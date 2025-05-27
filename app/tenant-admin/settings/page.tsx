"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2, Phone, Shield, Bell, CreditCard, Database, Save, Upload, Key, Webhook } from "lucide-react"
import { GlassSidebar } from "@/components/glass-sidebar"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("business")

  // Mock settings data
  const [businessSettings, setBusinessSettings] = useState({
    businessName: "Caring Clarity Counseling",
    businessType: "Mental Health Practice",
    address: "123 Wellness Drive, Suite 200",
    city: "San Francisco",
    state: "CA",
    zipCode: "94102",
    phone: "(555) 123-4567",
    email: "info@caringclarity.com",
    website: "https://caringclarity.com",
    description: "Providing compassionate mental health services to our community.",
    logo: null,
  })

  const [integrationSettings, setIntegrationSettings] = useState({
    twilioAccountSid: "AC1234567890abcdef",
    twilioAuthToken: "••••••••••••••••",
    twilioPhoneNumber: "+15551234567",
    deepgramApiKey: "••••••••••••••••",
    groqApiKey: "••••••••••••••••",
    supabaseUrl: "https://your-project.supabase.co",
    supabaseKey: "••••••••••••••••",
    webhookUrl: "https://your-app.vercel.app/api/webhooks",
    webhookSecret: "••••••••••••••••",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    emergencyAlerts: true,
    dailyReports: true,
    weeklyReports: true,
    systemUpdates: false,
    marketingEmails: false,
  })

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    sessionTimeout: "30",
    passwordExpiry: "90",
    ipWhitelist: "",
    auditLogs: true,
    dataRetention: "365",
  })

  const tabs = [
    { id: "business", label: "Business Info", icon: Building2 },
    { id: "integrations", label: "Integrations", icon: Database },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "billing", label: "Billing", icon: CreditCard },
  ]

  const handleSave = (section) => {
    console.log(`Saving ${section} settings...`)
    // Save logic here
  }

  return (
    <GlassSidebar userRole="tenant-admin" userName="Dr. Sarah Mitchell">
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="animate-fade-in">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Business Settings</h1>
            <p className="text-gray-600 text-lg">Configure your practice and system preferences</p>
          </div>
        </div>

        {/* Settings Navigation */}
        <Card className="bg-white/50 backdrop-blur-xl border-white/20 shadow-xl animate-fade-in">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-soft-blue to-soft-purple text-white"
                      : "hover:bg-white/30"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Business Information */}
        {activeTab === "business" && (
          <Card className="bg-white/50 backdrop-blur-xl border-white/20 shadow-xl animate-fade-in">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
                <Building2 className="w-5 h-5 mr-2" />
                Business Information
              </CardTitle>
              <CardDescription className="text-gray-600">
                Update your practice details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Business Name</label>
                  <Input
                    value={businessSettings.businessName}
                    onChange={(e) => setBusinessSettings({ ...businessSettings, businessName: e.target.value })}
                    className="bg-white/50 border-white/20"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Business Type</label>
                  <Select value={businessSettings.businessType}>
                    <SelectTrigger className="bg-white/50 border-white/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mental Health Practice">Mental Health Practice</SelectItem>
                      <SelectItem value="Medical Practice">Medical Practice</SelectItem>
                      <SelectItem value="Dental Practice">Dental Practice</SelectItem>
                      <SelectItem value="Legal Firm">Legal Firm</SelectItem>
                      <SelectItem value="Real Estate">Real Estate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Address</label>
                <Input
                  value={businessSettings.address}
                  onChange={(e) => setBusinessSettings({ ...businessSettings, address: e.target.value })}
                  className="bg-white/50 border-white/20"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">City</label>
                  <Input
                    value={businessSettings.city}
                    onChange={(e) => setBusinessSettings({ ...businessSettings, city: e.target.value })}
                    className="bg-white/50 border-white/20"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">State</label>
                  <Input
                    value={businessSettings.state}
                    onChange={(e) => setBusinessSettings({ ...businessSettings, state: e.target.value })}
                    className="bg-white/50 border-white/20"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">ZIP Code</label>
                  <Input
                    value={businessSettings.zipCode}
                    onChange={(e) => setBusinessSettings({ ...businessSettings, zipCode: e.target.value })}
                    className="bg-white/50 border-white/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Phone</label>
                  <Input
                    value={businessSettings.phone}
                    onChange={(e) => setBusinessSettings({ ...businessSettings, phone: e.target.value })}
                    className="bg-white/50 border-white/20"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Email</label>
                  <Input
                    value={businessSettings.email}
                    onChange={(e) => setBusinessSettings({ ...businessSettings, email: e.target.value })}
                    className="bg-white/50 border-white/20"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Website</label>
                <Input
                  value={businessSettings.website}
                  onChange={(e) => setBusinessSettings({ ...businessSettings, website: e.target.value })}
                  className="bg-white/50 border-white/20"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Description</label>
                <Textarea
                  value={businessSettings.description}
                  onChange={(e) => setBusinessSettings({ ...businessSettings, description: e.target.value })}
                  className="bg-white/50 border-white/20"
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Business Logo</label>

                {/* Logo Preview */}
                {businessSettings.logo && (
                  <div className="mb-4 p-4 bg-white/30 rounded-xl">
                    <p className="text-sm font-medium text-gray-700 mb-3">Logo Preview:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Sidebar Preview */}
                      <div className="bg-white/50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600 mb-2">In Dashboard Sidebar:</p>
                        <div className="flex items-center space-x-2">
                          <img
                            src={businessSettings.logo || "/placeholder.svg"}
                            alt="Logo Preview"
                            className="w-8 h-8 rounded-lg object-cover"
                          />
                          <div>
                            <p className="text-sm font-semibold">Business Admin</p>
                            <p className="text-xs text-gray-600">Caring Clarity</p>
                          </div>
                        </div>
                      </div>

                      {/* Customer Interface Preview */}
                      <div className="bg-white/50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600 mb-2">Customer Interface:</p>
                        <div className="text-center">
                          <img
                            src={businessSettings.logo || "/placeholder.svg"}
                            alt="Logo Preview"
                            className="w-12 h-12 mx-auto rounded-lg object-cover mb-1"
                          />
                          <p className="text-xs font-medium">Caring Clarity</p>
                          <p className="text-xs text-gray-600">AI Assistant</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    className="border-white/20 hover:bg-white/30"
                    onClick={() => {
                      // Simulate file upload
                      const mockLogoUrl = "/placeholder.svg?height=100&width=100&text=Logo"
                      setBusinessSettings({ ...businessSettings, logo: mockLogoUrl })
                    }}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Logo
                  </Button>
                  <span className="text-sm text-gray-600">PNG, JPG up to 2MB</span>
                  {businessSettings.logo && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setBusinessSettings({ ...businessSettings, logo: null })}
                      className="text-red-600 hover:bg-red-50"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>

              <Button
                onClick={() => handleSave("business")}
                className="bg-gradient-to-r from-soft-blue to-soft-purple text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Business Settings
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Integrations */}
        {activeTab === "integrations" && (
          <Card className="bg-white/50 backdrop-blur-xl border-white/20 shadow-xl animate-fade-in">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
                <Database className="w-5 h-5 mr-2" />
                API Integrations
              </CardTitle>
              <CardDescription className="text-gray-600">Configure third-party service connections</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Twilio Settings */}
              <div className="p-6 bg-white/30 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Phone className="w-5 h-5 mr-2" />
                  Twilio Voice & SMS
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Account SID</label>
                    <Input
                      value={integrationSettings.twilioAccountSid}
                      onChange={(e) =>
                        setIntegrationSettings({ ...integrationSettings, twilioAccountSid: e.target.value })
                      }
                      className="bg-white/50 border-white/20"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Auth Token</label>
                    <Input
                      type="password"
                      value={integrationSettings.twilioAuthToken}
                      onChange={(e) =>
                        setIntegrationSettings({ ...integrationSettings, twilioAuthToken: e.target.value })
                      }
                      className="bg-white/50 border-white/20"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Phone Number</label>
                    <Input
                      value={integrationSettings.twilioPhoneNumber}
                      onChange={(e) =>
                        setIntegrationSettings({ ...integrationSettings, twilioPhoneNumber: e.target.value })
                      }
                      className="bg-white/50 border-white/20"
                    />
                  </div>
                </div>
              </div>

              {/* AI Services */}
              <div className="p-6 bg-white/30 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Key className="w-5 h-5 mr-2" />
                  AI Services
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Deepgram API Key</label>
                    <Input
                      type="password"
                      value={integrationSettings.deepgramApiKey}
                      onChange={(e) =>
                        setIntegrationSettings({ ...integrationSettings, deepgramApiKey: e.target.value })
                      }
                      className="bg-white/50 border-white/20"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Groq API Key</label>
                    <Input
                      type="password"
                      value={integrationSettings.groqApiKey}
                      onChange={(e) => setIntegrationSettings({ ...integrationSettings, groqApiKey: e.target.value })}
                      className="bg-white/50 border-white/20"
                    />
                  </div>
                </div>
              </div>

              {/* Database */}
              <div className="p-6 bg-white/30 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Database className="w-5 h-5 mr-2" />
                  Database & Storage
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Supabase URL</label>
                    <Input
                      value={integrationSettings.supabaseUrl}
                      onChange={(e) => setIntegrationSettings({ ...integrationSettings, supabaseUrl: e.target.value })}
                      className="bg-white/50 border-white/20"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Supabase Key</label>
                    <Input
                      type="password"
                      value={integrationSettings.supabaseKey}
                      onChange={(e) => setIntegrationSettings({ ...integrationSettings, supabaseKey: e.target.value })}
                      className="bg-white/50 border-white/20"
                    />
                  </div>
                </div>
              </div>

              {/* Webhooks */}
              <div className="p-6 bg-white/30 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Webhook className="w-5 h-5 mr-2" />
                  Webhooks
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Webhook URL</label>
                    <Input
                      value={integrationSettings.webhookUrl}
                      onChange={(e) => setIntegrationSettings({ ...integrationSettings, webhookUrl: e.target.value })}
                      className="bg-white/50 border-white/20"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Webhook Secret</label>
                    <Input
                      type="password"
                      value={integrationSettings.webhookSecret}
                      onChange={(e) =>
                        setIntegrationSettings({ ...integrationSettings, webhookSecret: e.target.value })
                      }
                      className="bg-white/50 border-white/20"
                    />
                  </div>
                </div>
              </div>

              <Button
                onClick={() => handleSave("integrations")}
                className="bg-gradient-to-r from-soft-blue to-soft-purple text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Integration Settings
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Notifications */}
        {activeTab === "notifications" && (
          <Card className="bg-white/50 backdrop-blur-xl border-white/20 shadow-xl animate-fade-in">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Notification Preferences
              </CardTitle>
              <CardDescription className="text-gray-600">
                Choose how you want to receive updates and alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(notificationSettings).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-4 bg-white/30 rounded-xl">
                  <div>
                    <h3 className="font-medium text-gray-800 capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</h3>
                    <p className="text-sm text-gray-600">
                      {key === "emailNotifications" && "Receive notifications via email"}
                      {key === "smsNotifications" && "Receive notifications via SMS"}
                      {key === "emergencyAlerts" && "Immediate alerts for crisis situations"}
                      {key === "dailyReports" && "Daily summary of activities"}
                      {key === "weeklyReports" && "Weekly performance reports"}
                      {key === "systemUpdates" && "Platform updates and maintenance notices"}
                      {key === "marketingEmails" && "Product updates and feature announcements"}
                    </p>
                  </div>
                  <Switch
                    checked={value}
                    onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, [key]: checked })}
                  />
                </div>
              ))}

              <Button
                onClick={() => handleSave("notifications")}
                className="bg-gradient-to-r from-soft-blue to-soft-purple text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Security */}
        {activeTab === "security" && (
          <Card className="bg-white/50 backdrop-blur-xl border-white/20 shadow-xl animate-fade-in">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Security Settings
              </CardTitle>
              <CardDescription className="text-gray-600">
                Configure security and access control settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-white/30 rounded-xl">
                <div>
                  <h3 className="font-medium text-gray-800">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                </div>
                <Switch
                  checked={securitySettings.twoFactorAuth}
                  onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, twoFactorAuth: checked })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Session Timeout (minutes)</label>
                  <Select
                    value={securitySettings.sessionTimeout}
                    onValueChange={(value) => setSecuritySettings({ ...securitySettings, sessionTimeout: value })}
                  >
                    <SelectTrigger className="bg-white/50 border-white/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Password Expiry (days)</label>
                  <Select
                    value={securitySettings.passwordExpiry}
                    onValueChange={(value) => setSecuritySettings({ ...securitySettings, passwordExpiry: value })}
                  >
                    <SelectTrigger className="bg-white/50 border-white/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="60">60 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">IP Whitelist</label>
                <Textarea
                  value={securitySettings.ipWhitelist}
                  onChange={(e) => setSecuritySettings({ ...securitySettings, ipWhitelist: e.target.value })}
                  className="bg-white/50 border-white/20"
                  placeholder="Enter IP addresses separated by commas"
                  rows={3}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-white/30 rounded-xl">
                <div>
                  <h3 className="font-medium text-gray-800">Audit Logs</h3>
                  <p className="text-sm text-gray-600">Keep detailed logs of all system activities</p>
                </div>
                <Switch
                  checked={securitySettings.auditLogs}
                  onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, auditLogs: checked })}
                />
              </div>

              <Button
                onClick={() => handleSave("security")}
                className="bg-gradient-to-r from-soft-blue to-soft-purple text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Security Settings
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Billing */}
        {activeTab === "billing" && (
          <Card className="bg-white/50 backdrop-blur-xl border-white/20 shadow-xl animate-fade-in">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Billing & Subscription
              </CardTitle>
              <CardDescription className="text-gray-600">
                Manage your subscription and billing information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-6 bg-white/30 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Current Plan</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-800">Professional Plan</p>
                    <p className="text-gray-600">$99/month • Billed monthly</p>
                    <p className="text-sm text-gray-500">Next billing date: February 26, 2024</p>
                  </div>
                  <Button variant="outline" className="border-white/20 hover:bg-white/30">
                    Change Plan
                  </Button>
                </div>
              </div>

              <div className="p-6 bg-white/30 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Usage This Month</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-800">1,247</p>
                    <p className="text-sm text-gray-600">Voice Minutes</p>
                    <p className="text-xs text-gray-500">of 5,000 included</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-800">892</p>
                    <p className="text-sm text-gray-600">SMS Messages</p>
                    <p className="text-xs text-gray-500">of 2,000 included</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-800">156</p>
                    <p className="text-sm text-gray-600">AI Interactions</p>
                    <p className="text-xs text-gray-500">of unlimited</p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white/30 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Method</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">VISA</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">•••• •••• •••• 4242</p>
                      <p className="text-sm text-gray-600">Expires 12/25</p>
                    </div>
                  </div>
                  <Button variant="outline" className="border-white/20 hover:bg-white/30">
                    Update
                  </Button>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button className="bg-gradient-to-r from-soft-blue to-soft-purple text-white">
                  <CreditCard className="w-4 h-4 mr-2" />
                  View Billing History
                </Button>
                <Button variant="outline" className="border-white/20 hover:bg-white/30">
                  Download Invoice
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </GlassSidebar>
  )
}
