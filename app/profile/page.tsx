"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  User,
  Bell,
  Shield,
  Mic,
  Eye,
  EyeOff,
  Save,
  ArrowLeft,
  Camera,
  Phone,
  Mail,
  Calendar,
  MapPin,
} from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  // Mock user data
  const [userData, setUserData] = useState({
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah@caringclarity.org",
    phone: "+1 (555) 123-4567",
    role: "Operator",
    department: "Crisis Support",
    joinDate: "March 15, 2023",
    location: "Remote",
    bio: "Dedicated crisis counselor with 5+ years of experience in mental health support and emergency response.",
  })

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    callNotifications: true,
    systemUpdates: true,
    weeklyReports: true,
  })

  const [voiceSettings, setVoiceSettings] = useState({
    preferredVoice: "aura-luna-en",
    speechRate: 1.0,
    volume: 0.8,
    autoRecord: true,
    noiseReduction: true,
  })

  return (
    <div className="min-h-screen bg-gradient-radial from-white 90% via-purple-100 95% via-purple-200 98% to-purple-300">
      {/* Modern Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-100/30 to-blue-100/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-pink-100/30 to-purple-100/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto p-6 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/dashboard">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 rounded-xl border-gray-200 bg-white/70 hover:bg-white/90 shadow-lg drop-shadow-md"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2 tracking-tight drop-shadow-xl">Profile Settings</h1>
              <p className="text-gray-600 text-lg drop-shadow-lg">Manage your account settings and preferences</p>
            </div>
            <Badge
              variant="secondary"
              className="bg-green-50 text-green-700 border border-green-200 px-4 py-2 rounded-full shadow-lg drop-shadow-lg"
            >
              Active User
            </Badge>
          </div>
        </div>

        {/* Profile Overview Card */}
        <Card className="bg-white/60 backdrop-blur-sm border border-white/60 shadow-xl shadow-purple-100/50 drop-shadow-xl rounded-2xl mb-8">
          <CardContent className="p-8">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center shadow-xl drop-shadow-lg">
                  <User className="h-12 w-12 text-white" />
                </div>
                <Button
                  size="sm"
                  className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-200"
                  variant="outline"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-800 mb-1 drop-shadow-md">
                  {userData.firstName} {userData.lastName}
                </h2>
                <p className="text-gray-600 mb-2 drop-shadow-sm">{userData.email}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Shield className="h-4 w-4" />
                    {userData.role}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Joined {userData.joinDate}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {userData.location}
                  </div>
                </div>
              </div>
              <Button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-xl shadow-xl drop-shadow-lg"
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Settings Tabs */}
        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/60 backdrop-blur-sm border border-white/60 rounded-2xl p-1 shadow-xl drop-shadow-lg">
            <TabsTrigger value="personal" className="rounded-xl font-semibold">
              Personal Info
            </TabsTrigger>
            <TabsTrigger value="security" className="rounded-xl font-semibold">
              Security
            </TabsTrigger>
            <TabsTrigger value="notifications" className="rounded-xl font-semibold">
              Notifications
            </TabsTrigger>
            <TabsTrigger value="voice" className="rounded-xl font-semibold">
              Voice Settings
            </TabsTrigger>
          </TabsList>

          {/* Personal Information Tab */}
          <TabsContent value="personal" className="space-y-6">
            <Card className="bg-white/60 backdrop-blur-sm border border-white/60 shadow-xl shadow-purple-100/50 drop-shadow-xl rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-800 drop-shadow-md">
                  <User className="h-6 w-6" />
                  Personal Information
                </CardTitle>
                <CardDescription className="text-gray-600 drop-shadow-sm">
                  Update your personal details and contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm font-semibold text-gray-700 tracking-wide drop-shadow-sm">
                      First Name
                    </Label>
                    <Input
                      value={userData.firstName}
                      onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
                      disabled={!isEditing}
                      className="mt-2 bg-white/70 border-gray-200 rounded-xl shadow-lg drop-shadow-md"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-gray-700 tracking-wide drop-shadow-sm">
                      Last Name
                    </Label>
                    <Input
                      value={userData.lastName}
                      onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
                      disabled={!isEditing}
                      className="mt-2 bg-white/70 border-gray-200 rounded-xl shadow-lg drop-shadow-md"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-gray-700 tracking-wide drop-shadow-sm">
                      Email Address
                    </Label>
                    <div className="relative mt-2">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        value={userData.email}
                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                        disabled={!isEditing}
                        className="pl-10 bg-white/70 border-gray-200 rounded-xl shadow-lg drop-shadow-md"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-gray-700 tracking-wide drop-shadow-sm">
                      Phone Number
                    </Label>
                    <div className="relative mt-2">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        value={userData.phone}
                        onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                        disabled={!isEditing}
                        className="pl-10 bg-white/70 border-gray-200 rounded-xl shadow-lg drop-shadow-md"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-gray-700 tracking-wide drop-shadow-sm">
                      Department
                    </Label>
                    <Input
                      value={userData.department}
                      onChange={(e) => setUserData({ ...userData, department: e.target.value })}
                      disabled={!isEditing}
                      className="mt-2 bg-white/70 border-gray-200 rounded-xl shadow-lg drop-shadow-md"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-gray-700 tracking-wide drop-shadow-sm">Location</Label>
                    <Input
                      value={userData.location}
                      onChange={(e) => setUserData({ ...userData, location: e.target.value })}
                      disabled={!isEditing}
                      className="mt-2 bg-white/70 border-gray-200 rounded-xl shadow-lg drop-shadow-md"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-semibold text-gray-700 tracking-wide drop-shadow-sm">Bio</Label>
                  <Textarea
                    value={userData.bio}
                    onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
                    disabled={!isEditing}
                    rows={4}
                    className="mt-2 bg-white/70 border-gray-200 rounded-xl shadow-lg drop-shadow-md resize-none"
                  />
                </div>
                {isEditing && (
                  <Button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-xl shadow-xl drop-shadow-lg">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card className="bg-white/60 backdrop-blur-sm border border-white/60 shadow-xl shadow-purple-100/50 drop-shadow-xl rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-800 drop-shadow-md">
                  <Shield className="h-6 w-6" />
                  Security Settings
                </CardTitle>
                <CardDescription className="text-gray-600 drop-shadow-sm">
                  Manage your password and security preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-sm font-semibold text-gray-700 tracking-wide drop-shadow-sm">
                    Current Password
                  </Label>
                  <div className="relative mt-2">
                    <Input
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder="Enter current password"
                      className="pr-10 bg-white/70 border-gray-200 rounded-xl shadow-lg drop-shadow-md"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-gray-100/50 rounded-r-xl"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-semibold text-gray-700 tracking-wide drop-shadow-sm">
                    New Password
                  </Label>
                  <div className="relative mt-2">
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      className="pr-10 bg-white/70 border-gray-200 rounded-xl shadow-lg drop-shadow-md"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-gray-100/50 rounded-r-xl"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-semibold text-gray-700 tracking-wide drop-shadow-sm">
                    Confirm New Password
                  </Label>
                  <div className="relative mt-2">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      className="pr-10 bg-white/70 border-gray-200 rounded-xl shadow-lg drop-shadow-md"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-gray-100/50 rounded-r-xl"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <Button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-xl shadow-xl drop-shadow-lg">
                  Update Password
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="bg-white/60 backdrop-blur-sm border border-white/60 shadow-xl shadow-purple-100/50 drop-shadow-xl rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-800 drop-shadow-md">
                  <Bell className="h-6 w-6" />
                  Notification Preferences
                </CardTitle>
                <CardDescription className="text-gray-600 drop-shadow-sm">
                  Choose how you want to receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(notifications).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between p-4 bg-white/70 rounded-xl border border-gray-200 shadow-lg drop-shadow-md"
                  >
                    <div>
                      <h4 className="font-semibold text-gray-800 drop-shadow-sm">
                        {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                      </h4>
                      <p className="text-sm text-gray-600 drop-shadow-sm">
                        {key === "emailAlerts" && "Receive important alerts via email"}
                        {key === "smsAlerts" && "Get urgent notifications via SMS"}
                        {key === "callNotifications" && "Notifications for incoming calls"}
                        {key === "systemUpdates" && "Updates about system maintenance"}
                        {key === "weeklyReports" && "Weekly performance summaries"}
                      </p>
                    </div>
                    <Switch
                      checked={value}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, [key]: checked })}
                    />
                  </div>
                ))}
                <Button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-xl shadow-xl drop-shadow-lg">
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Voice Settings Tab */}
          <TabsContent value="voice" className="space-y-6">
            <Card className="bg-white/60 backdrop-blur-sm border border-white/60 shadow-xl shadow-purple-100/50 drop-shadow-xl rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-800 drop-shadow-md">
                  <Mic className="h-6 w-6" />
                  Voice & Audio Settings
                </CardTitle>
                <CardDescription className="text-gray-600 drop-shadow-sm">
                  Configure your voice interaction preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-sm font-semibold text-gray-700 tracking-wide drop-shadow-sm">
                    Preferred Voice Model
                  </Label>
                  <select className="mt-2 w-full bg-white/70 border border-gray-200 rounded-xl p-3 shadow-lg drop-shadow-md">
                    <option value="aura-luna-en">Luna (Female, Warm)</option>
                    <option value="aura-stella-en">Stella (Female, Professional)</option>
                    <option value="aura-athena-en">Athena (Female, Confident)</option>
                    <option value="aura-hera-en">Hera (Female, Gentle)</option>
                  </select>
                </div>
                <div>
                  <Label className="text-sm font-semibold text-gray-700 tracking-wide drop-shadow-sm">
                    Speech Rate: {voiceSettings.speechRate}x
                  </Label>
                  <input
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.1"
                    value={voiceSettings.speechRate}
                    onChange={(e) =>
                      setVoiceSettings({ ...voiceSettings, speechRate: Number.parseFloat(e.target.value) })
                    }
                    className="mt-2 w-full"
                  />
                </div>
                <div>
                  <Label className="text-sm font-semibold text-gray-700 tracking-wide drop-shadow-sm">
                    Volume: {Math.round(voiceSettings.volume * 100)}%
                  </Label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={voiceSettings.volume}
                    onChange={(e) => setVoiceSettings({ ...voiceSettings, volume: Number.parseFloat(e.target.value) })}
                    className="mt-2 w-full"
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-white/70 rounded-xl border border-gray-200 shadow-lg drop-shadow-md">
                  <div>
                    <h4 className="font-semibold text-gray-800 drop-shadow-sm">Auto Record</h4>
                    <p className="text-sm text-gray-600 drop-shadow-sm">Automatically start recording when speaking</p>
                  </div>
                  <Switch
                    checked={voiceSettings.autoRecord}
                    onCheckedChange={(checked) => setVoiceSettings({ ...voiceSettings, autoRecord: checked })}
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-white/70 rounded-xl border border-gray-200 shadow-lg drop-shadow-md">
                  <div>
                    <h4 className="font-semibold text-gray-800 drop-shadow-sm">Noise Reduction</h4>
                    <p className="text-sm text-gray-600 drop-shadow-sm">Filter background noise during calls</p>
                  </div>
                  <Switch
                    checked={voiceSettings.noiseReduction}
                    onCheckedChange={(checked) => setVoiceSettings({ ...voiceSettings, noiseReduction: checked })}
                  />
                </div>
                <Button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-xl shadow-xl drop-shadow-lg">
                  Save Voice Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
