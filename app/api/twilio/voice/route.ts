/**
 * Twilio Voice Webhook Handler - TRUE bidirectional real-time streaming
 * ECHO TEST VERSION - Greeting removed
 */
import { type NextRequest, NextResponse } from "next/server"
import twilio from "twilio"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    console.log("=== TWILIO VOICE WEBHOOK CALLED (ECHO TEST) ===")

    const formData = await request.formData()
    const CallSid = formData.get("CallSid") as string
    const From = formData.get("From") as string
    const To = formData.get("To") as string

    console.log(`📞 Incoming call from ${From} to ${To} (SID: ${CallSid})`)

    // Try the database function first
    console.log("🔍 Querying for counseling tenant with database function...")
    const { data: tenants, error: tenantError } = await supabase.rpc("get_counseling_tenant")

    if (tenantError) {
      console.error("❌ RPC error, trying fallback query:", tenantError)

      // Fallback: Try without active filter
      const { data: fallbackTenants, error: fallbackError } = await supabase
        .from("tenants")
        .select("id, name, business_type, settings")
        .eq("business_type", "counseling")
        .limit(1)

      if (fallbackError) {
        console.error("❌ Fallback query failed:", fallbackError)
        throw new Error(`Database error: ${fallbackError.message}`)
      }

      if (!fallbackTenants || fallbackTenants.length === 0) {
        throw new Error("No counseling tenant found")
      }

      const tenant = fallbackTenants[0]
      console.log("✅ Found tenant via fallback:", tenant.name)
      return await processTenantAndCall(tenant, CallSid, From, To)
    }

    if (!tenants || tenants.length === 0) {
      console.log("❌ No active counseling tenant found via RPC, trying fallback...")

      // Fallback: Try without active filter
      const { data: fallbackTenants, error: fallbackError } = await supabase
        .from("tenants")
        .select("id, name, business_type, settings")
        .eq("business_type", "counseling")
        .limit(1)

      if (fallbackError) {
        console.error("❌ Fallback query failed:", fallbackError)
        throw new Error(`Database error: ${fallbackError.message}`)
      }

      if (!fallbackTenants || fallbackTenants.length === 0) {
        throw new Error("No counseling tenant found")
      }

      const tenant = fallbackTenants[0]
      console.log("✅ Found tenant via fallback:", tenant.name)
      return await processTenantAndCall(tenant, CallSid, From, To)
    }

    const tenant = tenants[0]
    console.log("✅ Found tenant via RPC:", tenant.name)
    return await processTenantAndCall(tenant, CallSid, From, To)
  } catch (error) {
    console.error("💥 Error handling incoming call:", error)

    // Return error TwiML that still works
    const twiml = new twilio.twiml.VoiceResponse()
    twiml.say(
      {
        voice: "Polly.Joanna-Neural",
        language: "en-US",
      },
      "Sorry, we encountered an error processing your call. Please try again later.",
    )

    return new NextResponse(twiml.toString(), {
      headers: { "Content-Type": "text/xml" },
    })
  }
}

async function processTenantAndCall(tenant: any, CallSid: string, From: string, To: string) {
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
  } else {
    console.log("✅ User created/updated:", user?.id)
  }

  // Create conversation record
  const { error: conversationError } = await supabase.from("conversations").insert({
    tenant_id: tenant.id,
    user_id: user?.id || null,
    channel: "voice",
    status: "active",
    context: { callSid: CallSid, from: From, to: To, intent: "echo_test" },
  })

  if (conversationError) {
    console.error("❌ Conversation creation error:", conversationError)
  } else {
    console.log("✅ Conversation created")
  }

  // Create TwiML response for TRUE bidirectional streaming
  const twiml = new twilio.twiml.VoiceResponse()

  // GREETING REMOVED FOR ECHO TEST
  // Let the WebSocket handle all audio

  // Configure call with answering machine detection disabled
  twiml.dial({
    answerOnBridge: true,
    amd: 'false' // Disable answering machine detection
  }).conference('Echo Test', {
    startConferenceOnEnter: true,
    endConferenceOnExit: true,
    beep: false,
    record: false,
    trim: 'trim-silence'
  });

  // Start bidirectional streaming
  const renderWebSocketUrl = process.env.RENDER_WEBSOCKET_URL || "wss://voice-agent-websocket.onrender.com"

  twiml.start().stream({
    url: `${renderWebSocketUrl}/stream?callSid=${CallSid}&tenantId=${tenant.id}&userId=${user?.id || "anonymous"}`,
    track: "both_tracks",
    mode: "bidirectional" // Explicitly set bidirectional mode
  })

  // Keep the call alive for streaming
  twiml.pause({ length: 3600 }) // 1 hour max call duration

  console.log("✅ Returning TwiML with bidirectional streaming (ECHO TEST)")
  console.log(`🔗 WebSocket URL: ${renderWebSocketUrl}/stream`)

  return new NextResponse(twiml.toString(), {
    headers: { "Content-Type": "text/xml" },
  })
}
