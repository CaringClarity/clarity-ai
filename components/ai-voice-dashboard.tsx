"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { WaveformVisualization } from "./waveform-visualization"
import { MetricsPanel } from "./metrics-panel"
import { ActivityLog } from "./activity-log"
import { ControlPanel } from "./control-panel"
import { useTheme } from "@/components/theme-provider"
import { Moon, Sun, Zap, Brain, Phone, MessageSquare } from "lucide-react"

export function AIVoiceDashboard() {
  const { theme, setTheme } = useTheme()
  const [isActive, setIsActive] = useState(false)
  const [intensity, setIntensity] = useState(0.5)
  const [systemMetrics, setSystemMetrics] = useState({
    latency: 1.2,
    confidence: 0.94,
    uptime: 99.8,
    activeCalls: 3,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setSystemMetrics((prev) => ({
        latency: Math.max(0.5, prev.latency + (Math.random() - 0.5) * 0.3),
        confidence: Math.max(0.8, Math.min(1.0, prev.confidence + (Math.random() - 0.5) * 0.1)),
        uptime: Math.max(95, Math.min(100, prev.uptime + (Math.random() - 0.5) * 0.5)),
        activeCalls: Math.max(0, prev.activeCalls + Math.floor((Math.random() - 0.5) * 3)),
      }))
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const handleMicToggle = (enabled: boolean) => {
    setIsActive(enabled)
  }

  const handleVolumeChange = (volume: number) => {
    setIntensity(volume / 100)
  }

  const handleSystemToggle = (enabled: boolean) => {
    setIsActive(enabled)
  }

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-900 via-black to-gray-800"
          : "bg-gradient-to-br from-gray-100 via-white to-gray-200"
      }`}
    >
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-black" />
              </div>
              <h1 className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                Caring Clarity AI
              </h1>
            </div>
            <div
              className={`px-3 py-1 rounded-full text-xs font-mono ${
                isActive
                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                  : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
              }`}
            >
              {isActive ? "ACTIVE" : "STANDBY"}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={`${
                theme === "dark"
                  ? "border-amber-500/50 text-amber-400 hover:bg-amber-500/10"
                  : "border-gray-300 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Central Waveform Visualization */}
          <div className="col-span-12 lg:col-span-8">
            <Card
              className={`${
                theme === "dark" ? "bg-black/40 border-amber-500/20" : "bg-white/60 border-amber-500/30"
              } backdrop-blur-sm h-80`}
            >
              <div className="p-6 h-full">
                <div className="flex items-center justify-between mb-4">
                  <h2
                    className={`text-lg font-semibold ${
                      theme === "dark" ? "text-amber-400" : "text-amber-600"
                    } font-mono tracking-wider`}
                  >
                    VOICE ACTIVITY MONITOR
                  </h2>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Zap className={`w-4 h-4 ${theme === "dark" ? "text-amber-400" : "text-amber-600"}`} />
                      <span className={`text-sm font-mono ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                        {(intensity * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="h-full">
                  <WaveformVisualization isActive={isActive} intensity={intensity} className="h-full" />
                </div>
              </div>
            </Card>
          </div>

          {/* Control Panel */}
          <div className="col-span-12 lg:col-span-4">
            <ControlPanel
              onMicToggle={handleMicToggle}
              onVolumeChange={handleVolumeChange}
              onSystemToggle={handleSystemToggle}
              className="h-80"
            />
          </div>

          {/* Metrics Panels */}
          <div className="col-span-12 md:col-span-6 lg:col-span-3">
            <MetricsPanel
              title="Performance"
              metrics={[
                {
                  label: "Latency",
                  value: systemMetrics.latency,
                  unit: "s",
                  status: systemMetrics.latency < 2 ? "good" : "warning",
                },
                {
                  label: "Confidence",
                  value: systemMetrics.confidence,
                  unit: "",
                  status: systemMetrics.confidence > 0.9 ? "good" : "warning",
                },
                {
                  label: "Uptime",
                  value: systemMetrics.uptime,
                  unit: "%",
                  status: systemMetrics.uptime > 99 ? "good" : "warning",
                },
              ]}
            />
          </div>

          <div className="col-span-12 md:col-span-6 lg:col-span-3">
            <MetricsPanel
              title="Activity"
              metrics={[
                { label: "Active Calls", value: systemMetrics.activeCalls, unit: "", status: "good" },
                { label: "Total Today", value: 47, unit: "", status: "good" },
                { label: "Avg Duration", value: "4.2", unit: "min", status: "good" },
              ]}
            />
          </div>

          <div className="col-span-12 md:col-span-6 lg:col-span-3">
            <MetricsPanel
              title="AI Models"
              metrics={[
                { label: "STT Model", value: "Nova-2", unit: "", status: "good" },
                { label: "LLM Model", value: "Llama-3.3", unit: "", status: "good" },
                { label: "TTS Model", value: "Athena", unit: "", status: "good" },
              ]}
            />
          </div>

          <div className="col-span-12 md:col-span-6 lg:col-span-3">
            <MetricsPanel
              title="Channels"
              metrics={[
                { label: "Web", value: "2", unit: "active", status: "good" },
                { label: "Phone", value: "1", unit: "active", status: "good" },
                { label: "SMS", value: "0", unit: "active", status: "good" },
              ]}
            />
          </div>

          {/* Activity Log */}
          <div className="col-span-12">
            <ActivityLog />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 flex justify-center space-x-4">
          <Button
            variant="outline"
            className={`${
              theme === "dark"
                ? "border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                : "border-blue-500 text-blue-600 hover:bg-blue-50"
            }`}
          >
            <Phone className="w-4 h-4 mr-2" />
            Test Call
          </Button>
          <Button
            variant="outline"
            className={`${
              theme === "dark"
                ? "border-green-500/50 text-green-400 hover:bg-green-500/10"
                : "border-green-500 text-green-600 hover:bg-green-50"
            }`}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Test SMS
          </Button>
        </div>
      </div>
    </div>
  )
}
