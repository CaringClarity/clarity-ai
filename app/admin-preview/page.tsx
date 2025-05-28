"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  Settings,
  Database,
  Activity,
  Phone,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Search,
  Plus,
  Edit,
  Trash2,
  Download,
  RefreshCw,
} from "lucide-react"

// Mock data
const mockUsers = [
  {
    id: 1,
    name: "John Smith",
    email: "john@caringclarity.org",
    role: "Admin",
    status: "Active",
    lastLogin: "2024-01-15 14:30",
    callsHandled: 45,
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah@caringclarity.org",
    role: "Operator",
    status: "Active",
    lastLogin: "2024-01-15 13:45",
    callsHandled: 32,
  },
  {
    id: 3,
    name: "Mike Davis",
    email: "mike@caringclarity.org",
    role: "Supervisor",
    status: "Inactive",
    lastLogin: "2024-01-14 16:20",
    callsHandled: 28,
  },
  {
    id: 4,
    name: "Lisa Chen",
    email: "lisa@caringclarity.org",
    role: "Operator",
    status: "Active",
    lastLogin: "2024-01-15 15:10",
    callsHandled: 38,
  },
]

const mockSystemMetrics = {
  totalUsers: 24,
  activeUsers: 18,
  totalCalls: 1247,
  avgResponseTime: "2.3s",
  systemUptime: "99.8%",
  databaseSize: "2.4 GB",
}

const mockRecentActivity = [
  { id: 1, action: "User Login", user: "Sarah Johnson", timestamp: "2024-01-15 15:30", status: "success" },
  { id: 2, action: "Call Completed", user: "AI Agent", timestamp: "2024-01-15 15:28", status: "success" },
  { id: 3, action: "System Update", user: "System", timestamp: "2024-01-15 15:25", status: "info" },
  { id: 4, action: "Failed Login", user: "Unknown", timestamp: "2024-01-15 15:20", status: "error" },
  { id: 5, action: "Database Backup", user: "System", timestamp: "2024-01-15 15:00", status: "success" },
]

export default function AdminDashboardPreview() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTab, setSelectedTab] = useState("overview")

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gradient-radial from-white 90% via-purple-200 95% via-purple-300 98% to-purple-500">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
              <p className="text-gray-600">Manage users, system settings, and monitor platform performance</p>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Preview Mode
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{mockSystemMetrics.totalUsers}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold text-green-600">{mockSystemMetrics.activeUsers}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Calls</p>
                  <p className="text-2xl font-bold text-purple-600">{mockSystemMetrics.totalCalls}</p>
                </div>
                <Phone className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">System Uptime</p>
                  <p className="text-2xl font-bold text-green-600">{mockSystemMetrics.systemUptime}</p>
                </div>
                <Activity className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="system">System Settings</TabsTrigger>
            <TabsTrigger value="database">Database</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>Latest system events and user actions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockRecentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          {activity.status === "success" && <CheckCircle className="h-4 w-4 text-green-600" />}
                          {activity.status === "error" && <XCircle className="h-4 w-4 text-red-600" />}
                          {activity.status === "info" && <AlertTriangle className="h-4 w-4 text-blue-600" />}
                          <div>
                            <p className="font-medium text-sm">{activity.action}</p>
                            <p className="text-xs text-gray-600">{activity.user}</p>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">{activity.timestamp}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* System Health */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    System Health
                  </CardTitle>
                  <CardDescription>Current system status and performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">API Response Time</span>
                      <Badge variant="secondary">{mockSystemMetrics.avgResponseTime}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Database Size</span>
                      <Badge variant="secondary">{mockSystemMetrics.databaseSize}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Active Connections</span>
                      <Badge variant="secondary">12</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Memory Usage</span>
                      <Badge variant="secondary">68%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">CPU Usage</span>
                      <Badge variant="secondary">23%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* User Management Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      User Management
                    </CardTitle>
                    <CardDescription>Manage platform users and their permissions</CardDescription>
                  </div>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add User
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Search */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </div>

                {/* Users Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-medium">Name</th>
                        <th className="text-left p-3 font-medium">Email</th>
                        <th className="text-left p-3 font-medium">Role</th>
                        <th className="text-left p-3 font-medium">Status</th>
                        <th className="text-left p-3 font-medium">Last Login</th>
                        <th className="text-left p-3 font-medium">Calls</th>
                        <th className="text-left p-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-medium">{user.first_name + ' ' + user.last_name}</td>
                          <td className="p-3 text-gray-600">{user.email}</td>
                          <td className="p-3">
                            <Badge variant={user.role === "Admin" ? "default" : "secondary"}>{user.role}</Badge>
                          </td>
                          <td className="p-3">
                            <Badge variant={user.status === "Active" ? "default" : "secondary"}>{user.status}</Badge>
                          </td>
                          <td className="p-3 text-gray-600">{user.lastLogin}</td>
                          <td className="p-3">{user.callsHandled}</td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Settings Tab */}
          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    General Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Platform Name</label>
                    <Input defaultValue="Caring Clarity AI Voice Agent" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Default Language</label>
                    <Input defaultValue="English (US)" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Session Timeout (minutes)</label>
                    <Input defaultValue="30" type="number" />
                  </div>
                  <Button>Save Settings</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Voice Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Default Voice Model</label>
                    <Input defaultValue="aura-luna-en" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Response Timeout (seconds)</label>
                    <Input defaultValue="10" type="number" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Max Call Duration (minutes)</label>
                    <Input defaultValue="60" type="number" />
                  </div>
                  <Button>Save Settings</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Database Tab */}
          <TabsContent value="database" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Database Management
                </CardTitle>
                <CardDescription>Monitor and manage database operations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Database Status</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Connection Status</span>
                        <Badge variant="default">Connected</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Total Records</span>
                        <span className="text-sm font-medium">15,247</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Database Size</span>
                        <span className="text-sm font-medium">{mockSystemMetrics.databaseSize}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Last Backup</span>
                        <span className="text-sm font-medium">2024-01-15 03:00</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Database Operations</h3>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh Connection
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Download className="h-4 w-4 mr-2" />
                        Create Backup
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Database className="h-4 w-4 mr-2" />
                        Optimize Tables
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Activity className="h-4 w-4 mr-2" />
                        View Logs
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
