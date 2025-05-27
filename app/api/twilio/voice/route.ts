/**
 * Twilio Voice Handler
 * MIGRATED: Integrated with multi-tenant database and new streaming service
 */
import { type NextRequest, NextResponse } from "next/server"
import twilio from "twilio"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

/**
 * Handle incoming Twilio voice calls
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const CallSid = formData.get("CallSid") as string
    const From = formData.get("From") as string
    const To = formData.get("To") as string

    console.log(`📞 Incoming call from ${From} to ${To} (SID: ${CallSid})`)

    // Get default tenant (counseling practice)
    const { data: tenant } = await supabase.from("tenants").select("id").eq("business_type", "counseling").single()

    if (!tenant) {
      throw new Error("No tenant found")
    }

    // Create or get user
    const { data: user } = await supabase
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

    // Create conversation
    await supabase.from("conversations").insert({
      tenant_id: tenant.id,
      user_id: user.id,
      channel: "voice",
      status: "active",
      context: { callSid: CallSid, from: From, to: To, intent: "greeting" },
    })

    // Generate unique session ID
    const sessionId = `session-${CallSid}-${Date.now()}`

    // Create TwiML response
    const twiml = new twilio.twiml.VoiceResponse()

    // Get streaming endpoint URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://your-app.vercel.app"
    const streamUrl = `${baseUrl}/api/websocket/session/${sessionId}`

    console.log(`🔗 Streaming call to: ${streamUrl}`)

    // Connect to WebSocket stream
    const connect = twiml.connect()
    connect.stream({ url: streamUrl })

    return new NextResponse(twiml.toString(), {
      headers: { "Content-Type": "text/xml" },
    })
  } catch (error) {
    console.error("Error handling incoming call:", error)

    const twiml = new twilio.twiml.VoiceResponse()
    twiml.say("Sorry, we encountered an error processing your call. Please try again later.")

    return new NextResponse(twiml.toString(), {
      headers: { "Content-Type": "text/xml" },
    })
  }
}
