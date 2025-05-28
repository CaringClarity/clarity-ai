"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Phone, MessageSquare, Globe, Clock, User } from "lucide-react"
import { useTheme } from "next-themes"

interface CallLog {
  id: string
  created_at: string
  channel: "voice" | "sms" | "web"
  status: "active" | "completed" | "failed"
  user_id: string
  context: any
  duration?: number
}

interface CallLogsPanelProps {
  logs: CallLog[]
  className?: string
}

export function CallLogsPanel({ logs, className = "" }: CallLogsPanelProps) {
  const { theme } = useTheme()
  const [filter, setFilter] = useState<"all" | "voice" | "sms" | "web">("all")

  const filteredLogs = logs.filter((log) => filter === "all" || log.channel === filter)

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "voice":
        return <Phone className="w-4 h-4" />
      case "sms":
        return <MessageSquare className="w-4 h-4" />
      case "web":
        return <Globe className="w-4 h-4" />
      default:
        return <Phone className="w-4 h-4" />
    }
  }

  const getStatusBadge = (status: string) => {
    const baseClasses = "text-xs font-medium relative"
    switch (status) {
      case "active":
        return (
          <div className="relative">
            <div
              className={`absolute inset-0 rounded-full blur-sm ${
                theme === "dark" ? "bg-green-500/30" : "bg-green-500/20"
              }`}
            />
            <Badge
              className={`${baseClasses} ${
                theme === "dark"
                  ? "bg-green-500/20 text-green-400 border-green-500/30"
                  : "bg-green-100 text-green-700 border-green-200"
              }`}
            >
              Active
            </Badge>
          </div>
        )
      case "completed":
        return (
          <Badge
            className={`${baseClasses} ${
              theme === "dark"
                ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                : "bg-blue-100 text-blue-700 border-blue-200"
            }`}
          >
            Completed
          </Badge>
        )
      case "failed":
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
              Failed
            </Badge>
          </div>
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
            {status}
          </Badge>
        )
    }
  }

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "N/A"
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
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
          <h3 className={`text-sm font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Call Logs</h3>
          <div className="flex space-x-1">
            {["all", "voice", "sms", "web"].map((filterType) => (
              <Button
                key={filterType}
                variant="ghost"
                size="sm"
                onClick={() => setFilter(filterType as any)}
                className={`text-xs h-7 px-2 relative ${
                  filter === filterType
                    ? theme === "dark"
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                    : theme === "dark"
                      ? "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                }`}
              >
                {filter === filterType && (
                  <div
                    className={`absolute inset-0 rounded-md blur-sm ${
                      theme === "dark" ? "bg-blue-600/50" : "bg-blue-600/30"
                    }`}
                  />
                )}
                <span className="relative">{filterType.charAt(0).toUpperCase() + filterType.slice(1)}</span>
              </Button>
            ))}
          </div>
        </div>

        <ScrollArea className="h-80">
          <div className="space-y-3">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className={`relative p-3 rounded-lg border ${
                  theme === "dark" ? "bg-gray-800/50 border-gray-700" : "bg-gray-100/50 border-gray-300"
                } hover:shadow-md transition-all duration-200`}
              >
                {/* Subtle glow on hover */}
                <div
                  className={`absolute inset-0 rounded-lg blur-sm opacity-0 hover:opacity-100 transition-opacity ${
                    theme === "dark" ? "bg-blue-500/10" : "bg-blue-500/5"
                  }`}
                />

                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                        {getChannelIcon(log.channel)}
                      </div>
                      {getStatusBadge(log.status)}
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className={`w-3 h-3 ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`} />
                      <span className={`text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>
                        {new Date(log.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <User className={`w-3 h-3 ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`} />
                      <span className={`text-xs font-mono ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                        {log.user_id?.substring(0, 8)}...
                      </span>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                        {formatDuration(log.context?.duration)}
                      </div>
                      {log.context?.intent && (
                        <div className={`text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>
                          {log.context.intent}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {filteredLogs.length === 0 && (
              <div className={`text-center py-8 ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>
                No {filter !== "all" ? filter : ""} calls found
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </Card>
  )
}
