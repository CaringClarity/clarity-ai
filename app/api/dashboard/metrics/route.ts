/**
 * Dashboard Metrics API
 * Provides real operational data for the dashboard
 */
import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const timeframe = searchParams.get("timeframe") || "24h"

    // Calculate time range
    const now = new Date()
    const hoursAgo = timeframe === "24h" ? 24 : timeframe === "7d" ? 168 : 720 // 30d
    const since = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000).toISOString()

    // Get conversation metrics
    const { data: conversations } = await supabase
      .from("conversations")
      .select("*")
      .gte("created_at", since)
      .order("created_at", { ascending: false })

    // Get conversation metrics
    const { data: metrics } = await supabase
      .from("conversation_metrics")
      .select("*")
      .gte("created_at", since)
      .order("created_at", { ascending: false })

    // Get crisis logs
    const { data: crisisLogs } = await supabase
      .from("crisis_logs")
      .select("*")
      .gte("timestamp", since)
      .order("timestamp", { ascending: false })

    // Get staff messages
    const { data: staffMessages } = await supabase
      .from("staff_messages")
      .select("*")
      .gte("created_at", since)
      .order("created_at", { ascending: false })

    // Get intake forms
    const { data: intakeForms } = await supabase
      .from("intake_forms")
      .select("*")
      .gte("created_at", since)
      .order("created_at", { ascending: false })

    // Calculate real-time metrics
    const totalCalls = conversations?.length || 0
    const activeCalls = conversations?.filter((c) => c.status === "active").length || 0
    const completedIntakes = intakeForms?.filter((i) => i.status === "completed").length || 0
    const crisisCount = crisisLogs?.length || 0

    // Calculate average response time
    const avgResponseTime =
      metrics?.length > 0 ? metrics.reduce((sum, m) => sum + (m.average_response_time_ms || 0), 0) / metrics.length : 0

    // Calculate quality score
    const avgQualityScore =
      metrics?.length > 0 ? metrics.reduce((sum, m) => sum + (m.quality_score || 0), 0) / metrics.length : 0

    // Calculate escalation rate
    const escalationRate =
      metrics?.length > 0 ? (metrics.filter((m) => m.escalation_triggered).length / metrics.length) * 100 : 0

    // Group conversations by hour for chart data
    const hourlyData = Array.from({ length: 24 }, (_, i) => {
      const hour = new Date(now.getTime() - i * 60 * 60 * 1000)
      const hourStart = new Date(hour.getFullYear(), hour.getMonth(), hour.getDate(), hour.getHours())
      const hourEnd = new Date(hourStart.getTime() + 60 * 60 * 1000)

      const hourConversations =
        conversations?.filter((c) => {
          const createdAt = new Date(c.created_at)
          return createdAt >= hourStart && createdAt < hourEnd
        }) || []

      return {
        hour: hourStart.getHours(),
        calls: hourConversations.length,
        timestamp: hourStart.toISOString(),
      }
    }).reverse()

    // Get error logs from recent conversations
    const errorLogs =
      conversations
        ?.filter((c) => c.context?.error || c.status === "failed")
        .map((c) => ({
          id: c.id,
          timestamp: c.created_at,
          error: c.context?.error || "Conversation failed",
          channel: c.channel,
          user_id: c.user_id,
        })) || []

    const dashboardData = {
      timestamp: now.toISOString(),
      timeframe,
      realTimeMetrics: {
        totalCalls,
        activeCalls,
        completedIntakes,
        crisisCount,
        avgResponseTime: Math.round(avgResponseTime),
        avgQualityScore: Math.round(avgQualityScore),
        escalationRate: Math.round(escalationRate * 10) / 10,
        uptime: 99.8, // This would come from your monitoring system
      },
      chartData: {
        hourlyCallVolume: hourlyData,
        responseTimeData:
          metrics?.slice(0, 50).map((m) => ({
            timestamp: m.created_at,
            responseTime: m.average_response_time_ms,
            qualityScore: m.quality_score,
          })) || [],
        channelDistribution: [
          { channel: "voice", count: conversations?.filter((c) => c.channel === "voice").length || 0 },
          { channel: "sms", count: conversations?.filter((c) => c.channel === "sms").length || 0 },
          { channel: "web", count: conversations?.filter((c) => c.channel === "web").length || 0 },
        ],
      },
      recentActivity: {
        conversations: conversations?.slice(0, 10) || [],
        crisisLogs: crisisLogs?.slice(0, 5) || [],
        staffMessages: staffMessages?.slice(0, 10) || [],
        errorLogs: errorLogs.slice(0, 10),
      },
    }

    return NextResponse.json(dashboardData)
  } catch (error) {
    console.error("Error fetching dashboard metrics:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard metrics" }, { status: 500 })
  }
}
