/**
 * Enhanced Conversation Service with Complete Business Logic
 * MIGRATED: From OpenAI to Groq, integrated with multi-tenant database
 */
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"
import { createClient } from "@supabase/supabase-js"
import { detectEmotionalState, getEmpatheticResponse, getVoiceAdjustments } from "./emotionalIntelligence.js"
import { shouldEscalateCall, logCrisisCall } from "./callRouting.js"
import {
  adjustForAccessibility,
  adaptResponseForAccessibility,
  getAccessibilityPrompt,
} from "./accessibilityService.js"
import { trackConversationMetrics } from "./analyticsService.js"
import KnowledgeBaseService from "./knowledgeBaseService.js"
import { EnhancedIntakeFlow } from "./enhancedIntakeFlow.js"
import MessageHandlingService from "./messageHandlingService.js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

// Intent categories and their associated keywords/phrases
const INTENT_CATEGORIES = {
  existing_clients: [
    "billing",
    "my therapist",
    "my appointment",
    "insurance claim",
    "reschedule",
    "cancel appointment",
    "existing client",
    "current client",
    "already a client",
    "my session",
    "my counselor",
    "my therapy",
  ],
  new_appointment: [
    "new client",
    "first appointment",
    "start therapy",
    "become a client",
    "new patient",
    "begin counseling",
    "looking for a therapist",
    "need therapy",
    "want to schedule",
    "make an appointment",
    "book a session",
    "initial consultation",
  ],
  general_questions: [
    "hours",
    "location",
    "services",
    "insurance accepted",
    "address",
    "phone number",
    "website",
    "cost",
    "fees",
    "types of therapy",
    "specialties",
    "about your practice",
    "information",
    "how does it work",
  ],
  provider_availability: [
    "EAP",
    "provider availability",
    "accepting new clients",
    "available providers",
    "therapist availability",
    "openings",
    "availability",
    "provider network",
    "employee assistance program",
    "referral",
    "in-network provider",
  ],
  billing: ["billing", "payment", "insurance claim", "bill", "charge", "cost", "fee", "invoice"],
  appointment_changes: ["cancel", "reschedule", "change appointment", "move appointment", "different time"],
}

// Store active intake flows by call SID
const activeIntakeFlows = new Map()

// Minimum confidence threshold for intent classification
const MIN_CONFIDENCE_THRESHOLD = 0.6

/**
 * Generate AI response based on user input with complete business logic
 * @param {string} userInput - User input text
 * @param {Array} conversationHistory - Previous conversation exchanges
 * @param {string} callSid - Call SID for tracking
 * @returns {Promise<Object>} - AI response and detected intent
 */
export async function generateAIResponse(userInput, conversationHistory = [], callSid) {
  const startTime = Date.now()
  const metrics = {
    duration: 0,
    averageResponseTime: 0,
    intentConfidence: 0,
    detectedEmotion: "calm",
    escalated: false,
    intakeCompleted: false,
    totalExchanges: conversationHistory.length,
    cacheHitRate: 0,
    errorCount: 0,
    accessibilityAdjustments: {},
    conversationHistory: conversationHistory,
  }

  try {
    // Skip processing for empty or very short inputs
    if (!userInput || userInput.trim().length < 3) {
      return {
        response: "I'm sorry, I didn't catch that. Could you please repeat?",
        intent: null,
        confidence: 0,
        latency: Date.now() - startTime,
      }
    }

    // Get tenant configuration
    const { data: tenant } = await supabase
      .from("tenants")
      .select("id")
      .eq("business_name", "Caring Clarity Counseling")
      .single()

    if (!tenant) {
      throw new Error("Tenant not found")
    }

    // Initialize services
    const kbService = new KnowledgeBaseService(tenant.id)
    const messageService = new MessageHandlingService(tenant.id)

    // Detect emotional state
    const emotionalState = detectEmotionalState(userInput, conversationHistory)
    metrics.detectedEmotion = emotionalState

    // Check for crisis situations FIRST
    const escalationCheck = shouldEscalateCall(userInput, conversationHistory, emotionalState)
    if (escalationCheck.escalate && escalationCheck.priority === "CRISIS") {
      metrics.escalated = true

      // Log crisis call and send immediate notification
      await logCrisisCall(callSid, userInput, escalationCheck)
      await messageService.sendCrisisMessage(
        { name: "Unknown Caller", phone: "Unknown", email: "Unknown" },
        userInput,
        callSid,
      )

      // Return crisis response immediately
      const crisisResponse = escalationCheck.crisisResponse

      // Track metrics for crisis call
      metrics.duration = Date.now() - startTime
      await trackConversationMetrics(callSid, metrics)

      return {
        response: crisisResponse.immediateResponse,
        intent: "crisis",
        confidence: 1.0,
        escalation: escalationCheck,
        crisis: true,
        latency: Date.now() - startTime,
      }
    }

    // Check if we have an active intake flow
    let intakeFlow = activeIntakeFlows.get(callSid)

    // Classify intent
    const intentData = classifyIntentByKeywords(userInput)
    const intent = intentData.intent
    const confidence = intentData.confidence
    metrics.intentConfidence = confidence

    // Handle special business cases first
    const specialCase = await kbService.handleSpecialCases(userInput, intent)
    if (specialCase) {
      // Handle message collection for special cases
      if (specialCase.requiresMessage) {
        const callerInfo = extractCallerInfo(userInput, conversationHistory)

        if (specialCase.messageType === "billing") {
          await messageService.sendBillingMessage(callerInfo, userInput, callSid)
        } else if (specialCase.messageType === "appointment") {
          await messageService.sendAppointmentMessage(callerInfo, userInput, "Not specified", callSid)
        }

        return {
          response: specialCase.response + " I'll make sure someone gets back to you quickly.",
          intent: intent,
          confidence: 1.0,
          specialHandling: specialCase,
          latency: Date.now() - startTime,
        }
      }

      return {
        response: specialCase.response,
        intent: specialCase.intent || intent,
        confidence: 1.0,
        specialHandling: specialCase,
        latency: Date.now() - startTime,
      }
    }

    // Handle new client inquiries with intake flow
    if (intent === "new_appointment" || (intakeFlow && !intakeFlow.intakeCompleted)) {
      if (!intakeFlow) {
        intakeFlow = new EnhancedIntakeFlow(callSid, tenant.id)
        activeIntakeFlows.set(callSid, intakeFlow)
      }

      const intakeResult = await intakeFlow.processNewClientInquiry(userInput, conversationHistory)

      if (intakeResult.intakeCompleted) {
        metrics.intakeCompleted = true
        activeIntakeFlows.delete(callSid) // Clean up completed intake
      }

      if (intakeResult.endIntake) {
        activeIntakeFlows.delete(callSid) // Clean up ended intake
      }

      return {
        response: intakeResult.response,
        intent: "new_appointment",
        confidence: 1.0,
        intakeStage: intakeResult.stage,
        intakeCompleted: intakeResult.intakeCompleted || false,
        latency: Date.now() - startTime,
      }
    }

    // Handle existing client requests
    if (intent === "existing_clients") {
      return await handleExistingClientRequest(userInput, callSid, messageService, kbService)
    }

    // Handle billing questions
    if (intent === "billing") {
      const callerInfo = extractCallerInfo(userInput, conversationHistory)
      await messageService.sendBillingMessage(callerInfo, userInput, callSid)

      return {
        response:
          "I'll take your information and have our billing team respond quickly. They'll get back to you shortly.",
        intent: "billing",
        confidence: 1.0,
        latency: Date.now() - startTime,
      }
    }

    // Handle appointment changes
    if (intent === "appointment_changes") {
      const callerInfo = extractCallerInfo(userInput, conversationHistory)
      await messageService.sendAppointmentMessage(callerInfo, userInput, "Not specified", callSid)

      return {
        response:
          "I can help you with that appointment change. Just a reminder that if an appointment is canceled with less than 24 hours' notice, a $125 late cancellation fee may apply. I'll have someone contact you shortly to assist with rescheduling.",
        intent: "appointment_changes",
        confidence: 1.0,
        latency: Date.now() - startTime,
      }
    }

    // Handle provider availability inquiries
    if (intent === "provider_availability") {
      const providers = await kbService.getProviders()
      return {
        response:
          "Great news! We have open availability and are currently accepting new referrals. We can get members scheduled within 48 business hours. Would you like me to start the intake process for a new client?",
        intent: "provider_availability",
        confidence: 1.0,
        providers: providers,
        latency: Date.now() - startTime,
      }
    }

    // Try to find answer in knowledge base
    const kbAnswer = await kbService.findAnswer(userInput, intent)
    if (kbAnswer) {
      return {
        response: kbAnswer,
        intent: intent,
        confidence: 0.9,
        source: "knowledge_base",
        latency: Date.now() - startTime,
      }
    }

    // Check accessibility needs
    const accessibilityAdjustments = adjustForAccessibility(userInput, conversationHistory)
    metrics.accessibilityAdjustments = accessibilityAdjustments

    // Generate AI response as fallback
    const { data: agentConfig } = await supabase
      .from("agent_configs")
      .select("*")
      .eq("tenant_id", tenant.id)
      .eq("active", true)
      .single()

    // Prepare system prompt with business context
    let systemPrompt =
      agentConfig?.system_prompt ||
      `You are Clara, a virtual assistant for Caring Clarity Counseling, a therapy practice. 
      Be warm, professional, and empathetic. Keep responses concise and conversational (1-3 sentences).
      
      Key business information:
      - We provide telehealth services only (no in-person)
      - We don't accept Medicaid or Medicare
      - We only work with children 10 years and older
      - We accept: Aetna, Cigna, Horizon BCBS, Magellan, MHC, Evernorth, United, Optum, Care Bridge EAP
      - 24-hour cancellation policy with $125 fee
      - We have providers in NJ and PA
      - Phone: 855-968-7862
      
      If you don't know an answer, offer to take a message and have someone call back.
      Never make up information. Speak as if you're having a real-time phone conversation.`

    // Add accessibility prompt if needed
    if (accessibilityAdjustments.useSimpleLanguage || accessibilityAdjustments.shorterSentences) {
      systemPrompt += " " + getAccessibilityPrompt(accessibilityAdjustments)
    }

    const messages = [
      ...conversationHistory.map((exchange) => ({
        role: exchange.role || "user",
        content: exchange.content,
      })),
      { role: "user", content: userInput },
    ]

    // Generate AI response using Groq
    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      system: systemPrompt,
      messages: messages,
      temperature: 0.7,
      maxTokens: 150,
    })

    let response = text || "I'm sorry, I'm having trouble understanding. Could you please repeat that?"

    // Apply empathetic response based on emotional state
    response = getEmpatheticResponse(emotionalState, response)

    // Apply accessibility adaptations
    response = adaptResponseForAccessibility(response, accessibilityAdjustments)

    // If we still don't have a good answer, offer to take a message
    if (response.length < 20 || response.includes("I don't know")) {
      const callerInfo = extractCallerInfo(userInput, conversationHistory)
      await messageService.sendMessage({
        type: "general",
        urgency: "medium",
        callerInfo,
        content: `General inquiry: ${userInput}`,
        callSid,
      })

      response =
        "I don't have that specific information right now, but I'll take your details and have someone from our team get back to you with an answer. Could you please give me your name and phone number?"
    }

    // Calculate final metrics
    metrics.duration = Date.now() - startTime
    metrics.averageResponseTime = metrics.duration

    // Track conversation metrics
    await trackConversationMetrics(callSid, metrics)

    console.log(`Intent classified for call ${callSid}: ${intent} (confidence: ${confidence})`)
    console.log(`Emotional state: ${emotionalState}`)
    console.log(`Response time: ${metrics.duration}ms`)

    return {
      response: response,
      intent: intent,
      confidence: confidence,
      emotionalState: emotionalState,
      accessibility: accessibilityAdjustments,
      voiceAdjustments: getVoiceAdjustments(emotionalState),
      latency: metrics.duration,
    }
  } catch (error) {
    console.error(`Error generating AI response: ${error.message}`)
    metrics.errorCount = 1
    metrics.duration = Date.now() - startTime

    // Track error metrics
    await trackConversationMetrics(callSid, metrics)

    // Return fallback response
    return {
      response: "I'm sorry, I'm having trouble processing your request right now. Could you please try again?",
      intent: null,
      confidence: 0.0,
      error: true,
      latency: metrics.duration,
    }
  }
}

async function handleExistingClientRequest(userInput, callSid, messageService, kbService) {
  const text = userInput.toLowerCase()

  if (text.includes("billing") || text.includes("payment") || text.includes("insurance")) {
    const callerInfo = extractCallerInfo(userInput, [])
    await messageService.sendBillingMessage(callerInfo, userInput, callSid)
    return {
      response:
        "I'll connect you with our billing team. They'll get back to you quickly to help with your billing question.",
      intent: "existing_clients",
      confidence: 1.0,
    }
  }

  if (text.includes("cancel") || text.includes("reschedule") || text.includes("change")) {
    const callerInfo = extractCallerInfo(userInput, [])
    await messageService.sendAppointmentMessage(callerInfo, userInput, "Not specified", callSid)
    return {
      response:
        "I can help you with that appointment change. Just a reminder that if an appointment is canceled with less than 24 hours' notice, a $125 late cancellation fee may apply. I'll have Jessica contact you shortly.",
      intent: "existing_clients",
      confidence: 1.0,
    }
  }

  // General existing client inquiry
  const callerInfo = extractCallerInfo(userInput, [])
  await messageService.sendMessage({
    type: "general",
    urgency: "medium",
    callerInfo,
    content: `Existing client inquiry: ${userInput}`,
    callSid,
  })

  return {
    response: "I'll take your information and have someone from our team get back to you to help with your request.",
    intent: "existing_clients",
    confidence: 1.0,
  }
}

function extractCallerInfo(userInput, conversationHistory) {
  // Try to extract caller information from input and history
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/
  const phoneRegex = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/

  const email = userInput.match(emailRegex)
  const phone = userInput.match(phoneRegex)

  // Look for name patterns
  let name = "Unknown Caller"
  const nameMatch = userInput.match(/(?:my name is|i'm|i am|this is)\s+([a-zA-Z\s]+)/i)
  if (nameMatch) {
    name = nameMatch[1].trim()
  }

  return {
    name,
    phone: phone ? phone[0] : "Not provided",
    email: email ? email[0] : "Not provided",
  }
}

/**
 * Classify intent based on keywords in user input
 */
function classifyIntentByKeywords(userInput) {
  const normalizedInput = userInput.toLowerCase()
  const matches = {}
  let totalMatches = 0

  for (const [intent, keywords] of Object.entries(INTENT_CATEGORIES)) {
    matches[intent] = 0

    for (const keyword of keywords) {
      if (normalizedInput.includes(keyword.toLowerCase())) {
        matches[intent]++
        totalMatches++
      }
    }
  }

  let bestIntent = null
  let maxMatches = 0

  for (const [intent, count] of Object.entries(matches)) {
    if (count > maxMatches) {
      maxMatches = count
      bestIntent = intent
    }
  }

  const confidence = totalMatches > 0 ? maxMatches / totalMatches : 0

  if (confidence < MIN_CONFIDENCE_THRESHOLD) {
    return {
      intent: null,
      confidence: confidence,
      reasoning: "Insufficient keyword matches for confident classification",
    }
  }

  return {
    intent: bestIntent,
    confidence: confidence,
    reasoning: `Matched ${maxMatches} keywords for ${bestIntent} intent`,
  }
}

// Clean up completed intake flows periodically
setInterval(
  () => {
    const now = Date.now()
    for (const [callSid, intakeFlow] of activeIntakeFlows.entries()) {
      // Remove intake flows older than 1 hour
      if (now - intakeFlow.createdAt > 60 * 60 * 1000) {
        activeIntakeFlows.delete(callSid)
        console.log(`🧹 Cleaned up expired intake flow for call ${callSid}`)
      }
    }
  },
  10 * 60 * 1000,
) // Run every 10 minutes

export const conversationService = {
  generateAIResponse,
}

export default conversationService
