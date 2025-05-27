"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Mic,
  Play,
  Pause,
  Settings,
  Save,
  Clock,
  MessageSquare,
  Phone,
  TestTube,
  AudioWaveformIcon as Waveform,
  Bot,
} from "lucide-react"
import { GlassSidebar } from "@/components/glass-sidebar"
import Link from "next/link"

export default function VoiceAgentPage() {
  const [agentStatus, setAgentStatus] = useState("active")
  const [isTestMode, setIsTestMode] = useState(false)
  const [voiceSettings, setVoiceSettings] = useState({
    name: "Clara",
    voice: "alloy",
    speed: 1.0,
    pitch: 1.0,
    volume: 0.8,
    language: "en-US",
  })

  const [agentPersonality, setAgentPersonality] = useState({
    greeting: "Hello! I'm Clara, your AI assistant at Caring Clarity. How can I help you today?",
    tone: "professional",
    empathy: 7,
    formality: 6,
    patience: 9,
  })

  const [businessHours, setBusinessHours] = useState({
    enabled: true,
    timezone: "America/Los_Angeles",
    monday: { open: "09:00", close: "17:00", enabled: true },
    tuesday: { open: "09:00", close: "17:00", enabled: true },
    wednesday: { open: "09:00", close: "17:00", enabled: true },
    thursday: { open: "09:00", close: "17:00", enabled: true },
    friday: { open: "09:00", close: "17:00", enabled: true },
    saturday: { open: "10:00", close: "14:00", enabled: false },
    sunday: { open: "10:00", close: "14:00", enabled: false },
  })

  const voiceOptions = [
    { id: "alloy", name: "Alloy", description: "Balanced and professional" },
    { id: "echo", name: "Echo", description: "Warm and friendly" },
    { id: "fable", name: "Fable", description: "Expressive and engaging" },
    { id: "onyx", name: "Onyx", description: "Deep and authoritative" },
    { id: "nova", name: "Nova", description: "Bright and energetic" },
    { id: "shimmer", name: "Shimmer", description: "Gentle and calming" },
  ]

  const handleTestVoice = () => {
    setIsTestMode(true)
    // Simulate voice test
    setTimeout(() => setIsTestMode(false), 3000)
  }

  const handleSaveSettings = () => {
    // Save settings logic
    console.log("Saving voice agent settings...")
    alert("Settings saved successfully!")
  }

  // Simple Switch component
  const SimpleSwitch = ({ checked, onCheckedChange, disabled = false }) => (
    <button
      onClick={() => !disabled && onCheckedChange(!checked)}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-soft-blue focus:ring-offset-2 ${
        disabled
          ? "opacity-50 cursor-not-allowed bg-gray-300"
          : checked
            ? "bg-soft-blue hover:bg-soft-blue/80"
            : "bg-gray-300 hover:bg-gray-400"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-lg ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  )

  // Simple Slider component
  const SimpleSlider = ({ value, onValueChange, min = 0, max = 10, step = 1, disabled = false }) => (
    <div className="relative">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => !disabled && onValueChange(Number.parseFloat(e.target.value))}
        disabled={disabled}
        className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider focus:outline-none focus:ring-2 focus:ring-soft-blue ${
          disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"
        }`}
        style={{
          background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${((value - min) / (max - min)) * 100}%, #e5e7eb ${((value - min) / (max - min)) * 100}%, #e5e7eb 100%)`,
        }}
      />
    </div>
  )

  return (
    <GlassSidebar userRole="tenant-admin" userName="Dr. Sarah Mitchell">
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="animate-fade-in">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Voice Agent Configuration</h1>
            <p className="text-gray-600 text-lg">Customize your AI assistant's voice, personality, and behavior</p>
          </div>
          <div className="flex items-center space-x-4 animate-fade-in">
            <div className="flex items-center space-x-3 bg-white/50 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
              <div
                className={`w-3 h-3 rounded-full ${agentStatus === "active" ? "bg-green-400 animate-pulse" : "bg-gray-400"}`}
              ></div>
              <span className="text-sm font-medium text-gray-700">
                Agent {agentStatus === "active" ? "Active" : "Inactive"}
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setAgentStatus(agentStatus === "active" ? "inactive" : "active")}
                className="hover:bg-white/30 transition-colors"
              >
                {agentStatus === "active" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
            </div>
            <Button
              onClick={handleSaveSettings}
              className="bg-gradient-to-r from-soft-blue to-soft-purple text-white hover:shadow-lg transition-all duration-200"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        {/* Voice Settings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Voice Configuration */}
          <Card className="bg-white/50 backdrop-blur-xl border-white/20 shadow-xl animate-fade-in">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
                <Mic className="w-5 h-5 mr-2" />
                Voice Settings
              </CardTitle>
              <CardDescription className="text-gray-600">
                Configure voice characteristics and audio settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Agent Name */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Agent Name</label>
                <Input
                  value={voiceSettings.name}
                  onChange={(e) => setVoiceSettings({ ...voiceSettings, name: e.target.value })}
                  className="bg-white/50 border-white/20 focus:border-soft-blue focus:ring-soft-blue"
                  placeholder="Enter agent name"
                />
              </div>

              {/* Voice Selection */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-3 block">Voice Model</label>
                <div className="grid grid-cols-2 gap-3">
                  {voiceOptions.map((voice) => (
                    <div
                      key={voice.id}
                      className={`p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                        voiceSettings.voice === voice.id
                          ? "border-soft-blue bg-soft-blue/10 shadow-md"
                          : "border-white/20 bg-white/30 hover:bg-white/50 hover:border-white/40"
                      }`}
                      onClick={() => setVoiceSettings({ ...voiceSettings, voice: voice.id })}
                    >
                      <h4 className="font-semibold text-gray-800">{voice.name}</h4>
                      <p className="text-xs text-gray-600">{voice.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Voice Controls */}
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Speaking Speed: {voiceSettings.speed}x
                  </label>
                  <SimpleSlider
                    value={voiceSettings.speed}
                    onValueChange={(value) => setVoiceSettings({ ...voiceSettings, speed: value })}
                    max={2}
                    min={0.5}
                    step={0.1}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0.5x (Slow)</span>
                    <span>2.0x (Fast)</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Voice Pitch: {voiceSettings.pitch}x
                  </label>
                  <SimpleSlider
                    value={voiceSettings.pitch}
                    onValueChange={(value) => setVoiceSettings({ ...voiceSettings, pitch: value })}
                    max={2}
                    min={0.5}
                    step={0.1}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0.5x (Low)</span>
                    <span>2.0x (High)</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Volume: {Math.round(voiceSettings.volume * 100)}%
                  </label>
                  <SimpleSlider
                    value={voiceSettings.volume}
                    onValueChange={(value) => setVoiceSettings({ ...voiceSettings, volume: value })}
                    max={1}
                    min={0}
                    step={0.1}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0% (Mute)</span>
                    <span>100% (Max)</span>
                  </div>
                </div>
              </div>

              {/* Test Voice */}
              <Button
                onClick={handleTestVoice}
                disabled={isTestMode}
                className="w-full bg-gradient-to-r from-soft-mint to-soft-peach text-gray-700 hover:shadow-lg transition-all duration-200 disabled:opacity-50"
              >
                {isTestMode ? (
                  <>
                    <Waveform className="w-4 h-4 mr-2 animate-pulse" />
                    Testing Voice...
                  </>
                ) : (
                  <>
                    <TestTube className="w-4 h-4 mr-2" />
                    Test Voice
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Personality Settings */}
          <Card className="bg-white/50 backdrop-blur-xl border-white/20 shadow-xl animate-fade-in">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
                <Bot className="w-5 h-5 mr-2" />
                Personality & Behavior
              </CardTitle>
              <CardDescription className="text-gray-600">Define how your agent interacts with callers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Greeting Message */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Greeting Message</label>
                <Textarea
                  value={agentPersonality.greeting}
                  onChange={(e) => setAgentPersonality({ ...agentPersonality, greeting: e.target.value })}
                  className="bg-white/50 border-white/20 min-h-[100px] focus:border-soft-blue focus:ring-soft-blue"
                  placeholder="Enter the greeting message for your agent"
                />
              </div>

              {/* Personality Traits */}
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Empathy Level: {agentPersonality.empathy}/10
                  </label>
                  <SimpleSlider
                    value={agentPersonality.empathy}
                    onValueChange={(value) => setAgentPersonality({ ...agentPersonality, empathy: value })}
                    max={10}
                    min={1}
                    step={1}
                  />
                  <p className="text-xs text-gray-500 mt-1">How emotionally responsive the agent should be</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Formality Level: {agentPersonality.formality}/10
                  </label>
                  <SimpleSlider
                    value={agentPersonality.formality}
                    onValueChange={(value) => setAgentPersonality({ ...agentPersonality, formality: value })}
                    max={10}
                    min={1}
                    step={1}
                  />
                  <p className="text-xs text-gray-500 mt-1">Professional vs casual communication style</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Patience Level: {agentPersonality.patience}/10
                  </label>
                  <SimpleSlider
                    value={agentPersonality.patience}
                    onValueChange={(value) => setAgentPersonality({ ...agentPersonality, patience: value })}
                    max={10}
                    min={1}
                    step={1}
                  />
                  <p className="text-xs text-gray-500 mt-1">How long to wait for responses and handle interruptions</p>
                </div>
              </div>

              {/* Tone Selection */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-3 block">Communication Tone</label>
                <div className="grid grid-cols-2 gap-3">
                  {["professional", "friendly", "caring", "authoritative"].map((tone) => (
                    <div
                      key={tone}
                      className={`p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 text-center ${
                        agentPersonality.tone === tone
                          ? "border-soft-purple bg-soft-purple/10 shadow-md"
                          : "border-white/20 bg-white/30 hover:bg-white/50 hover:border-white/40"
                      }`}
                      onClick={() => setAgentPersonality({ ...agentPersonality, tone })}
                    >
                      <span className="font-medium text-gray-800 capitalize">{tone}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Business Hours */}
        <Card className="bg-white/50 backdrop-blur-xl border-white/20 shadow-xl animate-fade-in">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Business Hours
            </CardTitle>
            <CardDescription className="text-gray-600">Set when your AI agent should be available</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Enable Business Hours */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/30">
                <div>
                  <h3 className="font-semibold text-gray-800">Enable Business Hours</h3>
                  <p className="text-sm text-gray-600">Restrict agent availability to specific hours</p>
                </div>
                <SimpleSwitch
                  checked={businessHours.enabled}
                  onCheckedChange={(checked) => setBusinessHours({ ...businessHours, enabled: checked })}
                />
              </div>

              {/* Weekly Schedule */}
              {businessHours.enabled && (
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-700">Weekly Schedule</h4>
                  {Object.entries(businessHours)
                    .filter(([key]) => !["enabled", "timezone"].includes(key))
                    .map(([day, hours]) => (
                      <div key={day} className="flex items-center justify-between p-4 rounded-xl bg-white/30">
                        <div className="flex items-center space-x-4">
                          <SimpleSwitch
                            checked={hours.enabled}
                            onCheckedChange={(checked) =>
                              setBusinessHours({
                                ...businessHours,
                                [day]: { ...hours, enabled: checked },
                              })
                            }
                          />
                          <span className="font-medium text-gray-800 capitalize w-20">{day}</span>
                        </div>
                        {hours.enabled && (
                          <div className="flex items-center space-x-2">
                            <Input
                              type="time"
                              value={hours.open}
                              onChange={(e) =>
                                setBusinessHours({
                                  ...businessHours,
                                  [day]: { ...hours, open: e.target.value },
                                })
                              }
                              className="bg-white/50 border-white/20 w-32 focus:border-soft-blue focus:ring-soft-blue"
                            />
                            <span className="text-gray-600">to</span>
                            <Input
                              type="time"
                              value={hours.close}
                              onChange={(e) =>
                                setBusinessHours({
                                  ...businessHours,
                                  [day]: { ...hours, close: e.target.value },
                                })
                              }
                              className="bg-white/50 border-white/20 w-32 focus:border-soft-blue focus:ring-soft-blue"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/50 backdrop-blur-xl border-white/20 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 animate-fade-in">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-soft-blue to-soft-purple rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Test Call</h3>
              <p className="text-sm text-gray-600 mb-4">Make a test call to verify agent behavior</p>
              <Link href="/tenant-admin/voice-agent/test-call">
                <Button className="w-full bg-gradient-to-r from-soft-blue to-soft-purple text-white hover:shadow-lg transition-all duration-200">
                  Start Test
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-white/50 backdrop-blur-xl border-white/20 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 animate-fade-in">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-soft-mint to-soft-peach rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Script Editor</h3>
              <p className="text-sm text-gray-600 mb-4">Customize conversation flows and responses</p>
              <Link href="/tenant-admin/voice-agent/script-editor">
                <Button className="w-full bg-gradient-to-r from-soft-mint to-soft-peach text-gray-700 hover:shadow-lg transition-all duration-200">
                  Edit Scripts
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-white/50 backdrop-blur-xl border-white/20 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 animate-fade-in">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-soft-purple to-soft-pink rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Settings className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Advanced Settings</h3>
              <p className="text-sm text-gray-600 mb-4">Configure integrations and advanced features</p>
              <Link href="/tenant-admin/voice-agent/advanced-settings">
                <Button className="w-full bg-gradient-to-r from-soft-purple to-soft-pink text-white hover:shadow-lg transition-all duration-200">
                  Configure
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </GlassSidebar>
  )
}
