"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "@/components/theme-provider"
import {
  Mic,
  Users,
  BarChart3,
  Phone,
  LogOut,
  Menu,
  X,
  Settings,
  Activity,
  Building2,
  CreditCard,
  Shield,
  Database,
  Wrench,
  MessageSquare,
  Calendar,
  BookOpen,
  Palette,
  UserCheck,
  AlertTriangle,
  TestTube,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

interface RoleAwareSidebarProps {
  children: React.ReactNode
  userRole: "super-admin" | "tenant-admin" | "staff" | "agent-trainer" | "support" | "client"
  tenantName?: string
}

export function RoleAwareSidebar({ children, userRole, tenantName = "Caring Clarity" }: RoleAwareSidebarProps) {
  const { theme } = useTheme()
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const getNavigationItems = () => {
    switch (userRole) {
      case "super-admin":
        return [
          {
            label: "Platform Analytics",
            href: "/super-admin",
            icon: BarChart3,
            description: "System-wide metrics & usage",
          },
          {
            label: "Tenant Management",
            href: "/super-admin/tenants",
            icon: Building2,
            description: "Manage all tenants",
          },
          {
            label: "Billing & Plans",
            href: "/super-admin/billing",
            icon: CreditCard,
            description: "Billing management",
          },
          {
            label: "Platform Logs",
            href: "/super-admin/logs",
            icon: Database,
            description: "System logs & errors",
          },
          {
            label: "Security Settings",
            href: "/super-admin/security",
            icon: Shield,
            description: "Platform security",
          },
          {
            label: "Dev Tools",
            href: "/super-admin/dev-tools",
            icon: Wrench,
            description: "Developer utilities",
          },
        ]

      case "tenant-admin":
        return [
          {
            label: "Dashboard",
            href: "/tenant-admin",
            icon: BarChart3,
            description: "Analytics & insights",
          },
          {
            label: "Voice Agent",
            href: "/tenant-admin/voice-agent",
            icon: Mic,
            description: "Agent configuration",
            badge: "Live",
          },
          {
            label: "Call Logs",
            href: "/tenant-admin/call-logs",
            icon: Phone,
            description: "Call history & transcripts",
          },
          {
            label: "Team Management",
            href: "/tenant-admin/team",
            icon: Users,
            description: "Manage staff users",
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
            description: "Intake forms & flows",
          },
          {
            label: "Calendar",
            href: "/tenant-admin/calendar",
            icon: Calendar,
            description: "Appointments & booking",
          },
          {
            label: "Branding",
            href: "/tenant-admin/branding",
            icon: Palette,
            description: "Logo, voice, greeting",
          },
          {
            label: "Settings",
            href: "/tenant-admin/settings",
            icon: Settings,
            description: "Business configuration",
          },
        ]

      case "staff":
        return [
          {
            label: "Dashboard",
            href: "/staff",
            icon: BarChart3,
            description: "My activity overview",
          },
          {
            label: "Call Logs",
            href: "/staff/call-logs",
            icon: Phone,
            description: "Recent calls & messages",
          },
          {
            label: "Messages",
            href: "/staff/messages",
            icon: MessageSquare,
            description: "Respond to inquiries",
            badge: "3",
          },
          {
            label: "Clients",
            href: "/staff/clients",
            icon: Users,
            description: "Client information",
          },
          {
            label: "Alerts",
            href: "/staff/alerts",
            icon: AlertTriangle,
            description: "Agent notifications",
          },
          {
            label: "Profile",
            href: "/staff/profile",
            icon: Settings,
            description: "My settings",
          },
        ]

      case "agent-trainer":
        return [
          {
            label: "Dashboard",
            href: "/trainer",
            icon: BarChart3,
            description: "Training overview",
          },
          {
            label: "Script Editor",
            href: "/trainer/scripts",
            icon: Mic,
            description: "Edit agent scripts",
          },
          {
            label: "Test Flows",
            href: "/trainer/test-flows",
            icon: TestTube,
            description: "Test conversation flows",
          },
          {
            label: "Conversation Logs",
            href: "/trainer/conversations",
            icon: MessageSquare,
            description: "Review AI responses",
          },
          {
            label: "Fallback Responses",
            href: "/trainer/fallbacks",
            icon: AlertTriangle,
            description: "Update error handling",
          },
          {
            label: "Performance",
            href: "/trainer/performance",
            icon: Activity,
            description: "AI accuracy metrics",
          },
        ]

      case "support":
        return [
          {
            label: "Dashboard",
            href: "/support",
            icon: BarChart3,
            description: "Support overview",
          },
          {
            label: "Platform Errors",
            href: "/support/errors",
            icon: AlertTriangle,
            description: "System error logs",
          },
          {
            label: "Integration Tests",
            href: "/support/integrations",
            icon: TestTube,
            description: "Test API connections",
          },
          {
            label: "Access Logs",
            href: "/support/access-logs",
            icon: Database,
            description: "User access history",
          },
        ]

      default: // client
        return [
          {
            label: "My Inquiries",
            href: "/client",
            icon: MessageSquare,
            description: "My conversations",
          },
          {
            label: "Appointments",
            href: "/client/appointments",
            icon: Calendar,
            description: "Scheduled meetings",
          },
          {
            label: "Feedback",
            href: "/client/feedback",
            icon: UserCheck,
            description: "Rate your experience",
          },
        ]
    }
  }

  const getRoleInfo = () => {
    switch (userRole) {
      case "super-admin":
        return { title: "Platform Admin", subtitle: "System Management", color: "from-red-500 to-red-600" }
      case "tenant-admin":
        return { title: tenantName, subtitle: "Business Admin", color: "from-purple-500 to-purple-600" }
      case "staff":
        return { title: tenantName, subtitle: "Staff Member", color: "from-blue-500 to-blue-600" }
      case "agent-trainer":
        return { title: tenantName, subtitle: "AI Trainer", color: "from-green-500 to-green-600" }
      case "support":
        return { title: "Platform Support", subtitle: "Technical Support", color: "from-orange-500 to-orange-600" }
      default:
        return { title: "Client Portal", subtitle: "Customer", color: "from-gray-500 to-gray-600" }
    }
  }

  const navigationItems = getNavigationItems()
  const roleInfo = getRoleInfo()

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
              <div className={`w-8 h-8 bg-gradient-to-r ${roleInfo.color} rounded-lg flex items-center justify-center`}>
                <Mic className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  {roleInfo.title}
                </h1>
                <p className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>{roleInfo.subtitle}</p>
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
                {userRole === "super-admin" ? "Platform Status" : "System Status"}
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
