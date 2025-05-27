/**
 * Twilio Voice Webhook Handler - Optimized for Render WebSocket + Vercel deployment
 */
import { type NextRequest, NextResponse } from "next/server"
import twilio from "twilio"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    console.log("=== TWILIO VOICE WEBHOOK CALLED ===")

    const formData = await request.formData()
    const CallSid = formData.get("CallSid") as string
    const From = formData.get("From") as string
    const To = formData.get("To") as string

    console.log(`📞 Incoming call from ${From} to ${To} (SID: ${CallSid})`)

    // Query for active counseling tenant
    const { data: tenants, error: tenantError } = await supabase
      .from("tenants")
      .select("id, name, business_type, settings, active")
      .eq("business_type", "counseling")
      .eq("active", true)
      .limit(1)

    if (tenantError) {
      console.error("❌ Database error:", tenantError)
      throw new Error(`Database error: ${tenantError.message}`)
    }

    if (!tenants || tenants.length === 0) {
      console.error("❌ No active counseling tenant found")
      throw new Error("No active counseling tenant found")
    }

    const tenant = tenants[0]
    console.log("✅ Found tenant:", tenant.name, "ID:", tenant.id)

    // Create or get user
    const { data: user, error: userError } = await supabase
      .from("users")
      .upsert(
        {
          tenant_id: tenant.id,
          phone_number: From,
          name: "Caller",
          metadata: { lastCallSid: CallSid },
        },
        { onConflict: "tenant_id,phone_number" },
      )
      .select()
      .single()

    if (userError) {
      console.error("❌ User creation error:", userError)
      // Continue anyway - don't fail the call for user creation issues
    } else {
      console.log("✅ User created/updated:", user?.id)
    }

    // Create conversation record
    const { error: conversationError } = await supabase.from("conversations").insert({
      tenant_id: tenant.id,
      user_id: user?.id || null,
      channel: "voice",
      status: "active",
      context: { callSid: CallSid, from: From, to: To, intent: "greeting" },
    })

    if (conversationError) {
      console.error("❌ Conversation creation error:", conversationError)
      // Continue anyway - don't fail the call
    } else {
      console.log("✅ Conversation created")
    }

    // Create TwiML response with Render WebSocket integration
    const twiml = new twilio.twiml.VoiceResponse()

    // Get greeting from tenant settings
    const greeting =
      tenant.settings?.voice_agent?.greeting ||
      "Hello! Thank you for calling Caring Clarity Counseling. I am Clara, your AI assistant. How can I help you today?"

    // Generate initial greeting with Deepgram TTS
    const greetingAudio = await generateDeepgramTTS(greeting)

    if (greetingAudio) {
      // Play the Deepgram-generated greeting
      twiml.play(greetingAudio)
    } else {
      // Fallback to Twilio's neural voice
      twiml.say(
        {
          voice: "Polly.Joanna-Neural",
          language: "en-US",
        },
        greeting,
      )
    }

    // Connect to Render WebSocket server for real-time streaming
    // IMPORTANT: Replace 'your-render-app-name' with your actual Render app name
    const renderWebSocketUrl = process.env.RENDER_WEBSOCKET_URL || "wss://your-render-app-name.onrender.com"

    const connect = twiml.connect()
    connect.stream({
      url: `${renderWebSocketUrl}/stream?callSid=${CallSid}&tenantId=${tenant.id}&userId=${user?.id || "anonymous"}`,
      track: "both_tracks",
    })

    console.log("✅ Returning TwiML with Render WebSocket connection")
    console.log(`🔗 WebSocket URL: ${renderWebSocketUrl}/stream`)

    return new NextResponse(twiml.toString(), {
      headers: { "Content-Type": "text/xml" },
    })
  } catch (error) {
    console.error("💥 Error handling incoming call:", error)

    // Return error TwiML that still works
    const twiml = new twilio.twiml.VoiceResponse()
    twiml.say(
      {
        voice: "Polly.Joanna-Neural",
        language: "en-US",
      },
      "Sorry, we encountered an error processing your call. Please try again later or call back in a few minutes.",
    )

    return new NextResponse(twiml.toString(), {
      headers: { "Content-Type": "text/xml" },
    })
  }
}

/**
 * Generate greeting audio using Deepgram TTS
 */
async function generateDeepgramTTS(text: string): Promise<string | null> {
  try {
    console.log("🎤 Generating Deepgram TTS for greeting...")

    const response = await fetch("https://api.deepgram.com/v1/speak?model=aura-asteria-en", {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: text,
      }),
    })

    if (response.ok) {
      const audioBuffer = await response.arrayBuffer()
      const base64Audio = Buffer.from(audioBuffer).toString("base64")
      console.log("✅ Deepgram TTS generated successfully")
      return `data:audio/wav;base64,${base64Audio}`
    } else {
      console.error("❌ Deepgram TTS failed:", response.status, response.statusText)
    }
  } catch (error) {
    console.error("❌ Deepgram TTS error:", error)
  }
  return null
}
