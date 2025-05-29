"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { WaveformVisualization } from "./waveform-visualization"
import { MetricsPanel } from "./metrics-panel"
import { CallLogsPanel } from "./call-logs-panel"
import { ErrorLogsPanel } from "./error-logs-panel"
import { PerformanceCharts } from "./performance-charts"
import { CrisisAlertsPanel } from "./crisis-alerts-panel"
import { useTheme } from "@/components/theme-provider"
import { Moon, Sun, Zap, Brain, RefreshCw, Download, AlertTriangle } from 'lucide-react'

interface DashboardData {
  timestamp: string
  timeframe: string
  realTimeMetrics: {
    totalCalls: number
    activeCalls: number
    completedIntakes: number
    crisisCount: number
    avgResponseTime: number
    avgQualityScore: number
    escalationRate: number
    uptime: number
  }
  chartData: {
    hourlyCallVolume: Array<{ hour: number; calls: number; timestamp: string }>
    responseTimeData: Array<{ timestamp: string; responseTime: number; qualityScore: number }>
    channelDistribution: Array<{ channel: string; count: number }>
  }
  recentActivity: {
    conversations: any[]
    crisisLogs: any[]
    staffMessages: any[]
    errorLogs: any[]
  }
}

export function EnhancedAIDashboard() {
  const { theme, setTheme } = useTheme()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState("24h")
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/dashboard/metrics?timeframe=${timeframe}`)
      if (response.ok) {
        const data = await response.json()
        setDashboardData(data)
        setLastUpdated(new Date())
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000)
    return () => clearInterval(interval)
  }, [timeframe])

  const exportData = () => {
    if (dashboardData) {
      const dataStr = JSON.stringify(dashboardData, null, 2)
      const dataBlob = new Blob([dataStr], { type: "application/json" })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement("a")
      link.href = url
      link.download = `dashboard-data-${new Date().toISOString().split("T")[0]}.json`
      link.click()
      URL.revokeObjectURL(url)
    }
  }

  if (loading && !dashboardData) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${theme === "dark" ? "bg-gray-950" : "bg-gray-50"}`}
      >
        <div className="text-center relative">
          {/* Loading glow effect */}
          <div
            className={`absolute inset-0 rounded-full blur-xl ${theme === "dark" ? "bg-blue-500/20" : "bg-blue-500/10"}`}
          />
          <div className="relative">
            <RefreshCw
              className={`w-8 h-8 animate-spin mx-auto mb-4 ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`}
            />
            <p className={`font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
              Loading dashboard data...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen transition-all duration-300 ${theme === "dark" ? "bg-gray-950" : "bg-gray-50"}`}>
      {/* Enhanced background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse ${
            theme === "dark" ? "bg-blue-500/10" : "bg-blue-500/5"
          }`}
        />
        <div
          className={`absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse delay-1000 ${
            theme === "dark" ? "bg-purple-500/8" : "bg-purple-500/4"
          }`}
        />
        <div
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl animate-pulse delay-500 ${
            theme === "dark" ? "bg-indigo-500/6" : "bg-indigo-500/3"
          }`}
        />
      </div>

      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        {/* Header with glow */}
        <div className="flex items-center justify-between mb-8 relative">
          {/* Header glow */}
          <div
            className={`absolute inset-0 rounded-2xl blur-xl ${theme === "dark" ? "bg-blue-500/5" : "bg-blue-500/3"}`}
          />

          <div className="flex items-center space-x-4 relative">
            <div className="flex items-center space-x-3">
              <div className="relative">
                {/* Icon glow */}
                <div
                  className={`absolute inset-0 rounded-xl blur-lg ${
                    theme === "dark" ? "bg-blue-500/30" : "bg-blue-500/20"
                  }`}
                />
                <div className="relative w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Brain className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className={`text-2xl font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  Caring Clarity AI
                </h1>
                <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                  Voice Agent Dashboard
                </p>
              </div>
            </div>
            <div className="relative">
              {/* Badge glow */}
              <div
                className={`absolute inset-0 rounded-full blur-md ${
                  dashboardData?.realTimeMetrics.activeCalls > 0
                    ? theme === "dark"
                      ? "bg-green-500/20"
                      : "bg-green-500/15"
                    : theme === "dark"
                      ? "bg-gray-500/10"
                      : "bg-gray-500/8"
                }`}
              />
              <Badge
                variant="outline"
                className={`relative ${
                  dashboardData?.realTimeMetrics.activeCalls > 0
                    ? theme === "dark"
                      ? "border-green-500/50 text-green-400 bg-green-500/10"
                      : "border-green-600 text-green-700 bg-green-50"
                    : theme === "dark"
                      ? "border-gray-600 text-gray-400 bg-gray-800/50"
                      : "border-gray-200 text-gray-500 bg-gray-50"
                }`}
              >
                {dashboardData?.realTimeMetrics.activeCalls > 0 ? "ACTIVE" : "MONITORING"}
              </Badge>
            </div>
          </div>

          <div className="flex items-center space-x-3 relative">
            {/* Controls glow */}
            <div
              className={`absolute inset-0 rounded-2xl blur-lg ${theme === "dark" ? "bg-gray-800/30" : "bg-white/50"}`}
            />

            {/* Timeframe Selector */}
            <div
              className={`relative flex rounded-lg p-1 ${theme === "dark" ? "bg-gray-950/80 backdrop-blur-sm" : "bg-gray-50/80 backdrop-blur-sm border border-gray-100"}`}
            >
              {["24h", "7d", "30d"].map((tf) => (
                <Button
                  key={tf}
                  variant="ghost"
                  size="sm"
                  onClick={() => setTimeframe(tf)}
                  className={`text-xs font-medium transition-all ${
                    timeframe === tf
                      ? theme === "dark"
                        ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg"
                        : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg"
                      : theme === "dark"
                        ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {tf.toUpperCase()}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={fetchDashboardData}
              disabled={loading}
              className={`relative ${
                theme === "dark"
                  ? "border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white backdrop-blur-sm"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50 backdrop-blur-sm"
              }`}
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={exportData}
              className={`relative ${
                theme === "dark"
                  ? "border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white backdrop-blur-sm"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50 backdrop-blur-sm"
              }`}
            >
              <Download className="w-4 h-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
