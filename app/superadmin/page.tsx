"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  Building2,
  Users,
  DollarSign,
  Activity,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Download,
} from "lucide-react"
import { GlassSidebar } from "@/components/glass-sidebar"

export default function SuperAdminDashboard() {
  const [timeframe, setTimeframe] = useState("30d")

  // Mock data
  const platformMetrics = {
    totalTenants: 47,
    totalUsers: 12345,
    monthlyRevenue: 67890,
    totalCalls: 89234,
    systemUptime: 99.8,
    activeAgents: 156,
  }

  const growthData = [
    { month: "Jan", users: 8200, revenue: 45000, calls: 12000 },
    { month: "Feb", users: 9100, revenue: 52000, calls: 15000 },
    { month: "Mar", users: 9800, revenue: 58000, calls: 18000 },
    { month: "Apr", users: 10500, revenue: 61000, calls: 22000 },
    { month: "May", users: 11200, revenue: 64000, calls: 25000 },
    { month: "Jun", users: 12345, revenue: 67890, calls: 28000 },
  ]

  const tenantDistribution = [
    { name: "Healthcare", value: 35, color: "#a5b4ff" },
    { name: "Legal", value: 25, color: "#c4b5fd" },
    { name: "Real Estate", value: 20, color: "#fed7aa" },
    { name: "Finance", value: 12, color: "#d1fae5" },
    { name: "Other", value: 8, color: "#f3e8ff" },
  ]

  const recentActivity = [
    {
      id: 1,
      type: "new_tenant",
      message: "New tenant registered: MedCare Solutions",
      time: "2 mins ago",
      icon: Building2,
    },
    { id: 2, type: "system", message: "System update deployed successfully", time: "15 mins ago", icon: CheckCircle },
    { id: 3, type: "alert", message: "High call volume detected", time: "32 mins ago", icon: AlertTriangle },
    { id: 4, type: "revenue", message: "Monthly revenue target achieved", time: "1 hour ago", icon: DollarSign },
  ]

  return (
    <GlassSidebar userRole="superadmin" userName="Platform Admin">
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="animate-fade-in">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Platform Analytics</h1>
            <p className="text-gray-600 text-lg">System-wide insights and tenant management</p>
          </div>
          <div className="flex items-center space-x-4 animate-fade-in">
            <Badge className="bg-soft-mint text-gray-700 px-4 py-2">
              <Activity className="w-4 h-4 mr-2" />
              All Systems Operational
            </Badge>
            <Button className="bg-gradient-to-r from-soft-blue to-soft-purple text-white hover:shadow-lg transition-all duration-200">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Total Tenants",
              value: platformMetrics.totalTenants,
              change: "+5 this month",
              icon: Building2,
              color: "from-soft-blue to-soft-purple",
              bgColor: "bg-soft-blue/10",
            },
            {
              title: "Platform Users",
              value: platformMetrics.totalUsers.toLocaleString(),
              change: "+12% growth",
              icon: Users,
              color: "from-soft-purple to-soft-pink",
              bgColor: "bg-soft-purple/10",
            },
            {
              title: "Monthly Revenue",
              value: `$${platformMetrics.monthlyRevenue.toLocaleString()}`,
              change: "+18% vs last month",
              icon: DollarSign,
              color: "from-soft-mint to-soft-peach",
              bgColor: "bg-soft-mint/10",
            },
            {
              title: "System Uptime",
              value: `${platformMetrics.systemUptime}%`,
              change: "99.9% target",
              icon: Activity,
              color: "from-soft-peach to-soft-lavender",
              bgColor: "bg-soft-peach/10",
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

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Growth Trends */}
          <Card className="bg-white/50 backdrop-blur-xl border-white/20 shadow-xl animate-fade-in">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800">Platform Growth</CardTitle>
              <CardDescription className="text-gray-600">User acquisition and revenue trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={growthData}>
                  <defs>
                    <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a5b4ff" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#a5b4ff" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#c4b5fd" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#c4b5fd" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                  <XAxis dataKey="month" stroke="#6b7280" />
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
                    dataKey="users"
                    stroke="#a5b4ff"
                    strokeWidth={3}
                    fill="url(#userGradient)"
                    name="Users"
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#c4b5fd"
                    strokeWidth={3}
                    fill="url(#revenueGradient)"
                    name="Revenue"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Tenant Distribution */}
          <Card className="bg-white/50 backdrop-blur-xl border-white/20 shadow-xl animate-fade-in">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800">Tenant Distribution</CardTitle>
              <CardDescription className="text-gray-600">Breakdown by industry sector</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={tenantDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {tenantDistribution.map((entry, index) => (
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

        {/* Recent Activity */}
        <Card className="bg-white/50 backdrop-blur-xl border-white/20 shadow-xl animate-fade-in">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800">Recent Activity</CardTitle>
            <CardDescription className="text-gray-600">Latest platform events and notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div
                  key={activity.id}
                  className="flex items-center space-x-4 p-4 rounded-2xl bg-white/30 hover:bg-white/50 transition-all duration-200 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div
                    className={`
                    w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg
                    ${
                      activity.type === "new_tenant"
                        ? "bg-gradient-to-r from-soft-blue to-soft-purple"
                        : activity.type === "system"
                          ? "bg-gradient-to-r from-soft-mint to-soft-peach"
                          : activity.type === "alert"
                            ? "bg-gradient-to-r from-soft-peach to-soft-lavender"
                            : "bg-gradient-to-r from-soft-purple to-soft-pink"
                    }
                  `}
                  >
                    <activity.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{activity.message}</p>
                    <p className="text-sm text-gray-600 flex items-center mt-1">
                      <Clock className="w-3 h-3 mr-1" />
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </GlassSidebar>
  )
}
