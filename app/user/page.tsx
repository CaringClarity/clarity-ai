"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import { Phone, MessageSquare, Calendar, Clock, TrendingUp, User, Activity, Star } from "lucide-react"
import { GlassSidebar } from "@/components/glass-sidebar"

export default function UserDashboard() {
  const [timeframe, setTimeframe] = useState("7d")

  // Mock user data
  const userMetrics = {
    totalCalls: 156,
    totalMessages: 89,
    avgCallDuration: "4:32",
    satisfactionRating: 4.8,
    appointmentsScheduled: 23,
    responseTime: "1.2s",
  }

  const callData = [
    { day: "Mon", calls: 12, duration: 45 },
    { day: "Tue", calls: 19, duration: 52 },
    { day: "Wed", calls: 15, duration: 38 },
    { day: "Thu", calls: 22, duration: 61 },
    { day: "Fri", calls: 18, duration: 44 },
    { day: "Sat", calls: 8, duration: 28 },
    { day: "Sun", calls: 6, duration: 22 },
  ]

  const recentCalls = [
    {
      id: 1,
      caller: "Sarah Johnson",
      time: "2:30 PM",
      duration: "5:23",
      status: "completed",
      intent: "Appointment",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      caller: "Mike Davis",
      time: "1:15 PM",
      duration: "3:45",
      status: "completed",
      intent: "Question",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      caller: "Lisa Chen",
      time: "11:45 AM",
      duration: "7:12",
      status: "completed",
      intent: "Follow-up",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 4,
      caller: "John Smith",
      time: "10:30 AM",
      duration: "4:56",
      status: "missed",
      intent: "Inquiry",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  const upcomingAppointments = [
    { id: 1, client: "Emma Wilson", time: "3:00 PM", type: "Consultation", status: "confirmed" },
    { id: 2, client: "David Brown", time: "4:30 PM", type: "Follow-up", status: "pending" },
    { id: 3, client: "Anna Garcia", time: "Tomorrow 9:00 AM", type: "Initial Meeting", status: "confirmed" },
  ]

  const notifications = [
    { id: 1, type: "call", message: "AI is currently on a call", time: "now", status: "active" },
    { id: 2, type: "message", message: "New message received", time: "10:52 AM", status: "unread" },
    { id: 3, type: "system", message: "System update available", time: "5 mins ago", status: "info" },
    { id: 4, type: "appointment", message: "Scheduled maintenance", time: "25 mins ago", status: "scheduled" },
  ]

  return (
    <GlassSidebar userRole="user" userName="Sarah Mitchell">
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="animate-fade-in">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome back, Sarah</h1>
            <p className="text-gray-600 text-lg">Here's your activity overview for today</p>
          </div>
          <div className="flex items-center space-x-4 animate-fade-in">
            <Badge className="bg-soft-mint text-gray-700 px-4 py-2 animate-pulse-soft">
              <User className="w-4 h-4 mr-2" />
              AI is currently on a call
            </Badge>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Total Calls",
              value: userMetrics.totalCalls,
              change: "+12 this week",
              icon: Phone,
              color: "from-soft-blue to-soft-purple",
            },
            {
              title: "Messages",
              value: userMetrics.totalMessages,
              change: "3 unread",
              icon: MessageSquare,
              color: "from-soft-purple to-soft-pink",
            },
            {
              title: "Satisfaction",
              value: `${userMetrics.satisfactionRating}★`,
              change: "Excellent rating",
              icon: Star,
              color: "from-soft-mint to-soft-peach",
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
                  <div
                    className={`w-14 h-14 bg-gradient-to-r ${metric.color} rounded-2xl flex items-center justify-center shadow-lg`}
                  >
                    <metric.icon className="w-7 h-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Call Activity Chart */}
          <Card className="bg-white/50 backdrop-blur-xl border-white/20 shadow-xl animate-fade-in">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800">Weekly Activity</CardTitle>
              <CardDescription className="text-gray-600">Your call patterns this week</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={callData}>
                  <defs>
                    <linearGradient id="callGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a5b4ff" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#a5b4ff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
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
                  <Area
                    type="monotone"
                    dataKey="calls"
                    stroke="#a5b4ff"
                    strokeWidth={3}
                    fill="url(#callGradient)"
                    name="Calls"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="bg-white/50 backdrop-blur-xl border-white/20 shadow-xl animate-fade-in">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800">Recent Activity</CardTitle>
              <CardDescription className="text-gray-600">Latest updates and notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.map((notification, index) => (
                  <div
                    key={notification.id}
                    className="flex items-center space-x-4 p-4 rounded-2xl bg-white/30 hover:bg-white/50 transition-all duration-200 animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div
                      className={`
                      w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg
                      ${
                        notification.type === "call"
                          ? "bg-gradient-to-r from-soft-blue to-soft-purple"
                          : notification.type === "message"
                            ? "bg-gradient-to-r from-soft-purple to-soft-pink"
                            : notification.type === "system"
                              ? "bg-gradient-to-r from-soft-mint to-soft-peach"
                              : "bg-gradient-to-r from-soft-peach to-soft-lavender"
                      }
                    `}
                    >
                      {notification.type === "call" && <Phone className="w-5 h-5 text-white" />}
                      {notification.type === "message" && <MessageSquare className="w-5 h-5 text-white" />}
                      {notification.type === "system" && <Activity className="w-5 h-5 text-white" />}
                      {notification.type === "appointment" && <Calendar className="w-5 h-5 text-white" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{notification.message}</p>
                      <p className="text-sm text-gray-600 flex items-center mt-1">
                        <Clock className="w-3 h-3 mr-1" />
                        {notification.time}
                      </p>
                    </div>
                    {notification.status === "active" && (
                      <Badge className="bg-soft-mint text-gray-700 animate-pulse-soft">Live</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Calls and Appointments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Calls */}
          <Card className="bg-white/50 backdrop-blur-xl border-white/20 shadow-xl animate-fade-in">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800">Recent Calls</CardTitle>
              <CardDescription className="text-gray-600">Your latest call interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentCalls.map((call, index) => (
                  <div
                    key={call.id}
                    className="flex items-center space-x-4 p-4 rounded-2xl bg-white/30 hover:bg-white/50 transition-all duration-200 animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <Avatar className="w-12 h-12 shadow-lg">
                      <AvatarImage src={call.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="bg-gradient-to-r from-soft-blue to-soft-purple text-white">
                        {call.caller
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{call.caller}</p>
                      <p className="text-sm text-gray-600">
                        {call.intent} • {call.time}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-800">{call.duration}</p>
                      <Badge
                        className={
                          call.status === "completed" ? "bg-soft-mint text-gray-700" : "bg-soft-peach text-gray-700"
                        }
                      >
                        {call.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Appointments */}
          <Card className="bg-white/50 backdrop-blur-xl border-white/20 shadow-xl animate-fade-in">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800">Upcoming Appointments</CardTitle>
              <CardDescription className="text-gray-600">Scheduled meetings and consultations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingAppointments.map((appointment, index) => (
                  <div
                    key={appointment.id}
                    className="flex items-center space-x-4 p-4 rounded-2xl bg-white/30 hover:bg-white/50 transition-all duration-200 animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-soft-purple to-soft-pink rounded-2xl flex items-center justify-center shadow-lg">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{appointment.client}</p>
                      <p className="text-sm text-gray-600">
                        {appointment.type} • {appointment.time}
                      </p>
                    </div>
                    <Badge
                      className={
                        appointment.status === "confirmed"
                          ? "bg-soft-mint text-gray-700"
                          : "bg-soft-lavender text-gray-700"
                      }
                    >
                      {appointment.status}
                    </Badge>
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
