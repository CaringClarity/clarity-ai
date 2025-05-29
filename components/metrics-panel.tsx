"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { useTheme } from "@/components/theme-provider"

interface MetricsPanelProps {
  title: string
  metrics: Array<{
    label: string
    value: string | number
    unit?: string
    status?: "good" | "warning" | "error"
  }>
  className?: string
}

export function MetricsPanel({ title, metrics, className = "" }: MetricsPanelProps) {
  const { theme } = useTheme()
  const [animatedValues, setAnimatedValues] = useState<Record<string, number>>({})

  useEffect(() => {
    const interval = setInterval(() => {
      const newValues: Record<string, number> = {}
      metrics.forEach((metric) => {
        if (typeof metric.value === "number") {
          newValues[metric.label] = metric.value + (Math.random() - 0.5) * 0.1
        }
      })
      setAnimatedValues(newValues)
    }, 1000)

    return () => clearInterval(interval)
  }, [metrics])

  const getStatusColor = (status?: string) => {
    if (theme === "dark") {
      switch (status) {
        case "good":
          return "text-green-400"
        case "warning":
          return "text-yellow-400"
        case "error":
          return "text-red-400"
        default:
          return "text-blue-400"
      }
    } else {
      switch (status) {
        case "good":
          return "text-green-600"
        case "warning":
          return "text-yellow-600"
        case "error":
          return "text-red-600"
        default:
          return "text-blue-600"
      }
    }
  }

  const getStatusIndicator = (status?: string) => {
    const baseClasses = "w-2 h-2 rounded-full"
    if (theme === "dark") {
      switch (status) {
        case "good":
          return `${baseClasses} bg-green-400 shadow-lg shadow-green-400/50`
        case "warning":
          return `${baseClasses} bg-yellow-400 shadow-lg shadow-yellow-400/50`
        case "error":
          return `${baseClasses} bg-red-400 shadow-lg shadow-red-400/50`
        default:
          return `${baseClasses} bg-blue-400 shadow-lg shadow-blue-400/50`
      }
    } else {
      switch (status) {
        case "good":
          return `${baseClasses} bg-green-500 shadow-lg shadow-green-500/30`
        case "warning":
          return `${baseClasses} bg-yellow-500 shadow-lg shadow-yellow-500/30`
        case "error":
          return `${baseClasses} bg-red-500 shadow-lg shadow-red-500/30`
        default:
          return `${baseClasses} bg-blue-500 shadow-lg shadow-blue-500/30`
      }
    }
  }

  const getCardGlow = (status?: string) => {
    if (theme === "dark") {
      switch (status) {
        case "good":
          return "bg-green-500/5"
        case "warning":
          return "bg-yellow-500/5"
        case "error":
          return "bg-red-500/5"
        default:
          return "bg-blue-500/5"
      }
    } else {
      switch (status) {
        case "good":
          return "bg-green-500/3"
        case "warning":
          return "bg-yellow-500/3"
        case "error":
          return "bg-red-500/3"
        default:
          return "bg-blue-500/3"
      }
    }
  }

  const primaryMetric = metrics[0]

  return (
    <div className={`relative ${className}`}>
      {/* Glow effect */}
      <div className={`absolute inset-0 rounded-xl blur-lg ${getCardGlow(primaryMetric?.status)}`} />

      <Card
        className={`relative ${
          theme === "dark"
            ? "bg-gray-950/80 border-gray-800 backdrop-blur-sm"
            : "bg-gray-50/90 border-gray-100 backdrop-blur-sm"
        } shadow-lg hover:shadow-xl transition-all duration-300`}
      >
        <div className="p-4">
          <h3 className={`text-sm font-medium mb-3 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
            {title}
          </h3>
          <div className="space-y-3">
            {metrics.map((metric, index) => (
              <div key={metric.label} className="flex justify-between items-center">
                <span className={`text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>
                  {metric.label}
                </span>
                <div className="flex items-center space-x-2">
                  <span className={`font-semibold text-lg ${getStatusColor(metric.status)}`}>
                    {typeof metric.value === "number"
                      ? (animatedValues[metric.label] || metric.value).toFixed(0)
                      : metric.value}
                  </span>
                  {metric.unit && (
                    <span className={`text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>
                      {metric.unit}
                    </span>
                  )}
                  <div className={`${getStatusIndicator(metric.status)} animate-pulse`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}
