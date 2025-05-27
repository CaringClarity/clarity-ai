"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download, AlertTriangle, X, Clock, Code, RefreshCw } from "lucide-react"
import { GlassSidebar } from "@/components/glass-sidebar"

interface ErrorLog {
  id: string
  timestamp: string
  error: string
  channel: string
  user_id?: string
  severity: "low" | "medium" | "high" | "critical"
  stack_trace?: string
  resolved: boolean
}

export default function ErrorLogsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterSeverity, setFilterSeverity] = useState("all")
  const [filterChannel, setFilterChannel] = useState("all")
  const [filterResolved, setFilterResolved] = useState("all")
  const [selectedError, setSelectedError] = useState<ErrorLog | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Mock error data - in real app, this would come from your database
  const [errorLogs, setErrorLogs] = useState<ErrorLog[]>([
    {
      id: "err_001",
      timestamp: "2024-01-15T14:30:00Z",
      error: "Database connection timeout",
      channel: "voice",
      user_id: "user_123",
      severity: "high",
      stack_trace: "Error: Connection timeout\n  at Database.connect()\n  at VoiceHandler.process()",
      resolved: false,
    },
    {
      id: "err_002",
      timestamp: "2024-01-15T13:45:00Z",
      error: "AI model response timeout",
      channel: "chat",
      user_id: "user_456",
      severity: "medium",
      stack_trace: "Error: Request timeout\n  at AIService.generate()\n  at ChatHandler.respond()",
      resolved: true,
    },
    {
      id: "err_003",
      timestamp: "2024-01-15T12:20:00Z",
      error: "Invalid phone number format",
      channel: "sms",
      severity: "low",
      resolved: false,
    },
    {
      id: "err_004",
      timestamp: "2024-01-15T11:15:00Z",
      error: "Memory limit exceeded",
      channel: "system",
      severity: "critical",
      stack_trace: "Error: Out of memory\n  at ProcessManager.allocate()\n  at SystemMonitor.check()",
      resolved: false,
    },
    {
      id: "err_005",
      timestamp: "2024-01-15T10:30:00Z",
      error: "Webhook delivery failed",
      channel: "webhook",
      user_id: "user_789",
      severity: "medium",
      resolved: true,
    },
  ])

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`

    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500 text-white shadow-lg animate-pulse"
      case "high":
        return "bg-red-100 text-red-700 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "low":
        return "bg-blue-100 text-blue-700 border-blue-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-300"
    }
  }

  const getChannelColor = (channel: string) => {
    switch (channel) {
      case "voice":
        return "bg-soft-purple text-white"
      case "chat":
        return "bg-soft-blue text-white"
      case "sms":
        return "bg-soft-mint text-gray-700"
      case "webhook":
        return "bg-soft-peach text-gray-700"
      case "system":
        return "bg-gray-500 text-white"
      default:
        return "bg-gray-200 text-gray-600"
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <X className="w-3 h-3 mr-1" />
      default:
        return <AlertTriangle className="w-3 h-3 mr-1" />
    }
  }

  const filteredErrors = errorLogs.filter((error) => {
    const matchesSearch =
      error.error.toLowerCase().includes(searchTerm.toLowerCase()) ||
      error.channel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (error.user_id && error.user_id.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesSeverity = filterSeverity === "all" || error.severity === filterSeverity
    const matchesChannel = filterChannel === "all" || error.channel === filterChannel
    const matchesResolved =
      filterResolved === "all" ||
      (filterResolved === "resolved" && error.resolved) ||
      (filterResolved === "unresolved" && !error.resolved)
    return matchesSearch && matchesSeverity && matchesChannel && matchesResolved
  })

  const markAsResolved = (errorId: string) => {
    setErrorLogs((prev) => prev.map((error) => (error.id === errorId ? { ...error, resolved: true } : error)))
  }

  const refreshLogs = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  return (
    <GlassSidebar userRole="tenant-admin" userName="Dr. Sarah Mitchell">
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="animate-fade-in">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Error Logs</h1>
            <p className="text-gray-600 text-lg">Monitor and resolve system errors and issues</p>
          </div>
          <div className="flex items-center space-x-4 animate-fade-in">
            <Button
              onClick={refreshLogs}
              disabled={isLoading}
              variant="outline"
              className="border-white/20 hover:bg-white/30"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button className="bg-gradient-to-r from-soft-blue to-soft-purple text-white hover:shadow-lg transition-all duration-200">
              <Download className="w-4 h-4 mr-2" />
              Export Logs
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade-in">
          <Card className="bg-white/50 backdrop-blur-xl border-white/20 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Errors</p>
                  <p className="text-2xl font-bold text-gray-900">{errorLogs.length}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/50 backdrop-blur-xl border-white/20 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Critical</p>
                  <p className="text-2xl font-bold text-red-600">
                    {errorLogs.filter((e) => e.severity === "critical").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                  <X className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/50 backdrop-blur-xl border-white/20 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Unresolved</p>
                  <p className="text-2xl font-bold text-yellow-600">{errorLogs.filter((e) => !e.resolved).length}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/50 backdrop-blur-xl border-white/20 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Resolved</p>
                  <p className="text-2xl font-bold text-green-600">{errorLogs.filter((e) => e.resolved).length}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Code className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="bg-white/50 backdrop-blur-xl border-white/20 shadow-xl animate-fade-in">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by error message, channel, or user ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/50 border-white/20"
                />
              </div>

              {/* Severity Filter */}
              <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                <SelectTrigger className="w-48 bg-white/50 border-white/20">
                  <SelectValue placeholder="Filter by severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>

              {/* Channel Filter */}
              <Select value={filterChannel} onValueChange={setFilterChannel}>
                <SelectTrigger className="w-48 bg-white/50 border-white/20">
                  <SelectValue placeholder="Filter by channel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Channels</SelectItem>
                  <SelectItem value="voice">Voice</SelectItem>
                  <SelectItem value="chat">Chat</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="webhook">Webhook</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select value={filterResolved} onValueChange={setFilterResolved}>
                <SelectTrigger className="w-48 bg-white/50 border-white/20">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="unresolved">Unresolved</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Error Logs Table */}
        <Card className="bg-white/50 backdrop-blur-xl border-white/20 shadow-xl animate-fade-in">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800">Recent Errors</CardTitle>
            <CardDescription className="text-gray-600">{filteredErrors.length} errors found</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredErrors.map((error, index) => (
                <div
                  key={error.id}
                  className="flex items-center justify-between p-4 rounded-2xl bg-white/30 hover:bg-white/50 transition-all duration-200 cursor-pointer animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => setSelectedError(error)}
                >
                  <div className="flex items-center space-x-4">
                    {/* Severity Icon */}
                    <div className="relative">
                      {error.severity === "critical" && (
                        <div className="absolute inset-0 rounded-full blur-md bg-red-500/40 animate-pulse" />
                      )}
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
                          error.severity === "critical"
                            ? "bg-red-500"
                            : error.severity === "high"
                              ? "bg-red-100"
                              : error.severity === "medium"
                                ? "bg-yellow-100"
                                : "bg-blue-100"
                        }`}
                      >
                        {getSeverityIcon(error.severity)}
                      </div>
                    </div>

                    {/* Error Details */}
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-800">{error.error}</h3>
                        <Badge className={getSeverityColor(error.severity)}>{error.severity}</Badge>
                        <Badge className={getChannelColor(error.channel)}>{error.channel}</Badge>
                        {error.resolved && (
                          <Badge className="bg-green-100 text-green-700 border-green-200">Resolved</Badge>
                        )}
                      </div>
                      {error.user_id && <p className="text-sm text-gray-600">User: {error.user_id}</p>}
                      <p className="text-xs text-gray-500 flex items-center mt-1">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatDate(error.timestamp)}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    {!error.resolved && (
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          markAsResolved(error.id)
                        }}
                        className="bg-green-500 hover:bg-green-600 text-white"
                      >
                        Mark Resolved
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Error Detail Modal */}
        {selectedError && (
          <Card className="bg-white/50 backdrop-blur-xl border-white/20 shadow-xl animate-fade-in">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold text-gray-800">Error Details</CardTitle>
                <Button variant="ghost" onClick={() => setSelectedError(null)} className="hover:bg-white/30">
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Error Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Error Information</h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Error:</span> {selectedError.error}
                    </p>
                    <p>
                      <span className="font-medium">Severity:</span>
                      <Badge className={`ml-2 ${getSeverityColor(selectedError.severity)}`}>
                        {selectedError.severity}
                      </Badge>
                    </p>
                    <p>
                      <span className="font-medium">Channel:</span>
                      <Badge className={`ml-2 ${getChannelColor(selectedError.channel)}`}>
                        {selectedError.channel}
                      </Badge>
                    </p>
                    <p>
                      <span className="font-medium">Timestamp:</span>{" "}
                      {new Date(selectedError.timestamp).toLocaleString()}
                    </p>
                    {selectedError.user_id && (
                      <p>
                        <span className="font-medium">User ID:</span> {selectedError.user_id}
                      </p>
                    )}
                    <p>
                      <span className="font-medium">Status:</span>
                      <Badge
                        className={`ml-2 ${selectedError.resolved ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                      >
                        {selectedError.resolved ? "Resolved" : "Unresolved"}
                      </Badge>
                    </p>
                  </div>
                </div>
              </div>

              {/* Stack Trace */}
              {selectedError.stack_trace && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Stack Trace</h3>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-xl font-mono text-sm overflow-x-auto">
                    <pre>{selectedError.stack_trace}</pre>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-4">
                {!selectedError.resolved && (
                  <Button
                    onClick={() => markAsResolved(selectedError.id)}
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    Mark as Resolved
                  </Button>
                )}
                <Button variant="outline" className="border-white/20 hover:bg-white/30">
                  <Download className="w-4 h-4 mr-2" />
                  Export Details
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </GlassSidebar>
  )
}
