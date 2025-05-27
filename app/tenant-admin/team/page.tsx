"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Search, Mail, Phone, Activity, UserPlus, Edit, Trash2, Shield, Clock, TrendingUp } from "lucide-react"
import { GlassSidebar } from "@/components/glass-sidebar"

export default function TeamPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [showAddUser, setShowAddUser] = useState(false)

  // Mock team data
  const teamMembers = [
    {
      id: "user_001",
      name: "Dr. Emily Rodriguez",
      email: "emily.rodriguez@caringclarity.org",
      phone: "+1 (555) 123-4567",
      role: "Provider",
      status: "active",
      lastLogin: "2024-01-15T14:30:00Z",
      callsToday: 23,
      callsThisWeek: 156,
      avgRating: 4.8,
      permissions: ["view_calls", "manage_appointments", "access_client_data"],
      joinDate: "2023-06-15",
      avatar: "ER",
    },
    {
      id: "user_002",
      name: "James Wilson",
      email: "james.wilson@caringclarity.org",
      phone: "+1 (555) 987-6543",
      role: "Intake Specialist",
      status: "active",
      lastLogin: "2024-01-15T13:45:00Z",
      callsToday: 18,
      callsThisWeek: 124,
      avgRating: 4.6,
      permissions: ["view_calls", "manage_intake", "schedule_appointments"],
      joinDate: "2023-08-20",
      avatar: "JW",
    },
    {
      id: "user_003",
      name: "Maria Garcia",
      email: "maria.garcia@caringclarity.org",
      phone: "+1 (555) 456-7890",
      role: "Scheduler",
      status: "active",
      lastLogin: "2024-01-15T12:20:00Z",
      callsToday: 15,
      callsThisWeek: 98,
      avgRating: 4.7,
      permissions: ["view_calls", "manage_appointments", "send_reminders"],
      joinDate: "2023-09-10",
      avatar: "MG",
    },
    {
      id: "user_004",
      name: "David Kim",
      email: "david.kim@caringclarity.org",
      phone: "+1 (555) 321-0987",
      role: "Support",
      status: "inactive",
      lastLogin: "2024-01-14T16:45:00Z",
      callsToday: 0,
      callsThisWeek: 45,
      avgRating: 4.5,
      permissions: ["view_calls", "basic_support"],
      joinDate: "2023-11-05",
      avatar: "DK",
    },
    {
      id: "user_005",
      name: "Lisa Thompson",
      email: "lisa.thompson@caringclarity.org",
      phone: "+1 (555) 654-3210",
      role: "Admin",
      status: "active",
      lastLogin: "2024-01-15T15:00:00Z",
      callsToday: 8,
      callsThisWeek: 67,
      avgRating: 4.9,
      permissions: ["full_access", "manage_team", "system_settings"],
      joinDate: "2023-05-01",
      avatar: "LT",
    },
  ]

  const roles = [
    { value: "Provider", label: "Provider", color: "bg-soft-purple text-white" },
    { value: "Intake Specialist", label: "Intake Specialist", color: "bg-soft-blue text-white" },
    { value: "Scheduler", label: "Scheduler", color: "bg-soft-mint text-gray-700" },
    { value: "Support", label: "Support", color: "bg-soft-peach text-gray-700" },
    { value: "Admin", label: "Admin", color: "bg-soft-lavender text-gray-700" },
  ]

  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getRoleColor = (role) => {
    const roleConfig = roles.find((r) => r.value === role)
    return roleConfig ? roleConfig.color : "bg-gray-200 text-gray-600"
  }

  const getStatusColor = (status) => {
    return status === "active" ? "bg-soft-mint text-gray-700" : "bg-gray-200 text-gray-600"
  }

  const filteredMembers = teamMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === "all" || member.role === filterRole
    const matchesStatus = filterStatus === "all" || member.status === filterStatus
    return matchesSearch && matchesRole && matchesStatus
  })

  return (
    <GlassSidebar userRole="tenant-admin" userName="Dr. Sarah Mitchell">
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="animate-fade-in">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Team Management</h1>
            <p className="text-gray-600 text-lg">Manage staff members and their permissions</p>
          </div>
          <div className="flex items-center space-x-4 animate-fade-in">
            <Button
              onClick={() => setShowAddUser(true)}
              className="bg-gradient-to-r from-soft-blue to-soft-purple text-white hover:shadow-lg transition-all duration-200"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Add Team Member
            </Button>
          </div>
        </div>

        {/* Team Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              title: "Total Team Members",
              value: teamMembers.length,
              change: "+2 this month",
              icon: Users,
              color: "from-soft-blue to-soft-purple",
            },
            {
              title: "Active Members",
              value: teamMembers.filter((m) => m.status === "active").length,
              change: "Currently online",
              icon: Activity,
              color: "from-soft-mint to-soft-peach",
            },
            {
              title: "Calls Today",
              value: teamMembers.reduce((sum, m) => sum + m.callsToday, 0),
              change: "+15% vs yesterday",
              icon: Phone,
              color: "from-soft-purple to-soft-pink",
            },
            {
              title: "Avg Team Rating",
              value: "4.7★",
              change: "Excellent performance",
              icon: TrendingUp,
              color: "from-soft-peach to-soft-lavender",
            },
          ].map((stat, index) => (
            <Card
              key={stat.title}
              className="bg-white/50 backdrop-blur-xl border-white/20 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</p>
                    <p className="text-xs text-green-600">{stat.change}</p>
                  </div>
                  <div
                    className={`w-14 h-14 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center shadow-lg`}
                  >
                    <stat.icon className="w-7 h-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters and Search */}
        <Card className="bg-white/50 backdrop-blur-xl border-white/20 shadow-xl animate-fade-in">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by name, email, or role..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/50 border-white/20"
                />
              </div>

              {/* Role Filter */}
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="w-48 bg-white/50 border-white/20">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {roles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48 bg-white/50 border-white/20">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Team Members */}
        <Card className="bg-white/50 backdrop-blur-xl border-white/20 shadow-xl animate-fade-in">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800">Team Members</CardTitle>
            <CardDescription className="text-gray-600">{filteredMembers.length} members found</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredMembers.map((member, index) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-6 rounded-2xl bg-white/30 hover:bg-white/50 transition-all duration-200 animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center space-x-4">
                    {/* Avatar */}
                    <div className="w-16 h-16 bg-gradient-to-r from-soft-blue to-soft-purple rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-lg">{member.avatar}</span>
                    </div>

                    {/* Member Info */}
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">{member.name}</h3>
                        <Badge className={getRoleColor(member.role)}>{member.role}</Badge>
                        <Badge className={getStatusColor(member.status)}>{member.status}</Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Mail className="w-3 h-3 mr-1" />
                          {member.email}
                        </span>
                        <span className="flex items-center">
                          <Phone className="w-3 h-3 mr-1" />
                          {member.phone}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          Last login: {formatDate(member.lastLogin)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    {/* Performance Stats */}
                    <div className="flex items-center space-x-6 mb-3">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-800">{member.callsToday}</p>
                        <p className="text-xs text-gray-600">Calls Today</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-800">{member.callsThisWeek}</p>
                        <p className="text-xs text-gray-600">This Week</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-800">{member.avgRating}★</p>
                        <p className="text-xs text-gray-600">Rating</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="border-white/20 hover:bg-white/30">
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" className="border-white/20 hover:bg-white/30">
                        <Shield className="w-3 h-3 mr-1" />
                        Permissions
                      </Button>
                      <Button size="sm" variant="outline" className="border-white/20 hover:bg-white/30 text-red-600">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Add User Modal */}
        {showAddUser && (
          <Card className="bg-white/50 backdrop-blur-xl border-white/20 shadow-xl animate-fade-in">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold text-gray-800">Add New Team Member</CardTitle>
                <Button variant="ghost" onClick={() => setShowAddUser(false)} className="hover:bg-white/30">
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Full Name</label>
                  <Input className="bg-white/50 border-white/20" placeholder="Enter full name" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Email Address</label>
                  <Input type="email" className="bg-white/50 border-white/20" placeholder="Enter email address" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Phone Number</label>
                  <Input type="tel" className="bg-white/50 border-white/20" placeholder="Enter phone number" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Role</label>
                  <Select>
                    <SelectTrigger className="bg-white/50 border-white/20">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button className="bg-gradient-to-r from-soft-blue to-soft-purple text-white">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Member
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowAddUser(false)}
                  className="border-white/20 hover:bg-white/30"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </GlassSidebar>
  )
}
