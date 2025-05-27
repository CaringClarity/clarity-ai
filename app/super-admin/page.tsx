"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { Building2, Users, Activity, DollarSign, TrendingUp, CheckCircle } from "lucide-react"
import { RoleAwareSidebar } from "@/components/role-aware-sidebar"

export default function SuperAdminDashboard() {
  const [timeframe, setTimeframe] = useState("30d")

  // Mock data for super admin metrics
  const platformMetrics = {
    totalTenants: 47,
    activeTenants: 42,
    totalUsers: 1247,
    totalCalls: 15847,
    revenue: 47250,
    uptime: 99.8,
  }

  const tenantGrowthData = [
    { month: "Jan", tenants: 32, revenue: 28500 },
    { month: "Feb", tenants: 35, revenue: 31200 },
    { month: "Mar", tenants: 38, revenue: 34800 },
    { month: "Apr", tenants: 42, revenue: 38900 },
    { month: "May", tenants: 45, revenue: 42100 },
    { month: "Jun", tenants: 47, revenue: 47250 },
  ]

  const usageByTenant = [
    { name: "Caring Clarity", calls: 3247, users: 24, plan: "Enterprise" },
    { name: "MedConnect", calls: 2891, users: 18, plan: "Professional" },
    { name: "HealthFirst", calls: 2456, users: 15, plan: "Professional" },
    { name: "WellCare", calls: 1923, users: 12, plan: "Standard" },
    { name: "CareLink", calls: 1678, users: 8, plan: "Standard" },
  ]

  const systemHealthData = [
    { name: "API Latency", value: 98, color: "#10B981" },
    { name: "Database", value: 99, color: "#06B6D4" },
    { name: "Voice Services", value: 97, color: "#8B5CF6" },
    { name: "SMS Gateway", value: 99, color: "#F59E0B" },
  ]

  return (
    <RoleAwareSidebar userRole="super-admin">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 tracking-tight">Platform Analytics</h1>
          <p className="text-gray-600 text-lg">System-wide metrics and tenant management</p>
        </div>

        {/* Key Platform Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border border-gray-200 shadow-lg rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 tracking-wide">Total Tenants</p>
                  <p className="text-3xl font-bold text-purple-600 mt-1">{platformMetrics.totalTenants}</p>
                  <p className="text-xs text-green-600 mt-1 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +5 this month
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl flex items-center justify-center shadow-xl">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-lg rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 tracking-wide">Total Users</p>
                  <p className="text-3xl font-bold text-blue-600 mt-1">{platformMetrics.totalUsers.toLocaleString()}</p>
                  <p className="text-xs text-green-600 mt-1 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12% growth
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center shadow-xl">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-lg rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 tracking-wide">Monthly Revenue</p>
                  <p className="text-3xl font-bold text-green-600 mt-1">${platformMetrics.revenue.toLocaleString()}</p>
                  <p className="text-xs text-green-600 mt-1 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +18% vs last month
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-teal-400 rounded-xl flex items-center justify-center shadow-xl">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-lg rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 tracking-wide">Platform Uptime</p>
                  <p className="text-3xl font-bold text-orange-600 mt-1">{platformMetrics.uptime}%</p>
                  <p className="text-xs text-green-600 mt-1 flex items-center">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    All systems operational
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-400 rounded-xl flex items-center justify-center shadow-xl">
                  <Activity className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Tenant Growth Chart */}
          <Card className="bg-white border border-gray-200 shadow-lg rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800">Tenant Growth & Revenue</CardTitle>
              <CardDescription className="text-gray-600">Monthly tenant acquisition and revenue trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={tenantGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="tenants"
                    stroke="#8B5CF6"
                    strokeWidth={3}
                    name="Tenants"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10B981"
                    strokeWidth={3}
                    name="Revenue ($)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* System Health */}
          <Card className="bg-white border border-gray-200 shadow-lg rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800">System Health</CardTitle>
              <CardDescription className="text-gray-600">Real-time platform component status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemHealthData.map((component) => (
                  <div key={component.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full bg-${component.value > 95 ? "green" : "yellow"}-500`} />
                      <span className="font-medium text-gray-800">{component.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-gray-800">{component.value}%</span>
                      <Badge variant={component.value > 95 ? "default" : "secondary"}>
                        {component.value > 95 ? "Healthy" : "Warning"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Tenants Table */}
        <Card className="bg-white border border-gray-200 shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800">Top Tenants by Usage</CardTitle>
            <CardDescription className="text-gray-600">Highest activity tenants this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left p-3 font-semibold text-gray-700">Tenant Name</th>
                    <th className="text-left p-3 font-semibold text-gray-700">Total Calls</th>
                    <th className="text-left p-3 font-semibold text-gray-700">Users</th>
                    <th className="text-left p-3 font-semibold text-gray-700">Plan</th>
                    <th className="text-left p-3 font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {usageByTenant.map((tenant, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-3 font-semibold text-gray-800">{tenant.name}</td>
                      <td className="p-3 text-gray-600">{tenant.calls.toLocaleString()}</td>
                      <td className="p-3 text-gray-600">{tenant.users}</td>
                      <td className="p-3">
                        <Badge variant={tenant.plan === "Enterprise" ? "default" : "secondary"}>{tenant.plan}</Badge>
                      </td>
                      <td className="p-3">
                        <Badge className="bg-green-100 text-green-700">Active</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </RoleAwareSidebar>
  )
}
