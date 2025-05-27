"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Download,
  Play,
  Clock,
  Star,
  MessageSquare,
  Calendar,
  PhoneCall,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
} from "lucide-react"
import { GlassSidebar } from "@/components/glass-sidebar"

export default function CallLogsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterIntent, setFilterIntent] = useState("all")
  const [selectedCall, setSelectedCall] = useState(null)

  // Mock call data
  const callLogs = [
    {
      id: "call_001",
      caller: "Sarah Johnson",
      phone: "+1 (555) 123-4567",
      intent: "New Client Intake",
      status: "completed",
      duration: "4:32",
      timestamp: "2024-01-15T14:30:00Z",
      satisfaction: 5,
      transcript: "Hello, I'm interested in scheduling a consultation for therapy services...",
      outcome: "Appointment Scheduled",
      agent_notes: "Client interested in anxiety therapy, scheduled for next Tuesday",
      type: "incoming",
    },
    {
      id: "call_002",
      caller: "Mike Davis",
      phone: "+1 (555) 987-6543",
      intent: "Appointment Booking",
      status: "completed",
      duration: "2:15",
      timestamp: "2024-01-15T13:45:00Z",
      satisfaction: 4,
      transcript: "Hi, I'd like to reschedule my appointment for this week...",
      outcome: "Rescheduled",
      agent_notes: "Moved appointment from Thursday to Friday",
      type: "incoming",
    },
    {
      id: "call_003",
      caller: "Lisa Chen",
      phone: "+1 (555) 456-7890",
      intent: "Provider Availability",
      status: "completed",
      duration: "3:45",
      timestamp: "2024-01-15T12:20:00Z",
      satisfaction: 5,
      transcript: "I'm looking for a therapist who specializes in family counseling...",
      outcome: "Information Provided",
      agent_notes: "Provided Dr. Rodriguez contact info, client will call directly",
      type: "incoming",
    },
    {
      id: "call_004",
      caller: "John Smith",
      phone: "+1 (555) 321-0987",
      intent: "General Question",
      status: "completed",
      duration: "1:58",
      timestamp: "2024-01-15T11:15:00Z",
      satisfaction: 4,
      transcript: "What are your office hours and do you accept my insurance?",
      outcome: "Information Provided",
      agent_notes: "Confirmed office hours and insurance coverage",
      type: "incoming",
    },
    {
      id: "call_005",
      caller: "Emma Wilson",
      phone: "+1 (555) 654-3210",
      intent: "Emergency",
      status: "transferred",
      duration: "0:45",
      timestamp: "2024-01-15T10:30:00Z",
      satisfaction: null,
      transcript: "I'm having a panic attack and need immediate help...",
      outcome: "Transferred to Crisis Line",
      agent_notes: "Immediately transferred to 24/7 crisis support",
      type: "incoming",
    },
    {
      id: "call_006",
      caller: "Robert Brown",
      phone: "+1 (555) 789-0123",
      intent: "Billing Question",
      status: "missed",
      duration: "0:00",
      timestamp: "2024-01-15T09:45:00Z",
      satisfaction: null,
      transcript: null,
      outcome: "Missed Call",
      agent_notes: "Voicemail left, follow-up scheduled",
      type: "missed",
    },
  ]

  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-soft-mint text-gray-700"
      case "transferred":
        return "bg-soft-blue text-white"
      case "missed":
        return "bg-soft-peach text-gray-700"
      default:
        return "bg-gray-200 text-gray-600"
    }
  }

  const getIntentColor = (intent) => {
    switch (intent) {
      case "New Client Intake":
        return "bg-soft-purple text-white"
      case "Appointment Booking":
        return "bg-soft-blue text-white"
      case "Emergency":
        return "bg-red-500 text-white"
      default:
        return "bg-gray-200 text-gray-600"
    }
  }

  const getCallIcon = (type, status) => {
    if (status === "missed") return PhoneMissed
    if (type === "incoming") return PhoneIncoming
    if (type === "outgoing") return PhoneOutgoing
    return PhoneCall
  }

  const filteredCalls = callLogs.filter((call) => {
    const matchesSearch =
      call.caller.toLowerCase().includes(searchTerm.toLowerCase()) ||
      call.phone.includes(searchTerm) ||
      call.intent.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || call.status === filterStatus
    const matchesIntent = filterIntent === "all" || call.intent === filterIntent
    return matchesSearch && matchesStatus && matchesIntent
  })

  return (
    <GlassSidebar userRole="tenant-admin" userName="Dr. Sarah Mitchell">
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="animate-fade-in">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Call Logs</h1>
            <p className="text-gray-600 text-lg">Monitor and analyze all AI agent interactions</p>
          </div>
          <div className="flex items-center space-x-4 animate-fade-in">
            <Button className="bg-gradient-to-r from-soft-blue to-soft-purple text-white hover:shadow-lg transition-all duration-200">
              <Download className="w-4 h-4 mr-2" />
              Export Logs
            </Button>
          </div>
        </div>

        {/* Filters and Search */}
        <Card className="bg-white/50 backdrop-blur-xl border-white/20 shadow-xl animate-fade-in">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by caller name, phone, or intent..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/50 border-white/20"
                />
              </div>

              {/* Status Filter */}
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48 bg-white/50 border-white/20">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="transferred">Transferred</SelectItem>
                  <SelectItem value="missed">Missed</SelectItem>
                </SelectContent>
              </Select>

              {/* Intent Filter */}
              <Select value={filterIntent} onValueChange={setFilterIntent}>
                <SelectTrigger className="w-48 bg-white/50 border-white/20">
                  <SelectValue placeholder="Filter by intent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Intents</SelectItem>
                  <SelectItem value="New Client Intake">New Client Intake</SelectItem>
                  <SelectItem value="Appointment Booking">Appointment Booking</SelectItem>
                  <SelectItem value="Provider Availability">Provider Availability</SelectItem>
                  <SelectItem value="General Question">General Question</SelectItem>
                  <SelectItem value="Emergency">Emergency</SelectItem>
                  <SelectItem value="Billing Question">Billing Question</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Call Logs Table */}
        <Card className="bg-white/50 backdrop-blur-xl border-white/20 shadow-xl animate-fade-in">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800">Recent Calls</CardTitle>
            <CardDescription className="text-gray-600">{filteredCalls.length} calls found</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredCalls.map((call, index) => {
                const CallIcon = getCallIcon(call.type, call.status)
                return (
                  <div
                    key={call.id}
                    className="flex items-center justify-between p-4 rounded-2xl bg-white/30 hover:bg-white/50 transition-all duration-200 cursor-pointer animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                    onClick={() => setSelectedCall(call)}
                  >
                    <div className="flex items-center space-x-4">
                      {/* Call Icon */}
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
                          call.status === "missed"
                            ? "bg-red-100"
                            : call.status === "transferred"
                              ? "bg-blue-100"
                              : "bg-green-100"
                        }`}
                      >
                        <CallIcon
                          className={`w-5 h-5 ${
                            call.status === "missed"
                              ? "text-red-600"
                              : call.status === "transferred"
                                ? "text-blue-600"
                                : "text-green-600"
                          }`}
                        />
                      </div>

                      {/* Call Details */}
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-gray-800">{call.caller}</h3>
                          <Badge className={getIntentColor(call.intent)}>{call.intent}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">{call.phone}</p>
                        <p className="text-xs text-gray-500 flex items-center mt-1">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(call.timestamp)}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      {/* Status and Duration */}
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge className={getStatusColor(call.status)}>{call.status}</Badge>
                        {call.duration !== "0:00" && (
                          <span className="text-sm text-gray-600 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {call.duration}
                          </span>
                        )}
                      </div>

                      {/* Satisfaction Rating */}
                      {call.satisfaction && (
                        <div className="flex items-center text-yellow-500 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < call.satisfaction ? "fill-current" : ""}`} />
                          ))}
                        </div>
                      )}

                      {/* Outcome */}
                      <p className="text-xs text-gray-600">{call.outcome}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Call Detail Modal/Panel */}
        {selectedCall && (
          <Card className="bg-white/50 backdrop-blur-xl border-white/20 shadow-xl animate-fade-in">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold text-gray-800">Call Details</CardTitle>
                <Button variant="ghost" onClick={() => setSelectedCall(null)} className="hover:bg-white/30">
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Call Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Call Information</h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Caller:</span> {selectedCall.caller}
                    </p>
                    <p>
                      <span className="font-medium">Phone:</span> {selectedCall.phone}
                    </p>
                    <p>
                      <span className="font-medium">Intent:</span> {selectedCall.intent}
                    </p>
                    <p>
                      <span className="font-medium">Duration:</span> {selectedCall.duration}
                    </p>
                    <p>
                      <span className="font-medium">Status:</span> {selectedCall.status}
                    </p>
                    <p>
                      <span className="font-medium">Outcome:</span> {selectedCall.outcome}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Agent Notes</h3>
                  <p className="text-sm text-gray-600 bg-white/30 p-3 rounded-xl">{selectedCall.agent_notes}</p>
                  {selectedCall.satisfaction && (
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-800 mb-2">Satisfaction Rating</h4>
                      <div className="flex items-center text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < selectedCall.satisfaction ? "fill-current" : ""}`} />
                        ))}
                        <span className="ml-2 text-gray-600">({selectedCall.satisfaction}/5)</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Transcript */}
              {selectedCall.transcript && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Call Transcript</h3>
                  <div className="bg-white/30 p-4 rounded-xl">
                    <p className="text-sm text-gray-700">{selectedCall.transcript}</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-4">
                <Button className="bg-gradient-to-r from-soft-blue to-soft-purple text-white">
                  <Play className="w-4 h-4 mr-2" />
                  Play Recording
                </Button>
                <Button variant="outline" className="border-white/20 hover:bg-white/30">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send Follow-up
                </Button>
                <Button variant="outline" className="border-white/20 hover:bg-white/30">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </GlassSidebar>
  )
}
