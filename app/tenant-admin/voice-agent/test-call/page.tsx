"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Phone,
  PhoneCall,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  RotateCcw,
  Download,
  Clock,
  MessageSquare,
} from "lucide-react"
import { GlassSidebar } from "@/components/glass-sidebar"

export default function TestCallPage() {
  const [callStatus, setCallStatus] = useState("idle") // idle, connecting, active, ended
  const [isMuted, setIsMuted] = useState(false)
  const [isSpeakerOn, setIsSpeakerOn] = useState(true)
  const [callDuration, setCallDuration] = useState(0)
  const [testPhoneNumber, setTestPhoneNumber] = useState("+1234567890")
  const [conversation, setConversation] = useState([])
  const [isRecording, setIsRecording] = useState(false)

  const intervalRef = useRef(null)

  // Simulate call timer
  useEffect(() => {
    if (callStatus === "active") {
      intervalRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1)
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [callStatus])

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const startTestCall = () => {
    setCallStatus("connecting")
    setCallDuration(0)
    setConversation([])

    // Simulate connection
    setTimeout(() => {
      setCallStatus("active")
      setIsRecording(true)
      // Add initial greeting
      setConversation([
        {
          id: 1,
          speaker: "agent",
          message: "Hello! I'm Clara, your AI assistant at Caring Clarity. How can I help you today?",
          timestamp: new Date(),
        },
      ])
    }, 2000)
  }

  const endTestCall = () => {
    setCallStatus("ended")
    setIsRecording(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  const resetTest = () => {
    setCallStatus("idle")
    setCallDuration(0)
    setConversation([])
    setIsRecording(false)
  }

  const simulateUserResponse = () => {
    const responses = [
      "Hi, I'd like to schedule an appointment",
      "I'm having trouble with my account",
      "Can you tell me your hours?",
      "I need to speak with someone about billing",
      "What services do you offer?",
    ]

    const userMessage = responses[Math.floor(Math.random() * responses.length)]
    const newConversation = [
      ...conversation,
      {
        id: conversation.length + 1,
        speaker: "user",
        message: userMessage,
        timestamp: new Date(),
      },
    ]

    setConversation(newConversation)

    // Simulate AI response
    setTimeout(() => {
      const agentResponses = [
        "I'd be happy to help you schedule an appointment. What type of service are you looking for?",
        "I can help you with your account. Can you please provide your name or account number?",
        "Our office hours are Monday through Friday, 9 AM to 5 PM. Is there a specific day you'd prefer?",
        "I can connect you with our billing department. Let me transfer you to the right person.",
        "We offer a variety of mental health services including individual therapy, couples counseling, and group sessions.",
      ]

      setConversation((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          speaker: "agent",
          message: agentResponses[Math.floor(Math.random() * agentResponses.length)],
          timestamp: new Date(),
        },
      ])
    }, 1500)
  }

  return (
    <GlassSidebar userRole="tenant-admin" userName="Dr. Sarah Mitchell">
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="animate-fade-in">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Test Call Interface</h1>
            <p className="text-gray-600 text-lg">Test your AI voice agent with simulated calls</p>
          </div>
          <Button onClick={() => window.history.back()} variant="outline" className="bg-white/50 border-white/20">
            Back to Configuration
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Call Controls */}
          <Card className="bg-white/50 backdrop-blur-xl border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
                <Phone className="w-5 h-5 mr-2" />
                Call Controls
              </CardTitle>
              <CardDescription>Simulate and control test calls</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Phone Number Input */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Test Phone Number</label>
                <Input
                  value={testPhoneNumber}
                  onChange={(e) => setTestPhoneNumber(e.target.value)}
                  className="bg-white/50 border-white/20"
                  placeholder="+1234567890"
                  disabled={callStatus !== "idle"}
                />
              </div>

              {/* Call Status */}
              <div className="text-center p-6 rounded-xl bg-white/30">
                <div className="mb-4">
                  <div
                    className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center ${
                      callStatus === "active"
                        ? "bg-green-500 animate-pulse"
                        : callStatus === "connecting"
                          ? "bg-yellow-500 animate-pulse"
                          : callStatus === "ended"
                            ? "bg-red-500"
                            : "bg-gray-400"
                    }`}
                  >
                    {callStatus === "active" || callStatus === "connecting" ? (
                      <PhoneCall className="w-8 h-8 text-white" />
                    ) : (
                      <Phone className="w-8 h-8 text-white" />
                    )}
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {callStatus === "idle" && "Ready to Test"}
                  {callStatus === "connecting" && "Connecting..."}
                  {callStatus === "active" && "Call Active"}
                  {callStatus === "ended" && "Call Ended"}
                </h3>

                {callStatus === "active" && (
                  <div className="flex items-center justify-center space-x-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{formatDuration(callDuration)}</span>
                  </div>
                )}
              </div>

              {/* Call Actions */}
              <div className="flex justify-center space-x-4">
                {callStatus === "idle" && (
                  <Button
                    onClick={startTestCall}
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8"
                  >
                    <PhoneCall className="w-4 h-4 mr-2" />
                    Start Test Call
                  </Button>
                )}

                {callStatus === "active" && (
                  <>
                    <Button onClick={endTestCall} className="bg-gradient-to-r from-red-500 to-red-600 text-white px-8">
                      <PhoneOff className="w-4 h-4 mr-2" />
                      End Call
                    </Button>
                    <Button
                      onClick={simulateUserResponse}
                      className="bg-gradient-to-r from-soft-blue to-soft-purple text-white"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Simulate Response
                    </Button>
                  </>
                )}

                {(callStatus === "ended" || callStatus === "connecting") && (
                  <Button onClick={resetTest} className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-8">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                )}
              </div>

              {/* Audio Controls */}
              {callStatus === "active" && (
                <div className="flex justify-center space-x-4 pt-4 border-t border-white/20">
                  <Button
                    onClick={() => setIsMuted(!isMuted)}
                    variant="outline"
                    className={`${isMuted ? "bg-red-100 border-red-300" : "bg-white/50 border-white/20"}`}
                  >
                    {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </Button>
                  <Button
                    onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                    variant="outline"
                    className={`${!isSpeakerOn ? "bg-red-100 border-red-300" : "bg-white/50 border-white/20"}`}
                  >
                    {isSpeakerOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Conversation Log */}
          <Card className="bg-white/50 backdrop-blur-xl border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                Conversation Log
              </CardTitle>
              <CardDescription>Real-time conversation transcript</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {conversation.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Start a test call to see the conversation</p>
                  </div>
                ) : (
                  conversation.map((message) => (
                    <div
                      key={message.id}
                      className={`p-4 rounded-xl ${
                        message.speaker === "agent"
                          ? "bg-soft-blue/20 border-l-4 border-soft-blue"
                          : "bg-soft-mint/20 border-l-4 border-soft-mint"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-800 capitalize">
                          {message.speaker === "agent" ? "AI Agent" : "Test User"}
                        </span>
                        <span className="text-xs text-gray-500">{message.timestamp.toLocaleTimeString()}</span>
                      </div>
                      <p className="text-gray-700">{message.message}</p>
                    </div>
                  ))
                )}
              </div>

              {conversation.length > 0 && (
                <div className="pt-4 border-t border-white/20">
                  <Button className="w-full bg-gradient-to-r from-soft-purple to-soft-pink text-white">
                    <Download className="w-4 h-4 mr-2" />
                    Download Transcript
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Test Results */}
        {callStatus === "ended" && (
          <Card className="bg-white/50 backdrop-blur-xl border-white/20 shadow-xl animate-fade-in">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800">Test Results</CardTitle>
              <CardDescription>Analysis of the test call performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center p-4 rounded-xl bg-white/30">
                  <h3 className="text-2xl font-bold text-gray-800">{formatDuration(callDuration)}</h3>
                  <p className="text-sm text-gray-600">Call Duration</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-white/30">
                  <h3 className="text-2xl font-bold text-gray-800">{conversation.length}</h3>
                  <p className="text-sm text-gray-600">Total Messages</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-white/30">
                  <h3 className="text-2xl font-bold text-gray-800">1.2s</h3>
                  <p className="text-sm text-gray-600">Avg Response Time</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-white/30">
                  <h3 className="text-2xl font-bold text-green-600">✓</h3>
                  <p className="text-sm text-gray-600">Test Passed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </GlassSidebar>
  )
}
