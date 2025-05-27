/**
 * Knowledge Base Service
 * Handles business-specific information retrieval
 */
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

// Cache for knowledge base responses
const kbCache = new Map()
const CACHE_TTL = 30 * 60 * 1000 // 30 minutes

export class KnowledgeBaseService {
  constructor(tenantId) {
    this.tenantId = tenantId
  }

  async findAnswer(question, category = null) {
    try {
      const cacheKey = `${this.tenantId}_${question.toLowerCase()}`
      const cached = kbCache.get(cacheKey)

      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.answer
      }

      // Search knowledge base
      let query = supabase.from("knowledge_base").select("*").eq("tenant_id", this.tenantId).eq("active", true)

      if (category) {
        query = query.eq("category", category)
      }

      const { data: kbEntries } = await query

      if (!kbEntries || kbEntries.length === 0) {
        return null
      }

      // Find best match using keyword matching
      const bestMatch = this.findBestMatch(question, kbEntries)

      if (bestMatch) {
        // Cache the result
        kbCache.set(cacheKey, {
          answer: bestMatch.answer,
          timestamp: Date.now(),
        })

        return bestMatch.answer
      }

      return null
    } catch (error) {
      console.error("Error searching knowledge base:", error)
      return null
    }
  }

  findBestMatch(question, entries) {
    const questionLower = question.toLowerCase()
    let bestMatch = null
    let highestScore = 0

    for (const entry of entries) {
      let score = 0

      // Check if question contains keywords
      if (entry.keywords && entry.keywords.length > 0) {
        for (const keyword of entry.keywords) {
          if (questionLower.includes(keyword.toLowerCase())) {
            score += 2
          }
        }
      }

      // Check if question matches the stored question
      if (
        questionLower.includes(entry.question.toLowerCase()) ||
        entry.question.toLowerCase().includes(questionLower)
      ) {
        score += 3
      }

      // Priority boost
      score += entry.priority || 0

      if (score > highestScore) {
        highestScore = score
        bestMatch = entry
      }
    }

    return highestScore > 0 ? bestMatch : null
  }

  async getBusinessInfo() {
    try {
      const { data } = await supabase.from("business_info").select("*").eq("tenant_id", this.tenantId).single()

      return data
    } catch (error) {
      console.error("Error getting business info:", error)
      return null
    }
  }

  async getProviders(state = null) {
    try {
      let query = supabase.from("providers").select("*").eq("tenant_id", this.tenantId).eq("active", true)

      if (state) {
        query = query.contains("states", [state])
      }

      const { data } = await query
      return data || []
    } catch (error) {
      console.error("Error getting providers:", error)
      return []
    }
  }

  async getInsuranceInfo(insuranceName = null) {
    try {
      let query = supabase.from("insurance_providers").select("*").eq("tenant_id", this.tenantId)

      if (insuranceName) {
        query = query.ilike("name", `%${insuranceName}%`)
      }

      const { data } = await query
      return data || []
    } catch (error) {
      console.error("Error getting insurance info:", error)
      return []
    }
  }

  // Handle specific business logic
  async handleSpecialCases(userInput, intent) {
    const text = userInput.toLowerCase()

    // Care management organization inquiry
    if (text.includes("care management") || text.includes("cmo") || text.includes("care manager")) {
      return {
        response:
          "For Intensive In-Community (IIC) program inquiries, you'll need to contact Erik Coleman directly at 856-340-2991.",
        requiresTransfer: true,
        transferInfo: { name: "Erik Coleman", phone: "856-340-2991" },
      }
    }

    // Billing questions
    if (intent === "billing" || text.includes("billing") || text.includes("payment")) {
      return {
        response:
          "I'll take your information and have our billing team respond quickly. Let me get your name, phone number, and email address.",
        requiresMessage: true,
        messageType: "billing",
        contactInfo: { name: "Jessica", phone: "856-889-8434", method: "text" },
      }
    }

    // Appointment changes
    if (text.includes("cancel") || text.includes("reschedule") || text.includes("change appointment")) {
      return {
        response:
          "I can help you with that appointment change. Just a reminder that if an appointment is canceled with less than 24 hours' notice, a $125 late cancellation fee may apply. Let me get your information and availability for a new appointment.",
        requiresMessage: true,
        messageType: "appointment",
        contactInfo: { name: "Jessica", phone: "856-889-8434", method: "text" },
      }
    }

    // EAP provider availability
    if (text.includes("aetna eap") || text.includes("provider availability") || text.includes("eap")) {
      return {
        response:
          "Great news! We have open availability and are currently accepting new referrals. We can get members scheduled within 48 business hours.",
        intent: "provider_availability",
      }
    }

    return null
  }
}

export async function initializeKnowledgeBase(tenantId) {
  try {
    // Check if knowledge base exists for tenant
    const { data: existing } = await supabase.from("knowledge_base").select("id").eq("tenant_id", tenantId).limit(1)

    if (existing && existing.length > 0) {
      console.log(`Knowledge base already exists for tenant ${tenantId}`)
      return
    }

    // Initialize with default Caring Clarity data
    await seedCaringClarityKnowledgeBase(tenantId)
    console.log(`✅ Knowledge base initialized for tenant ${tenantId}`)
  } catch (error) {
    console.error("Error initializing knowledge base:", error)
  }
}

async function seedCaringClarityKnowledgeBase(tenantId) {
  // This will be populated with your specific business data
  // We'll create this in the next step
}

export default KnowledgeBaseService
