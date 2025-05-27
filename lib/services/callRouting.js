/**
 * Intelligent Call Routing Service with Crisis Intervention
 */
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

export const ESCALATION_TRIGGERS = {
  CRISIS_KEYWORDS: [
    "suicide",
    "kill myself",
    "end it all",
    "want to die",
    "hurt myself",
    "emergency",
    "crisis",
    "911",
    "police",
    "ambulance",
  ],
  COMPLEX_REQUESTS: [
    "insurance authorization",
    "billing dispute",
    "provider complaint",
    "medical records",
    "prescription",
    "medication",
  ],
  REPEATED_CONFUSION: 3, // Number of "I don't understand" responses
}

export const ESCALATION_ACTIONS = {
  CRISIS_TRANSFER: "CRISIS_TRANSFER",
  EMERGENCY_SERVICES: "EMERGENCY_SERVICES",
  IMMEDIATE_CALLBACK: "IMMEDIATE_CALLBACK",
  SCHEDULE_CALLBACK: "SCHEDULE_CALLBACK",
  OFFER_HUMAN_TRANSFER: "OFFER_HUMAN_TRANSFER",
  PROVIDE_RESOURCES: "PROVIDE_RESOURCES",
}

export function shouldEscalateCall(transcript, conversationHistory, emotionalState) {
  const text = transcript.toLowerCase()

  // CRISIS DETECTION - HIGHEST PRIORITY
  if (ESCALATION_TRIGGERS.CRISIS_KEYWORDS.some((keyword) => text.includes(keyword))) {
    return {
      escalate: true,
      priority: "CRISIS",
      reason: "Crisis keywords detected",
      action: ESCALATION_ACTIONS.CRISIS_TRANSFER,
      immediateAction: true,
      crisisResponse: getCrisisResponse(text),
    }
  }

  // Emotional state-based escalation
  if (emotionalState === "CRISIS") {
    return {
      escalate: true,
      priority: "CRISIS",
      reason: "Crisis emotional state detected",
      action: ESCALATION_ACTIONS.CRISIS_TRANSFER,
      immediateAction: true,
      crisisResponse: getCrisisResponse(text),
    }
  }

  // Complex request detection
  if (ESCALATION_TRIGGERS.COMPLEX_REQUESTS.some((request) => text.includes(request))) {
    return {
      escalate: true,
      priority: "HIGH",
      reason: "Complex request requiring human assistance",
      action: ESCALATION_ACTIONS.SCHEDULE_CALLBACK,
      immediateAction: false,
    }
  }

  // Repeated confusion
  const confusionCount = conversationHistory.filter((msg) =>
    msg.content?.toLowerCase().includes("don't understand"),
  ).length

  if (confusionCount >= ESCALATION_TRIGGERS.REPEATED_CONFUSION) {
    return {
      escalate: true,
      priority: "MEDIUM",
      reason: "Repeated confusion detected",
      action: ESCALATION_ACTIONS.OFFER_HUMAN_TRANSFER,
      immediateAction: false,
    }
  }

  // High distress without crisis keywords
  if (emotionalState === "DISTRESSED") {
    return {
      escalate: false, // Don't escalate yet, but flag for monitoring
      priority: "MEDIUM",
      reason: "High distress detected",
      action: ESCALATION_ACTIONS.PROVIDE_RESOURCES,
      immediateAction: false,
      monitorClosely: true,
    }
  }

  return { escalate: false }
}

export function getCrisisResponse(transcript) {
  const text = transcript.toLowerCase()

  if (text.includes("suicide") || text.includes("kill myself") || text.includes("want to die")) {
    return {
      immediateResponse:
        "I'm very concerned about what you're telling me. Your life is valuable and there are people who want to help. I need to connect you with someone who can provide immediate support. Please stay on the line while I transfer you to emergency services.",
      transferTo: "911",
      resources: [
        "National Suicide Prevention Lifeline: 988",
        "Crisis Text Line: Text HOME to 741741",
        "Emergency Services: 911",
      ],
      followUpRequired: true,
    }
  }

  if (text.includes("emergency") || text.includes("911")) {
    return {
      immediateResponse:
        "This sounds like an emergency situation. I'm going to connect you with emergency services right away. Please stay on the line.",
      transferTo: "911",
      resources: ["Emergency Services: 911"],
      followUpRequired: true,
    }
  }

  return {
    immediateResponse:
      "I'm concerned about what you're sharing with me. Your safety is very important. Let me connect you with someone who can provide immediate support.",
    transferTo: "CRISIS_HOTLINE",
    resources: [
      "National Suicide Prevention Lifeline: 988",
      "Crisis Text Line: Text HOME to 741741",
      "Emergency Services: 911",
    ],
    followUpRequired: true,
  }
}

export async function logCrisisCall(callSid, transcript, escalationData) {
  try {
    await supabase.from("crisis_logs").insert({
      call_sid: callSid,
      transcript_excerpt: transcript.substring(0, 500),
      escalation_reason: escalationData.reason,
      action_taken: escalationData.action,
      priority: escalationData.priority,
      timestamp: new Date().toISOString(),
      follow_up_required: escalationData.followUpRequired || false,
    })

    console.log(`🚨 Crisis call logged for ${callSid}`)
  } catch (error) {
    console.error("Error logging crisis call:", error)
  }
}
