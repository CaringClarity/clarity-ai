"use client"

import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, X, Clock, Code } from "lucide-react"
import { useTheme } from "next-themes"

interface ErrorLog {
  id: string
  timestamp: string
  error: string
  channel: string
  user_id?: string
  severity?: "low" | "medium" | "high" | "critical"
}

interface ErrorLogsPanelProps {
  errors: ErrorLog[]
  className?: string
}

export function ErrorLogsPanel({ errors, className = "" }: ErrorLogsPanelProps) {
  const { theme } = useTheme()

  const getSeverityBadge = (severity?: string) => {
    const baseClasses = "text-xs font-medium relative"
    switch (severity) {
      case "critical":
        return (
          <div className="relative">
            <div className="absolute inset-0 rounded-full blur-md bg-red-500/40 animate-pulse" />
            <Badge className={`${baseClasses} bg-red-500 text-white shadow-lg`}>
              <X className="w-3 h-3 mr-1" />
              Critical
            </Badge>
          </div>
        )
      case "high":
        return (
          <div className="relative">
            <div
              className={`absolute inset-0 rounded-full blur-sm ${
                theme === "dark" ? "bg-red-500/30" : "bg-red-500/20"
              }`}
            />
            <Badge
              className={`${baseClasses} ${
                theme === "dark"
                  ? "bg-red-500/20 text-red-400 border-red-500/30"
                  : "bg-red-100 text-red-700 border-red-200"
              }`}
            >
              <AlertTriangle className="w-3 h-3 mr-1" />
              High
            </Badge>
          </div>
        )
      case "medium":
        return (
          <Badge
            className={`${baseClasses} ${
              theme === "dark"
                ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                : "bg-yellow-100 text-yellow-700 border-yellow-200"
            }`}
          >
            <AlertTriangle className="w-3 h-3 mr-1" />
            Medium
          </Badge>
        )
      case "low":
        return (
          <Badge
            className={`${baseClasses} ${
              theme === "dark"
                ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                : "bg-blue-100 text-blue-700 border-blue-200"
            }`}
          >
            <AlertTriangle className="w-3 h-3 mr-1" />
            Low
          </Badge>
        )
      default:
        return (
          <Badge
            className={`${baseClasses} ${
              theme === "dark"
                ? "bg-gray-500/20 text-gray-400 border-gray-500/30"
                : "bg-gray-100 text-gray-700 border-gray-300"
            }`}
          >
            <AlertTriangle className="w-3 h-3 mr-1" />
            Error
          </Badge>
        )
    }
  }

  return (
    <Card
      className={`${
        theme === "dark"
          ? "bg-gray-950/80 border-gray-800 backdrop-blur-sm"
          : "bg-gray-50/90 border-gray-300 backdrop-blur-sm"
      } shadow-lg ${className}`}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-sm font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Error Logs</h3>
          <div className="relative">
            <div
              className={`absolute inset-0 rounded-full blur-sm ${
                theme === "dark" ? "bg-red-500/20" : "bg-red-500/15"
              }`}
            />
            <Badge
              variant="outline"
              className={`relative ${theme === "dark" ? "border-red-500/50 text-red-400" : "border-red-400 text-red-700"}`}
            >
              {errors.length} errors
            </Badge>
          </div>
        </div>

        <ScrollArea className="h-80">
          <div className="space-y-3">
            {errors.map((error) => (
              <div
                key={error.id}
                className={`relative p-3 rounded-lg border ${
                  theme === "dark" ? "bg-red-500/5 border-red-500/20" : "bg-red-50 border-red-200"
                } hover:shadow-md transition-all duration-200`}
              >
                {/* Error glow effect */}
                <div
                  className={`absolute inset-0 rounded-lg blur-sm opacity-0 hover:opacity-100 transition-opacity ${
                    theme === "dark" ? "bg-red-500/10" : "bg-red-500/8"
                  }`}
                />

                <div className="relative">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getSeverityBadge(error.severity)}
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          theme === "dark" ? "border-gray-600 text-gray-400" : "border-gray-300 text-gray-600"
                        }`}
                      >
                        {error.channel}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className={`w-3 h-3 ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`} />
                      <span className={`text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>
                        {new Date(error.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>

                  <div className={`text-sm mb-2 ${theme === "dark" ? "text-red-300" : "text-red-700"}`}>
                    {error.error}
                  </div>

                  {error.user_id && (
                    <div className="flex items-center space-x-1">
                      <Code className={`w-3 h-3 ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`} />
                      <span className={`text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>
                        User: {error.user_id.substring(0, 8)}...
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {errors.length === 0 && (
              <div className={`text-center py-8 ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>
                <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                No errors found
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </Card>
  )
}
