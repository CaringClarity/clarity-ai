"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from "recharts"
import { DollarSign, TrendingUp, CreditCard, Calendar, Download, AlertCircle, CheckCircle, Clock } from "lucide-react"
import { GlassSidebar } from "@/components/glass-sidebar"

export default function BillingPage() {
  const [timeframe, setTimeframe] = useState("30d")

  const revenueMetrics = {
    totalRevenue: 89450,
    monthlyRecurring: 67890,
    averagePerTenant: 1899,
    churnRate: 2.3,
    growthRate: 18.5,
    outstandingInvoices: 12,
  }

  const revenueData = [
    { month: "Jan", revenue: 45000, tenants: 35, avgPerTenant: 1286 },
    { month: "Feb", revenue: 52000, tenants: 38, avgPerTenant: 1368 },
    { month: "Mar", revenue: 58000, tenants: 41, avgPerTenant: 1415 },
    { month: "Apr", revenue: 64000, tenants: 44, avgPerTenant: 1455 },
    { month: "May", revenue: 71000, tenants: 46, avgPerTenant: 1543 },
    { month: "Jun", revenue: 89450, tenants: 47, avgPerTenant: 1903 },
  ]

  const planDistribution = [
    { plan: "Enterprise", count: 12, revenue: 48000, color: "#a5b4ff" },
    { plan: "Professional", count: 18, revenue: 27000, color: "#c4b5fd" },
    { plan: "Business", count: 17, revenue: 14450, color: "#fed7aa" },
  ]

  const recentTransactions = [
    {
      id: 1,
      tenant: "Caring Clarity",
      amount: 2890,
      plan: "Enterprise",
      status: "paid",
      date: "2024-05-26",
      invoice: "INV-2024-001247",
    },
    {
      id: 2,
      tenant: "Legal Solutions Pro",
      amount: 1450,
      plan: "Professional",
      status: "paid",
      date: "2024-05-25",
      invoice: "INV-2024-001246",
    },
    {
      id: 3,
      tenant: "Premier Realty Group",
      amount: 890,
      plan: "Business",
      status: "pending",
      date: "2024-05-24",
      invoice: "INV-2024-001245",
    },
    {
      id: 4,
      tenant: "FinanceFirst Advisors",
      amount: 1680,
      plan: "Professional",
      status: "overdue",
      date: "2024-05-20",
      invoice: "INV-2024-001244",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-soft-mint text-gray-700"
      case "pending":
        return "bg-soft-peach text-gray-700"
      case "overdue":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-200 text-gray-600"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="w-4 h-4" />
      case "pending":
        return <Clock className="w-4 h-4" />
      case "overdue":
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  return (
    <GlassSidebar userRole="superadmin" userName="Platform Admin">
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="animate-fade-in">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Billing & Revenue</h1>
            <p className="text-gray-600 text-lg">Platform financial overview and subscription management</p>
          </div>
          <div className="flex items-center space-x-4 animate-fade-in">
            <Badge className="bg-soft-mint text-gray-700 px-4 py-2">
              <TrendingUp className="w-4 h-4 mr-2" />+{revenueMetrics.growthRate}% Growth
            </Badge>
            <Button className="bg-gradient-to-r from-soft-blue to-soft-purple text-white hover:shadow-lg transition-all duration-200">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Revenue Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Total Revenue",
              value: `$${revenueMetrics.totalRevenue.toLocaleString()}`,
              change: `+${revenueMetrics.growthRate}% this month`,
              icon: DollarSign,
              color: "from-soft-blue to-soft-purple",
            },
            {
              title: "Monthly Recurring",
              value: `$${revenueMetrics.monthlyRecurring.toLocaleString()}`,
              change: "Stable growth",
              icon: CreditCard,
              color: "from-soft-purple to-soft-pink",
            },
            {
              title: "Avg Per Tenant",
              value: `$${revenueMetrics.averagePerTenant}`,
              change: "+12% vs last month",
              icon: TrendingUp,
              color: "from-soft-mint to-soft-peach",
            },
            {
              title: "Churn Rate",
              value: `${revenueMetrics.churnRate}%`,
              change: "Below 3% target",
              icon: Calendar,
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

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Revenue Trends */}
          <Card className="bg-white/50 backdrop-blur-xl border-white/20 shadow-xl animate-fade-in">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800">Revenue Growth</CardTitle>
              <CardDescription className="text-gray-600">Monthly revenue and tenant acquisition</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a5b4ff" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#a5b4ff" stopOpacity={0} />
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
                    dataKey="revenue"
                    stroke="#a5b4ff"
                    strokeWidth={3}
                    fill="url(#revenueGradient)"
                    name="Revenue ($)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Plan Distribution */}
          <Card className="bg-white/50 backdrop-blur-xl border-white/20 shadow-xl animate-fade-in">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800">Plan Distribution</CardTitle>
              <CardDescription className="text-gray-600">Revenue breakdown by subscription plan</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={planDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                  <XAxis dataKey="plan" stroke="#6b7280" />
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
                  <Bar dataKey="revenue" fill="#a5b4ff" radius={[8, 8, 0, 0]} name="Revenue ($)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card className="bg-white/50 backdrop-blur-xl border-white/20 shadow-xl animate-fade-in">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800">Recent Transactions</CardTitle>
            <CardDescription className="text-gray-600">Latest billing activity and invoice status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction, index) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 rounded-2xl bg-white/30 hover:bg-white/50 transition-all duration-200 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-soft-blue to-soft-purple rounded-2xl flex items-center justify-center shadow-lg">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{transaction.tenant}</h3>
                      <p className="text-sm text-gray-600">{transaction.invoice}</p>
                      <p className="text-xs text-gray-500 flex items-center mt-1">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-800">${transaction.amount}</p>
                      <Badge className="bg-soft-blue text-white text-xs">{transaction.plan}</Badge>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(transaction.status)}>
                        {getStatusIcon(transaction.status)}
                        <span className="ml-1 capitalize">{transaction.status}</span>
                      </Badge>
                    </div>

                    <Button size="sm" variant="outline" className="hover:bg-white/30">
                      View Invoice
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
