"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Phone, DollarSign, Search, Plus, MoreHorizontal, TrendingUp, Calendar, Settings } from "lucide-react"
import { GlassSidebar } from "@/components/glass-sidebar"

export default function TenantsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const tenants = [
    {
      id: 1,
      name: "Caring Clarity",
      industry: "Healthcare",
      plan: "Enterprise",
      users: 24,
      calls: 1247,
      revenue: 2890,
      status: "active",
      joinDate: "2024-01-15",
      logo: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      name: "Legal Solutions Pro",
      industry: "Legal",
      plan: "Professional",
      users: 12,
      calls: 856,
      revenue: 1450,
      status: "active",
      joinDate: "2024-02-20",
      logo: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      name: "Premier Realty Group",
      industry: "Real Estate",
      plan: "Business",
      users: 8,
      calls: 623,
      revenue: 890,
      status: "active",
      joinDate: "2024-03-10",
      logo: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 4,
      name: "FinanceFirst Advisors",
      industry: "Finance",
      plan: "Professional",
      users: 15,
      calls: 934,
      revenue: 1680,
      status: "trial",
      joinDate: "2024-05-01",
      logo: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 5,
      name: "TechStart Innovations",
      industry: "Technology",
      plan: "Business",
      users: 6,
      calls: 445,
      revenue: 650,
      status: "suspended",
      joinDate: "2024-04-15",
      logo: "/placeholder.svg?height=40&width=40",
    },
  ]

  const filteredTenants = tenants.filter(
    (tenant) =>
      tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.industry.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-soft-mint text-gray-700"
      case "trial":
        return "bg-soft-peach text-gray-700"
      case "suspended":
        return "bg-gray-200 text-gray-600"
      default:
        return "bg-gray-200 text-gray-600"
    }
  }

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "Enterprise":
        return "bg-soft-purple text-white"
      case "Professional":
        return "bg-soft-blue text-white"
      case "Business":
        return "bg-soft-mint text-gray-700"
      default:
        return "bg-gray-200 text-gray-600"
    }
  }

  return (
    <GlassSidebar userRole="superadmin" userName="Platform Admin">
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="animate-fade-in">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Tenant Management</h1>
            <p className="text-gray-600 text-lg">Manage all business accounts and subscriptions</p>
          </div>
          <Button className="bg-gradient-to-r from-soft-blue to-soft-purple text-white hover:shadow-lg transition-all duration-200 animate-fade-in">
            <Plus className="w-4 h-4 mr-2" />
            Add New Tenant
          </Button>
        </div>

        {/* Search and Filters */}
        <Card className="bg-white/50 backdrop-blur-xl border-white/20 shadow-xl animate-fade-in">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search tenants by name or industry..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/50 border-white/20"
                />
              </div>
              <div className="flex space-x-2">
                <Badge className="bg-soft-mint text-gray-700">
                  {filteredTenants.filter((t) => t.status === "active").length} Active
                </Badge>
                <Badge className="bg-soft-peach text-gray-700">
                  {filteredTenants.filter((t) => t.status === "trial").length} Trial
                </Badge>
                <Badge className="bg-gray-200 text-gray-600">
                  {filteredTenants.filter((t) => t.status === "suspended").length} Suspended
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tenants Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTenants.map((tenant, index) => (
            <Card
              key={tenant.id}
              className="bg-white/50 backdrop-blur-xl border-white/20 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12 shadow-lg">
                      <AvatarImage src={tenant.logo || "/placeholder.svg"} />
                      <AvatarFallback className="bg-gradient-to-r from-soft-blue to-soft-purple text-white">
                        {tenant.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold text-gray-800">{tenant.name}</h3>
                      <p className="text-sm text-gray-600">{tenant.industry}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="hover:bg-white/30">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(tenant.status)}>{tenant.status}</Badge>
                  <Badge className={getPlanColor(tenant.plan)}>{tenant.plan}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 rounded-xl bg-white/30">
                    <div className="flex items-center justify-center mb-1">
                      <Users className="w-4 h-4 text-soft-blue mr-1" />
                      <span className="text-sm font-medium text-gray-600">Users</span>
                    </div>
                    <p className="text-xl font-bold text-gray-800">{tenant.users}</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-white/30">
                    <div className="flex items-center justify-center mb-1">
                      <Phone className="w-4 h-4 text-soft-purple mr-1" />
                      <span className="text-sm font-medium text-gray-600">Calls</span>
                    </div>
                    <p className="text-xl font-bold text-gray-800">{tenant.calls}</p>
                  </div>
                </div>

                {/* Revenue */}
                <div className="p-3 rounded-xl bg-gradient-to-r from-soft-mint/20 to-soft-peach/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 text-soft-mint mr-2" />
                      <span className="text-sm font-medium text-gray-600">Monthly Revenue</span>
                    </div>
                    <div className="flex items-center text-green-600">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      <span className="text-xs">+12%</span>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-800 mt-1">${tenant.revenue}</p>
                </div>

                {/* Join Date */}
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Joined {new Date(tenant.joinDate).toLocaleDateString()}</span>
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1 hover:bg-white/30">
                    <Settings className="w-3 h-3 mr-1" />
                    Manage
                  </Button>
                  <Button size="sm" className="flex-1 bg-gradient-to-r from-soft-blue to-soft-purple text-white">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </GlassSidebar>
  )
}
