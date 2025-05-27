/**
 * Analytics and Quality Assurance Service
 * Tracks conversation metrics and quality scores
 */
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

export async function trackConversationMetrics(callSid, metrics) {
  try {
    const conversationMetrics = {
      call_sid: callSid,
      duration_seconds: metrics.duration,
      average_response_time_ms: metrics.averageResponseTime,
      intent_accuracy: metrics.intentConfidence,
      emotional_state: metrics.detectedEmotion,
      escalation_triggered: metrics.escalated || false,
      user_satisfaction_score: metrics.satisfactionScore || null,
      intake_completed: metrics.intakeCompleted || false,
      total_exchanges: metrics.totalExchanges || 0,
      cache_hit_rate: metrics.cacheHitRate || 0,
      error_count: metrics.errorCount || 0,
      accessibility_adjustments: metrics.accessibilityAdjustments || {},
      quality_score: scoreConversationQuality(metrics.conversationHistory || []),
      created_at: new Date().toISOString(),
    }

    await supabase.from("conversation_metrics").insert(conversationMetrics)
    console.log(`📊 Metrics tracked for call ${callSid}`)
  } catch (error) {
    console.error("Error tracking conversation metrics:", error)
  }
}

export function scoreConversationQuality(conversationHistory) {
  let score = 100

  // Deduct points for various issues
  const userMessages = conversationHistory.filter((msg) => msg.role === "user")
  const assistantMessages = conversationHistory.filter((msg) => msg.role === "assistant")

  // Too many confusion indicators
  const confusionCount = conversationHistory.filter((msg) =>
    msg.content?.toLowerCase().includes("don't understand"),
  ).length
  score -= confusionCount * 10

  // Conversation too long (indicates inefficiency)
  if (conversationHistory.length > 30) {
    score -= 15
  }

  // Conversation too short (might indicate user hung up)
  if (conversationHistory.length < 4) {
    score -= 20
  }

  // Check for repetitive responses
  const responseTexts = assistantMessages.map((msg) => msg.content)
  const uniqueResponses = new Set(responseTexts)
  if (responseTexts.length > 0 && uniqueResponses.size / responseTexts.length < 0.7) {
    score -= 15 // Too repetitive
  }

  // Bonus for successful information collection
  const hasContactInfo = conversationHistory.some(
    (msg) => msg.content?.toLowerCase().includes("email") || msg.content?.toLowerCase().includes("phone"),
  )
  if (hasContactInfo) {
    score += 10
  }

  // Bonus for empathetic responses
  const empathyIndicators = ["understand", "hear", "feel", "sorry", "help"]
  const empathyCount = assistantMessages.filter((msg) =>
    empathyIndicators.some((indicator) => msg.content?.toLowerCase().includes(indicator)),
  ).length
  score += Math.min(empathyCount * 2, 10)

  return Math.max(0, Math.min(100, score))
}

export async function generateQualityReport(timeframe = "24h") {
  try {
    const hoursAgo = timeframe === "24h" ? 24 : timeframe === "7d" ? 168 : 720 // 30d
    const since = new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString()

    const { data: metrics } = await supabase.from("conversation_metrics").select("*").gte("created_at", since)

    if (!metrics || metrics.length === 0) {
      return { error: "No data available for the specified timeframe" }
    }

    const report = {
      totalCalls: metrics.length,
      averageQualityScore: metrics.reduce((sum, m) => sum + (m.quality_score || 0), 0) / metrics.length,
      averageResponseTime: metrics.reduce((sum, m) => sum + (m.average_response_time_ms || 0), 0) / metrics.length,
      escalationRate: (metrics.filter((m) => m.escalation_triggered).length / metrics.length) * 100,
      intakeCompletionRate: (metrics.filter((m) => m.intake_completed).length / metrics.length) * 100,
      cacheHitRate: metrics.reduce((sum, m) => sum + (m.cache_hit_rate || 0), 0) / metrics.length,
      emotionalStateDistribution: getEmotionalStateDistribution(metrics),
      topIssues: getTopIssues(metrics),
      timeframe,
      generatedAt: new Date().toISOString(),
    }

    return report
  } catch (error) {
    console.error("Error generating quality report:", error)
    return { error: "Failed to generate quality report" }
  }
}

function getEmotionalStateDistribution(metrics) {
  const distribution = {}
  metrics.forEach((metric) => {
    const state = metric.emotional_state || "unknown"
    distribution[state] = (distribution[state] || 0) + 1
  })
  return distribution
}

function getTopIssues(metrics) {
  const issues = []

  // Low quality scores
  const lowQualityCount = metrics.filter((m) => (m.quality_score || 0) < 70).length
  if (lowQualityCount > 0) {
    issues.push({
      issue: "Low Quality Conversations",
      count: lowQualityCount,
      percentage: (lowQualityCount / metrics.length) * 100,
    })
  }

  // High response times
  const slowResponseCount = metrics.filter((m) => (m.average_response_time_ms || 0) > 3000).length
  if (slowResponseCount > 0) {
    issues.push({
      issue: "Slow Response Times",
      count: slowResponseCount,
      percentage: (slowResponseCount / metrics.length) * 100,
    })
  }

  // High escalation rate
  const escalationCount = metrics.filter((m) => m.escalation_triggered).length
  if (escalationCount / metrics.length > 0.1) {
    // More than 10%
    issues.push({
      issue: "High Escalation Rate",
      count: escalationCount,
      percentage: (escalationCount / metrics.length) * 100,
    })
  }

  return issues.sort((a, b) => b.percentage - a.percentage)
}
