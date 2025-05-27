"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Volume2, Play, Pause } from "lucide-react"

export interface Voice {
  id: string
  name: string
  description: string
  gender: string
  accent: string
  model: string
}

export const AVAILABLE_VOICES: Voice[] = [
  {
    id: "athena",
    name: "Athena",
    description: "Professional, clear American voice",
    gender: "Female",
    accent: "American",
    model: "aura-2-athena-en",
  },
  {
    id: "asteria",
    name: "Asteria",
    description: "Warm, professional voice",
    gender: "Female",
    accent: "American",
    model: "aura-asteria-en",
  },
  {
    id: "luna",
    name: "Luna",
    description: "Calm, soothing voice",
    gender: "Female",
    accent: "American",
    model: "aura-luna-en",
  },
  {
    id: "stella",
    name: "Stella",
    description: "Friendly, approachable voice",
    gender: "Female",
    accent: "American",
    model: "aura-stella-en",
  },
  {
    id: "arcas",
    name: "Arcas",
    description: "Professional, authoritative voice",
    gender: "Male",
    accent: "American",
    model: "aura-arcas-en",
  },
  {
    id: "perseus",
    name: "Perseus",
    description: "Warm, friendly voice",
    gender: "Male",
    accent: "American",
    model: "aura-perseus-en",
  },
  {
    id: "angus",
    name: "Angus",
    description: "Deep, reassuring voice",
    gender: "Male",
    accent: "American",
    model: "aura-angus-en",
  },
]

interface VoiceSelectorProps {
  selectedVoice: Voice
  onVoiceChange: (voice: Voice) => void
  className?: string
}

export function VoiceSelector({ selectedVoice, onVoiceChange, className }: VoiceSelectorProps) {
  const [playingVoice, setPlayingVoice] = useState<string | null>(null)
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null)

  const playVoicePreview = async (voice: Voice) => {
    try {
      // Stop any currently playing audio
      if (audioElement) {
        audioElement.pause()
        audioElement.currentTime = 0
      }

      setPlayingVoice(voice.id)

      // Generate a short preview with the selected voice
      const response = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `Hello, I'm ${voice.name}. I'm here to help you today.`,
          voiceModel: voice.model,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate voice preview")
      }

      const audioArrayBuffer = await response.arrayBuffer()
      const audioBlob = new Blob([audioArrayBuffer], { type: "audio/mpeg" })
      const audioUrl = URL.createObjectURL(audioBlob)

      const audio = new Audio(audioUrl)
      setAudioElement(audio)

      audio.onended = () => {
        setPlayingVoice(null)
        URL.revokeObjectURL(audioUrl)
      }

      audio.onerror = () => {
        setPlayingVoice(null)
        URL.revokeObjectURL(audioUrl)
      }

      await audio.play()
    } catch (error) {
      console.error("Error playing voice preview:", error)
      setPlayingVoice(null)
    }
  }

  const stopPreview = () => {
    if (audioElement) {
      audioElement.pause()
      audioElement.currentTime = 0
    }
    setPlayingVoice(null)
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Volume2 className="w-5 h-5" />
          <span>Voice Selection</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {AVAILABLE_VOICES.map((voice) => (
            <div
              key={voice.id}
              className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                selectedVoice.id === voice.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
              onClick={() => onVoiceChange(voice)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium">{voice.name}</h4>
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">{voice.gender}</span>
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">{voice.accent}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{voice.description}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    if (playingVoice === voice.id) {
                      stopPreview()
                    } else {
                      playVoicePreview(voice)
                    }
                  }}
                  disabled={playingVoice !== null && playingVoice !== voice.id}
                >
                  {playingVoice === voice.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
