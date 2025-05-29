"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "@/components/theme-provider"

interface WaveformVisualizationProps {
  isActive?: boolean
  intensity?: number
  className?: string
}

export function WaveformVisualization({
  isActive = false,
  intensity = 0.5,
  className = "",
}: WaveformVisualizationProps) {
  const { theme } = useTheme()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const [dimensions, setDimensions] = useState({ width: 800, height: 200 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * window.devicePixelRatio
      canvas.height = rect.height * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
      setDimensions({ width: rect.width, height: rect.height })
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    let time = 0
    const animate = () => {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height)

      const centerY = dimensions.height / 2
      const baseAmplitude = isActive ? 30 * intensity : 5

      // Main waveform
      ctx.beginPath()
      ctx.strokeStyle =
        theme === "dark"
          ? "rgba(59, 130, 246, 0.8)" // Blue for dark theme
          : "rgba(37, 99, 235, 0.8)" // Darker blue for light theme
      ctx.lineWidth = 2
      ctx.shadowColor = theme === "dark" ? "rgba(59, 130, 246, 0.3)" : "rgba(37, 99, 235, 0.2)"
      ctx.shadowBlur = 8

      for (let x = 0; x < dimensions.width; x += 2) {
        const frequency1 = 0.02
        const frequency2 = 0.05
        const frequency3 = 0.01

        const wave1 = Math.sin(x * frequency1 + time * 0.02) * baseAmplitude
        const wave2 = Math.sin(x * frequency2 + time * 0.03) * (baseAmplitude * 0.5)
        const wave3 = Math.sin(x * frequency3 + time * 0.01) * (baseAmplitude * 0.3)

        const y = centerY + wave1 + wave2 + wave3

        if (x === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      ctx.stroke()

      // Flowing particles when active
      if (isActive) {
        for (let i = 0; i < 15; i++) {
          const x = (time * 2 + i * 50) % dimensions.width
          const y = centerY + Math.sin(x * 0.02 + time * 0.02) * baseAmplitude

          ctx.beginPath()
          ctx.arc(x, y, 1.5, 0, Math.PI * 2)
          ctx.fillStyle =
            theme === "dark" ? `rgba(59, 130, 246, ${0.7 - i / 25})` : `rgba(37, 99, 235, ${0.6 - i / 25})`
          ctx.shadowColor = theme === "dark" ? "rgba(59, 130, 246, 0.5)" : "rgba(37, 99, 235, 0.4)"
          ctx.shadowBlur = 4
          ctx.fill()
        }
      }

      time += 1
      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isActive, intensity, dimensions.width, dimensions.height, theme])

  return <canvas ref={canvasRef} className={`w-full h-full ${className}`} style={{ background: "transparent" }} />
}
