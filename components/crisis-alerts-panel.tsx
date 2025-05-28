"use client"

import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Phone, Clock, ExternalLink } from "lucide-react"
import { useTheme } from "next-themes"

interface CrisisAlert {
  id: string
  call_sid: string
  timestamp: string
  escalation_reason: string
  action_taken: string
  priority: "CRISIS" | "HIGH" | "MEDIUM"
  follow_up_required: boolean
  transcript_excerpt?: string
}

interface CrisisAlertsPanelProps {
  alerts: CrisisAlert[]
  className?: string
}

export function CrisisAlertsPanel({ alerts, className = "" }: CrisisAlertsPanelProps) {
  const { theme } = useTheme()

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "CRISIS":
        return "bg-red-600 text-white border-red-500"
      case "HIGH":
        return "bg-orange-500 text-white border-orange-400"
      case "MEDIUM":
        return "bg-yellow-500 text-black border-yellow-400"
      default:
        return "bg-gray-500 text-white border-gray-400"
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "CRISIS":
        return "🚨"
      case "HIGH":
        return "⚠️"
      case "MEDIUM":
        return "⚡"
      default:
        return "ℹ️"
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
          <h3 className={`text-sm font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Crisis Alerts</h3>
          <div className="flex items-center space-x-2">
            <AlertTriangle className={`w-4 h-4 ${theme === "dark" ? "text-red-400" : "text-red-600"}`} />
            <Badge
              variant="outline"
              className={`${theme === "dark" ? "border-red-500/50 text-red-400" : "border-red-400 text-red-700"}`}
            >
              {alerts.length} alerts
            </Badge>
          </div>
        </div>

        <ScrollArea className="h-80">
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border ${
                  theme === "dark" ? "bg-red-900/20 border-red-500/30" : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getPriorityIcon(alert.priority)}</span>
                    <Badge className={`${getPriorityColor(alert.priority)} text-xs`}>{alert.priority}</Badge>
                    {alert.follow_up_required && (
                      <Badge
                        variant="outline"
                        className={`${
                          theme === "dark" ? "border-amber-500/50 text-amber-400" : "border-amber-400 text-amber-700"
                        } text-xs`}
                      >
                        FOLLOW-UP
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-1 text-gray-500 text-xs">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(alert.timestamp).toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <span className={`text-sm font-semibold ${theme === "dark" ? "text-red-300" : "text-red-700"}`}>
                      Reason:{" "}
                    </span>
                    <span className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                      {alert.escalation_reason}
                    </span>
                  </div>

                  <div>
                    <span className={`text-sm font-semibold ${theme === "dark" ? "text-red-300" : "text-red-700"}`}>
                      Action:{" "}
                    </span>
                    <span className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                      {alert.action_taken}
                    </span>
                  </div>

                  {alert.transcript_excerpt && (
                    <div>
                      <span className={`text-sm font-semibold ${theme === "dark" ? "text-red-300" : "text-red-700"}`}>
                        Excerpt:{" "}
                      </span>
                      <div
                        className={`text-sm italic mt-1 p-2 rounded ${
                          theme === "dark" ? "text-gray-400 bg-black/30" : "text-gray-600 bg-gray-100"
                        }`}
                      >
                        "{alert.transcript_excerpt}"
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-1 text-gray-500 text-xs">
                      <Phone className="w-3 h-3" />
                      <span>Call: {alert.call_sid.substring(0, 12)}...</span>
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      className={`text-xs ${
                        theme === "dark"
                          ? "border-red-500/50 text-red-400 hover:bg-red-500/10"
                          : "border-red-400 text-red-700 hover:bg-red-50"
                      }`}
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {alerts.length === 0 && (
              <div className={`text-center py-8 ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>
                <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                No crisis alerts
                <div className="text-xs mt-1">System monitoring for crisis situations</div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </Card>
  )
}
