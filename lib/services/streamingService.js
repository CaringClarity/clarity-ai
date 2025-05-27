/**
 * Enhanced Bidirectional Streaming Manager for Clara Voice Assistant
 * MIGRATED: From ElevenLabs to Deepgram TTS, OpenAI to Groq
 * INTEGRATED: With multi-tenant database and Next.js API routes
 */
import { createClient } from "@deepgram/sdk"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"

const supabase = createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

// Store streaming sessions
const streamingSessions = new Map()
const pendingMediaEvents = new Map()
const sessionCreationStatus = new Map()
const callSidToSessionMap = new Map()

// Configuration constants
const PROCESSING_INTERVAL_MS = 1200
const MIN_BUFFER_SIZE = 5
const MIN_AUDIO_BYTES = 800
const SILENCE_THRESHOLD = 160
const STOP_DELAY_MS = 15000
const MAX_RETRIES = 3
const RETRY_DELAY_MS = 500
const MIN_RESPONSE_INTERVAL_MS = 3000
const INACTIVITY_TIMEOUT_MS = 60000
const RECOVERY_WINDOW_MS = 10000
const MEDIA_BUFFER_LIMIT = 500

/**
 * Initialize WebSocket server for Next.js
 */
export function initWebSocketServer(server) {
  try {
    const { WebSocketServer } = require("ws")
    const wss = new WebSocketServer({
      noServer: true,
      maxPayload: 65536,
    })

    console.log("WebSocket server initialized")

    // Handle upgrade requests
    server.on("upgrade", (request, socket, head) => {
      const pathname = request.url.split("?")[0]

      if (pathname.startsWith("/api/websocket")) {
        console.log(`WebSocket upgrade request: ${pathname}`)

        wss.handleUpgrade(request, socket, head, (ws) => {
          wss.emit("connection", ws, request)
        })
      } else {
        socket.destroy()
      }
    })

    // Handle new connections
    wss.on("connection", (ws, req) => {
      console.log("New WebSocket connection established")

      // Extract sessionId from path
      let sessionId = null
      const pathMatch = req.url.match(/\/session\/(session-[A-Za-z0-9]+-\d+)/)
      if (pathMatch && pathMatch[1]) {
        sessionId = pathMatch[1]
        ws.sessionId = sessionId
        console.log(`✅ WebSocket connected with sessionId: ${sessionId}`)

        // Extract callSid from sessionId
        const parts = sessionId.split("-")
        if (parts.length >= 3) {
          const callSid = parts[1]
          ws.callSid = callSid
          callSidToSessionMap.set(callSid, sessionId)
        }
      }

      ws.isAlive = true

      // Handle messages
      ws.on("message", async (message) => {
        try {
          const data = JSON.parse(message)

          if (data.event === "start") {
            await handleStartEvent(ws, data)
          } else if (data.event === "media") {
            await handleMediaEvent(ws, data)
          } else if (data.event === "stop") {
            handleStopEvent(ws, data)
          }
        } catch (error) {
          console.error("Error handling WebSocket message:", error)
        }
      })

      // Handle connection close
      ws.on("close", () => {
        console.log(`WebSocket disconnected for ${ws.sessionId}`)
        if (ws.sessionId) {
          removeStreamingSession(ws.sessionId)
        }
      })

      ws.on("error", (error) => {
        console.error("WebSocket error:", error)
      })
    })

    // Heartbeat
    const interval = setInterval(() => {
      wss.clients.forEach((ws) => {
        if (ws.isAlive === false) {
          return ws.terminate()
        }
        ws.isAlive = false
        ws.ping()
      })
    }, 30000)

    wss.on("close", () => {
      clearInterval(interval)
    })

    return wss
  } catch (error) {
    console.error("Failed to initialize WebSocket server:", error)
    throw error
  }
}

/**
 * Handle start event
 */
async function handleStartEvent(ws, data) {
  try {
    const callSid = data.start?.callSid
    const streamSid = data.start?.streamSid
    const sessionId = ws.sessionId

    if (!callSid || !sessionId) {
      console.error("Missing required parameters for start event")
      return
    }

    ws.callSid = callSid
    ws.streamSid = streamSid

    callSidToSessionMap.set(callSid, sessionId)

    console.log(`Twilio call started for ${callSid}, session ${sessionId}`)

    // Create streaming session
    const streamingSession = await createStreamingSession(callSid, sessionId, ws, streamSid)

    if (streamingSession) {
      console.log(`✅ Streaming session ready for call ${callSid}`)
    }
  } catch (error) {
    console.error("Error handling start event:", error)
  }
}

/**
 * Handle media event
 */
async function handleMediaEvent(ws, data) {
  try {
    if (!data.media?.payload) return

    const sessionId = ws.sessionId
    if (!sessionId) return

    const streamingSession = getStreamingSession(sessionId)
    const audioData = Buffer.from(data.media.payload, "base64")

    if (streamingSession?.initializationComplete) {
      await streamingSession.processAudioChunk(audioData)
    } else {
      bufferMediaEvent(sessionId, audioData)
    }
  } catch (error) {
    console.error("Error handling media event:", error)
  }
}

/**
 * Handle stop event
 */
function handleStopEvent(ws, data) {
  try {
    const sessionId = ws.sessionId
    if (sessionId) {
      console.log(`Received stop event for session ${sessionId}`)
      removeStreamingSession(sessionId)
      if (ws.callSid) {
        callSidToSessionMap.delete(ws.callSid)
      }
    }
  } catch (error) {
    console.error("Error handling stop event:", error)
  }
}

/**
 * Create streaming session
 */
export async function createStreamingSession(callSid, sessionId, ws, streamSid) {
  try {
    const streamingSession = new BidirectionalStreamingManager(callSid, sessionId)
    streamingSession.streamSid = streamSid

    // Register session early
    streamingSessions.set(sessionId, streamingSession)
    sessionCreationStatus.set(sessionId, "creating")

    if (!pendingMediaEvents.has(sessionId)) {
      pendingMediaEvents.set(sessionId, [])
    }

    // Initialize session
    const initialized = await streamingSession.initialize(ws)

    if (initialized) {
      sessionCreationStatus.set(sessionId, "created")
      console.log(`✅ Streaming session created for call ${callSid}`)

      // Process pending events
      processPendingMediaEvents(sessionId)
    } else {
      sessionCreationStatus.set(sessionId, "failed")
      console.error("Session initialization failed")
    }

    return streamingSession
  } catch (error) {
    console.error("Error creating streaming session:", error)
    sessionCreationStatus.set(sessionId, "failed")
    return null
  }
}

/**
 * Get streaming session
 */
export function getStreamingSession(sessionId) {
  return streamingSessions.get(sessionId)
}

/**
 * Buffer media event
 */
export function bufferMediaEvent(sessionId, audioData) {
  if (!pendingMediaEvents.has(sessionId)) {
    pendingMediaEvents.set(sessionId, [])
  }

  const events = pendingMediaEvents.get(sessionId)
  if (events.length < MEDIA_BUFFER_LIMIT) {
    events.push(audioData)
    return true
  }

  return false
}

/**
 * Process pending media events
 */
function processPendingMediaEvents(sessionId) {
  const session = streamingSessions.get(sessionId)
  const events = pendingMediaEvents.get(sessionId) || []

  if (session && events.length > 0) {
    console.log(`Processing ${events.length} pending media events`)

    for (const event of events) {
      try {
        if (session.processAudioChunk) {
          session.processAudioChunk(event)
        }
      } catch (err) {
        console.error("Error processing pending media event:", err)
      }
    }

    pendingMediaEvents.set(sessionId, [])
  }
}

/**
 * Remove streaming session
 */
export function removeStreamingSession(sessionId) {
  const session = streamingSessions.get(sessionId)
  if (session) {
    session.cleanup()
    streamingSessions.delete(sessionId)
    console.log(`🗑️ Removed streaming session ${sessionId}`)

    if (session.callSid) {
      callSidToSessionMap.delete(session.callSid)
    }
  }

  pendingMediaEvents.delete(sessionId)
  sessionCreationStatus.delete(sessionId)
}

/**
 * BidirectionalStreamingManager class
 */
export class BidirectionalStreamingManager {
  constructor(callSid, sessionId) {
    this.callSid = callSid
    this.sessionId = sessionId
    this.streamSid = null
    this.clientConnection = null
    this.deepgramSTTConnection = null
    this.currentUtterance = ""
    this.conversationHistory = []
    this.isProcessingResponse = false
    this.pendingResponse = false
    this.lastActivityTimestamp = Date.now()
    this.initializationComplete = false
    this.deepgramConnectionReady = false
    this.pendingAudioChunks = []
  }

  /**
   * Initialize the streaming session
   */
  async initialize(ws) {
    try {
      console.log(`Initializing streaming session for call ${this.callSid}`)

      this.clientConnection = ws

      // Initialize Deepgram STT
      const deepgramInitialized = await this.initializeDeepgramSTT()
      if (!deepgramInitialized) {
        console.error("Failed to initialize Deepgram STT")
        return false
      }

      // Wait for connection
      const deepgramReady = await this.waitForDeepgramConnection()
      if (!deepgramReady) {
        console.error("Deepgram connection not ready")
        return false
      }

      // Send welcome message
      await this.sendWelcomeMessage()

      this.initializationComplete = true
      console.log(`✅ Streaming session initialized for call ${this.callSid}`)
      return true
    } catch (error) {
      console.error("Error initializing streaming session:", error)
      return false
    }
  }

  /**
   * Initialize Deepgram STT connection
   */
  async initializeDeepgramSTT() {
    try {
      const deepgramClient = createClient(process.env.DEEPGRAM_API_KEY)

      const deepgramOptions = {
        encoding: "mulaw",
        sample_rate: 8000,
        channels: 1,
        model: "nova-2",
        language: "en-US",
        interim_results: false,
        smart_format: true,
        endpointing: 300,
        vad_events: true,
        punctuate: true,
      }

      this.deepgramSTTConnection = await deepgramClient.listen.live(deepgramOptions)
      this.setupDeepgramSTTEventHandlers()

      console.log(`✅ Deepgram STT initialized for call ${this.callSid}`)
      return true
    } catch (error) {
      console.error("Error initializing Deepgram STT:", error)
      return false
    }
  }

  /**
   * Set up Deepgram STT event handlers
   */
  setupDeepgramSTTEventHandlers() {
    this.deepgramSTTConnection.on("transcription", (data) => {
      this.handleTranscription(data)
    })

    this.deepgramSTTConnection.on("open", () => {
      console.log(`Deepgram STT connection opened for call ${this.callSid}`)
      this.deepgramConnectionReady = true

      // Process pending audio chunks
      if (this.pendingAudioChunks.length > 0) {
        console.log(`Processing ${this.pendingAudioChunks.length} pending audio chunks`)
        for (const chunk of this.pendingAudioChunks) {
          this.deepgramSTTConnection.send(chunk)
        }
        this.pendingAudioChunks = []
      }
    })

    this.deepgramSTTConnection.on("close", () => {
      console.log(`Deepgram STT connection closed for call ${this.callSid}`)
      this.deepgramConnectionReady = false
    })

    this.deepgramSTTConnection.on("error", (error) => {
      console.error(`Deepgram STT error for call ${this.callSid}:`, error)
    })
  }

  /**
   * Wait for Deepgram connection
   */
  async waitForDeepgramConnection() {
    return new Promise((resolve) => {
      if (this.deepgramConnectionReady) {
        resolve(true)
        return
      }

      const timeoutId = setTimeout(() => {
        console.error(`Deepgram connection timeout for call ${this.callSid}`)
        resolve(false)
      }, 10000)

      const openHandler = () => {
        clearTimeout(timeoutId)
        resolve(true)
      }

      this.deepgramSTTConnection.on("open", openHandler)
    })
  }

  /**
   * Send welcome message
   */
  async sendWelcomeMessage() {
    try {
      const welcomeMessage =
        "Thank you for calling Caring Clarity Counseling, my name is Clara. How can I help you today?"
      await this.generateAndSendAudioResponse(welcomeMessage, true)
      console.log(`✅ Welcome message sent for call ${this.callSid}`)
    } catch (error) {
      console.error("Error sending welcome message:", error)
    }
  }

  /**
   * Process audio chunk
   */
  async processAudioChunk(audioData) {
    try {
      this.lastActivityTimestamp = Date.now()

      if (this.isProcessingResponse) return

      if (!this.deepgramConnectionReady) {
        if (this.pendingAudioChunks.length < 500) {
          this.pendingAudioChunks.push(audioData)
        }
        return
      }

      // Send to Deepgram STT
      this.deepgramSTTConnection.send(audioData)
    } catch (error) {
      console.error("Error processing audio chunk:", error)
    }
  }

  /**
   * Handle transcription from Deepgram
   */
  async handleTranscription(data) {
    try {
      let transcript = ""
      let isFinal = false

      // Handle different Deepgram response formats
      if (data.channel?.alternatives?.[0]?.transcript) {
        transcript = data.channel.alternatives[0].transcript
        isFinal = !!data.is_final
      } else if (data.alternatives?.[0]?.transcript) {
        transcript = data.alternatives[0].transcript
        isFinal = !!data.is_final
      }

      if (!transcript || transcript.trim() === "") return

      console.log(`📝 Transcript: "${transcript}" (isFinal: ${isFinal})`)

      this.currentUtterance = transcript

      if (isFinal) {
        if (this.isProcessingResponse) {
          this.pendingResponse = true
          return
        }

        this.isProcessingResponse = true

        try {
          // Generate AI response using Groq
          const aiResult = await this.generateAIResponse(transcript)
          const response = aiResult.response
          console.log(`🤖 AI Response: "${response}"`)

          // Generate and send audio response
          await this.generateAndSendAudioResponse(response)

          // Update conversation history
          this.conversationHistory.push({ role: "user", content: transcript }, { role: "assistant", content: response })

          this.currentUtterance = ""

          if (this.pendingResponse) {
            this.pendingResponse = false
            setTimeout(() => {
              this.isProcessingResponse = false
            }, 100)
          } else {
            this.isProcessingResponse = false
          }
        } catch (error) {
          console.error("Error generating response:", error)
          this.isProcessingResponse = false
        }
      }
    } catch (error) {
      console.error("Error handling transcription:", error)
    }
  }

  /**
   * Generate AI response using Groq
   */
  async generateAIResponse(transcript) {
    try {
      // Get tenant configuration
      const { data: tenant } = await supabase.from("tenants").select("id").eq("business_type", "counseling").single()

      const { data: agentConfig } = await supabase
        .from("agent_configs")
        .select("*")
        .eq("tenant_id", tenant?.id)
        .eq("active", true)
        .single()

      const systemPrompt =
        agentConfig?.system_prompt ||
        `You are Clara, a warm and professional intake assistant for a mental health practice. 
         Keep responses conversational, concise, and natural for speech. 
         Avoid special characters or formatting. 
         Aim for 1-3 sentences unless more detail is requested.`

      const { text } = await generateText({
        model: groq("llama-3.3-70b-versatile"),
        system: systemPrompt,
        messages: [...this.conversationHistory, { role: "user", content: transcript }],
        maxTokens: 150,
        temperature: 0.7,
      })

      return { response: text }
    } catch (error) {
      console.error("Error generating AI response:", error)
      return {
        response: "I'm sorry, I'm having trouble processing your request. Could you please repeat that?",
      }
    }
  }

  /**
   * Generate and send audio response using Deepgram TTS
   */
  async generateAndSendAudioResponse(text, isGreeting = false) {
    try {
      console.log(`Generating audio for: "${text}"`)

      // Generate audio using Deepgram TTS
      const audioBuffer = await this.generateAudioWithDeepgram(text)

      // Send audio to client (already in correct format from Deepgram)
      await this.sendAudioToClient(audioBuffer, isGreeting)

      console.log(`✅ Audio response sent for call ${this.callSid}`)
    } catch (error) {
      console.error("Error generating audio response:", error)
      throw error
    }
  }

  /**
   * Generate audio using Deepgram TTS
   */
  async generateAudioWithDeepgram(text) {
    try {
      // Use the selected voice model from environment or default to Athena
      const voiceModel = process.env.DEEPGRAM_TTS_MODEL || "aura-2-athena-en"

      const response = await fetch(`https://api.deepgram.com/v1/speak?model=${voiceModel}`, {
        method: "POST",
        headers: {
          Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) {
        throw new Error(`Deepgram TTS error: ${response.status}`)
      }

      const audioArrayBuffer = await response.arrayBuffer()
      console.log(`✅ Deepgram TTS audio generated (${audioArrayBuffer.byteLength} bytes)`)

      // Convert to mulaw format for Twilio
      return await this.convertToMulaw(Buffer.from(audioArrayBuffer))
    } catch (error) {
      console.error("Error generating audio with Deepgram:", error)
      throw error
    }
  }

  /**
   * Convert audio to mulaw format
   */
  async convertToMulaw(audioBuffer) {
    // For now, return the buffer as-is since Deepgram can output in the correct format
    // In production, you might need to use ffmpeg for format conversion
    return audioBuffer
  }

  /**
   * Send audio to client
   */
  async sendAudioToClient(audioBuffer, isGreeting = false) {
    try {
      if (!this.clientConnection || this.clientConnection.readyState !== 1) {
        console.error("No client connection available")
        return
      }

      // Send audio in chunks
      const chunkSize = 640 // 80ms of audio at 8kHz
      for (let i = 0; i < audioBuffer.length; i += chunkSize) {
        const chunk = audioBuffer.slice(i, i + chunkSize)

        const mediaPayload = {
          event: "media",
          streamSid: this.streamSid,
          media: {
            payload: chunk.toString("base64"),
          },
        }

        this.clientConnection.send(JSON.stringify(mediaPayload))

        // Small delay to prevent overwhelming
        await new Promise((resolve) => setTimeout(resolve, 20))
      }

      console.log(`✅ Sent ${audioBuffer.length} bytes of audio to client`)
    } catch (error) {
      console.error("Error sending audio to client:", error)
      throw error
    }
  }

  /**
   * Clean up resources
   */
  cleanup() {
    try {
      console.log(`Cleaning up resources for call ${this.callSid}`)

      if (this.deepgramSTTConnection) {
        try {
          this.deepgramSTTConnection.finish()
        } catch (error) {
          console.error("Error closing Deepgram connection:", error)
        }
      }

      console.log(`✅ Cleanup complete for call ${this.callSid}`)
    } catch (error) {
      console.error("Error during cleanup:", error)
    }
  }
}

export default {
  initWebSocketServer,
  createStreamingSession,
  getStreamingSession,
  bufferMediaEvent,
  removeStreamingSession,
  BidirectionalStreamingManager,
}
