"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Mic, MicOff, Volume2, VolumeX, Settings, Power } from "lucide-react"

interface ControlPanelProps {
  onMicToggle: (enabled: boolean) => void
  onVolumeChange: (volume: number) => void
  onSystemToggle: (enabled: boolean) => void
  className?: string
}

export function ControlPanel({ onMicToggle, onVolumeChange, onSystemToggle, className = "" }: ControlPanelProps) {
  const [micEnabled, setMicEnabled] = useState(true)
  const [volume, setVolume] = useState([75])
  const [systemEnabled, setSystemEnabled] = useState(true)
  const [autoResponse, setAutoResponse] = useState(true)
  const [crisisDetection, setCrisisDetection] = useState(true)

  const handleMicToggle = () => {
    const newState = !micEnabled
    setMicEnabled(newState)
    onMicToggle(newState)
  }

  const handleVolumeChange = (newVolume: number[]) => {
    setVolume(newVolume)
    onVolumeChange(newVolume[0])
  }

  const handleSystemToggle = () => {
    const newState = !systemEnabled
    setSystemEnabled(newState)
    onSystemToggle(newState)
  }

  return (
    <Card className={`bg-black/40 border-amber-500/20 backdrop-blur-sm ${className}`}>
      <div className="p-4">
        <h3 className="text-amber-400 font-mono text-sm mb-4 tracking-wider uppercase">System Controls</h3>

        <div className="space-y-6">
          {/* Main Controls */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant={micEnabled ? "default" : "outline"}
              size="sm"
              onClick={handleMicToggle}
              className={`${
                micEnabled
                  ? "bg-amber-500 hover:bg-amber-600 text-black"
                  : "border-amber-500/50 text-amber-400 hover:bg-amber-500/10"
              } transition-all duration-200`}
            >
              {micEnabled ? <Mic className="w-4 h-4 mr-2" /> : <MicOff className="w-4 h-4 mr-2" />}
              {micEnabled ? "ON" : "OFF"}
            </Button>

            <Button
              variant={systemEnabled ? "default" : "outline"}
              size="sm"
              onClick={handleSystemToggle}
              className={`${
                systemEnabled
                  ? "bg-green-500 hover:bg-green-600 text-black"
                  : "border-red-500/50 text-red-400 hover:bg-red-500/10"
              } transition-all duration-200`}
            >
              <Power className="w-4 h-4 mr-2" />
              {systemEnabled ? "ACTIVE" : "STANDBY"}
            </Button>
          </div>

          {/* Volume Control */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm font-mono">Volume</span>
              <span className="text-amber-400 text-sm font-mono">{volume[0]}%</span>
            </div>
            <div className="flex items-center space-x-3">
              <VolumeX className="w-4 h-4 text-gray-500" />
              <Slider value={volume} onValueChange={handleVolumeChange} max={100} step={1} className="flex-1" />
              <Volume2 className="w-4 h-4 text-gray-500" />
            </div>
          </div>

          {/* Feature Toggles */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm font-mono">Auto Response</span>
              <Switch
                checked={autoResponse}
                onCheckedChange={setAutoResponse}
                className="data-[state=checked]:bg-amber-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm font-mono">Crisis Detection</span>
              <Switch
                checked={crisisDetection}
                onCheckedChange={setCrisisDetection}
                className="data-[state=checked]:bg-red-500"
              />
            </div>
          </div>

          {/* Settings Button */}
          <Button
            variant="outline"
            size="sm"
            className="w-full border-amber-500/50 text-amber-400 hover:bg-amber-500/10"
          >
            <Settings className="w-4 h-4 mr-2" />
            Advanced Settings
          </Button>
        </div>
      </div>
    </Card>
  )
}
