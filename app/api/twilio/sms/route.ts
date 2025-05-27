/**
 * Twilio SMS Handler
 * Handles incoming SMS messages
 */
import { type NextRequest, NextResponse } from "next/server"
import twilio from "twilio"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const From = formData.get("From") as string
    const Body = formData.get("Body") as string
    const MessageSid = formData.get("MessageSid") as string

    console.log(`📱 Incoming SMS from ${From}: ${Body}`)

    // Get default tenant
    const { data: tenant } = await supabase.from("tenants").select("id").eq("business_type", "counseling").single()

    if (!tenant) {
      throw new Error("No tenant found")
    }

    // Get or create user
    const { data: user } = await supabase
      .from("users")
      .upsert(
        {
          tenant_id: tenant.id,
          phone_number: From,
          name: "SMS User",
          metadata: { lastMessageSid: MessageSid },
        },
        {
          onConflict: "tenant_id,phone_number",
        },
      )
      .select()
      .single()

    // Get or create conversation
    let { data: conversation } = await supabase
      .from("conversations")
      .select("*")
      .eq("tenant_id", tenant.id)
      .eq("user_id", user.id)
      .eq("channel", "sms")
      .eq("status", "active")
      .single()

    if (!conversation) {
      const { data: newConversation } = await supabase
        .from("conversations")
        .insert({
          tenant_id: tenant.id,
          user_id: user.id,
          channel: "sms",
          status: "active",
          context: { from: From },
        })
        .select()
        .single()

      conversation = newConversation
    }

    // Get agent configuration
    const { data: agentConfig } = await supabase
      .from("agent_configs")
      .select("*")
      .eq("tenant_id", tenant.id)
      .eq("active", true)
      .single()

    // Generate AI response
    const systemPrompt =
      agentConfig?.system_prompt ||
      `You are Clara, a professional SMS assistant for a mental health practice. 
       Keep responses brief, helpful, and appropriate for text messaging.
       Help with scheduling, basic information, and directing urgent matters appropriately.`

    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      system: systemPrompt,
      messages: [{ role: "user", content: Body }],
      maxTokens: 160, // SMS-appropriate length
      temperature: 0.7,
    })

    // Save messages
    await supabase.from("messages").insert([
      {
        conversation_id: conversation.id,
        role: "user",
        content: Body,
        channel_data: { messageSid: MessageSid, from: From },
      },
      {
        conversation_id: conversation.id,
        role: "assistant",
        content: text,
        channel_data: { channel: "sms" },
      },
    ])

    // Create TwiML response
    const twiml = new twilio.twiml.MessagingResponse()
    twiml.message(text)

    return new NextResponse(twiml.toString(), {
      headers: { "Content-Type": "text/xml" },
    })
  } catch (error) {
    console.error("Error handling SMS:", error)

    const twiml = new twilio.twiml.MessagingResponse()
    twiml.message("Sorry, I'm having trouble processing your message. Please try again or call us directly.")

    return new NextResponse(twiml.toString(), {
      headers: { "Content-Type": "text/xml" },
    })
  }
}
