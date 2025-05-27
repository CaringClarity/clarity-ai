"use client"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Users,
  Settings,
  Database,
  Activity,
  Phone,
  CheckCircle,
  Search,
  Plus,
  Edit,
  Trash2,
  Download,
  TrendingUp,
  Clock,
  LogOut,
  User,
  Menu,
  Bell,
  HelpCircle,
  Shield,
  Home,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function AdminDashboardPreview() {
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  const handleLogout = () => {
    // Add logout logic here
    console.log("Logging out...")
    router.push("/")
  }

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
  ]

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gradient-radial from-white 90% via-purple-100 95% via-purple-200 98% to-purple-300">
      {/* Modern Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-100/30 to-blue-100/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-pink-100/30 to-purple-100/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto p-6">
        {/* Modern Header with Navigation */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2 tracking-tight drop-shadow-xl">Admin Dashboard</h1>
              <p className="text-gray-600 text-lg drop-shadow-lg">
                Manage users, system settings, and monitor platform performance
              </p>
            </div>

            {/* Navigation Menu */}
            <div className="flex items-center gap-4">
              <Badge
                variant="secondary"
                className="bg-blue-50 text-blue-700 border border-blue-200 px-4 py-2 rounded-full shadow-lg drop-shadow-lg"
              >
                Preview Mode
              </Badge>

              {/* Notifications */}
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-white/70 border-gray-200 shadow-lg drop-shadow-md hover:bg-white/90"
              >
                <Bell className="h-4 w-4" />
              </Button>

              {/* User Menu Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 bg-white/70 border-gray-200 rounded-xl px-4 py-2 shadow-lg drop-shadow-md hover:bg-white/90"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div className="text-left hidden md:block">
                      <p className="text-sm font-semibold text-gray-800">Admin User</p>
                      <p className="text-xs text-gray-600">admin@caringclarity.org</p>
                    </div>
                    <Menu className="h-4 w-4 text-gray-600" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-white/90 backdrop-blur-sm border border-gray-200 shadow-xl drop-shadow-lg rounded-xl"
                >
                  <DropdownMenuLabel className="font-semibold text-gray-800">My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild className="cursor-pointer hover:bg-gray-50 rounded-lg">
                    <Link href="/dashboard" className="flex items-center gap-2 w-full">
                      <Home className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild className="cursor-pointer hover:bg-gray-50 rounded-lg">
                    <Link href="/profile" className="flex items-center gap-2 w-full">
                      <User className="h-4 w-4" />
                      <span>Profile Settings</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild className="cursor-pointer hover:bg-gray-50 rounded-lg">
                    <Link href="/profile" className="flex items-center gap-2 w-full">
                      <Settings className="h-4 w-4" />
                      <span>Account Settings</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild className="cursor-pointer hover:bg-gray-50 rounded-lg">
                    <Link href="/profile" className="flex items-center gap-2 w-full">
                      <Shield className="h-4 w-4" />
                      <span>Security</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild className="cursor-pointer hover:bg-gray-50 rounded-lg">
                    <Link href="/profile" className="flex items-center gap-2 w-full">
                      <Bell className="h-4 w-4" />
                      <span>Notifications</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild className="cursor-pointer hover:bg-gray-50 rounded-lg">
                    <Link href="/help" className="flex items-center gap-2 w-full">
                      <HelpCircle className="h-4 w-4" />
                      <span>Help & Support</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center gap-2 cursor-pointer hover:bg-red-50 text-red-600 rounded-lg"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Quick Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/call-history" className="block">
            <Card className="bg-white/60 backdrop-blur-sm border border-white/60 shadow-xl shadow-purple-100/50 drop-shadow-xl hover:shadow-2xl hover:shadow-purple-100/60 transition-all duration-300 hover:scale-105 rounded-2xl cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 tracking-wide drop-shadow-sm">Total Calls</p>
                    <p className="text-3xl font-bold text-purple-600 mt-1 drop-shadow-md">1,247</p>
                    <p className="text-xs text-green-600 mt-1 flex items-center drop-shadow-sm">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      View Call History
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl flex items-center justify-center shadow-xl drop-shadow-lg">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/analytics" className="block">
            <Card className="bg-white/60 backdrop-blur-sm border border-white/60 shadow-xl shadow-purple-100/50 drop-shadow-xl hover:shadow-2xl hover:shadow-purple-100/60 transition-all duration-300 hover:scale-105 rounded-2xl cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 tracking-wide drop-shadow-sm">Analytics</p>
                    <p className="text-3xl font-bold text-blue-600 mt-1 drop-shadow-md">Reports</p>
                    <p className="text-xs text-blue-600 mt-1 flex items-center drop-shadow-sm">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      View Analytics
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center shadow-xl drop-shadow-lg">
                    <Activity className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Card className="bg-white/60 backdrop-blur-sm border border-white/60 shadow-xl shadow-purple-100/50 drop-shadow-xl hover:shadow-2xl hover:shadow-purple-100/60 transition-all duration-300 hover:scale-105 rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 tracking-wide drop-shadow-sm">Total Users</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1 drop-shadow-md">24</p>
                  <p className="text-xs text-green-600 mt-1 flex items-center drop-shadow-sm">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12% this month
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-teal-400 rounded-xl flex items-center justify-center shadow-xl drop-shadow-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border border-white/60 shadow-xl shadow-purple-100/50 drop-shadow-xl hover:shadow-2xl hover:shadow-purple-100/60 transition-all duration-300 hover:scale-105 rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 tracking-wide drop-shadow-sm">System Uptime</p>
                  <p className="text-3xl font-bold text-green-600 mt-1 drop-shadow-md">99.8%</p>
                  <p className="text-xs text-gray-500 mt-1 flex items-center drop-shadow-sm">
                    <Clock className="h-3 w-3 mr-1" />
                    Last 30 days
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-green-400 rounded-xl flex items-center justify-center shadow-xl drop-shadow-lg">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Modern Content Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/60 backdrop-blur-sm border border-white/60 rounded-2xl p-1 shadow-xl drop-shadow-lg">
            <TabsTrigger value="users" className="rounded-xl font-semibold">
              User Management
            </TabsTrigger>
            <TabsTrigger value="system" className="rounded-xl font-semibold">
              System Settings
            </TabsTrigger>
            <TabsTrigger value="database" className="rounded-xl font-semibold">
              Database
            </TabsTrigger>
          </TabsList>

          {/* User Management Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card className="bg-white/60 backdrop-blur-sm border border-white/60 shadow-xl shadow-purple-100/50 drop-shadow-xl rounded-2xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-800 drop-shadow-md">
                      <Users className="h-6 w-6" />
                      User Management
                    </CardTitle>
                    <CardDescription className="text-gray-600 mt-1 drop-shadow-sm">
                      Manage platform users and their permissions
                    </CardDescription>
                  </div>
                  <Button className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-xl shadow-xl drop-shadow-lg hover:shadow-2xl transition-all duration-200">
                    <Plus className="h-4 w-4" />
                    Add User
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Modern Search */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-12 bg-white/70 border-gray-200 rounded-xl h-12 shadow-lg drop-shadow-md"
                    />
                  </div>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 rounded-xl border-gray-200 bg-white/70 hover:bg-white/90 shadow-lg drop-shadow-md"
                  >
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </div>

                {/* Modern Users Table */}
                <div className="overflow-x-auto bg-white/70 rounded-xl border border-gray-200 shadow-xl drop-shadow-lg">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50/50">
                        <th className="text-left p-4 font-semibold text-gray-700 drop-shadow-sm">Name</th>
                        <th className="text-left p-4 font-semibold text-gray-700 drop-shadow-sm">Email</th>
                        <th className="text-left p-4 font-semibold text-gray-700 drop-shadow-sm">Role</th>
                        <th className="text-left p-4 font-semibold text-gray-700 drop-shadow-sm">Status</th>
                        <th className="text-left p-4 font-semibold text-gray-700 drop-shadow-sm">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr
                          key={user.id}
                          className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors duration-200"
                        >
                          <td className="p-4 font-semibold text-gray-800 drop-shadow-sm">{user.name}</td>
                          <td className="p-4 text-gray-600 drop-shadow-sm">{user.email}</td>
                          <td className="p-4">
                            <Badge
                              variant={user.role === "Admin" ? "default" : "secondary"}
                              className={
                                user.role === "Admin"
                                  ? "bg-purple-100 text-purple-700 border border-purple-200 shadow-md drop-shadow-sm"
                                  : "bg-gray-100 text-gray-700 border border-gray-200 shadow-md drop-shadow-sm"
                              }
                            >
                              {user.role}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <Badge
                              variant={user.status === "Active" ? "default" : "secondary"}
                              className={
                                user.status === "Active"
                                  ? "bg-green-100 text-green-700 border border-green-200 shadow-md drop-shadow-sm"
                                  : "bg-gray-100 text-gray-700 border border-gray-200 shadow-md drop-shadow-sm"
                              }
                            >
                              {user.status}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" className="hover:bg-gray-100 rounded-lg shadow-md">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="hover:bg-gray-100 rounded-lg shadow-md">
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
            <Card className="bg-white/60 backdrop-blur-sm border border-white/60 shadow-xl shadow-purple-100/50 drop-shadow-xl rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-800 drop-shadow-md">
                  <Settings className="h-6 w-6" />
                  System Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-semibold text-gray-700 tracking-wide drop-shadow-sm">
                    Platform Name
                  </label>
                  <Input
                    defaultValue="Caring Clarity AI Voice Agent"
                    className="mt-2 bg-white/70 border-gray-200 rounded-xl shadow-lg drop-shadow-md"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 tracking-wide drop-shadow-sm">
                    Default Voice Model
                  </label>
                  <Input
                    defaultValue="aura-luna-en"
                    className="mt-2 bg-white/70 border-gray-200 rounded-xl shadow-lg drop-shadow-md"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 tracking-wide drop-shadow-sm">
                    Session Timeout (minutes)
                  </label>
                  <Input
                    defaultValue="30"
                    type="number"
                    className="mt-2 bg-white/70 border-gray-200 rounded-xl shadow-lg drop-shadow-md"
                  />
                </div>
                <Button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-xl shadow-xl drop-shadow-lg hover:shadow-2xl transition-all duration-200">
                  Save Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Database Tab */}
          <TabsContent value="database" className="space-y-6">
            <Card className="bg-white/60 backdrop-blur-sm border border-white/60 shadow-xl shadow-purple-100/50 drop-shadow-xl rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-800 drop-shadow-md">
                  <Database className="h-6 w-6" />
                  Database Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-white/70 rounded-xl border border-gray-200 shadow-lg drop-shadow-md">
                    <span className="text-sm font-semibold text-gray-700 drop-shadow-sm">Connection Status</span>
                    <Badge className="bg-green-100 text-green-700 border border-green-200 shadow-md drop-shadow-sm">
                      Connected
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-white/70 rounded-xl border border-gray-200 shadow-lg drop-shadow-md">
                    <span className="text-sm font-semibold text-gray-700 drop-shadow-sm">Total Records</span>
                    <span className="text-sm font-bold text-gray-800 drop-shadow-sm">15,247</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-white/70 rounded-xl border border-gray-200 shadow-lg drop-shadow-md">
                    <span className="text-sm font-semibold text-gray-700 drop-shadow-sm">Database Size</span>
                    <span className="text-sm font-bold text-gray-800 drop-shadow-sm">2.4 GB</span>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full rounded-xl border-gray-200 bg-white/70 hover:bg-white/90 font-semibold shadow-lg drop-shadow-md"
                  >
                    Create Backup
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
