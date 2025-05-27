/**
 * Emotional Intelligence Service
 * Detects emotional state and adjusts responses accordingly
 */

export const EMOTIONAL_STATES = {
  DISTRESSED: "distressed",
  ANXIOUS: "anxious",
  FRUSTRATED: "frustrated",
  CALM: "calm",
  CONFUSED: "confused",
  URGENT: "urgent",
  CRISIS: "crisis",
}

export function detectEmotionalState(transcript, conversationHistory) {
  const text = transcript.toLowerCase()

  // Crisis indicators - highest priority
  if (
    text.includes("suicide") ||
    text.includes("kill myself") ||
    text.includes("end it all") ||
    text.includes("want to die") ||
    text.includes("emergency") ||
    text.includes("crisis")
  ) {
    return EMOTIONAL_STATES.CRISIS
  }

  // Distress indicators
  if (
    text.includes("help me") ||
    text.includes("desperate") ||
    text.includes("can't cope") ||
    text.includes("breaking down")
  ) {
    return EMOTIONAL_STATES.DISTRESSED
  }

  // Anxiety indicators
  if (
    text.includes("worried") ||
    text.includes("anxious") ||
    text.includes("scared") ||
    text.includes("panic") ||
    text.includes("overwhelmed")
  ) {
    return EMOTIONAL_STATES.ANXIOUS
  }

  // Frustration indicators
  if (
    text.includes("frustrated") ||
    text.includes("angry") ||
    text.includes("upset") ||
    text.includes("mad") ||
    text.includes("irritated")
  ) {
    return EMOTIONAL_STATES.FRUSTRATED
  }

  // Confusion indicators
  if (
    text.includes("confused") ||
    text.includes("don't understand") ||
    text.includes("what do you mean") ||
    text.includes("unclear")
  ) {
    return EMOTIONAL_STATES.CONFUSED
  }

  // Urgency indicators
  if (text.includes("urgent") || text.includes("asap") || text.includes("immediately") || text.includes("right now")) {
    return EMOTIONAL_STATES.URGENT
  }

  return EMOTIONAL_STATES.CALM
}

export function getEmpatheticResponse(emotionalState, baseResponse) {
  const empathyPrefixes = {
    [EMOTIONAL_STATES.CRISIS]:
      "I'm very concerned about what you're telling me. Your safety is the most important thing right now. ",
    [EMOTIONAL_STATES.DISTRESSED]: "I can hear that you're going through a really difficult time right now. ",
    [EMOTIONAL_STATES.ANXIOUS]: "I understand this can feel overwhelming, and those feelings are completely valid. ",
    [EMOTIONAL_STATES.FRUSTRATED]: "I can sense your frustration, and that's completely understandable. ",
    [EMOTIONAL_STATES.CONFUSED]: "Let me help clarify that for you in a simpler way. ",
    [EMOTIONAL_STATES.URGENT]:
      "I understand this feels urgent for you, and I want to help you as quickly as possible. ",
  }

  const prefix = empathyPrefixes[emotionalState] || ""
  return prefix + baseResponse
}

export function getVoiceAdjustments(emotionalState) {
  const adjustments = {
    [EMOTIONAL_STATES.CRISIS]: {
      speed: 0.9, // Slower, more deliberate
      tone: "calm",
      volume: 0.8,
    },
    [EMOTIONAL_STATES.DISTRESSED]: {
      speed: 0.9,
      tone: "gentle",
      volume: 0.7,
    },
    [EMOTIONAL_STATES.ANXIOUS]: {
      speed: 0.8, // Slower to reduce anxiety
      tone: "soothing",
      volume: 0.7,
    },
    [EMOTIONAL_STATES.FRUSTRATED]: {
      speed: 0.9,
      tone: "understanding",
      volume: 0.8,
    },
    [EMOTIONAL_STATES.CONFUSED]: {
      speed: 0.8, // Slower for clarity
      tone: "clear",
      volume: 0.9,
    },
    [EMOTIONAL_STATES.URGENT]: {
      speed: 1.1, // Slightly faster
      tone: "efficient",
      volume: 0.9,
    },
  }

  return adjustments[emotionalState] || { speed: 1.0, tone: "neutral", volume: 0.8 }
}
