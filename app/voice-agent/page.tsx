"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Mic, MicOff, Volume2, VolumeX, Loader2, Phone, Settings, BarChart3 } from "lucide-react"
import { VoiceSelector, AVAILABLE_VOICES, type Voice } from "@/components/voice-selector"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { SidebarLayout } from "@/components/sidebar-layout"

type ConversationState = "idle" | "listening" | "processing" | "speaking"

export default function VoiceAgentPage() {
  const [state, setState] = useState<ConversationState>("idle")
  const [transcript, setTranscript] = useState("")
  const [response, setResponse] = useState("")
  const [isEnabled, setIsEnabled] = useState(false)
  const [error, setError] = useState("")
  const [conversationHistory, setConversationHistory] = useState<Array<{ role: string; content: string }>>([])
  const [showVoiceSelector, setShowVoiceSelector] = useState(false)
  const [selectedVoice, setSelectedVoice] = useState<Voice>(AVAILABLE_VOICES[0])
  const router = useRouter()

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const handleLogout = () => {
    router.push("/")
  }

  // Initialize microphone access
  const initializeMicrophone = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      })

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      })

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })
        audioChunksRef.current = []
        await processAudio(audioBlob)
      }

      mediaRecorderRef.current = mediaRecorder
      setIsEnabled(true)
      setError("")
    } catch (err) {
      setError("Microphone access denied. Please allow microphone access to use the voice agent.")
      console.error("Error accessing microphone:", err)
    }
  }, [])

  // Process recorded audio
  const processAudio = async (audioBlob: Blob) => {
    setState("processing")
    setTranscript("")
    setResponse("")

    try {
      // Convert speech to text using Deepgram
      const formData = new FormData()
      formData.append("audio", audioBlob)

      const sttResponse = await fetch("/api/speech-to-text", {
        method: "POST",
        body: formData,
      })

      if (!sttResponse.ok) {
        throw new Error("Speech recognition failed")
      }

      const { transcript: userText } = await sttResponse.json()
      setTranscript(userText)

      if (!userText.trim()) {
        setState("idle")
        return
      }

      // Generate AI response
      const aiResponse = await fetch("/api/generate-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          conversationHistory: conversationHistory,
        }),
      })

      if (!aiResponse.ok) {
        throw new Error("AI response generation failed")
      }

      const { response: aiText } = await aiResponse.json()
      setResponse(aiText)

      // Update conversation history
      const newHistory = [
        ...conversationHistory,
        { role: "user", content: userText },
        { role: "assistant", content: aiText },
      ]
      setConversationHistory(newHistory)

      // Convert text to speech using selected voice
      const ttsResponse = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: aiText,
          voiceModel: selectedVoice.model,
        }),
      })

      if (!ttsResponse.ok) {
        throw new Error("Speech synthesis failed")
      }

      const audioArrayBuffer = await ttsResponse.arrayBuffer()
      const audioBlobTTS = new Blob([audioArrayBuffer], { type: "audio/mpeg" })
      const audioUrl = URL.createObjectURL(audioBlobTTS)

      // Play the synthesized speech
      setState("speaking")
      const audio = new Audio(audioUrl)
      audioRef.current = audio

      audio.onended = () => {
        setState("idle")
        URL.revokeObjectURL(audioUrl)
      }

      audio.onerror = () => {
        setState("idle")
        setError("Error playing audio response")
        URL.revokeObjectURL(audioUrl)
      }

      await audio.play()
    } catch (err) {
      console.error("Error processing audio:", err)
      setError(err instanceof Error ? err.message : "An error occurred")
      setState("idle")
    }
  }

  // Start recording
  const startRecording = useCallback(() => {
    if (mediaRecorderRef.current && state === "idle") {
      setState("listening")
      setError("")
      mediaRecorderRef.current.start()
    }
  }, [state])

  // Stop recording
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && state === "listening") {
      mediaRecorderRef.current.stop()
    }
  }, [state])

  // Stop speaking
  const stopSpeaking = useCallback(() => {
    if (audioRef.current && state === "speaking") {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setState("idle")
    }
  }, [state])

  // Initialize on component mount
  useEffect(() => {
    initializeMicrophone()

    return () => {
      if (mediaRecorderRef.current?.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop())
      }
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [initializeMicrophone])

  const getStateIcon = () => {
    switch (state) {
      case "listening":
        return <Mic className="w-8 h-8 text-red-500 animate-pulse" />
      case "processing":
        return <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      case "speaking":
        return <Volume2 className="w-8 h-8 text-green-500 animate-pulse" />
      default:
        return <MicOff className="w-8 h-8 text-gray-400" />
    }
  }

  const getStateText = () => {
    switch (state) {
      case "listening":
        return "Listening..."
      case "processing":
        return "Processing..."
      case "speaking":
        return `${selectedVoice.name} is speaking...`
      default:
        return "Ready to listen"
    }
  }

  return (
    <SidebarLayout>
      <div className="p-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 min-h-[80vh] rounded-xl">
          <div className="w-full max-w-6xl grid lg:grid-cols-3 gap-6">
            {/* Main Voice Agent */}
            <div className="lg:col-span-2">
              <Card className="w-full">
                <CardContent className="p-8">
                  <div className="text-center space-y-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <Phone className="w-8 h-8 text-blue-600" />
                        <h1 className="text-3xl font-bold text-gray-900">Caring Clarity AI Assistant</h1>
                      </div>
                    </div>
                    <p className="text-gray-600">
                      Multi-channel AI voice agent • Currently using {selectedVoice.name} voice
                    </p>

                    {/* Status Display */}
                    <div className="flex flex-col items-center space-y-4">
                      <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center border-4 border-gray-200">
                        {getStateIcon()}
                      </div>
                      <p className="text-lg font-medium text-gray-700">{getStateText()}</p>
                    </div>

                    {/* Controls */}
                    <div className="flex justify-center space-x-4">
                      {state === "idle" && (
                        <>
                          <Button
                            onClick={startRecording}
                            disabled={!isEnabled}
                            size="lg"
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Mic className="w-5 h-5 mr-2" />
                            Start Talking
                          </Button>
                          <Button onClick={() => setShowVoiceSelector(!showVoiceSelector)} size="lg" variant="outline">
                            <Settings className="w-5 h-5 mr-2" />
                            Voice Settings
                          </Button>
                          <Link href="/dashboard">
                            <Button size="lg" variant="outline">
                              <BarChart3 className="w-5 h-5 mr-2" />
                              Dashboard
                            </Button>
                          </Link>
                        </>
                      )}

                      {state === "listening" && (
                        <Button onClick={stopRecording} size="lg" variant="destructive">
                          <MicOff className="w-5 h-5 mr-2" />
                          Stop Recording
                        </Button>
                      )}

                      {state === "speaking" && (
                        <Button onClick={stopSpeaking} size="lg" variant="outline">
                          <VolumeX className="w-5 h-5 mr-2" />
                          Stop Speaking
                        </Button>
                      )}
                    </div>

                    {/* Error Display */}
                    {error && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-700">{error}</p>
                        {!isEnabled && (
                          <Button onClick={initializeMicrophone} className="mt-2" variant="outline">
                            Retry Microphone Access
                          </Button>
                        )}
                      </div>
                    )}

                    {/* Conversation Display */}
                    <div className="space-y-4 text-left">
                      {/* Current Exchange */}
                      {(transcript || response) && (
                        <div className="space-y-4">
                          <h3 className="font-semibold text-gray-900">Current Exchange</h3>
                          {transcript && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                              <h4 className="font-semibold text-blue-900 mb-2">You said:</h4>
                              <p className="text-blue-800">{transcript}</p>
                            </div>
                          )}

                          {response && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                              <h4 className="font-semibold text-green-900 mb-2">{selectedVoice.name} responded:</h4>
                              <p className="text-green-800">{response}</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Conversation History */}
                      {conversationHistory.length > 0 && (
                        <div className="space-y-4">
                          <h3 className="font-semibold text-gray-900">Conversation History</h3>
                          <div className="max-h-96 overflow-y-auto space-y-2">
                            {conversationHistory.slice(-6).map((msg, index) => (
                              <div
                                key={index}
                                className={`p-3 rounded-lg text-sm ${
                                  msg.role === "user"
                                    ? "bg-blue-50 border border-blue-200"
                                    : "bg-green-50 border border-green-200"
                                }`}
                              >
                                <span className="font-medium">
                                  {msg.role === "user" ? "You: " : `${selectedVoice.name}: `}
                                </span>
                                {msg.content}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Features */}
                    <div className="grid md:grid-cols-3 gap-4 mt-8 text-sm">
                      <div className="bg-white p-4 rounded-lg border">
                        <h4 className="font-semibold text-gray-900 mb-2">🌐 Web Voice</h4>
                        <p className="text-gray-600">Direct browser-based voice interaction</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border">
                        <h4 className="font-semibold text-gray-900 mb-2">📞 Phone Calls</h4>
                        <p className="text-gray-600">Twilio-powered voice calls</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border">
                        <h4 className="font-semibold text-gray-900 mb-2">💬 SMS</h4>
                        <p className="text-gray-600">Text message support</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Voice Selector Sidebar */}
            <div className="lg:col-span-1">
              {showVoiceSelector && (
                <VoiceSelector
                  selectedVoice={selectedVoice}
                  onVoiceChange={setSelectedVoice}
                  className="sticky top-4"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  )
}
