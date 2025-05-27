"use client"

import { Card } from "@/components/ui/card"
import { useTheme } from "./theme-provider"
import { BarChart3, TrendingUp, PieChart } from "lucide-react"

interface ChartData {
  hourlyCallVolume: Array<{ hour: number; calls: number; timestamp: string }>
  responseTimeData: Array<{ timestamp: string; responseTime: number; qualityScore: number }>
  channelDistribution: Array<{ channel: string; count: number }>
}

interface PerformanceChartsProps {
  data: ChartData
  className?: string
}

export function PerformanceCharts({ data, className = "" }: PerformanceChartsProps) {
  const { theme } = useTheme()

  // Mock chart data for visualization
  const maxCalls = Math.max(...data.hourlyCallVolume.map((d) => d.calls), 1)
  const totalChannelCalls = data.channelDistribution.reduce((sum, d) => sum + d.count, 0)

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 ${className}`}>
      {/* 24-Hour Call Volume */}
      <Card
        className={`${
          theme === "dark"
            ? "bg-gray-950/80 border-gray-800 backdrop-blur-sm"
            : "bg-gray-50/90 border-gray-200 backdrop-blur-sm"
        } shadow-lg`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-sm font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              24-Hour Call Volume
            </h3>
            <BarChart3 className={`w-4 h-4 ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`} />
          </div>
          <div className="space-y-2">
            {data.hourlyCallVolume.slice(-8).map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  {item.hour}:00
                </span>
                <div className="flex items-center space-x-2 flex-1 ml-3">
                  <div className={`flex-1 h-2 rounded-full ${theme === "dark" ? "bg-gray-800" : "bg-gray-200"}`}>
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300"
                      style={{ width: `${(item.calls / maxCalls) * 100}%` }}
                    />
                  </div>
                  <span className={`text-xs font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                    {item.calls}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Response Time Trend */}
      <Card
        className={`${
          theme === "dark"
            ? "bg-gray-950/80 border-gray-800 backdrop-blur-sm"
            : "bg-gray-50/90 border-gray-200 backdrop-blur-sm"
        } shadow-lg`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-sm font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              Response Time Trend
            </h3>
            <TrendingUp className={`w-4 h-4 ${theme === "dark" ? "text-green-400" : "text-green-600"}`} />
          </div>
          <div className="space-y-3">
            {data.responseTimeData.slice(-6).map((item, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </span>
                  <span className={`text-xs font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                    {item.responseTime}ms
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`flex-1 h-1.5 rounded-full ${theme === "dark" ? "bg-gray-800" : "bg-gray-200"}`}>
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        item.responseTime < 1000
                          ? "bg-gradient-to-r from-green-500 to-green-600"
                          : item.responseTime < 2000
                            ? "bg-gradient-to-r from-yellow-500 to-yellow-600"
                            : "bg-gradient-to-r from-red-500 to-red-600"
                      }`}
                      style={{ width: `${Math.min((item.responseTime / 3000) * 100, 100)}%` }}
                    />
                  </div>
                  <span
                    className={`text-xs ${
                      item.responseTime < 1000
                        ? theme === "dark"
                          ? "text-green-400"
                          : "text-green-600"
                        : item.responseTime < 2000
                          ? theme === "dark"
                            ? "text-yellow-400"
                            : "text-yellow-600"
                          : theme === "dark"
                            ? "text-red-400"
                            : "text-red-600"
                    }`}
                  >
                    {item.qualityScore}/100
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Channel Distribution */}
      <Card
        className={`${
          theme === "dark"
            ? "bg-gray-950/80 border-gray-800 backdrop-blur-sm"
            : "bg-gray-50/90 border-gray-200 backdrop-blur-sm"
        } shadow-lg`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-sm font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              Channel Distribution
            </h3>
            <PieChart className={`w-4 h-4 ${theme === "dark" ? "text-purple-400" : "text-purple-600"}`} />
          </div>
          <div className="space-y-3">
            {data.channelDistribution.map((item, index) => {
              const percentage = totalChannelCalls > 0 ? (item.count / totalChannelCalls) * 100 : 0
              const colors = [
                theme === "dark" ? "from-blue-500 to-blue-600" : "from-blue-500 to-blue-600",
                theme === "dark" ? "from-green-500 to-green-600" : "from-green-500 to-green-600",
                theme === "dark" ? "from-purple-500 to-purple-600" : "from-purple-500 to-purple-600",
              ]
              return (
                <div key={item.channel} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs capitalize ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                      {item.channel}
                    </span>
                    <span className={`text-xs font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                      {item.count} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className={`h-2 rounded-full ${theme === "dark" ? "bg-gray-800" : "bg-gray-200"}`}>
                    <div
                      className={`h-full bg-gradient-to-r ${colors[index % colors.length]} rounded-full transition-all duration-300`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </Card>
    </div>
  )
}
