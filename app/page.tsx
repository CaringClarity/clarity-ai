"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Eye, EyeOff, Sparkles, Zap, Shield } from "lucide-react"
import { useRouter } from "next/navigation"
import { createClient } from "@supabase/supabase-js"
import Image from "next/image"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // TEMPORARY: For testing admin dashboard
      if (email === "admin@test.com" && password === "admin123") {
        const testUserData = {
          id: 1,
          email: "admin@test.com",
          role: "admin",
          active: true,
          first_name: "Admin",
          last_name: "User",
        }
        localStorage.setItem("user", JSON.stringify(testUserData))
        router.push("/admin")
        return
      }

      // Authenticate with Supabase
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        setError(authError.message)
        return
      }

      if (data.user) {
        // Check if user is active and get their role
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("id, email, role, active, first_name, last_name")
          .eq("email", email)
          .single()

        if (userError || !userData) {
          setError("User not found in system. Please contact your administrator.")
          await supabase.auth.signOut()
          return
        }

        if (!userData.active) {
          setError("Your account has been deactivated. Please contact your administrator.")
          await supabase.auth.signOut()
          return
        }

        // Store user info in localStorage for the session
        localStorage.setItem("user", JSON.stringify(userData))

        // Redirect based on role
        if (userData.role === "admin") {
          router.push("/admin")
        } else {
          router.push("/dashboard")
        }
      }
    } catch (err) {
      setError("Login failed. Please try again.")
      console.error("Login error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-radial from-white 90% via-purple-100 95% via-purple-200 98% to-purple-300">
      {/* Modern Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-100/40 to-blue-100/40 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-pink-100/40 to-purple-100/40 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-white/20 to-purple-50/30 rounded-full blur-3xl"></div>
      </div>

      {/* Modern Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(139,69,19,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(139,69,19,0.02)_1px,transparent_1px)] bg-[size:60px_60px]"></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 -mt-10">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-2">
            <div className="inline-block mb-0 drop-shadow-2xl">
              <Image
                src="/images/ccc-logo.png"
                alt="Caring Clarity Counseling"
                width={400}
                height={120}
                className="max-w-full h-auto drop-shadow-2xl"
                priority
              />
            </div>
            <p className="text-purple-600 text-lg font-semibold drop-shadow-xl -mt-28 tracking-wide">
              AI Voice Agent Platform
            </p>
          </div>

          {/* Modern Login Card */}
          <Card className="backdrop-blur-2xl bg-white/60 border border-white/60 shadow-2xl shadow-purple-200/60 drop-shadow-2xl rounded-2xl">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-3 tracking-tight drop-shadow-lg">Welcome Back</h2>
                <p className="text-gray-600 text-lg drop-shadow-md">Sign in to access your dashboard</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-gray-700 font-semibold text-sm tracking-wide drop-shadow-sm">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="bg-white/70 border-gray-200 text-gray-800 placeholder:text-gray-500 focus:border-purple-400 focus:ring-purple-300/30 h-12 shadow-lg drop-shadow-md rounded-xl transition-all duration-200"
                  />
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="password"
                    className="text-gray-700 font-semibold text-sm tracking-wide drop-shadow-sm"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      className="bg-white/70 border-gray-200 text-gray-800 placeholder:text-gray-500 focus:border-purple-400 focus:ring-purple-300/30 h-12 pr-12 shadow-lg drop-shadow-md rounded-xl transition-all duration-200"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-gray-100/50 text-gray-600 hover:text-gray-800 rounded-r-xl"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50/90 border border-red-200 rounded-xl p-4 backdrop-blur-sm shadow-lg drop-shadow-lg">
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold shadow-xl shadow-purple-300/50 drop-shadow-lg rounded-xl transition-all duration-200 hover:shadow-2xl hover:shadow-purple-300/60 hover:scale-[1.02]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Sign In
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-8 text-center">
                <div className="inline-flex items-center px-4 py-2 bg-blue-50/80 border border-blue-200 rounded-full backdrop-blur-sm shadow-lg drop-shadow-lg">
                  <Shield className="w-4 h-4 text-blue-600 mr-2" />
                  <span className="text-blue-700 text-sm font-medium">Contact admin for account access</span>
                </div>
              </div>

              {/* Preview Link */}
              <div className="mt-6 text-center">
                <a
                  href="/dashboard"
                  className="text-sm text-purple-600 hover:text-purple-700 underline underline-offset-4 font-medium transition-colors duration-200 drop-shadow-sm"
                >
                  Preview Admin Dashboard (No Login Required)
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Modern Features Preview */}
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-2xl bg-white/40 backdrop-blur-sm border border-white/50 shadow-xl shadow-purple-100/40 drop-shadow-lg hover:shadow-2xl hover:shadow-purple-100/50 transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-xl mx-auto mb-3 flex items-center justify-center shadow-xl drop-shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-gray-800 font-semibold text-sm mb-1 drop-shadow-sm">Real-time AI</h3>
              <p className="text-gray-600 text-xs drop-shadow-sm">Instant responses</p>
            </div>

            <div className="text-center p-4 rounded-2xl bg-white/40 backdrop-blur-sm border border-white/50 shadow-xl shadow-purple-100/40 drop-shadow-lg hover:shadow-2xl hover:shadow-purple-100/50 transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-teal-400 rounded-xl mx-auto mb-3 flex items-center justify-center shadow-xl drop-shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-gray-800 font-semibold text-sm mb-1 drop-shadow-sm">Multi-Channel</h3>
              <p className="text-gray-600 text-xs drop-shadow-sm">Voice, SMS, Web</p>
            </div>

            <div className="text-center p-4 rounded-2xl bg-white/40 backdrop-blur-sm border border-white/50 shadow-xl shadow-purple-100/40 drop-shadow-lg hover:shadow-2xl hover:shadow-purple-100/50 transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl mx-auto mb-3 flex items-center justify-center shadow-xl drop-shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-gray-800 font-semibold text-sm mb-1 drop-shadow-sm">Analytics</h3>
              <p className="text-gray-600 text-xs drop-shadow-sm">Deep insights</p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-gray-600 text-sm drop-shadow-sm">Powered by advanced AI technology</p>
          </div>
        </div>
      </div>
    </div>
  )
}
