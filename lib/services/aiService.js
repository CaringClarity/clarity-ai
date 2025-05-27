/**
 * AI Service for Clara Voice Assistant
 * MIGRATED: From OpenAI to Groq for faster responses
 * Integrated with multi-tenant database
 */
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

/**
 * Generate AI response for a given user input
 * @param {string} userInput - The user's input message
 * @param {object} options - Additional options for response generation
 * @returns {Promise<string>} - The generated AI response
 */
export async function generateAIResponse(userInput, options = {}) {
  try {
    // Apply type safety to userInput
    const safeUserInput = typeof userInput === "string" ? userInput : String(userInput || "")

    // Get tenant-specific configuration
    const tenantId = options.tenantId || (await getDefaultTenantId())
    const agentConfig = await getAgentConfig(tenantId)

    // Prepare system prompt from agent config
    const systemPrompt = agentConfig?.system_prompt || "You are a helpful voice assistant named Clara."

    // Prepare conversation messages
    let messages = []

    // Add conversation history if provided
    if (options.conversationHistory && Array.isArray(options.conversationHistory)) {
      messages = options.conversationHistory.map((msg) => {
        // Ensure content is a string
        if (typeof msg.content !== "string") {
          msg.content = String(msg.content || "")
        }

        // Ensure role is valid
        if (!["system", "user", "assistant"].includes(msg.role)) {
          msg.role = "user"
        }

        return msg
      })
    }

    // Add current user input if not already in conversation history
    if (!messages.some((msg) => msg.role === "user" && msg.content === safeUserInput)) {
      messages.push({ role: "user", content: safeUserInput })
    }

    // Generate response using Groq
    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      system: systemPrompt,
      messages: messages,
      maxTokens: options.maxTokens || 150,
      temperature: 0.7,
    })

    return text
  } catch (error) {
    console.error(`Error in generateAIResponse: ${error.message}`)
    return "I'm sorry, I'm having trouble processing your request right now. Could you please try again?"
  }
}

/**
 * Get default tenant ID (for backward compatibility)
 */
async function getDefaultTenantId() {
  try {
    const { data, error } = await supabase.from("tenants").select("id").eq("business_type", "counseling").single()

    if (error) throw error
    return data.id
  } catch (error) {
    console.error("Error getting default tenant:", error)
    return null
  }
}

/**
 * Get agent configuration for tenant
 */
async function getAgentConfig(tenantId) {
  try {
    const { data, error } = await supabase
      .from("agent_configs")
      .select("*")
      .eq("tenant_id", tenantId)
      .eq("active", true)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error getting agent config:", error)
    return null
  }
}

// Default export for backward compatibility
export default { generateAIResponse }
