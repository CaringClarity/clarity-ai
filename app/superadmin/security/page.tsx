"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Shield,
  Lock,
  Key,
  AlertTriangle,
  CheckCircle,
  Eye,
  Search,
  Download,
  RefreshCw,
  Globe,
  User,
  Clock,
  MapPin,
} from "lucide-react"
import { GlassSidebar } from "@/components/glass-sidebar"

export default function SecurityPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const securityMetrics = {
    totalLogins: 15847,
    failedAttempts: 23,
    activeTokens: 1247,
    suspiciousActivity: 3,
    lastSecurityScan: "2 hours ago",
    vulnerabilities: 0,
  }

  const securityEvents = [
    {
      id: 1,
      type: "login_success",
      user: "Dr. Sarah Mitchell",
      tenant: "Caring Clarity",
      ip: "192.168.1.100",
      location: "San Francisco, CA",
      time: "2024-05-26T10:30:00Z",
      userAgent: "Chrome 124.0.0.0",
    },
    {
      id: 2,
      type: "failed_login",
      user: "admin@legalsolutions.com",
      tenant: "Legal Solutions Pro",
      ip: "203.0.113.45",
      location: "Unknown",
      time: "2024-05-26T10:15:00Z",
      userAgent: "Unknown",
    },
    {
      id: 3,
      type: "password_change",
      user: "Maria Garcia",
      tenant: "Legal Solutions Pro",
      ip: "192.168.1.200",
      location: "New York, NY",
      time: "2024-05-26T09:45:00Z",
      userAgent: "Firefox 125.0.1",
    },
    {
      id: 4,
      type: "api_key_created",
      user: "System Admin",
      tenant: "Platform",
      ip: "10.0.0.1",
      location: "Server",
      time: "2024-05-26T08:30:00Z",
      userAgent: "API Client",
    },
    {
      id: 5,
      type: "suspicious_activity",
      user: "unknown@example.com",
      tenant: "N/A",
      ip: "198.51.100.42",
      location: "Unknown",
      time: "2024-05-26T07:20:00Z",
      userAgent: "Bot/1.0",
    },
  ]

  const activeTokens = [
    {
      id: 1,
      name: "Production API Key",
      tenant: "Caring Clarity",
      type: "api_key",
      permissions: ["read", "write"],
      lastUsed: "5 mins ago",
      expires: "2024-12-31",
      status: "active",
    },
    {
      id: 2,
      name: "Mobile App Token",
      tenant: "Legal Solutions Pro",
      type: "jwt",
      permissions: ["read"],
      lastUsed: "2 hours ago",
      expires: "2024-06-26",
      status: "active",
    },
    {
      id: 3,
      name: "Webhook Integration",
      tenant: "Premier Realty Group",
      type: "webhook",
      permissions: ["webhook"],
      lastUsed: "1 day ago",
      expires: "2025-01-15",
      status: "active",
    },
    {
      id: 4,
      name: "Test Environment",
      tenant: "FinanceFirst Advisors",
      type: "api_key",
      permissions: ["read"],
      lastUsed: "Never",
      expires: "2024-07-01",
      status: "inactive",
    },
  ]

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "login_success":
        return "bg-soft-mint text-gray-700"
      case "failed_login":
        return "bg-red-100 text-red-700"
      case "password_change":
        return "bg-soft-blue/20 text-gray-700"
      case "api_key_created":
        return "bg-soft-purple/20 text-gray-700"
      case "suspicious_activity":
        return "bg-soft-peach text-gray-700"
      default:
        return "bg-gray-200 text-gray-600"
    }
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case "login_success":
        return <CheckCircle className="w-4 h-4" />
      case "failed_login":
        return <AlertTriangle className="w-4 h-4" />
      case "password_change":
        return <Lock className="w-4 h-4" />
      case "api_key_created":
        return <Key className="w-4 h-4" />
      case "suspicious_activity":
        return <Eye className="w-4 h-4" />
      default:
        return <Shield className="w-4 h-4" />
    }
  }

  const getTokenTypeColor = (type: string) => {
    switch (type) {
      case "api_key":
        return "bg-soft-blue text-white"
      case "jwt":
        return "bg-soft-purple text-white"
      case "webhook":
        return "bg-soft-mint text-gray-700"
      default:
        return "bg-gray-200 text-gray-600"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-soft-mint text-gray-700"
      case "inactive":
        return "bg-gray-200 text-gray-600"
      case "expired":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-200 text-gray-600"
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    return date.toLocaleDateString()
  }

  const filteredEvents = securityEvents.filter(
    (event) =>
      event.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.tenant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.ip.includes(searchTerm),
  )

  return (
    <GlassSidebar userRole="superadmin" userName="Platform Admin">
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="animate-fade-in">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Security Center</h1>
            <p className="text-gray-600 text-lg">Platform security monitoring and access control</p>
          </div>
          <div className="flex items-center space-x-4 animate-fade-in">
            <Badge className="bg-soft-mint text-gray-700 px-4 py-2">
              <Shield className="w-4 h-4 mr-2" />
              Security Score: 98/100
            </Badge>
            <Button className="bg-gradient-to-r from-soft-blue to-soft-purple text-white hover:shadow-lg transition-all duration-200">
              <Download className="w-4 h-4 mr-2" />
              Security Report
            </Button>
          </div>
        </div>

        {/* Security Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Total Logins",
              value: securityMetrics.totalLogins.toLocaleString(),
              change: "+5% today",
              icon: User,
              color: "from-soft-blue to-soft-purple",
            },
            {
              title: "Failed Attempts",
              value: securityMetrics.failedAttempts,
              change: "Normal levels",
              icon: AlertTriangle,
              color: "from-soft-peach to-soft-lavender",
            },
            {
              title: "Active Tokens",
              value: securityMetrics.activeTokens.toLocaleString(),
              change: "All secure",
              icon: Key,
              color: "from-soft-purple to-soft-pink",
            },
            {
              title: "Vulnerabilities",
              value: securityMetrics.vulnerabilities,
              change: "All patched",
              icon: Shield,
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
                    <p className="text-xs text-green-600">{metric.change}</p>
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

        {/* Security Events */}
        <Card className="bg-white/50 backdrop-blur-xl border-white/20 shadow-xl animate-fade-in">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-gray-800">Security Events</CardTitle>
                <CardDescription className="text-gray-600">Real-time security activity monitoring</CardDescription>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/50 border-white/20 w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredEvents.map((event, index) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-4 rounded-2xl bg-white/30 hover:bg-white/50 transition-all duration-200 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-soft-blue to-soft-purple rounded-2xl flex items-center justify-center shadow-lg">
                      {getEventIcon(event.type)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-800">{event.user}</h3>
                        <Badge className={getEventTypeColor(event.type)} size="sm">
                          {event.type.replace("_", " ")}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{event.tenant}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                        <div className="flex items-center">
                          <Globe className="w-3 h-3 mr-1" />
                          {event.ip}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {event.location}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatTime(event.time)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="hover:bg-white/30">
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Tokens */}
        <Card className="bg-white/50 backdrop-blur-xl border-white/20 shadow-xl animate-fade-in">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800">Active API Tokens</CardTitle>
            <CardDescription className="text-gray-600">Manage API keys and access tokens</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeTokens.map((token, index) => (
                <div
                  key={token.id}
                  className="flex items-center justify-between p-4 rounded-2xl bg-white/30 hover:bg-white/50 transition-all duration-200 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-soft-purple to-soft-pink rounded-2xl flex items-center justify-center shadow-lg">
                      <Key className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-800">{token.name}</h3>
                        <Badge className={getTokenTypeColor(token.type)} size="sm">
                          {token.type}
                        </Badge>
                        <Badge className={getStatusColor(token.status)} size="sm">
                          {token.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{token.tenant}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                        <span>Permissions: {token.permissions.join(", ")}</span>
                        <span>Last used: {token.lastUsed}</span>
                        <span>Expires: {token.expires}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="hover:bg-white/30">
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Rotate
                    </Button>
                    <Button size="sm" variant="outline" className="hover:bg-white/30 text-red-600">
                      Revoke
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
