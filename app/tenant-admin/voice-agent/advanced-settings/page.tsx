"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Settings,
  Zap,
  Shield,
  Database,
  Webhook,
  Key,
  AlertTriangle,
  CheckCircle,
  Save,
  RefreshCw,
} from "lucide-react"
import { GlassSidebar } from "@/components/glass-sidebar"

export default function AdvancedSettingsPage() {
  const [settings, setSettings] = useState({
    // AI Configuration
    aiModel: "groq-llama-3.3-70b",
    maxTokens: 150,
    temperature: 0.7,
    responseTimeout: 10,

    // Voice Settings
    voiceProvider: "deepgram",
    sttModel: "nova-2",
    ttsModel: "aura-2-athena-en",
    audioQuality: "high",

    // Integration Settings
    crmIntegration: true,
    crmWebhook: "https://api.caringclarity.org/webhook/crm",
    calendarIntegration: true,
    calendarApi: "google-calendar",

    // Security Settings
    encryptionEnabled: true,
    hipaaCompliant: true,
    sessionTimeout: 30,
    maxConcurrentCalls: 10,

    // Monitoring
    loggingLevel: "info",
    analyticsEnabled: true,
    errorReporting: true,
    performanceMonitoring: true,
  })

  const [webhooks, setWebhooks] = useState([
    {
      id: 1,
      name: "CRM Integration",
      url: "https://api.caringclarity.org/webhook/crm",
      events: ["call_started", "call_ended", "appointment_booked"],
      active: true,
      lastTriggered: "2 minutes ago",
    },
    {
      id: 2,
      name: "Billing System",
      url: "https://billing.caringclarity.org/webhook",
      events: ["payment_inquiry", "billing_question"],
      active: true,
      lastTriggered: "1 hour ago",
    },
  ])

  const [apiKeys, setApiKeys] = useState([
    {
      id: 1,
      name: "Deepgram STT/TTS",
      service: "deepgram",
      status: "active",
      lastUsed: "Active now",
    },
    {
      id: 2,
      name: "Groq AI Model",
      service: "groq",
      status: "active",
      lastUsed: "Active now",
    },
    {
      id: 3,
      name: "Twilio Voice",
      service: "twilio",
      status: "active",
      lastUsed: "2 minutes ago",
    },
  ])

  const updateSetting = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const saveSettings = () => {
    console.log("Saving advanced settings...", settings)
    // Here you would save to your backend
  }

  const testWebhook = (webhookId) => {
    console.log("Testing webhook:", webhookId)
    // Here you would test the webhook
  }

  const regenerateApiKey = (keyId) => {
    console.log("Regenerating API key:", keyId)
    // Here you would regenerate the API key
  }

  // Simple Switch component
  const SimpleSwitch = ({ checked, onCheckedChange, ...props }) => (
    <button
      onClick={() => onCheckedChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? "bg-soft-blue" : "bg-gray-300"
      }`}
      {...props}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  )

  return (
    <GlassSidebar userRole="tenant-admin" userName="Dr. Sarah Mitchell">
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="animate-fade-in">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Advanced Settings</h1>
            <p className="text-gray-600 text-lg">Configure integrations, security, and advanced features</p>
          </div>
          <div className="flex space-x-4">
            <Button onClick={() => window.history.back()} variant="outline" className="bg-white/50 border-white/20">
              Back to Configuration
            </Button>
            <Button onClick={saveSettings} className="bg-gradient-to-r from-soft-blue to-soft-purple text-white">
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* AI Configuration */}
          <Card className="bg-white/50 backdrop-blur-xl border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                AI Configuration
              </CardTitle>
              <CardDescription>Advanced AI model and performance settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">AI Model</label>
                <select
                  value={settings.aiModel}
                  onChange={(e) => updateSetting("aiModel", e.target.value)}
                  className="w-full p-2 rounded-lg bg-white/50 border border-white/20"
                >
                  <option value="groq-llama-3.3-70b">Groq Llama 3.3 70B (Recommended)</option>
                  <option value="groq-llama-3.1-8b">Groq Llama 3.1 8B (Faster)</option>
                  <option value="groq-mixtral-8x7b">Groq Mixtral 8x7B</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Max Tokens: {settings.maxTokens}</label>
                <input
                  type="range"
                  min="50"
                  max="500"
                  value={settings.maxTokens}
                  onChange={(e) => updateSetting("maxTokens", Number.parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Temperature: {settings.temperature}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={settings.temperature}
                  onChange={(e) => updateSetting("temperature", Number.parseFloat(e.target.value))}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">Higher values make responses more creative</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Response Timeout (seconds)</label>
                <Input
                  type="number"
                  value={settings.responseTimeout}
                  onChange={(e) => updateSetting("responseTimeout", Number.parseInt(e.target.value))}
                  className="bg-white/50 border-white/20"
                />
              </div>
            </CardContent>
          </Card>

          {/* Voice & Audio Settings */}
          <Card className="bg-white/50 backdrop-blur-xl border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Voice & Audio
              </CardTitle>
              <CardDescription>Speech-to-text and text-to-speech configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Voice Provider</label>
                <select
                  value={settings.voiceProvider}
                  onChange={(e) => updateSetting("voiceProvider", e.target.value)}
                  className="w-full p-2 rounded-lg bg-white/50 border border-white/20"
                >
                  <option value="deepgram">Deepgram (Recommended)</option>
                  <option value="openai">OpenAI</option>
                  <option value="elevenlabs">ElevenLabs</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">STT Model</label>
                <select
                  value={settings.sttModel}
                  onChange={(e) => updateSetting("sttModel", e.target.value)}
                  className="w-full p-2 rounded-lg bg-white/50 border border-white/20"
                >
                  <option value="nova-2">Nova 2 (Latest)</option>
                  <option value="nova">Nova</option>
                  <option value="enhanced">Enhanced</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">TTS Model</label>
                <select
                  value={settings.ttsModel}
                  onChange={(e) => updateSetting("ttsModel", e.target.value)}
                  className="w-full p-2 rounded-lg bg-white/50 border border-white/20"
                >
                  <option value="aura-2-athena-en">Aura 2 Athena (Recommended)</option>
                  <option value="aura-2-luna-en">Aura 2 Luna</option>
                  <option value="aura-2-stella-en">Aura 2 Stella</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Audio Quality</label>
                <select
                  value={settings.audioQuality}
                  onChange={(e) => updateSetting("audioQuality", e.target.value)}
                  className="w-full p-2 rounded-lg bg-white/50 border border-white/20"
                >
                  <option value="high">High (Recommended)</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low (Faster)</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="bg-white/50 backdrop-blur-xl border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Security & Compliance
              </CardTitle>
              <CardDescription>Privacy, security, and compliance settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/30">
                <div>
                  <h3 className="font-semibold text-gray-800">End-to-End Encryption</h3>
                  <p className="text-sm text-gray-600">Encrypt all voice data in transit</p>
                </div>
                <SimpleSwitch
                  checked={settings.encryptionEnabled}
                  onCheckedChange={(checked) => updateSetting("encryptionEnabled", checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-white/30">
                <div>
                  <h3 className="font-semibold text-gray-800">HIPAA Compliance</h3>
                  <p className="text-sm text-gray-600">Enable healthcare data protection</p>
                </div>
                <SimpleSwitch
                  checked={settings.hipaaCompliant}
                  onCheckedChange={(checked) => updateSetting("hipaaCompliant", checked)}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Session Timeout (minutes)</label>
                <Input
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => updateSetting("sessionTimeout", Number.parseInt(e.target.value))}
                  className="bg-white/50 border-white/20"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Max Concurrent Calls</label>
                <Input
                  type="number"
                  value={settings.maxConcurrentCalls}
                  onChange={(e) => updateSetting("maxConcurrentCalls", Number.parseInt(e.target.value))}
                  className="bg-white/50 border-white/20"
                />
              </div>
            </CardContent>
          </Card>

          {/* Monitoring & Analytics */}
          <Card className="bg-white/50 backdrop-blur-xl border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
                <Database className="w-5 h-5 mr-2" />
                Monitoring & Analytics
              </CardTitle>
              <CardDescription>System monitoring and data collection settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Logging Level</label>
                <select
                  value={settings.loggingLevel}
                  onChange={(e) => updateSetting("loggingLevel", e.target.value)}
                  className="w-full p-2 rounded-lg bg-white/50 border border-white/20"
                >
                  <option value="error">Error Only</option>
                  <option value="warn">Warning</option>
                  <option value="info">Info (Recommended)</option>
                  <option value="debug">Debug (Verbose)</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-white/30">
                <div>
                  <h3 className="font-semibold text-gray-800">Analytics Enabled</h3>
                  <p className="text-sm text-gray-600">Collect usage and performance data</p>
                </div>
                <SimpleSwitch
                  checked={settings.analyticsEnabled}
                  onCheckedChange={(checked) => updateSetting("analyticsEnabled", checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-white/30">
                <div>
                  <h3 className="font-semibold text-gray-800">Error Reporting</h3>
                  <p className="text-sm text-gray-600">Automatically report system errors</p>
                </div>
                <SimpleSwitch
                  checked={settings.errorReporting}
                  onCheckedChange={(checked) => updateSetting("errorReporting", checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-white/30">
                <div>
                  <h3 className="font-semibold text-gray-800">Performance Monitoring</h3>
                  <p className="text-sm text-gray-600">Track response times and system health</p>
                </div>
                <SimpleSwitch
                  checked={settings.performanceMonitoring}
                  onCheckedChange={(checked) => updateSetting("performanceMonitoring", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Webhooks */}
        <Card className="bg-white/50 backdrop-blur-xl border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
              <Webhook className="w-5 h-5 mr-2" />
              Webhook Integrations
            </CardTitle>
            <CardDescription>Configure external system integrations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {webhooks.map((webhook) => (
                <div key={webhook.id} className="p-4 rounded-xl bg-white/30 border border-white/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800">{webhook.name}</h3>
                      <p className="text-sm text-gray-600">{webhook.url}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Events: {webhook.events.join(", ")} • Last triggered: {webhook.lastTriggered}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${webhook.active ? "bg-green-400" : "bg-gray-400"}`}></div>
                      <Button
                        size="sm"
                        onClick={() => testWebhook(webhook.id)}
                        className="bg-gradient-to-r from-soft-mint to-soft-peach text-gray-700"
                      >
                        Test
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* API Keys */}
        <Card className="bg-white/50 backdrop-blur-xl border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
              <Key className="w-5 h-5 mr-2" />
              API Keys & Services
            </CardTitle>
            <CardDescription>Manage external service connections</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {apiKeys.map((key) => (
                <div key={key.id} className="p-4 rounded-xl bg-white/30 border border-white/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800">{key.name}</h3>
                      <p className="text-sm text-gray-600 capitalize">{key.service} Service</p>
                      <p className="text-xs text-gray-500 mt-1">Last used: {key.lastUsed}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-2">
                        {key.status === "active" ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                        )}
                        <span className="text-sm text-gray-600 capitalize">{key.status}</span>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => regenerateApiKey(key.id)}
                        variant="outline"
                        className="bg-white/50 border-white/20"
                      >
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Regenerate
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </GlassSidebar>
  )
}
