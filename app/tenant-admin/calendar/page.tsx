"use client"

import React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  CalendarIcon,
  Clock,
  Plus,
  ChevronLeft,
  ChevronRight,
  User,
  Phone,
  Video,
  MapPin,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { GlassSidebar } from "@/components/glass-sidebar"

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState("month")
  const [showAddAppointment, setShowAddAppointment] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)

  // Mock appointment data
  const appointments = [
    {
      id: "apt_001",
      title: "Initial Consultation - Sarah Johnson",
      client: "Sarah Johnson",
      provider: "Dr. Emily Rodriguez",
      date: "2024-01-26",
      time: "09:00",
      duration: 60,
      type: "in-person",
      status: "confirmed",
      notes: "New client intake for anxiety treatment",
      phone: "(555) 123-4567",
      email: "sarah.j@email.com",
    },
    {
      id: "apt_002",
      title: "Follow-up Session - Mike Davis",
      client: "Mike Davis",
      provider: "Dr. Sarah Mitchell",
      date: "2024-01-26",
      time: "10:30",
      duration: 50,
      type: "telehealth",
      status: "confirmed",
      notes: "Progress review for depression treatment",
      phone: "(555) 234-5678",
      email: "mike.d@email.com",
    },
    {
      id: "apt_003",
      title: "Couples Session - Lisa & John Chen",
      client: "Lisa & John Chen",
      provider: "Dr. Emily Rodriguez",
      date: "2024-01-26",
      time: "14:00",
      duration: 90,
      type: "in-person",
      status: "pending",
      notes: "Relationship counseling session",
      phone: "(555) 345-6789",
      email: "lisa.chen@email.com",
    },
    {
      id: "apt_004",
      title: "Group Therapy - Anxiety Support",
      client: "Group Session",
      provider: "Dr. Sarah Mitchell",
      date: "2024-01-26",
      time: "16:00",
      duration: 75,
      type: "in-person",
      status: "confirmed",
      notes: "Weekly anxiety support group",
      phone: "N/A",
      email: "group@caringclarity.com",
    },
    {
      id: "apt_005",
      title: "Emergency Session - Alex Thompson",
      client: "Alex Thompson",
      provider: "Dr. Emily Rodriguez",
      date: "2024-01-27",
      time: "11:00",
      duration: 60,
      type: "telehealth",
      status: "urgent",
      notes: "Crisis intervention session",
      phone: "(555) 456-7890",
      email: "alex.t@email.com",
    },
  ]

  const providers = [
    { id: "dr_sarah", name: "Dr. Sarah Mitchell", color: "bg-soft-blue" },
    { id: "dr_emily", name: "Dr. Emily Rodriguez", color: "bg-soft-purple" },
    { id: "dr_james", name: "Dr. James Wilson", color: "bg-soft-mint" },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-soft-mint text-gray-700"
      case "pending":
        return "bg-soft-peach text-gray-700"
      case "urgent":
        return "bg-red-500 text-white"
      case "cancelled":
        return "bg-gray-400 text-white"
      default:
        return "bg-gray-200 text-gray-600"
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case "telehealth":
        return Video
      case "in-person":
        return MapPin
      case "phone":
        return Phone
      default:
        return User
    }
  }

  const formatTime = (time) => {
    const [hours, minutes] = time.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return days
  }

  const getAppointmentsForDate = (date) => {
    const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
    return appointments.filter((apt) => apt.date === dateString)
  }

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate)
    newDate.setMonth(currentDate.getMonth() + direction)
    setCurrentDate(newDate)
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <GlassSidebar userRole="tenant-admin" userName="Dr. Sarah Mitchell">
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="animate-fade-in">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Calendar & Appointments</h1>
            <p className="text-gray-600 text-lg">Manage schedules and appointment bookings</p>
          </div>
          <div className="flex items-center space-x-4 animate-fade-in">
            <Select value={viewMode} onValueChange={setViewMode}>
              <SelectTrigger className="w-32 bg-white/50 border-white/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="day">Day</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={() => setShowAddAppointment(true)}
              className="bg-gradient-to-r from-soft-blue to-soft-purple text-white hover:shadow-lg transition-all duration-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Appointment
            </Button>
          </div>
        </div>

        {/* Calendar Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              title: "Today's Appointments",
              value: getAppointmentsForDate(new Date()).length,
              change: "Scheduled today",
              icon: CalendarIcon,
              color: "from-soft-blue to-soft-purple",
            },
            {
              title: "This Week",
              value: 23,
              change: "+3 from last week",
              icon: Clock,
              color: "from-soft-mint to-soft-peach",
            },
            {
              title: "Confirmed",
              value: appointments.filter((a) => a.status === "confirmed").length,
              change: "Ready to go",
              icon: CheckCircle,
              color: "from-soft-purple to-soft-pink",
            },
            {
              title: "Pending",
              value: appointments.filter((a) => a.status === "pending").length,
              change: "Need confirmation",
              icon: AlertCircle,
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

        {/* Calendar View */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <Card className="lg:col-span-2 bg-white/50 backdrop-blur-xl border-white/20 shadow-xl animate-fade-in">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold text-gray-800">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => navigateMonth(-1)} className="hover:bg-white/30">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentDate(new Date())}
                    className="hover:bg-white/30"
                  >
                    Today
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => navigateMonth(1)} className="hover:bg-white/30">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {dayNames.map((day) => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {getDaysInMonth(currentDate).map((day, index) => {
                  if (!day) {
                    return <div key={index} className="h-24 p-1"></div>
                  }

                  const cellDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
                  const dayAppointments = getAppointmentsForDate(cellDate)
                  const isToday = cellDate.toDateString() === new Date().toDateString()

                  return (
                    <div
                      key={day}
                      className={`h-24 p-1 border border-white/20 rounded-lg hover:bg-white/30 transition-colors cursor-pointer ${
                        isToday ? "bg-soft-blue/20 border-soft-blue" : "bg-white/10"
                      }`}
                    >
                      <div className={`text-sm font-medium mb-1 ${isToday ? "text-soft-blue" : "text-gray-700"}`}>
                        {day}
                      </div>
                      <div className="space-y-1">
                        {dayAppointments.slice(0, 2).map((apt) => (
                          <div
                            key={apt.id}
                            className="text-xs p-1 rounded bg-soft-blue/20 text-gray-700 truncate cursor-pointer hover:bg-soft-blue/30"
                            onClick={() => setSelectedAppointment(apt)}
                          >
                            {formatTime(apt.time)} {apt.client.split(" ")[0]}
                          </div>
                        ))}
                        {dayAppointments.length > 2 && (
                          <div className="text-xs text-gray-500">+{dayAppointments.length - 2} more</div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Today's Schedule */}
          <Card className="bg-white/50 backdrop-blur-xl border-white/20 shadow-xl animate-fade-in">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800">Today's Schedule</CardTitle>
              <CardDescription className="text-gray-600">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getAppointmentsForDate(new Date()).map((appointment, index) => {
                  const TypeIcon = getTypeIcon(appointment.type)
                  return (
                    <div
                      key={appointment.id}
                      className="p-4 rounded-xl bg-white/30 hover:bg-white/50 transition-all duration-200 cursor-pointer animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                      onClick={() => setSelectedAppointment(appointment)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-semibold text-gray-800">{formatTime(appointment.time)}</span>
                            <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                          </div>
                          <h4 className="font-medium text-gray-800 mb-1">{appointment.client}</h4>
                          <p className="text-sm text-gray-600 mb-2">{appointment.provider}</p>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <TypeIcon className="w-3 h-3" />
                            <span>{appointment.type}</span>
                            <span>•</span>
                            <span>{appointment.duration} min</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}

                {getAppointmentsForDate(new Date()).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <CalendarIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No appointments scheduled for today</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Appointment Detail Modal */}
        {selectedAppointment && (
          <Card className="bg-white/50 backdrop-blur-xl border-white/20 shadow-xl animate-fade-in">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold text-gray-800">{selectedAppointment.title}</CardTitle>
                <Button variant="ghost" onClick={() => setSelectedAppointment(null)} className="hover:bg-white/30">
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Client</label>
                    <p className="text-gray-800">{selectedAppointment.client}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Provider</label>
                    <p className="text-gray-800">{selectedAppointment.provider}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Date & Time</label>
                    <p className="text-gray-800">
                      {new Date(selectedAppointment.date).toLocaleDateString()} at{" "}
                      {formatTime(selectedAppointment.time)}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Duration</label>
                    <p className="text-gray-800">{selectedAppointment.duration} minutes</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Type</label>
                    <div className="flex items-center space-x-2">
                      {React.createElement(getTypeIcon(selectedAppointment.type), { className: "w-4 h-4" })}
                      <span className="text-gray-800 capitalize">{selectedAppointment.type}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <Badge className={getStatusColor(selectedAppointment.status)}>{selectedAppointment.status}</Badge>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Notes</label>
                <p className="text-gray-800 bg-white/30 p-3 rounded-lg">{selectedAppointment.notes}</p>
              </div>

              <div className="flex space-x-4">
                <Button className="bg-gradient-to-r from-soft-blue to-soft-purple text-white">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Appointment
                </Button>
                <Button variant="outline" className="border-white/20 hover:bg-white/30">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Client
                </Button>
                <Button variant="outline" className="border-white/20 hover:bg-white/30 text-red-600">
                  <Trash2 className="w-4 h-4 mr-2" />
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
