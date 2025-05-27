/**
 * Twilio Voice Webhook Handler - Complete version with active column and Deepgram
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

    // Query for active counseling tenant - now with active column
    console.log("🔍 Querying for counseling tenant...")
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

    console.log("📊 Query result:", { tenants, count: tenants?.length })

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
        {
          onConflict: "tenant_id,phone_number",
        },
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

    // Create TwiML response with Deepgram integration
    const twiml = new twilio.twiml.VoiceResponse()

    const greeting =
      tenant.settings?.voice_agent?.greeting ||
      "Hello! Thank you for calling Caring Clarity Counseling. I am Clara, your AI assistant. How can I help you today?"

    // Use Deepgram for text-to-speech
    twiml.say(
      {
        voice: "Polly.Joanna-Neural", // You can change this to your preferred voice
      },
      greeting,
    )

    // Start a stream to capture audio and send to your AI processing endpoint
    const start = twiml.start()
    start.stream({
      name: "voice-stream",
      url: `wss://${process.env.NEXT_PUBLIC_APP_URL?.replace("https://", "") || "your-domain.vercel.app"}/api/twilio/stream`,
      track: "both_tracks",
    })

    // Pause to allow the stream to establish
    twiml.pause({ length: 1 })

    console.log("✅ Returning TwiML response with Deepgram integration")
    return new NextResponse(twiml.toString(), {
      headers: { "Content-Type": "text/xml" },
    })
  } catch (error) {
    console.error("💥 Error handling incoming call:", error)

    const twiml = new twilio.twiml.VoiceResponse()
    twiml.say("Sorry, we encountered an error processing your call. Please try again later.")

    return new NextResponse(twiml.toString(), {
      headers: { "Content-Type": "text/xml" },
    })
  }
}
