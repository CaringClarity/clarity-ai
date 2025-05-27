"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface LogEntry {
  id: string
  timestamp: string
  type: "info" | "warning" | "error" | "success"
  message: string
}

interface ActivityLogProps {
  className?: string
}

export function ActivityLog({ className = "" }: ActivityLogProps) {
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: "1",
      timestamp: new Date().toISOString(),
      type: "success",
      message: "Voice agent initialized successfully",
    },
    {
      id: "2",
      timestamp: new Date(Date.now() - 30000).toISOString(),
      type: "info",
      message: "Deepgram STT connection established",
    },
    {
      id: "3",
      timestamp: new Date(Date.now() - 60000).toISOString(),
      type: "info",
      message: "Groq AI model loaded",
    },
    {
      id: "4",
      timestamp: new Date(Date.now() - 90000).toISOString(),
      type: "warning",
      message: "High latency detected: 2.3s",
    },
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      const newLog: LogEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        type: ["info", "success", "warning"][Math.floor(Math.random() * 3)] as LogEntry["type"],
        message: [
          "Processing voice input...",
          "AI response generated",
          "TTS synthesis complete",
          "New conversation started",
          "Intent classified: new_appointment",
        ][Math.floor(Math.random() * 5)],
      }

      setLogs((prev) => [newLog, ...prev.slice(0, 19)]) // Keep last 20 logs
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getTypeColor = (type: LogEntry["type"]) => {
    switch (type) {
      case "success":
        return "text-green-400"
      case "warning":
        return "text-amber-400"
      case "error":
        return "text-red-400"
      default:
        return "text-blue-400"
    }
  }

  const getTypeIcon = (type: LogEntry["type"]) => {
    switch (type) {
      case "success":
        return "✓"
      case "warning":
        return "⚠"
      case "error":
        return "✗"
      default:
        return "ℹ"
    }
  }

  return (
    <Card className={`bg-black/40 border-amber-500/20 backdrop-blur-sm ${className}`}>
      <div className="p-4">
        <h3 className="text-amber-400 font-mono text-sm mb-4 tracking-wider uppercase">Activity Log</h3>
        <ScrollArea className="h-64">
          <div className="space-y-2">
            {logs.map((log) => (
              <div key={log.id} className="flex items-start space-x-3 text-xs">
                <span className={`${getTypeColor(log.type)} mt-0.5`}>{getTypeIcon(log.type)}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500 font-mono">{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-gray-300 mt-1 break-words">{log.message}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </Card>
  )
}
