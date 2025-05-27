"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, ArrowLeft, Download, Calendar, Activity, Phone, Clock, Users } from "lucide-react"
import Link from "next/link"

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("30d")

  // Mock data for charts
  const callVolumeData = [
    { name: "Mon", calls: 45 },
    { name: "Tue", calls: 52 },
    { name: "Wed", calls: 38 },
    { name: "Thu", calls: 61 },
    { name: "Fri", calls: 55 },
    { name: "Sat", calls: 28 },
    { name: "Sun", calls: 32 },
  ]

  // Updated caller intent data
  const callerIntentData = [
    { name: "Week 1", newClient: 45, existingClient: 32, providerAvailability: 18, generalQuestions: 25 },
    { name: "Week 2", newClient: 52, existingClient: 28, providerAvailability: 22, generalQuestions: 30 },
    { name: "Week 3", newClient: 38, existingClient: 35, providerAvailability: 15, generalQuestions: 28 },
    { name: "Week 4", newClient: 48, existingClient: 30, providerAvailability: 20, generalQuestions: 32 },
  ]

  const channelData = [
    { name: "Phone", value: 65, color: "#8B5CF6" },
    { name: "SMS", value: 25, color: "#06B6D4" },
    { name: "Web", value: 10, color: "#10B981" },
  ]

  // Updated satisfaction data to caller intent distribution
  const callerIntentDistribution = [
    { name: "New Client", value: 42, color: "#8B5CF6" },
    { name: "Existing Client", value: 28, color: "#06B6D4" },
    { name: "Provider Availability", value: 18, color: "#10B981" },
    { name: "General Questions", value: 12, color: "#F59E0B" },
  ]

  return (
    <div className="min-h-screen bg-gradient-radial from-white 90% via-purple-100 95% via-purple-200 98% to-purple-300">
      {/* Modern Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-100/30 to-blue-100/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-pink-100/30 to-purple-100/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/dashboard">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 bg-white/70 border-gray-200 rounded-xl shadow-lg drop-shadow-md hover:bg-white/90"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2 tracking-tight drop-shadow-xl">
                Analytics & Reports
              </h1>
              <p className="text-gray-600 text-lg drop-shadow-lg">
                Monitor performance metrics and caller intent insights
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-48 bg-white/70 border-gray-200 rounded-xl shadow-lg drop-shadow-md">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white/90 backdrop-blur-sm border border-gray-200 shadow-xl drop-shadow-lg rounded-xl">
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>
              <Button className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-xl shadow-xl drop-shadow-lg">
                <Download className="h-4 w-4" />
                Export Report
              </Button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/60 backdrop-blur-sm border border-white/60 shadow-xl shadow-purple-100/50 drop-shadow-xl rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 tracking-wide drop-shadow-sm">Total Calls</p>
                  <p className="text-3xl font-bold text-purple-600 mt-1 drop-shadow-md">1,247</p>
                  <p className="text-xs text-green-600 mt-1 flex items-center drop-shadow-sm">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +23% vs last month
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl flex items-center justify-center shadow-xl drop-shadow-lg">
                  <Phone className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border border-white/60 shadow-xl shadow-purple-100/50 drop-shadow-xl rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 tracking-wide drop-shadow-sm">New Clients</p>
                  <p className="text-3xl font-bold text-blue-600 mt-1 drop-shadow-md">524</p>
                  <p className="text-xs text-green-600 mt-1 flex items-center drop-shadow-sm">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +18% this month
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center shadow-xl drop-shadow-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border border-white/60 shadow-xl shadow-purple-100/50 drop-shadow-xl rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 tracking-wide drop-shadow-sm">Provider Inquiries</p>
                  <p className="text-3xl font-bold text-green-600 mt-1 drop-shadow-md">225</p>
                  <p className="text-xs text-green-600 mt-1 flex items-center drop-shadow-sm">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12% this month
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-teal-400 rounded-xl flex items-center justify-center shadow-xl drop-shadow-lg">
                  <Activity className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border border-white/60 shadow-xl shadow-purple-100/50 drop-shadow-xl rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 tracking-wide drop-shadow-sm">Avg Response Time</p>
                  <p className="text-3xl font-bold text-orange-600 mt-1 drop-shadow-md">1.8s</p>
                  <p className="text-xs text-green-600 mt-1 flex items-center drop-shadow-sm">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    -15% improvement
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-400 rounded-xl flex items-center justify-center shadow-xl drop-shadow-lg">
                  <Clock className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Call Volume Chart */}
          <Card className="bg-white/60 backdrop-blur-sm border border-white/60 shadow-xl shadow-purple-100/50 drop-shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800 drop-shadow-md">Daily Call Volume</CardTitle>
              <CardDescription className="text-gray-600 drop-shadow-sm">
                Calls received per day this week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={callVolumeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="calls" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Caller Intent Trends Chart */}
          <Card className="bg-white/60 backdrop-blur-sm border border-white/60 shadow-xl shadow-purple-100/50 drop-shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800 drop-shadow-md">Caller Intent Trends</CardTitle>
              <CardDescription className="text-gray-600 drop-shadow-sm">
                Call intent categories over the last month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={callerIntentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="newClient" stroke="#8B5CF6" strokeWidth={3} name="New Client" />
                  <Line
                    type="monotone"
                    dataKey="existingClient"
                    stroke="#06B6D4"
                    strokeWidth={3}
                    name="Existing Client"
                  />
                  <Line
                    type="monotone"
                    dataKey="providerAvailability"
                    stroke="#10B981"
                    strokeWidth={3}
                    name="Provider Availability"
                  />
                  <Line
                    type="monotone"
                    dataKey="generalQuestions"
                    stroke="#F59E0B"
                    strokeWidth={3}
                    name="General Questions"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Channel Distribution */}
          <Card className="bg-white/60 backdrop-blur-sm border border-white/60 shadow-xl shadow-purple-100/50 drop-shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800 drop-shadow-md">Channel Distribution</CardTitle>
              <CardDescription className="text-gray-600 drop-shadow-sm">Calls by communication channel</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={channelData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {channelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Caller Intent Distribution */}
          <Card className="bg-white/60 backdrop-blur-sm border border-white/60 shadow-xl shadow-purple-100/50 drop-shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800 drop-shadow-md">
                Caller Intent Distribution
              </CardTitle>
              <CardDescription className="text-gray-600 drop-shadow-sm">
                Breakdown of call purposes and intent
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={callerIntentDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {callerIntentDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
