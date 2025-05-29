"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes" // Change this import
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import {
  Home,
  Phone,
  Calendar,
  MessageSquare,
  Users,
  FileText,
  Settings,
  HelpCircle,
  LogOut,
  Moon,
  Sun,
  User,
} from "lucide-react"

interface RoleAwareSidebarProps {
  children: React.ReactNode
  userRole: "admin" | "staff" | "client"
  tenantName: string
}

export function RoleAwareSidebar({ children, userRole, tenantName }: RoleAwareSidebarProps) {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  const adminNavItems = [
    { name: "Dashboard", href: "/admin", icon: Home },
    { name: "Calls", href: "/admin/calls", icon: Phone },
    { name: "Clients", href: "/admin/clients", icon: Users },
    { name: "Staff", href: "/admin/staff", icon: Users },
    { name: "Reports", href: "/admin/reports", icon: FileText },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ]

  const staffNavItems = [
    { name: "Dashboard", href: "/staff", icon: Home },
    { name: "Calls", href: "/staff/calls", icon: Phone },
    { name: "Calendar", href: "/staff/calendar", icon: Calendar },
    { name: "Messages", href: "/staff/messages", icon: MessageSquare },
    { name: "Clients", href: "/staff/clients", icon: Users },
  ]

  const clientNavItems = [
    { name: "Dashboard", href: "/client", icon: Home },
    { name: "Appointments", href: "/client/appointments", icon: Calendar },
    { name: "Messages", href: "/client/messages", icon: MessageSquare },
    { name: "Documents", href: "/client/documents", icon: FileText },
    { name: "Profile", href: "/client/profile", icon: User },
  ]

  const navItems = userRole === "admin" ? adminNavItems : userRole === "staff" ? staffNavItems : clientNavItems

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <Sidebar>
          <SidebarHeader className="border-b">
            <div className="flex items-center p-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">CC</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg">{tenantName}</h3>
                <p className="text-xs text-muted-foreground capitalize">{userRole} Portal</p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="border-t p-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <div className="flex space-x-2">
                <Button variant="ghost" size="icon" aria-label="Help">
                  <HelpCircle className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" aria-label="Logout">
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </SidebarProvider>
  )
}
