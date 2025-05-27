/**
 * Call Flow Service for Clara Voice Assistant
 * MIGRATED: Integrated with multi-tenant database
 * ENHANCED: Stores conversation state in database
 */
import { generateAIResponse } from "./aiService.js"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

const stagePrompts = {
  initial:
    "You are Clara, a warm and professional intake assistant for a mental health practice. Greet the caller and ask how you can assist.",
  collecting_name: "Ask the caller for their full name.",
  collecting_email: "Ask for their best email address.",
  collecting_reason: "Ask why they're seeking therapy.",
  confirming: "Confirm the caller's name, email, and reason. Ask if everything sounds correct.",
  closing: "Thank them, explain someone will follow up shortly, and say goodbye.",
}

const stageTransitions = {
  initial: "collecting_name",
  collecting_name: "collecting_email",
  collecting_email: "collecting_reason",
  collecting_reason: "confirming",
  confirming: "closing",
}

function isExitIntent(text) {
  const exitPhrases = ["gotta go", "have to go", "call back", "talk later", "goodbye", "bye", "not now"]
  return exitPhrases.some((phrase) => text.toLowerCase().includes(phrase))
}

export async function callFlowManager({ prompt, callSid, tenantId }) {
  try {
    // Get or create conversation
    const conversation = await getOrCreateConversation(callSid, tenantId)

    // Get conversation context
    let context = conversation.context || {}
    const now = Date.now()

    // Reset if inactive for too long
    if (context.lastUpdated && now - new Date(context.lastUpdated).getTime() > 30 * 60 * 1000) {
      context = { stage: "initial", history: [] }
      context.resetDueToInactivity = true
    }

    context.lastUpdated = new Date().toISOString()
    const stage = context.stage || "initial"
    const assistantPrompt = stagePrompts[stage] || stagePrompts.initial
    const history = (context.history || []).slice(-8) // Keep last 8 messages
    let replyText = ""

    if (isExitIntent(prompt)) {
      context.stage = "closing"
      replyText = "Thank you. We'll follow up shortly. Take care!"
    } else {
      // Generate AI response
      try {
        replyText = await generateAIResponse(prompt, {
          systemPrompt: assistantPrompt,
          conversationHistory: history,
          tenantId: tenantId,
        })
      } catch (err) {
        console.error("Error generating AI response:", err)
        replyText = "Sorry, I'm having trouble answering right now. Let me transfer you shortly."
      }

      // Stage advancement
      if (stageTransitions[stage]) {
        context.stage = stageTransitions[stage]
        if (stage === "collecting_name") context.name = prompt
        if (stage === "collecting_email") context.email = prompt
        if (stage === "collecting_reason") context.reason = prompt
      }
    }

    // Update conversation history
    context.history = [...history, { role: "user", content: prompt }, { role: "assistant", content: replyText }]

    // Save conversation state
    await updateConversation(conversation.id, context, replyText)

    // Save individual messages
    await saveMessages(conversation.id, [
      { role: "user", content: prompt },
      { role: "assistant", content: replyText },
    ])

    return { replyText, updatedContext: context }
  } catch (error) {
    console.error("Error in callFlowManager:", error)
    return {
      replyText:
        "I'm sorry, I'm experiencing technical difficulties. Please hold while I connect you to someone who can help.",
      updatedContext: { stage: "initial", history: [] },
    }
  }
}

/**
 * Get or create conversation for call
 */
async function getOrCreateConversation(callSid, tenantId) {
  try {
    // First try to find existing conversation
    const { data: existing, error: findError } = await supabase
      .from("conversations")
      .select("*")
      .eq("tenant_id", tenantId)
      .eq("channel", "voice")
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (existing && !findError) {
      return existing
    }

    // Get or create user (we'll use phone number from call)
    const user = await getOrCreateUser(callSid, tenantId)

    // Create new conversation
    const { data: conversation, error } = await supabase
      .from("conversations")
      .insert({
        tenant_id: tenantId,
        user_id: user.id,
        channel: "voice",
        status: "active",
        context: { stage: "initial", history: [], callSid },
      })
      .select()
      .single()

    if (error) throw error
    return conversation
  } catch (error) {
    console.error("Error getting/creating conversation:", error)
    throw error
  }
}

/**
 * Get or create user for call
 */
async function getOrCreateUser(callSid, tenantId) {
  try {
    // For now, create a temporary user for each call
    // In production, you'd extract phone number from Twilio data
    const { data: user, error } = await supabase
      .from("users")
      .insert({
        tenant_id: tenantId,
        phone_number: `call_${callSid}`,
        name: "Unknown Caller",
        metadata: { callSid },
      })
      .select()
      .single()

    if (error) throw error
    return user
  } catch (error) {
    console.error("Error creating user:", error)
    throw error
  }
}

/**
 * Update conversation context
 */
async function updateConversation(conversationId, context, lastMessage) {
  try {
    const { error } = await supabase
      .from("conversations")
      .update({
        context,
        updated_at: new Date().toISOString(),
      })
      .eq("id", conversationId)

    if (error) throw error
  } catch (error) {
    console.error("Error updating conversation:", error)
  }
}

/**
 * Save messages to database
 */
async function saveMessages(conversationId, messages) {
  try {
    const messagesToInsert = messages.map((msg) => ({
      conversation_id: conversationId,
      role: msg.role,
      content: msg.content,
      channel_data: {},
    }))

    const { error } = await supabase.from("messages").insert(messagesToInsert)

    if (error) throw error
  } catch (error) {
    console.error("Error saving messages:", error)
  }
}
