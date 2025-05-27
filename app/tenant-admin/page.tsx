"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts"
import { Phone, Calendar, TrendingUp, Clock, CheckCircle, Download, Play, Pause } from "lucide-react"
import { GlassSidebar } from "@/components/glass-sidebar"

export default function TenantAdminDashboard() {
  const [agentStatus, setAgentStatus] = useState("active")

  // Mock data for business metrics
  const businessMetrics = {
    totalCalls: 1247,
    completedIntakes: 892,
    appointments: 156,
    teamMembers: 8,
    avgResponseTime: 1.8,
    satisfactionScore: 4.6,
    conversionRate: 71.5,
    activeCalls: 3,
  }

  const callVolumeData = [
    { day: "Mon", calls: 45, intakes: 32, appointments: 8 },
    { day: "Tue", calls: 52, intakes: 38, appointments: 12 },
    { day: "Wed", calls: 38, intakes: 28, appointments: 6 },
    { day: "Thu", calls: 61, intakes: 45, appointments: 15 },
    { day: "Fri", calls: 55, intakes: 41, appointments: 11 },
    { day: "Sat", calls: 28, intakes: 18, appointments: 4 },
    { day: "Sun", calls: 32, intakes: 22, appointments: 5 },
  ]

  const intentDistribution = [
    { name: "New Client", value: 42, color: "#a5b4ff" },
    { name: "Existing Client", value: 28, color: "#c4b5fd" },
    { name: "Appointment", value: 18, color: "#fed7aa" },
    { name: "General Question", value: 12, color: "#d1fae5" },
  ]

  const recentCalls = [
    {
      id: 1,
      caller: "Sarah Johnson",
      intent: "New Client Intake",
      duration: "4:32",
      status: "completed",
      time: "2 mins ago",
      satisfaction: 5,
    },
    {
      id: 2,
      caller: "Mike Davis",
      intent: "Appointment Booking",
      duration: "2:15",
      status: "completed",
      time: "8 mins ago",
      satisfaction: 4,
    },
    {
      id: 3,
      caller: "Lisa Chen",
      intent: "Provider Availability",
      duration: "3:45",
      status: "completed",
      time: "15 mins ago",
      satisfaction: 5,
    },
    {
      id: 4,
      caller: "John Smith",
      intent: "General Question",
      duration: "1:58",
      status: "completed",
      time: "22 mins ago",
      satisfaction: 4,
    },
  ]

  const teamActivity = [
    { name: "Dr. Emily Rodriguez", role: "Provider", status: "Available", calls: 23 },
    { name: "James Wilson", role: "Intake Specialist", status: "On Call", calls: 18 },
    { name: "Maria Garcia", role: "Scheduler", status: "Available", calls: 15 },
    { name: "David Kim", role: "Support", status: "Break", calls: 12 },
  ]

  return (
    <GlassSidebar userRole="tenant-admin" userName="Dr. Sarah Mitchell">
      <div className="p-8 space-y-8">
        {/* Header with Agent Control */}
        <div className="flex items-center justify-between">
          <div className="animate-fade-in">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Business Dashboard</h1>
            <p className="text-gray-600 text-lg">Caring Clarity - AI Voice Agent Management</p>
          </div>
          <div className="flex items-center space-x-4 animate-fade-in">
            <div className="flex items-center space-x-3 bg-white/50 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse-soft"></div>
              <span className="text-sm font-medium text-gray-700">Agent Active</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setAgentStatus(agentStatus === "active" ? "paused" : "active")}
                className="hover:bg-white/30"
              >
                {agentStatus === "active" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
            </div>
            <Button className="bg-gradient-to-r from-soft-blue to-soft-purple text-white hover:shadow-lg transition-all duration-200">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Business Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Total Calls Today",
              value: businessMetrics.totalCalls,
              change: "+23% vs yesterday",
              icon: Phone,
              color: "from-soft-blue to-soft-purple",
              badge: `${businessMetrics.activeCalls} active`,
            },
            {
              title: "Completed Intakes",
              value: businessMetrics.completedIntakes,
              change: `${businessMetrics.conversionRate}% conversion`,
              icon: CheckCircle,
              color: "from-soft-purple to-soft-pink",
            },
            {
              title: "Appointments Booked",
              value: businessMetrics.appointments,
              change: "+18% this week",
              icon: Calendar,
              color: "from-soft-mint to-soft-peach",
            },
            {
              title: "Avg Response Time",
              value: `${businessMetrics.avgResponseTime}s`,
              change: "-15% improvement",
              icon: Clock,
              color: "from-soft-peach to-soft-lavender",
            },
          ].map((metric, index) => (
            <Card
              key={metric.title}
              className="bg-white/50 backdrop-blur-xl border-white/20 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{metric.title}</p>
                    <p className="text-3xl font-bold text-gray-800 mb-2">{metric.value}</p>
                    <p className="text-xs text-green-600 flex items-center">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {metric.change}
                    </p>
                  </div>
                  <div className="text-right">
                    <div
                      className={`w-14 h-14 bg-gradient-to-r ${metric.color} rounded-2xl flex items-center justify-center shadow-lg mb-2`}
                    >
                      <metric.icon className="w-7 h-7 text-white" />
                    </div>
                    {metric.badge && <Badge className="bg-soft-mint text-gray-700 text-xs">{metric.badge}</Badge>}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Weekly Activity */}
          <Card className="bg-white/50 backdrop-blur-xl border-white/20 shadow-xl animate-fade-in">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800">Weekly Activity</CardTitle>
              <CardDescription className="text-gray-600">Calls, intakes, and appointments this week</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={callVolumeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                  <XAxis dataKey="day" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      backdropFilter: "blur(10px)",
                      border: "none",
                      borderRadius: "12px",
                      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Bar dataKey="calls" fill="#a5b4ff" radius={[4, 4, 0, 0]} name="Total Calls" />
                  <Bar dataKey="intakes" fill="#c4b5fd" radius={[4, 4, 0, 0]} name="Completed Intakes" />
                  <Bar dataKey="appointments" fill="#fed7aa" radius={[4, 4, 0, 0]} name="Appointments" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Caller Intent Distribution */}
          <Card className="bg-white/50 backdrop-blur-xl border-white/20 shadow-xl animate-fade-in">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800">Caller Intent Analysis</CardTitle>
              <CardDescription className="text-gray-600">Breakdown of call purposes</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={intentDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {intentDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      backdropFilter: "blur(10px)",
                      border: "none",
                      borderRadius: "12px",
                      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Calls and Team Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Calls */}
          <Card className="bg-white/50 backdrop-blur-xl border-white/20 shadow-xl animate-fade-in">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800">Recent Calls</CardTitle>
              <CardDescription className="text-gray-600">Latest AI agent interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentCalls.map((call, index) => (
                  <div
                    key={call.id}
                    className="flex items-center justify-between p-4 rounded-2xl bg-white/30 hover:bg-white/50 transition-all duration-200 animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-soft-blue to-soft-purple rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white font-semibold text-sm">
                          {call.caller
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{call.caller}</p>
                        <p className="text-sm text-gray-600">{call.intent}</p>
                        <p className="text-xs text-gray-500 flex items-center mt-1">
                          <Clock className="w-3 h-3 mr-1" />
                          {call.duration} • {call.time}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="default" className="mb-2">
                        {call.status}
                      </Badge>
                      <div className="flex items-center text-yellow-500">{"★".repeat(call.satisfaction)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Team Activity */}
          <Card className="bg-white/50 backdrop-blur-xl border-white/20 shadow-xl animate-fade-in">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800">Team Activity</CardTitle>
              <CardDescription className="text-gray-600">Staff status and performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamActivity.map((member, index) => (
                  <div
                    key={member.name}
                    className="flex items-center justify-between p-4 rounded-2xl bg-white/30 hover:bg-white/50 transition-all duration-200 animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-soft-purple to-soft-pink rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white font-semibold text-sm">
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{member.name}</p>
                        <p className="text-sm text-gray-600">{member.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={member.status === "Available" ? "default" : "secondary"}
                        className={`mb-2 ${
                          member.status === "Available"
                            ? "bg-soft-mint text-gray-700"
                            : member.status === "On Call"
                              ? "bg-soft-blue text-white"
                              : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {member.status}
                      </Badge>
                      <p className="text-sm text-gray-600">{member.calls} calls today</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </GlassSidebar>
  )
}
