"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "./theme-provider"
import { LayoutDashboard, Mic, Users, BarChart3, Phone, Activity, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

interface DashboardLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
}

export function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
  const { theme } = useTheme()
  const pathname = usePathname()
  const router = useRouter()

  const navigationItems = [
    {
      label: "Voice Agent",
      href: "/voice-agent",
      icon: Mic,
      description: "Real-time voice monitoring",
      badge: "Live",
      badgeColor: "green",
    },
    {
      label: "Operations",
      href: "/dashboard/operations",
      icon: Activity,
      description: "Live system metrics",
      badge: "Active",
      badgeColor: "blue",
    },
    {
      label: "Admin Panel",
      href: "/dashboard",
      icon: LayoutDashboard,
      description: "User & system management",
    },
    {
      label: "Call History",
      href: "/call-history",
      icon: Phone,
      description: "Call logs & transcripts",
    },
    {
      label: "Analytics",
      href: "/analytics",
      icon: BarChart3,
      description: "Performance insights",
    },
    {
      label: "Users",
      href: "/dashboard/users",
      icon: Users,
      description: "User management",
    },
  ]

  const handleLogout = () => {
    router.push("/")
  }

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-gray-950" : "bg-gray-50"}`}>
      {/* Top Navigation Bar */}
      <div
        className={`border-b ${theme === "dark" ? "border-gray-800 bg-gray-950/80" : "border-gray-200 bg-white/80"} backdrop-blur-sm sticky top-0 z-50`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo & Title */}
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Mic className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className={`text-xl font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  Caring Clarity AI
                </h1>
                <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>{title}</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center space-x-3">
              <Badge
                variant="outline"
                className={`${theme === "dark" ? "border-green-500/50 text-green-400" : "border-green-600 text-green-700"}`}
              >
                System Online
              </Badge>
              <Button onClick={handleLogout} variant="outline" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Navigation */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link key={item.href} href={item.href}>
                <Card
                  className={`relative p-4 cursor-pointer transition-all duration-200 hover:scale-105 ${
                    isActive
                      ? theme === "dark"
                        ? "bg-purple-900/50 border-purple-500/50 shadow-lg shadow-purple-500/20"
                        : "bg-purple-50 border-purple-200 shadow-lg shadow-purple-500/10"
                      : theme === "dark"
                        ? "bg-gray-900/50 border-gray-700 hover:bg-gray-800/50"
                        : "bg-white border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div
                      className={`p-2 rounded-lg ${
                        isActive
                          ? "bg-purple-500 text-white"
                          : theme === "dark"
                            ? "bg-gray-800 text-gray-300"
                            : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className={`font-medium text-sm ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                        {item.label}
                      </h3>
                      <p className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                        {item.description}
                      </p>
                    </div>
                    {item.badge && (
                      <Badge
                        size="sm"
                        className={`absolute -top-1 -right-1 ${
                          item.badgeColor === "green" ? "bg-green-500 text-white" : "bg-blue-500 text-white"
                        }`}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* Page Content */}
        <div>{children}</div>
      </div>
    </div>
  )
}
