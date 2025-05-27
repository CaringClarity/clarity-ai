"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  BarChart3,
  Users,
  Phone,
  Settings,
  LogOut,
  Menu,
  X,
  Building2,
  CreditCard,
  Database,
  Shield,
  MessageSquare,
  Calendar,
  Activity,
  ChevronLeft,
  ChevronRight,
  Mic,
  BookOpen,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface GlassSidebarProps {
  children: React.ReactNode
  userRole: "superadmin" | "tenant-admin" | "user"
  userName?: string
  userAvatar?: string
  businessLogo?: string
}

export function GlassSidebar({
  children,
  userRole,
  userName = "Admin User",
  userAvatar,
  businessLogo,
}: GlassSidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const getNavigationItems = () => {
    if (userRole === "superadmin") {
      return [
        {
          label: "Analytics",
          href: "/superadmin",
          icon: BarChart3,
          description: "Platform overview",
        },
        {
          label: "Tenants",
          href: "/superadmin/tenants",
          icon: Building2,
          description: "Manage businesses",
        },
        {
          label: "Users",
          href: "/superadmin/users",
          icon: Users,
          description: "User management",
        },
        {
          label: "Billing",
          href: "/superadmin/billing",
          icon: CreditCard,
          description: "Revenue & plans",
        },
        {
          label: "System",
          href: "/superadmin/system",
          icon: Database,
          description: "Platform health",
        },
        {
          label: "Security",
          href: "/superadmin/security",
          icon: Shield,
          description: "Access control",
        },
      ]
    } else if (userRole === "tenant-admin") {
      return [
        {
          label: "Dashboard",
          href: "/tenant-admin",
          icon: BarChart3,
          description: "Business overview",
        },
        {
          label: "Voice Agent",
          href: "/tenant-admin/voice-agent",
          icon: Mic,
          description: "AI configuration",
          badge: "Live",
        },
        {
          label: "Call Logs",
          href: "/tenant-admin/calls",
          icon: Phone,
          description: "Call history",
        },
        {
          label: "Team",
          href: "/tenant-admin/team",
          icon: Users,
          description: "Staff management",
        },
        {
          label: "Knowledge Base",
          href: "/tenant-admin/knowledge",
          icon: BookOpen,
          description: "FAQs & responses",
        },
        {
          label: "Workflows",
          href: "/tenant-admin/workflows",
          icon: Activity,
          description: "Intake forms",
        },
        {
          label: "Calendar",
          href: "/tenant-admin/calendar",
          icon: Calendar,
          description: "Appointments",
        },
        {
          label: "Error Logs",
          href: "/tenant-admin/error-logs",
          icon: AlertTriangle,
          description: "System errors",
          badge: "3",
        },
        {
          label: "Settings",
          href: "/tenant-admin/settings",
          icon: Settings,
          description: "Business config",
        },
      ]
    } else {
      return [
        {
          label: "Dashboard",
          href: "/user",
          icon: BarChart3,
          description: "My overview",
        },
        {
          label: "Calls",
          href: "/user/calls",
          icon: Phone,
          description: "Call history",
          badge: "12",
        },
        {
          label: "Messages",
          href: "/user/messages",
          icon: MessageSquare,
          description: "Conversations",
          badge: "3",
        },
        {
          label: "Calendar",
          href: "/user/calendar",
          icon: Calendar,
          description: "Appointments",
        },
        {
          label: "Activity",
          href: "/user/activity",
          icon: Activity,
          description: "Recent actions",
        },
        {
          label: "Settings",
          href: "/user/settings",
          icon: Settings,
          description: "Preferences",
        },
      ]
    }
  }

  const navigationItems = getNavigationItems()

  const getRoleInfo = () => {
    if (userRole === "superadmin") {
      return { title: "Platform Admin", subtitle: "System Management" }
    } else if (userRole === "tenant-admin") {
      return { title: "Business Admin", subtitle: "Caring Clarity" }
    } else {
      return { title: "Voice Agent", subtitle: "AI Dashboard" }
    }
  }

  const roleInfo = getRoleInfo()

  return (
    <div className="min-h-screen bg-gradient-to-br from-glass-50 via-glass-100 to-glass-200 flex">
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed lg:relative inset-y-0 left-0 z-50 transition-all duration-300 ease-in-out
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        ${isCollapsed ? "w-20" : "w-72"}
        bg-white/40 backdrop-blur-xl border-r border-white/20
        flex flex-col shadow-xl h-screen
      `}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center space-x-3 animate-fade-in">
                {/* Show business logo if uploaded, otherwise show default icon */}
                {userRole === "tenant-admin" && businessLogo ? (
                  <img
                    src={businessLogo || "/placeholder.svg"}
                    alt="Business Logo"
                    className="w-10 h-10 rounded-xl object-cover shadow-lg"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-r from-soft-blue to-soft-purple rounded-xl flex items-center justify-center shadow-lg">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                )}
                <div>
                  <h1 className="text-lg font-bold text-gray-800">{roleInfo.title}</h1>
                  <p className="text-xs text-gray-600">{roleInfo.subtitle}</p>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex hover:bg-white/20 transition-colors"
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setIsMobileOpen(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item, index) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link key={item.href} href={item.href} onClick={() => setIsMobileOpen(false)}>
                <div
                  className={`
                  group relative flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-200
                  hover:bg-white/30 hover:shadow-lg hover:scale-[1.02] transform
                  ${
                    isActive
                      ? "bg-white/50 shadow-lg border border-white/30 text-glass-600"
                      : "text-gray-700 hover:text-gray-900"
                  }
                  ${isCollapsed ? "justify-center" : ""}
                `}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-glass-600" : ""}`} />
                  {!isCollapsed && (
                    <div className="flex-1 min-w-0 animate-fade-in">
                      <p className="font-medium text-sm">{item.label}</p>
                      <p className="text-xs opacity-70">{item.description}</p>
                    </div>
                  )}
                  {!isCollapsed && item.badge && (
                    <Badge
                      className={`text-xs animate-pulse-soft ${
                        item.label === "Error Logs" ? "bg-red-500 text-white" : "bg-soft-blue text-white"
                      }`}
                    >
                      {item.badge}
                    </Badge>
                  )}
                  {isCollapsed && item.badge && (
                    <div
                      className={`absolute -top-1 -right-1 w-3 h-3 rounded-full animate-pulse-soft ${
                        item.label === "Error Logs" ? "bg-red-500" : "bg-soft-blue"
                      }`}
                    />
                  )}
                </div>
              </Link>
            )
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-white/10">
          <div
            className={`
          flex items-center space-x-3 p-3 rounded-2xl bg-white/30 backdrop-blur-sm
          hover:bg-white/40 transition-all duration-200 cursor-pointer
          ${isCollapsed ? "justify-center" : ""}
        `}
          >
            <div className="w-10 h-10 bg-gradient-to-r from-soft-purple to-soft-pink rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-semibold text-sm">
                {userName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0 animate-fade-in">
                <p className="font-medium text-sm text-gray-800 truncate">{userName}</p>
                <p className="text-xs text-gray-600">{userRole === "superadmin" ? "Super Administrator" : "User"}</p>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <Button variant="ghost" size="sm" className="w-full mt-3 hover:bg-white/20 text-gray-700 animate-fade-in">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white/40 backdrop-blur-xl border-b border-white/20 px-4 py-3 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => setIsMobileOpen(true)}>
            <Menu className="w-5 h-5" />
          </Button>
          <Badge className="bg-soft-mint text-gray-700">System Online</Badge>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
