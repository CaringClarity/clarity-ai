import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory = [] } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "No message provided" }, { status: 400 })
    }

    // Get tenant configuration
    const { data: tenant } = await supabase.from("tenants").select("id").eq("business_type", "counseling").single()

    const { data: agentConfig } = await supabase
      .from("agent_configs")
      .select("*")
      .eq("tenant_id", tenant?.id)
      .eq("active", true)
      .single()

    // Use agent-specific system prompt
    const systemPrompt =
      agentConfig?.system_prompt ||
      `You are Clara, a warm and professional intake assistant for a mental health practice. 
       Keep responses conversational, concise, and natural for speech. 
       Avoid special characters or formatting. 
       Aim for 1-3 sentences unless more detail is requested.
       
       Your role is to:
       1. Gather basic intake information from new clients
       2. Schedule appointments  
       3. Take messages for the counselor
       4. Provide general information about services
       5. Handle crisis situations by directing to emergency services
       
       Always maintain a warm, professional tone and respect confidentiality.`

    // Prepare messages for Groq
    const messages = [
      ...conversationHistory.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: "user", content: message },
    ]

    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      system: systemPrompt,
      messages: messages,
      maxTokens: 150,
      temperature: 0.7,
    })

    return NextResponse.json({ response: text })
  } catch (error) {
    console.error("AI response generation error:", error)
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 })
  }
}
