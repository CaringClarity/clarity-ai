"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "next-themes"
import { Mic, Users, BarChart3, Phone, LogOut, Menu, X, Settings, Activity } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

interface SidebarLayoutProps {
  children: React.ReactNode
}

export function SidebarLayout({ children }: SidebarLayoutProps) {
  const { theme } = useTheme()
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigationItems = [
    {
      label: "Analytics",
      href: "/dashboard",
      icon: BarChart3,
      description: "Performance insights & metrics",
    },
    {
      label: "Voice Agent",
      href: "/voice-agent",
      icon: Mic,
      description: "Live voice interaction",
      badge: "Live",
    },
    {
      label: "Call History",
      href: "/call-history",
      icon: Phone,
      description: "Call logs & transcripts",
    },
    {
      label: "Users",
      href: "/admin",
      icon: Users,
      description: "User management",
    },
    {
      label: "System",
      href: "/dashboard/operations",
      icon: Activity,
      description: "System monitoring",
      badge: "Active",
    },
    {
      label: "Settings",
      href: "/profile",
      icon: Settings,
      description: "Profile & preferences",
    },
  ]

  const handleLogout = () => {
    router.push("/")
  }

  return (
    <div className={`min-h-screen flex ${theme === "dark" ? "bg-gray-950" : "bg-gray-50"}`}>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        ${theme === "dark" ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}
        border-r flex flex-col
      `}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Mic className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  Caring Clarity
                </h1>
                <p className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>AI Voice Platform</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}>
                <div
                  className={`
                    relative flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 group
                    ${
                      isActive
                        ? theme === "dark"
                          ? "bg-purple-900/50 text-purple-300 border border-purple-500/30"
                          : "bg-purple-50 text-purple-700 border border-purple-200"
                        : theme === "dark"
                          ? "text-gray-300 hover:bg-gray-800 hover:text-white"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }
                  `}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{item.label}</p>
                    <p
                      className={`text-xs ${
                        isActive
                          ? theme === "dark"
                            ? "text-purple-400"
                            : "text-purple-600"
                          : theme === "dark"
                            ? "text-gray-500"
                            : "text-gray-500"
                      }`}
                    >
                      {item.description}
                    </p>
                  </div>
                  {item.badge && (
                    <Badge
                      size="sm"
                      className={`
                        ${item.badge === "Live" ? "bg-green-500 text-white" : "bg-blue-500 text-white"}
                        text-xs px-2 py-0.5
                      `}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </div>
              </Link>
            )
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className={`mb-3 p-3 rounded-lg ${theme === "dark" ? "bg-gray-800" : "bg-gray-50"}`}>
            <div className="flex items-center justify-between">
              <span className={`text-sm font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                System Status
              </span>
              <Badge className="bg-green-500 text-white text-xs">Online</Badge>
            </div>
            <p className={`text-xs mt-1 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
              All systems operational
            </p>
          </div>
          <Button onClick={handleLogout} variant="outline" size="sm" className="w-full">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div
          className={`
          lg:hidden border-b px-4 py-3 flex items-center justify-between
          ${theme === "dark" ? "border-gray-800 bg-gray-900" : "border-gray-200 bg-white"}
        `}
        >
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </Button>
          <Badge className="bg-green-500 text-white">System Online</Badge>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
