"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, Save, Play, Copy, Edit, ArrowRight, ArrowDown, FileText } from "lucide-react"
import { GlassSidebar } from "@/components/glass-sidebar"

export default function ScriptEditorPage() {
  const [selectedScript, setSelectedScript] = useState("greeting")
  const [scripts, setScripts] = useState({
    greeting: {
      name: "Initial Greeting",
      content: "Hello! I'm Clara, your AI assistant at Caring Clarity. How can I help you today?",
      triggers: ["call_start"],
      active: true,
    },
    appointment: {
      name: "Appointment Booking",
      content:
        "I'd be happy to help you schedule an appointment. What type of service are you looking for, and what days work best for you?",
      triggers: ["appointment", "schedule", "booking"],
      active: true,
    },
    billing: {
      name: "Billing Inquiry",
      content:
        "I can help you with billing questions. Let me connect you with our billing specialist who can assist you with your account.",
      triggers: ["billing", "payment", "insurance", "cost"],
      active: true,
    },
    emergency: {
      name: "Emergency Protocol",
      content:
        "I understand this is urgent. I'm connecting you immediately with our crisis support team. Please stay on the line.",
      triggers: ["emergency", "crisis", "urgent", "help"],
      active: true,
    },
    hours: {
      name: "Business Hours",
      content:
        "Our office hours are Monday through Friday, 9 AM to 5 PM, and Saturday 10 AM to 2 PM. We're closed on Sundays.",
      triggers: ["hours", "open", "closed", "schedule"],
      active: true,
    },
  })

  const [conversationFlow, setConversationFlow] = useState([
    { id: 1, type: "greeting", content: "Initial greeting", next: [2, 3] },
    { id: 2, type: "question", content: "Intent detection", next: [4, 5, 6] },
    { id: 3, type: "fallback", content: "Clarification request", next: [2] },
    { id: 4, type: "appointment", content: "Appointment booking", next: [7] },
    { id: 5, type: "billing", content: "Billing inquiry", next: [7] },
    { id: 6, type: "emergency", content: "Emergency protocol", next: [] },
    { id: 7, type: "closing", content: "Call conclusion", next: [] },
  ])

  const scriptTypes = [
    { id: "greeting", name: "Greeting", color: "bg-green-500" },
    { id: "appointment", name: "Appointment", color: "bg-blue-500" },
    { id: "billing", name: "Billing", color: "bg-purple-500" },
    { id: "emergency", name: "Emergency", color: "bg-red-500" },
    { id: "hours", name: "Hours", color: "bg-yellow-500" },
    { id: "fallback", name: "Fallback", color: "bg-gray-500" },
  ]

  const updateScript = (scriptId, field, value) => {
    setScripts((prev) => ({
      ...prev,
      [scriptId]: {
        ...prev[scriptId],
        [field]: value,
      },
    }))
  }

  const addNewScript = () => {
    const newId = `script_${Date.now()}`
    setScripts((prev) => ({
      ...prev,
      [newId]: {
        name: "New Script",
        content: "Enter your script content here...",
        triggers: [],
        active: true,
      },
    }))
    setSelectedScript(newId)
  }

  const deleteScript = (scriptId) => {
    const newScripts = { ...scripts }
    delete newScripts[scriptId]
    setScripts(newScripts)
    setSelectedScript(Object.keys(newScripts)[0] || "")
  }

  const saveScripts = () => {
    console.log("Saving scripts...", scripts)
    // Here you would save to your backend
  }

  const testScript = (scriptId) => {
    console.log("Testing script:", scripts[scriptId])
    // Here you would trigger a test of the specific script
  }

  return (
    <GlassSidebar userRole="tenant-admin" userName="Dr. Sarah Mitchell">
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="animate-fade-in">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Script Editor</h1>
            <p className="text-gray-600 text-lg">Customize conversation flows and AI responses</p>
          </div>
          <div className="flex space-x-4">
            <Button onClick={() => window.history.back()} variant="outline" className="bg-white/50 border-white/20">
              Back to Configuration
            </Button>
            <Button onClick={saveScripts} className="bg-gradient-to-r from-soft-blue to-soft-purple text-white">
              <Save className="w-4 h-4 mr-2" />
              Save All Scripts
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Script List */}
          <Card className="bg-white/50 backdrop-blur-xl border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Scripts
              </CardTitle>
              <CardDescription>Manage your conversation scripts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(scripts).map(([scriptId, script]) => (
                <div
                  key={scriptId}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    selectedScript === scriptId
                      ? "border-soft-blue bg-soft-blue/10"
                      : "border-white/20 bg-white/30 hover:bg-white/50"
                  }`}
                  onClick={() => setSelectedScript(scriptId)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800">{script.name}</h3>
                      <p className="text-xs text-gray-600 mt-1">{script.triggers.length} triggers</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${script.active ? "bg-green-400" : "bg-gray-400"}`}></div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteScript(scriptId)
                        }}
                        className="hover:bg-red-100"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              <Button
                onClick={addNewScript}
                className="w-full bg-gradient-to-r from-soft-mint to-soft-peach text-gray-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Script
              </Button>
            </CardContent>
          </Card>

          {/* Script Editor */}
          <div className="lg:col-span-2 space-y-6">
            {selectedScript && scripts[selectedScript] && (
              <Card className="bg-white/50 backdrop-blur-xl border-white/20 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
                    <Edit className="w-5 h-5 mr-2" />
                    Edit Script: {scripts[selectedScript].name}
                  </CardTitle>
                  <CardDescription>Customize the script content and triggers</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Script Name */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Script Name</label>
                    <Input
                      value={scripts[selectedScript].name}
                      onChange={(e) => updateScript(selectedScript, "name", e.target.value)}
                      className="bg-white/50 border-white/20"
                      placeholder="Enter script name"
                    />
                  </div>

                  {/* Script Content */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Script Content</label>
                    <Textarea
                      value={scripts[selectedScript].content}
                      onChange={(e) => updateScript(selectedScript, "content", e.target.value)}
                      className="bg-white/50 border-white/20 min-h-[150px]"
                      placeholder="Enter the script content that the AI will speak"
                    />
                  </div>

                  {/* Triggers */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Trigger Keywords</label>
                    <Input
                      value={scripts[selectedScript].triggers.join(", ")}
                      onChange={(e) =>
                        updateScript(
                          selectedScript,
                          "triggers",
                          e.target.value.split(", ").filter((t) => t.trim()),
                        )
                      }
                      className="bg-white/50 border-white/20"
                      placeholder="appointment, schedule, booking (comma separated)"
                    />
                    <p className="text-xs text-gray-500 mt-1">Keywords that will trigger this script</p>
                  </div>

                  {/* Script Actions */}
                  <div className="flex space-x-4 pt-4 border-t border-white/20">
                    <Button
                      onClick={() => testScript(selectedScript)}
                      className="bg-gradient-to-r from-soft-mint to-soft-peach text-gray-700"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Test Script
                    </Button>
                    <Button
                      onClick={() => navigator.clipboard.writeText(scripts[selectedScript].content)}
                      variant="outline"
                      className="bg-white/50 border-white/20"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Content
                    </Button>
                    <Button
                      onClick={() => updateScript(selectedScript, "active", !scripts[selectedScript].active)}
                      variant="outline"
                      className={`${
                        scripts[selectedScript].active ? "bg-green-100 border-green-300" : "bg-red-100 border-red-300"
                      }`}
                    >
                      {scripts[selectedScript].active ? "Active" : "Inactive"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Conversation Flow */}
            <Card className="bg-white/50 backdrop-blur-xl border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Conversation Flow
                </CardTitle>
                <CardDescription>Visual representation of conversation paths</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {conversationFlow.map((step, index) => (
                    <div key={step.id} className="flex items-center space-x-4">
                      <div
                        className={`w-4 h-4 rounded-full ${
                          scriptTypes.find((t) => t.id === step.type)?.color || "bg-gray-500"
                        }`}
                      ></div>
                      <div className="flex-1 p-3 rounded-xl bg-white/30">
                        <h4 className="font-semibold text-gray-800">{step.content}</h4>
                        <p className="text-xs text-gray-600 capitalize">{step.type}</p>
                      </div>
                      {step.next.length > 0 && <ArrowDown className="w-4 h-4 text-gray-400" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </GlassSidebar>
  )
}
