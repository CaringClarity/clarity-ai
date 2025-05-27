"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Phone, MessageSquare, Clock, CheckCircle, AlertTriangle, TrendingUp } from "lucide-react"
import { RoleAwareSidebar } from "@/components/role-aware-sidebar"

export default function StaffDashboard() {
  const staffMetrics = {
    callsHandled: 45,
    messagesResponded: 23,
    clientsUpdated: 12,
    avgResponseTime: 2.3,
    satisfactionRating: 4.8,
    activeAlerts: 3,
  }

  const recentCalls = [
    { id: 1, caller: "Sarah Johnson", time: "10:30 AM", duration: "5:23", status: "completed", intent: "New Client" },
    { id: 2, caller: "Mike Davis", time: "10:15 AM", duration: "3:45", status: "completed", intent: "Appointment" },
    { id: 3, caller: "Lisa Chen", time: "9:45 AM", duration: "7:12", status: "completed", intent: "Follow-up" },
    { id: 4, caller: "John Smith", time: "9:30 AM", duration: "4:56", status: "completed", intent: "General Question" },
  ]

  const pendingMessages = [
    { id: 1, from: "Emma Wilson", message: "Can I reschedule my appointment?", time: "5 min ago", priority: "normal" },
    {
      id: 2,
      from: "David Brown",
      message: "Need help with insurance verification",
      time: "12 min ago",
      priority: "high",
    },
    { id: 3, from: "Anna Garcia", message: "Thank you for the follow-up call", time: "25 min ago", priority: "low" },
  ]

  const alerts = [
    { id: 1, type: "urgent", message: "Client callback requested - Emma Wilson", time: "2 min ago" },
    { id: 2, type: "info", message: "New intake form submitted", time: "15 min ago" },
    { id: 3, type: "warning", message: "High call volume detected", time: "30 min ago" },
  ]

  return (
    <RoleAwareSidebar userRole="staff" tenantName="Caring Clarity">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 tracking-tight">My Dashboard</h1>
          <p className="text-gray-600 text-lg">Your daily activity and pending tasks</p>
        </div>

        {/* Staff Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white border border-gray-200 shadow-lg rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 tracking-wide">Calls Handled</p>
                  <p className="text-3xl font-bold text-purple-600 mt-1">{staffMetrics.callsHandled}</p>
                  <p className="text-xs text-green-600 mt-1 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Today
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl flex items-center justify-center shadow-xl">
                  <Phone className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-lg rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 tracking-wide">Messages</p>
                  <p className="text-3xl font-bold text-blue-600 mt-1">{staffMetrics.messagesResponded}</p>
                  <p className="text-xs text-orange-600 mt-1 flex items-center">
                    <AlertTriangle className="h-3 w-3 mr-1" />3 pending
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center shadow-xl">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-lg rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 tracking-wide">Satisfaction</p>
                  <p className="text-3xl font-bold text-green-600 mt-1">{staffMetrics.satisfactionRating}</p>
                  <p className="text-xs text-green-600 mt-1 flex items-center">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Average rating
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-teal-400 rounded-xl flex items-center justify-center shadow-xl">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Calls */}
          <Card className="bg-white border border-gray-200 shadow-lg rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800">Recent Calls</CardTitle>
              <CardDescription className="text-gray-600">Your latest call activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentCalls.map((call) => (
                  <div key={call.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <Phone className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{call.caller}</p>
                        <p className="text-sm text-gray-600">
                          {call.intent} • {call.time}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-800">{call.duration}</p>
                      <Badge className="bg-green-100 text-green-700 text-xs">Completed</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pending Messages */}
          <Card className="bg-white border border-gray-200 shadow-lg rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800">Pending Messages</CardTitle>
              <CardDescription className="text-gray-600">Messages requiring your response</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingMessages.map((message) => (
                  <div key={message.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-gray-800">{message.from}</p>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={
                            message.priority === "high"
                              ? "destructive"
                              : message.priority === "normal"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {message.priority}
                        </Badge>
                        <span className="text-xs text-gray-500">{message.time}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{message.message}</p>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      Respond
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts */}
        <Card className="bg-white border border-gray-200 shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800">Active Alerts</CardTitle>
            <CardDescription className="text-gray-600">Important notifications and system alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border-l-4 ${
                    alert.type === "urgent"
                      ? "bg-red-50 border-red-500"
                      : alert.type === "warning"
                        ? "bg-yellow-50 border-yellow-500"
                        : "bg-blue-50 border-blue-500"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {alert.type === "urgent" && <AlertTriangle className="w-5 h-5 text-red-600" />}
                      {alert.type === "warning" && <Clock className="w-5 h-5 text-yellow-600" />}
                      {alert.type === "info" && <CheckCircle className="w-5 h-5 text-blue-600" />}
                      <div>
                        <p className="font-medium text-gray-800">{alert.message}</p>
                        <p className="text-sm text-gray-600">{alert.time}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </RoleAwareSidebar>
  )
}
