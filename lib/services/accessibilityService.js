/**
 * Accessibility Service
 * Ensures inclusive experience for all users
 */

export function adjustForAccessibility(userInput, conversationHistory) {
  const text = userInput.toLowerCase()

  const adjustments = {
    adjustAudio: false,
    volume: "normal",
    speakSlower: false,
    useSimpleLanguage: false,
    avoidJargon: true, // Always avoid jargon in healthcare
    shorterSentences: false,
    offerTextAlternative: false,
    sendSMS: false,
    repeatInformation: false,
  }

  // Detect hearing difficulties
  if (
    text.includes("speak louder") ||
    text.includes("can't hear") ||
    text.includes("volume") ||
    text.includes("louder")
  ) {
    adjustments.adjustAudio = true
    adjustments.volume = "high"
    adjustments.speakSlower = true
  }

  // Detect need for slower speech
  if (text.includes("slower") || text.includes("too fast") || text.includes("slow down")) {
    adjustments.speakSlower = true
  }

  // Detect need for simpler language
  if (
    text.includes("don't understand") ||
    text.includes("simpler") ||
    text.includes("explain") ||
    text.includes("what does that mean")
  ) {
    adjustments.useSimpleLanguage = true
    adjustments.shorterSentences = true
    adjustments.repeatInformation = true
  }

  // Detect preference for text communication
  if (text.includes("text") || text.includes("write") || text.includes("sms") || text.includes("message")) {
    adjustments.offerTextAlternative = true
    adjustments.sendSMS = true
  }

  // Detect cognitive load issues
  if (text.includes("confused") || text.includes("overwhelmed") || text.includes("too much")) {
    adjustments.shorterSentences = true
    adjustments.useSimpleLanguage = true
    adjustments.speakSlower = true
  }

  return adjustments
}

export function adaptResponseForAccessibility(response, adjustments) {
  let adaptedResponse = response

  if (adjustments.useSimpleLanguage) {
    // Replace complex words with simpler alternatives
    const replacements = {
      utilize: "use",
      facilitate: "help",
      assistance: "help",
      appointment: "meeting",
      consultation: "meeting",
      therapeutic: "helpful",
      intervention: "help",
      assessment: "check",
    }

    for (const [complex, simple] of Object.entries(replacements)) {
      adaptedResponse = adaptedResponse.replace(new RegExp(complex, "gi"), simple)
    }
  }

  if (adjustments.shorterSentences) {
    // Break long sentences into shorter ones
    adaptedResponse = adaptedResponse
      .split(". ")
      .map((sentence) => {
        if (sentence.length > 50) {
          // Try to break at natural pause points
          return sentence.replace(/,\s+/g, ". ")
        }
        return sentence
      })
      .join(". ")
  }

  if (adjustments.repeatInformation) {
    // Add confirmation phrases
    adaptedResponse = adaptedResponse + " Does that make sense to you?"
  }

  return adaptedResponse
}

export function getAccessibilityPrompt(adjustments) {
  let prompt = ""

  if (adjustments.useSimpleLanguage) {
    prompt += "Use simple, clear language. Avoid medical jargon. "
  }

  if (adjustments.shorterSentences) {
    prompt += "Keep sentences short and clear. "
  }

  if (adjustments.repeatInformation) {
    prompt += "Be prepared to repeat or rephrase information. "
  }

  return prompt
}
