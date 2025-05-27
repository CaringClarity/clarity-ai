"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Plus, MoreHorizontal, Mail, Calendar, Shield, Building2, Activity } from "lucide-react"
import { GlassSidebar } from "@/components/glass-sidebar"

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("all")

  const users = [
    {
      id: 1,
      name: "Dr. Sarah Mitchell",
      email: "sarah@caringclarity.org",
      role: "tenant-admin",
      tenant: "Caring Clarity",
      status: "active",
      lastLogin: "2024-05-26T10:30:00Z",
      joinDate: "2024-01-15",
      avatar: "/placeholder.svg?height=40&width=40",
      callsHandled: 156,
    },
    {
      id: 2,
      name: "James Wilson",
      email: "james@caringclarity.org",
      role: "staff",
      tenant: "Caring Clarity",
      status: "active",
      lastLogin: "2024-05-26T09:15:00Z",
      joinDate: "2024-02-01",
      avatar: "/placeholder.svg?height=40&width=40",
      callsHandled: 89,
    },
    {
      id: 3,
      name: "Maria Garcia",
      email: "maria@legalsolutions.com",
      role: "tenant-admin",
      tenant: "Legal Solutions Pro",
      status: "active",
      lastLogin: "2024-05-26T08:45:00Z",
      joinDate: "2024-02-20",
      avatar: "/placeholder.svg?height=40&width=40",
      callsHandled: 234,
    },
    {
      id: 4,
      name: "David Kim",
      email: "david@premierrealty.com",
      role: "staff",
      tenant: "Premier Realty Group",
      status: "inactive",
      lastLogin: "2024-05-20T14:20:00Z",
      joinDate: "2024-03-10",
      avatar: "/placeholder.svg?height=40&width=40",
      callsHandled: 67,
    },
    {
      id: 5,
      name: "Emily Rodriguez",
      email: "emily@financefirst.com",
      role: "agent-trainer",
      tenant: "FinanceFirst Advisors",
      status: "active",
      lastLogin: "2024-05-26T11:00:00Z",
      joinDate: "2024-05-01",
      avatar: "/placeholder.svg?height=40&width=40",
      callsHandled: 45,
    },
  ]

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.tenant.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === "all" || user.role === filterRole
    return matchesSearch && matchesRole
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-soft-mint text-gray-700"
      case "inactive":
        return "bg-gray-200 text-gray-600"
      default:
        return "bg-gray-200 text-gray-600"
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "tenant-admin":
        return "bg-soft-purple text-white"
      case "staff":
        return "bg-soft-blue text-white"
      case "agent-trainer":
        return "bg-soft-peach text-gray-700"
      default:
        return "bg-gray-200 text-gray-600"
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "tenant-admin":
        return "Admin"
      case "staff":
        return "Staff"
      case "agent-trainer":
        return "Trainer"
      default:
        return role
    }
  }

  const formatLastLogin = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    return date.toLocaleDateString()
  }

  return (
    <GlassSidebar userRole="superadmin" userName="Platform Admin">
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="animate-fade-in">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">User Management</h1>
            <p className="text-gray-600 text-lg">Manage all platform users across tenants</p>
          </div>
          <Button className="bg-gradient-to-r from-soft-blue to-soft-purple text-white hover:shadow-lg transition-all duration-200 animate-fade-in">
            <Plus className="w-4 h-4 mr-2" />
            Add New User
          </Button>
        </div>

        {/* Search and Filters */}
        <Card className="bg-white/50 backdrop-blur-xl border-white/20 shadow-xl animate-fade-in">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search users by name, email, or tenant..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/50 border-white/20"
                />
              </div>
              <div className="flex space-x-2">
                <Button
                  variant={filterRole === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterRole("all")}
                  className={filterRole === "all" ? "bg-soft-blue text-white" : "hover:bg-white/30"}
                >
                  All Users
                </Button>
                <Button
                  variant={filterRole === "tenant-admin" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterRole("tenant-admin")}
                  className={filterRole === "tenant-admin" ? "bg-soft-purple text-white" : "hover:bg-white/30"}
                >
                  Admins
                </Button>
                <Button
                  variant={filterRole === "staff" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterRole("staff")}
                  className={filterRole === "staff" ? "bg-soft-mint text-gray-700" : "hover:bg-white/30"}
                >
                  Staff
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="bg-white/50 backdrop-blur-xl border-white/20 shadow-xl animate-fade-in">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800">Platform Users</CardTitle>
            <CardDescription className="text-gray-600">
              {filteredUsers.length} users found across all tenants
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredUsers.map((user, index) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 rounded-2xl bg-white/30 hover:bg-white/50 transition-all duration-200 animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-12 h-12 shadow-lg">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="bg-gradient-to-r from-soft-blue to-soft-purple text-white">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-800">{user.name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Mail className="w-3 h-3" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                        <Building2 className="w-3 h-3" />
                        <span>{user.tenant}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    {/* Role and Status */}
                    <div className="text-center">
                      <Badge className={getRoleColor(user.role)} size="sm">
                        {getRoleLabel(user.role)}
                      </Badge>
                      <Badge className={`${getStatusColor(user.status)} mt-1`} size="sm">
                        {user.status}
                      </Badge>
                    </div>

                    {/* Activity */}
                    <div className="text-center">
                      <div className="flex items-center text-sm text-gray-600 mb-1">
                        <Activity className="w-3 h-3 mr-1" />
                        <span>{user.callsHandled} calls</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>{formatLastLogin(user.lastLogin)}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="hover:bg-white/30">
                        <Shield className="w-3 h-3 mr-1" />
                        Permissions
                      </Button>
                      <Button variant="ghost" size="sm" className="hover:bg-white/30">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
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
