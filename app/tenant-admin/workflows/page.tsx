"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Workflow,
  Plus,
  Edit,
  Play,
  Pause,
  Copy,
  ArrowRight,
  MessageSquare,
  Phone,
  Calendar,
  Mail,
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react"
import { GlassSidebar } from "@/components/glass-sidebar"

export default function WorkflowsPage() {
  const [showCreateWorkflow, setShowCreateWorkflow] = useState(false)
  const [selectedWorkflow, setSelectedWorkflow] = useState(null)

  // Mock workflow data
  const workflows = [
    {
      id: "wf_001",
      name: "New Client Intake",
      description: "Complete intake process for new therapy clients",
      status: "active",
      trigger: "Intent: New Client",
      steps: [
        { id: 1, type: "question", content: "What type of therapy are you interested in?", required: true },
        { id: 2, type: "question", content: "Have you been in therapy before?", required: false },
        { id: 3, type: "collect", content: "Collect contact information", required: true },
        { id: 4, type: "schedule", content: "Schedule initial consultation", required: true },
        { id: 5, type: "email", content: "Send welcome email with intake forms", required: true },
      ],
      completionRate: 87,
      avgDuration: "4:32",
      totalRuns: 156,
      lastModified: "2024-01-15T10:30:00Z",
      author: "Dr. Sarah Mitchell",
    },
    {
      id: "wf_002",
      name: "Appointment Scheduling",
      description: "Handle appointment booking and rescheduling requests",
      status: "active",
      trigger: "Intent: Appointment",
      steps: [
        { id: 1, type: "question", content: "Are you an existing client?", required: true },
        { id: 2, type: "verify", content: "Verify client identity", required: true },
        { id: 3, type: "calendar", content: "Check provider availability", required: true },
        { id: 4, type: "schedule", content: "Book appointment slot", required: true },
        { id: 5, type: "sms", content: "Send confirmation text", required: true },
      ],
      completionRate: 94,
      avgDuration: "2:15",
      totalRuns: 298,
      lastModified: "2024-01-14T14:20:00Z",
      author: "Maria Garcia",
    },
    {
      id: "wf_003",
      name: "Emergency Protocol",
      description: "Handle crisis and emergency situations",
      status: "active",
      trigger: "Intent: Emergency",
      steps: [
        { id: 1, type: "assess", content: "Assess immediate danger", required: true },
        { id: 2, type: "transfer", content: "Transfer to crisis counselor", required: true },
        { id: 3, type: "alert", content: "Alert on-call provider", required: true },
        { id: 4, type: "log", content: "Log emergency contact", required: true },
      ],
      completionRate: 100,
      avgDuration: "0:45",
      totalRuns: 23,
      lastModified: "2024-01-13T16:45:00Z",
      author: "Dr. Emily Rodriguez",
    },
    {
      id: "wf_004",
      name: "Insurance Verification",
      description: "Verify insurance coverage and benefits",
      status: "draft",
      trigger: "Intent: Insurance",
      steps: [
        { id: 1, type: "collect", content: "Collect insurance information", required: true },
        { id: 2, type: "verify", content: "Verify coverage with provider", required: true },
        { id: 3, type: "calculate", content: "Calculate copay and deductible", required: true },
        { id: 4, type: "inform", content: "Inform client of coverage details", required: true },
      ],
      completionRate: 0,
      avgDuration: "0:00",
      totalRuns: 0,
      lastModified: "2024-01-12T11:15:00Z",
      author: "Lisa Thompson",
    },
  ]

  const stepTypes = [
    { value: "question", label: "Ask Question", icon: MessageSquare, color: "bg-soft-blue" },
    { value: "collect", label: "Collect Info", icon: FileText, color: "bg-soft-purple" },
    { value: "schedule", label: "Schedule", icon: Calendar, color: "bg-soft-mint" },
    { value: "email", label: "Send Email", icon: Mail, color: "bg-soft-peach" },
    { value: "sms", label: "Send SMS", icon: Phone, color: "bg-soft-lavender" },
    { value: "transfer", label: "Transfer Call", icon: Phone, color: "bg-red-400" },
    { value: "verify", label: "Verify", icon: CheckCircle, color: "bg-green-400" },
    { value: "alert", label: "Send Alert", icon: AlertCircle, color: "bg-yellow-400" },
  ]

  const getStepTypeConfig = (type) => {
    return stepTypes.find((st) => st.value === type) || stepTypes[0]
  }

  const getStatusColor = (status) => {
    return status === "active" ? "bg-soft-mint text-gray-700" : "bg-soft-peach text-gray-700"
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <GlassSidebar userRole="tenant-admin" userName="Dr. Sarah Mitchell">
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="animate-fade-in">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Workflows & Intake Forms</h1>
            <p className="text-gray-600 text-lg">Design conversation flows and data collection processes</p>
          </div>
          <div className="flex items-center space-x-4 animate-fade-in">
            <Button
              onClick={() => setShowCreateWorkflow(true)}
              className="bg-gradient-to-r from-soft-blue to-soft-purple text-white hover:shadow-lg transition-all duration-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Workflow
            </Button>
          </div>
        </div>

        {/* Workflow Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              title: "Active Workflows",
              value: workflows.filter((w) => w.status === "active").length,
              change: "Currently running",
              icon: Workflow,
              color: "from-soft-blue to-soft-purple",
            },
            {
              title: "Total Executions",
              value: workflows.reduce((sum, w) => sum + w.totalRuns, 0),
              change: "+23% this month",
              icon: Play,
              color: "from-soft-mint to-soft-peach",
            },
            {
              title: "Avg Completion Rate",
              value: `${Math.round(workflows.reduce((sum, w) => sum + w.completionRate, 0) / workflows.length)}%`,
              change: "Excellent performance",
              icon: CheckCircle,
              color: "from-soft-purple to-soft-pink",
            },
            {
              title: "Avg Duration",
              value: "2:48",
              change: "Per workflow",
              icon: Clock,
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

        {/* Workflows List */}
        <Card className="bg-white/50 backdrop-blur-xl border-white/20 shadow-xl animate-fade-in">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800">Workflows</CardTitle>
            <CardDescription className="text-gray-600">{workflows.length} workflows configured</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {workflows.map((workflow, index) => (
                <div
                  key={workflow.id}
                  className="p-6 rounded-2xl bg-white/30 hover:bg-white/50 transition-all duration-200 cursor-pointer animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => setSelectedWorkflow(workflow)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Workflow Header */}
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-800">{workflow.name}</h3>
                        <Badge className={getStatusColor(workflow.status)}>{workflow.status}</Badge>
                        <span className="text-sm text-gray-500">Trigger: {workflow.trigger}</span>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 mb-4">{workflow.description}</p>

                      {/* Workflow Steps Preview */}
                      <div className="flex items-center space-x-2 mb-4">
                        {workflow.steps.slice(0, 4).map((step, stepIndex) => {
                          const stepConfig = getStepTypeConfig(step.type)
                          return (
                            <div key={step.id} className="flex items-center">
                              <div
                                className={`w-8 h-8 ${stepConfig.color} rounded-lg flex items-center justify-center shadow-sm`}
                              >
                                <stepConfig.icon className="w-4 h-4 text-white" />
                              </div>
                              {stepIndex < 3 && stepIndex < workflow.steps.length - 1 && (
                                <ArrowRight className="w-3 h-3 text-gray-400 mx-1" />
                              )}
                            </div>
                          )
                        })}
                        {workflow.steps.length > 4 && (
                          <span className="text-sm text-gray-500 ml-2">+{workflow.steps.length - 4} more</span>
                        )}
                      </div>

                      {/* Workflow Stats */}
                      <div className="flex items-center space-x-6 text-sm text-gray-600">
                        <span>{workflow.totalRuns} executions</span>
                        <span>{workflow.completionRate}% completion rate</span>
                        <span>Avg {workflow.avgDuration}</span>
                        <span>Modified {formatDate(workflow.lastModified)}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2 ml-4">
                      <Button size="sm" variant="outline" className="border-white/20 hover:bg-white/30">
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" className="border-white/20 hover:bg-white/30">
                        <Copy className="w-3 h-3 mr-1" />
                        Clone
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className={`border-white/20 hover:bg-white/30 ${
                          workflow.status === "active" ? "text-orange-600" : "text-green-600"
                        }`}
                      >
                        {workflow.status === "active" ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Workflow Detail Modal */}
        {selectedWorkflow && (
          <Card className="bg-white/50 backdrop-blur-xl border-white/20 shadow-xl animate-fade-in">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold text-gray-800">{selectedWorkflow.name}</CardTitle>
                  <CardDescription className="text-gray-600">{selectedWorkflow.description}</CardDescription>
                </div>
                <Button variant="ghost" onClick={() => setSelectedWorkflow(null)} className="hover:bg-white/30">
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Workflow Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-white/30 rounded-xl">
                  <p className="text-2xl font-bold text-gray-800">{selectedWorkflow.totalRuns}</p>
                  <p className="text-sm text-gray-600">Total Executions</p>
                </div>
                <div className="text-center p-4 bg-white/30 rounded-xl">
                  <p className="text-2xl font-bold text-gray-800">{selectedWorkflow.completionRate}%</p>
                  <p className="text-sm text-gray-600">Completion Rate</p>
                </div>
                <div className="text-center p-4 bg-white/30 rounded-xl">
                  <p className="text-2xl font-bold text-gray-800">{selectedWorkflow.avgDuration}</p>
                  <p className="text-sm text-gray-600">Average Duration</p>
                </div>
              </div>

              {/* Workflow Steps */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Workflow Steps</h3>
                <div className="space-y-3">
                  {selectedWorkflow.steps.map((step, index) => {
                    const stepConfig = getStepTypeConfig(step.type)
                    return (
                      <div key={step.id} className="flex items-center p-4 bg-white/30 rounded-xl">
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="flex items-center space-x-3">
                            <span className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-semibold">
                              {index + 1}
                            </span>
                            <div
                              className={`w-10 h-10 ${stepConfig.color} rounded-lg flex items-center justify-center shadow-sm`}
                            >
                              <stepConfig.icon className="w-5 h-5 text-white" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-medium text-gray-800">{stepConfig.label}</h4>
                              {step.required && <Badge className="bg-red-100 text-red-700 text-xs">Required</Badge>}
                            </div>
                            <p className="text-sm text-gray-600">{step.content}</p>
                          </div>
                        </div>
                        {index < selectedWorkflow.steps.length - 1 && (
                          <ArrowRight className="w-4 h-4 text-gray-400 ml-4" />
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-4">
                <Button className="bg-gradient-to-r from-soft-blue to-soft-purple text-white">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Workflow
                </Button>
                <Button variant="outline" className="border-white/20 hover:bg-white/30">
                  <Play className="w-4 h-4 mr-2" />
                  Test Run
                </Button>
                <Button variant="outline" className="border-white/20 hover:bg-white/30">
                  <Copy className="w-4 h-4 mr-2" />
                  Clone Workflow
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Create Workflow Modal */}
        {showCreateWorkflow && (
          <Card className="bg-white/50 backdrop-blur-xl border-white/20 shadow-xl animate-fade-in">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold text-gray-800">Create New Workflow</CardTitle>
                <Button variant="ghost" onClick={() => setShowCreateWorkflow(false)} className="hover:bg-white/30">
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Workflow Name</label>
                  <Input className="bg-white/50 border-white/20" placeholder="Enter workflow name" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Trigger</label>
                  <Select>
                    <SelectTrigger className="bg-white/50 border-white/20">
                      <SelectValue placeholder="Select trigger" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new-client">Intent: New Client</SelectItem>
                      <SelectItem value="appointment">Intent: Appointment</SelectItem>
                      <SelectItem value="billing">Intent: Billing</SelectItem>
                      <SelectItem value="emergency">Intent: Emergency</SelectItem>
                      <SelectItem value="general">Intent: General Question</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Description</label>
                <Textarea
                  className="bg-white/50 border-white/20"
                  placeholder="Describe what this workflow does..."
                  rows={3}
                />
              </div>

              <div className="flex space-x-4">
                <Button className="bg-gradient-to-r from-soft-blue to-soft-purple text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Workflow
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowCreateWorkflow(false)}
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
