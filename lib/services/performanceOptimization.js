/**
 * Performance Optimization Service
 * Caching, parallel processing, and response optimization
 */

// Response cache for common queries
const responseCache = new Map()
const intentCache = new Map()

// Cache TTL in milliseconds
const CACHE_TTL = Number.parseInt(process.env.CACHE_TTL_SECONDS || "3600") * 1000

export const CACHEABLE_INTENTS = ["hours", "location", "services", "insurance", "general_questions"]

import { generateAIResponse, classifyIntent } from "./aiService"

export function getCachedResponse(intent, userInput) {
  if (!CACHEABLE_INTENTS.includes(intent)) return null

  const cacheKey = `${intent}_${userInput.toLowerCase().trim()}`
  const cached = responseCache.get(cacheKey)

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log(`📋 Cache hit for: ${cacheKey}`)
    return cached.response
  }

  // Clean expired cache entry
  if (cached) {
    responseCache.delete(cacheKey)
  }

  return null
}

export function setCachedResponse(intent, userInput, response) {
  if (!CACHEABLE_INTENTS.includes(intent)) return

  const cacheKey = `${intent}_${userInput.toLowerCase().trim()}`
  responseCache.set(cacheKey, {
    response,
    timestamp: Date.now(),
  })

  console.log(`💾 Cached response for: ${cacheKey}`)
}

export async function generateOptimizedResponse(transcript, conversationHistory, callSid, emotionalState) {
  const startTime = Date.now()

  try {
    // Check cache first for common queries
    const cachedResponse = getCachedResponse("general", transcript)
    if (cachedResponse) {
      return {
        response: cachedResponse,
        cached: true,
        latency: Date.now() - startTime,
      }
    }

    // Parallel processing for better performance
    const [aiResponse, intentClassification] = await Promise.all([
      generateAIResponse(transcript, conversationHistory),
      classifyIntent(transcript),
    ])

    // Cache the response if appropriate
    if (intentClassification.intent && CACHEABLE_INTENTS.includes(intentClassification.intent)) {
      setCachedResponse(intentClassification.intent, transcript, aiResponse.response)
    }

    return {
      response: aiResponse.response,
      intent: intentClassification.intent,
      confidence: intentClassification.confidence,
      cached: false,
      latency: Date.now() - startTime,
    }
  } catch (error) {
    console.error("Error in optimized response generation:", error)
    return {
      response: "I'm sorry, I'm having trouble processing your request. Could you please try again?",
      error: true,
      latency: Date.now() - startTime,
    }
  }
}

export function preloadCommonResponses() {
  const commonQueries = [
    {
      intent: "hours",
      query: "what are your hours",
      response: "Our office hours are Monday through Friday, 9 AM to 5 PM.",
    },
    {
      intent: "location",
      query: "where are you located",
      response: "We're located at [Your Address]. We also offer telehealth appointments.",
    },
    {
      intent: "services",
      query: "what services do you offer",
      response:
        "We offer individual therapy, couples counseling, family therapy, and group sessions for various mental health concerns.",
    },
    {
      intent: "insurance",
      query: "do you take insurance",
      response:
        "We accept most major insurance plans including Blue Cross Blue Shield, Aetna, Cigna, and United Healthcare. We also offer self-pay options.",
    },
  ]

  commonQueries.forEach(({ intent, query, response }) => {
    setCachedResponse(intent, query, response)
  })

  console.log("🚀 Preloaded common responses")
}

// Initialize cache on startup
preloadCommonResponses()

export function clearExpiredCache() {
  const now = Date.now()
  let cleared = 0

  for (const [key, value] of responseCache.entries()) {
    if (now - value.timestamp > CACHE_TTL) {
      responseCache.delete(key)
      cleared++
    }
  }

  if (cleared > 0) {
    console.log(`🧹 Cleared ${cleared} expired cache entries`)
  }
}

// Clean cache every hour
setInterval(clearExpiredCache, 60 * 60 * 1000)
