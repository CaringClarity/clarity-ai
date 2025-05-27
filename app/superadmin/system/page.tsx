"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from "recharts"
import {
  Server,
  Database,
  Cpu,
  HardDrive,
  Wifi,
  AlertTriangle,
  CheckCircle,
  Activity,
  Clock,
  RefreshCw,
  TrendingUp,
} from "lucide-react"
import { GlassSidebar } from "@/components/glass-sidebar"

export default function SystemPage() {
  const [refreshing, setRefreshing] = useState(false)

  const systemMetrics = {
    uptime: 99.8,
    totalRequests: 2847293,
    avgResponseTime: 145,
    errorRate: 0.02,
    activeConnections: 1247,
    cpuUsage: 34.5,
    memoryUsage: 67.2,
    diskUsage: 45.8,
  }

  const performanceData = [
    { time: "00:00", cpu: 25, memory: 60, responseTime: 120, requests: 1200 },
    { time: "04:00", cpu: 18, memory: 58, responseTime: 110, requests: 800 },
    { time: "08:00", cpu: 45, memory: 72, responseTime: 180, requests: 2400 },
    { time: "12:00", cpu: 52, memory: 78, responseTime: 195, requests: 3200 },
    { time: "16:00", cpu: 38, memory: 65, responseTime: 155, requests: 2800 },
    { time: "20:00", cpu: 28, memory: 62, responseTime: 135, requests: 1800 },
  ]

  const systemServices = [
    {
      name: "API Gateway",
      status: "healthy",
      uptime: "99.9%",
      lastCheck: "30s ago",
      responseTime: "45ms",
      icon: Server,
    },
    {
      name: "Database Cluster",
      status: "healthy",
      uptime: "99.8%",
      lastCheck: "1m ago",
      responseTime: "12ms",
      icon: Database,
    },
    {
      name: "AI Processing",
      status: "healthy",
      uptime: "99.7%",
      lastCheck: "45s ago",
      responseTime: "230ms",
      icon: Cpu,
    },
    {
      name: "Voice Streaming",
      status: "warning",
      uptime: "98.9%",
      lastCheck: "2m ago",
      responseTime: "180ms",
      icon: Wifi,
    },
    {
      name: "File Storage",
      status: "healthy",
      uptime: "99.9%",
      lastCheck: "1m ago",
      responseTime: "25ms",
      icon: HardDrive,
    },
    {
      name: "Message Queue",
      status: "healthy",
      uptime: "99.6%",
      lastCheck: "30s ago",
      responseTime: "8ms",
      icon: Activity,
    },
  ]

  const recentAlerts = [
    {
      id: 1,
      type: "warning",
      service: "Voice Streaming",
      message: "High latency detected in voice processing pipeline",
      time: "5 mins ago",
      resolved: false,
    },
    {
      id: 2,
      type: "info",
      service: "Database",
      message: "Scheduled maintenance completed successfully",
      time: "2 hours ago",
      resolved: true,
    },
    {
      id: 3,
      type: "error",
      service: "API Gateway",
      message: "Rate limit exceeded for tenant: legal-solutions",
      time: "4 hours ago",
      resolved: true,
    },
    {
      id: 4,
      type: "info",
      service: "System",
      message: "Security patch deployed to all nodes",
      time: "1 day ago",
      resolved: true,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-soft-mint text-gray-700"
      case "warning":
        return "bg-soft-peach text-gray-700"
      case "error":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-200 text-gray-600"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="w-4 h-4" />
      case "warning":
        return <AlertTriangle className="w-4 h-4" />
      case "error":
        return <AlertTriangle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getAlertColor = (type: string) => {
    switch (type) {
      case "error":
        return "bg-red-100 text-red-700"
      case "warning":
        return "bg-soft-peach text-gray-700"
      case "info":
        return "bg-soft-blue/20 text-gray-700"
      default:
        return "bg-gray-200 text-gray-600"
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setRefreshing(false)
  }

  return (
    <GlassSidebar userRole="superadmin" userName="Platform Admin">
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="animate-fade-in">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">System Health</h1>
            <p className="text-gray-600 text-lg">Platform infrastructure monitoring and performance</p>
          </div>
          <div className="flex items-center space-x-4 animate-fade-in">
            <Badge className="bg-soft-mint text-gray-700 px-4 py-2">
              <CheckCircle className="w-4 h-4 mr-2" />
              All Systems Operational
            </Badge>
            <Button
              onClick={handleRefresh}
              disabled={refreshing}
              className="bg-gradient-to-r from-soft-blue to-soft-purple text-white hover:shadow-lg transition-all duration-200"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
              {refreshing ? "Refreshing..." : "Refresh"}
            </Button>
          </div>
        </div>

        {/* System Overview Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "System Uptime",
              value: `${systemMetrics.uptime}%`,
              change: "99.9% target",
              icon: Server,
              color: "from-soft-mint to-soft-peach",
            },
            {
              title: "Total Requests",
              value: `${(systemMetrics.totalRequests / 1000000).toFixed(1)}M`,
              change: "+12% today",
              icon: Activity,
              color: "from-soft-blue to-soft-purple",
            },
            {
              title: "Avg Response Time",
              value: `${systemMetrics.avgResponseTime}ms`,
              change: "-8% improvement",
              icon: Clock,
              color: "from-soft-purple to-soft-pink",
            },
            {
              title: "Error Rate",
              value: `${systemMetrics.errorRate}%`,
              change: "Below 0.1% target",
              icon: AlertTriangle,
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

        {/* Performance Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Resource Usage */}
          <Card className="bg-white/50 backdrop-blur-xl border-white/20 shadow-xl animate-fade-in">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800">Resource Usage</CardTitle>
              <CardDescription className="text-gray-600">CPU and memory utilization over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                  <XAxis dataKey="time" stroke="#6b7280" />
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
                  <Line
                    type="monotone"
                    dataKey="cpu"
                    stroke="#a5b4ff"
                    strokeWidth={3}
                    dot={{ fill: "#a5b4ff", strokeWidth: 2, r: 4 }}
                    name="CPU Usage (%)"
                  />
                  <Line
                    type="monotone"
                    dataKey="memory"
                    stroke="#c4b5fd"
                    strokeWidth={3}
                    dot={{ fill: "#c4b5fd", strokeWidth: 2, r: 4 }}
                    name="Memory Usage (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Response Time & Requests */}
          <Card className="bg-white/50 backdrop-blur-xl border-white/20 shadow-xl animate-fade-in">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800">Performance Metrics</CardTitle>
              <CardDescription className="text-gray-600">Response time and request volume</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient id="requestGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#fed7aa" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#fed7aa" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                  <XAxis dataKey="time" stroke="#6b7280" />
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
                    dataKey="requests"
                    stroke="#fed7aa"
                    strokeWidth={3}
                    fill="url(#requestGradient)"
                    name="Requests/hour"
                  />
                  <Line
                    type="monotone"
                    dataKey="responseTime"
                    stroke="#d1fae5"
                    strokeWidth={3}
                    dot={{ fill: "#d1fae5", strokeWidth: 2, r: 4 }}
                    name="Response Time (ms)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Service Status */}
        <Card className="bg-white/50 backdrop-blur-xl border-white/20 shadow-xl animate-fade-in">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800">Service Status</CardTitle>
            <CardDescription className="text-gray-600">Real-time health monitoring of all services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {systemServices.map((service, index) => (
                <div
                  key={service.name}
                  className="p-4 rounded-2xl bg-white/30 hover:bg-white/50 transition-all duration-200 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${
                          service.status === "healthy"
                            ? "bg-gradient-to-r from-soft-mint to-soft-peach"
                            : "bg-gradient-to-r from-soft-peach to-soft-lavender"
                        }`}
                      >
                        <service.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{service.name}</h3>
                        <p className="text-xs text-gray-600">Uptime: {service.uptime}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(service.status)}>
                      {getStatusIcon(service.status)}
                      <span className="ml-1 capitalize">{service.status}</span>
                    </Badge>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Response Time:</span>
                      <span className="font-medium">{service.responseTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Check:</span>
                      <span className="font-medium">{service.lastCheck}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <Card className="bg-white/50 backdrop-blur-xl border-white/20 shadow-xl animate-fade-in">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800">Recent Alerts</CardTitle>
            <CardDescription className="text-gray-600">System notifications and incident reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAlerts.map((alert, index) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-4 rounded-2xl bg-white/30 hover:bg-white/50 transition-all duration-200 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-soft-blue to-soft-purple rounded-2xl flex items-center justify-center shadow-lg">
                      <AlertTriangle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-800">{alert.service}</h3>
                        <Badge className={getAlertColor(alert.type)} size="sm">
                          {alert.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{alert.message}</p>
                      <p className="text-xs text-gray-500 flex items-center mt-1">
                        <Clock className="w-3 h-3 mr-1" />
                        {alert.time}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {alert.resolved && <Badge className="bg-soft-mint text-gray-700">Resolved</Badge>}
                    <Button size="sm" variant="outline" className="hover:bg-white/30">
                      View Details
                    </Button>
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
