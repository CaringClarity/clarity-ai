/**
 * Enhanced StreamingService with improved error handling and reconnection logic
 * Fixes for WebSocket integration and conversation flow
 */
import { createClient } from "@deepgram/sdk"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { logInfo, logError, logWarn } from "./loggingService"

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

    logInfo("WebSocket", "WebSocket server initialized")

    // Handle upgrade requests
    server.on("upgrade", (request, socket, head) => {
      const pathname = request.url.split("?")[0]

      if (pathname.startsWith("/api/websocket") || pathname.startsWith("/stream")) {
        logInfo("WebSocket", `WebSocket upgrade request: ${pathname}`)

        wss.handleUpgrade(request, socket, head, (ws) => {
          wss.emit("connection", ws, request)
        })
      } else {
        socket.destroy()
      }
    })

    // Handle new connections
    wss.on("connection", (ws, req) => {
      logInfo("WebSocket", "New WebSocket connection established")

      // Extract sessionId from path
      let sessionId = null
      const pathMatch = req.url.match(/\/session\/(session-[A-Za-z0-9]+-\d+)/)
      if (pathMatch && pathMatch[1]) {
        sessionId = pathMatch[1]
        ws.sessionId = sessionId
        logInfo("WebSocket", `WebSocket connected with sessionId: ${sessionId}`)

        // Extract callSid from sessionId
        const parts = sessionId.split("-")
        if (parts.length >= 3) {
          const callSid = parts[1]
          ws.callSid = callSid
          callSidToSessionMap.set(callSid, sessionId)
        }
      } else {
        // Check for stream path with callSid parameter
        const url = new URL(req.url, `http://${req.headers.host}`)
        const callSid = url.searchParams.get('callSid')
        const tenantId = url.searchParams.get('tenantId')
        const userId = url.searchParams.get('userId')
        
        if (callSid) {
          ws.callSid = callSid
          ws.tenantId = tenantId
          ws.userId = userId
          
          // Generate a session ID if not provided
          sessionId = `session-${callSid}-${Date.now()}`
          ws.sessionId = sessionId
          callSidToSessionMap.set(callSid, sessionId)
          
          logInfo("WebSocket", `WebSocket connected with callSid: ${callSid}, generated sessionId: ${sessionId}`)
        }
      }

      ws.isAlive = true

      // Handle messages
      ws.on("message", async (message) => {
        try {
          const data = JSON.parse(message)
          logInfo("WebSocket", `Received event: ${data.event}`)

          if (data.event === "start") {
            await handleStartEvent(ws, data)
          } else if (data.event === "media") {
            await handleMediaEvent(ws, data)
          } else if (data.event === "stop") {
            handleStopEvent(ws, data)
          }
        } catch (error) {
          logError("WebSocket", "Error handling WebSocket message", { error: error.message })
        }
      })

      // Handle connection close
      ws.on("close", () => {
        logInfo("WebSocket", `WebSocket disconnected for ${ws.sessionId}`)
        if (ws.sessionId) {
          removeStreamingSession(ws.sessionId)
        }
      })

      ws.on("error", (error) => {
        logError("WebSocket", "WebSocket error", { error: error.message })
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
    logError("WebSocket", "Failed to initialize WebSocket server", { error: error.message })
    throw error
  }
}

/**
 * Handle start event
 */
async function handleStartEvent(ws, data) {
  try {
    const callSid = data.start?.callSid || ws.callSid
    const streamSid = data.start?.streamSid
    const sessionId = ws.sessionId

    if (!callSid || !sessionId) {
      logError("WebSocket", "Missing required parameters for start event")
      return
    }

    ws.callSid = callSid
    ws.streamSid = streamSid

    callSidToSessionMap.set(callSid, sessionId)

    logInfo("WebSocket", `Twilio call started for ${callSid}, session ${sessionId}`)

    // Create streaming session
    const streamingSession = await createStreamingSession(callSid, sessionId, ws, streamSid)

    if (streamingSession) {
      logInfo("WebSocket", `Streaming session ready for call ${callSid}`)
    }
  } catch (error) {
    logError("WebSocket", "Error handling start event", { error: error.message })
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
    logError("WebSocket", "Error handling media event", { error: error.message })
  }
}

/**
 * Handle stop event
 */
function handleStopEvent(ws, data) {
  try {
    const sessionId = ws.sessionId
    if (sessionId) {
      logInfo("WebSocket", `Received stop event for session ${sessionId}`)
      removeStreamingSession(sessionId)
      if (ws.callSid) {
        callSidToSessionMap.delete(ws.callSid)
      }
    }
  } catch (error) {
    logError("WebSocket", "Error handling stop event", { error: error.message })
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
      logInfo("StreamingSession", `Streaming session created for call ${callSid}`)

      // Process pending events
      processPendingMediaEvents(sessionId)
    } else {
      sessionCreationStatus.set(sessionId, "failed")
      logError("StreamingSession", "Session initialization failed")
    }

    return streamingSession
  } catch (error) {
    logError("StreamingSession", "Error creating streaming session", { error: error.message })
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
    logInfo("StreamingSession", `Processing ${events.length} pending media events`)

    for (const event of events) {
      try {
        if (session.processAudioChunk) {
          session.processAudioChunk(event)
        }
      } catch (err) {
        logError("StreamingSession", "Error processing pending media event", { error: err.message })
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
    logInfo("StreamingSession", `Removed streaming session ${sessionId}`)

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
    this.reconnectionAttempts = 0
    this.maxReconnectionAttempts = 3
    this.welcomeMessageSent = false
  }

  /**
   * Initialize the streaming session
   */
  async initialize(ws) {
    try {
      logInfo("StreamingSession", `Initializing streaming session for call ${this.callSid}`)

      this.clientConnection = ws

      // Initialize Deepgram STT
      const deepgramInitialized = await this.initializeDeepgramSTT()
      if (!deepgramInitialized) {
        logError("StreamingSession", "Failed to initialize Deepgram STT")
        return false
      }

      // Wait for connection
      const deepgramReady = await this.waitForDeepgramConnection()
      if (!deepgramReady) {
        logError("StreamingSession", "Deepgram connection not ready")
        return false
      }

      // Send welcome message only if not already sent by Twilio
      // Check if this is a new conversation
      const { data: conversationData } = await supabase
        .from("conversations")
        .select("created_at")
        .eq("context->callSid", this.callSid)
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      // If conversation was created more than 10 seconds ago, assume greeting was already played
      const skipWelcome = conversationData && 
                         (new Date() - new Date(conversationData.created_at)) > 10000
      
      if (skipWelcome) {
        logInfo("StreamingSession", `Skipping welcome message for existing call ${this.callSid}`)
        this.welcomeMessageSent = true
      } else {
        // Wait a moment to ensure Twilio greeting has time to play
        await new Promise(resolve => setTimeout(resolve, 2000))
        await this.sendWelcomeMessage()
      }

      this.initializationComplete = true
      logInfo("StreamingSession", `Streaming session initialized for call ${this.callSid}`)
      return true
    } catch (error) {
      logError("StreamingSession", "Error initializing streaming session", { error: error.message })
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

      logInfo("StreamingSession", `Deepgram STT initialized for call ${this.callSid}`)
      return true
    } catch (error) {
      logError("StreamingSession", "Error initializing Deepgram STT", { error: error.message })
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
      logInfo("StreamingSession", `Deepgram STT connection opened for call ${this.callSid}`)
      this.deepgramConnectionReady = true
      this.reconnectionAttempts = 0

      // Process pending audio chunks
      if (this.pendingAudioChunks.length > 0) {
        logInfo("StreamingSession", `Processing ${this.pendingAudioChunks.length} pending audio chunks`)
        for (const chunk of this.pendingAudioChunks) {
          this.deepgramSTTConnection.send(chunk)
        }
        this.pendingAudioChunks = []
      }
    })

    this.deepgramSTTConnection.on("close", async (code, reason) => {
      logWarn("StreamingSession", `Deepgram STT connection closed for call ${this.callSid}`, { code, reason })
      this.deepgramConnectionReady = false
      
      // Attempt reconnection on unexpected closure
      if (code !== 1000 && this.reconnectionAttempts < this.maxReconnectionAttempts) {
        logInfo("StreamingSession", "Attempting to reconnect due to unexpected closure")
        await this.reconnectDeepgramSTT()
      }
    })

    this.deepgramSTTConnection.on("error", async (error) => {
      logError("StreamingSession", `Deepgram STT error for call ${this.callSid}`, { error: error.message })
      
      // Attempt reconnection on certain errors
      if (this.reconnectionAttempts < this.maxReconnectionAttempts) {
        logInfo("StreamingSession", "Attempting to reconnect due to connection error")
        await this.reconnectDeepgramSTT()
      }
    })
  }

  /**
   * Reconnect to Deepgram STT
   */
  async reconnectDeepgramSTT() {
    this.reconnectionAttempts++
    logInfo("StreamingSession", `Attempting to reconnect Deepgram STT (attempt ${this.reconnectionAttempts})`)
    
    // Close existing connection if any
    if (this.deepgramSTTConnection) {
      try {
        this.deepgramSTTConnection.close()
      } catch (err) {
        logError("StreamingSession", "Error closing existing Deepgram connection", { error: err.message })
      }
    }
    
    // Reset connection state
    this.deepgramConnectionReady = false
    
    // Wait before reconnecting
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Try to initialize a new connection
    const initialized = await this.initializeDeepgramSTT()
    if (initialized) {
      logInfo("StreamingSession", `Successfully reconnected Deepgram STT for call ${this.callSid}`)
      return true
    } else {
      logError("StreamingSession", `Failed to reconnect Deepgram STT for call ${this.callSid}`)
      return false
    }
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
        logError("StreamingSession", `Deepgram connection timeout for call ${this.callSid}`)
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
      // Check if welcome message was already sent
      if (this.welcomeMessageSent) {
        logInfo("StreamingSession", `Welcome message already sent for call ${this.callSid}`)
        return
      }
      
      const welcomeMessage =
        "Thank you for calling Caring Clarity Counseling, my name is Clara. How can I help you today?"
      await this.generateAndSendAudioResponse(welcomeMessage, true)
      this.welcomeMessageSent = true
      logInfo("StreamingSession", `Welcome message sent for call ${this.callSid}`)
    } catch (error) {
      logError("StreamingSession", "Error sending welcome message", { error: error.message })
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
      logError("StreamingSession", "Error processing audio chunk", { error: error.message })
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

      logInfo("StreamingSession", `Transcript: "${transcript}" (isFinal: ${isFinal})`)

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
          logInfo("StreamingSession", `AI Response: "${response}"`)

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
          logError("StreamingSession", "Error generating response", { error: error.message })
          this.isProcessingResponse = false
        }
      }
    } catch (error) {
      logError("StreamingSession", "Error handling transcription", { error: error.message })
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
        temperature: 0.7
      })

      // Log the conversation turn
      await this.logConversationTurn(transcript, text)

      return { response: text }
    } catch (error) {
      logError("StreamingSession", "Error generating AI response", { error: error.message })
      
      // Return a fallback response
      return { 
        response: "I'm sorry, I'm having trouble processing that right now. Could you please repeat your question?" 
      }
    }
  }

  /**
   * Generate and send audio response
   */
  async generateAndSendAudioResponse(text, isWelcome = false) {
    try {
      logInfo("StreamingSession", `Generating TTS for: "${text}"`)

      // Generate audio with Deepgram TTS
      const response = await fetch("https://api.deepgram.com/v1/speak?model=aura-asteria-en&encoding=mulaw&sample_rate=8000", {
        method: "POST",
        headers: {
          Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) {
        throw new Error(`Deepgram TTS API error: ${response.status}`)
      }

      const audioBuffer = Buffer.from(await response.arrayBuffer())
      logInfo("StreamingSession", `TTS generated successfully (${audioBuffer.byteLength} bytes)`)

      // Send audio to Twilio
      await this.sendAudioToTwilio(audioBuffer)
      
      return true
    } catch (error) {
      logError("StreamingSession", "Error generating and sending audio response", { error: error.message })
      return false
    }
  }

  /**
   * Send audio to Twilio
   */
  async sendAudioToTwilio(audioBuffer) {
    try {
      // Convert audio to base64 for Twilio
      const base64Audio = audioBuffer.toString("base64")
      
      // Send media message back to Twilio stream
      const mediaMessage = {
        event: "media",
        streamSid: this.streamSid,
        media: {
          payload: base64Audio
        }
      }
      
      // Send through WebSocket back to Twilio
      if (this.clientConnection && this.clientConnection.readyState === 1) { // WebSocket.OPEN
        this.clientConnection.send(JSON.stringify(mediaMessage))
        logInfo("StreamingSession", "Audio response sent to Twilio")
        return true
      } else {
        logError("StreamingSession", "WebSocket not open for sending audio")
        return false
      }
    } catch (error) {
      logError("StreamingSession", "Error sending audio to Twilio", { error: error.message })
      return false
    }
  }

  /**
   * Log conversation turn
   */
  async logConversationTurn(userMessage, aiResponse) {
    try {
      await supabase.from("conversation_turns").insert({
        conversation_id: this.callSid,
        user_message: userMessage,
        ai_response: aiResponse,
        timestamp: new Date().toISOString(),
        metadata: {
          tenant_id: this.clientConnection?.tenantId,
          user_id: this.clientConnection?.userId
        }
      })
      logInfo("StreamingSession", "Conversation logged to database")
      return true
    } catch (error) {
      logError("StreamingSession", "Error logging conversation", { error: error.message })
      return false
    }
  }

  /**
   * Clean up resources
   */
  cleanup() {
    try {
      if (this.deepgramSTTConnection) {
        this.deepgramSTTConnection.close()
      }
      
      logInfo("StreamingSession", `Cleaned up session: ${this.sessionId}`)
    } catch (error) {
      logError("StreamingSession", "Error during cleanup", { error: error.message })
    }
  }
}
