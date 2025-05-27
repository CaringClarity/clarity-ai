/**
 * Intelligent Intake Flow Service
 * Guides users through information collection naturally
 */
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

export const INTAKE_STAGES = {
  GREETING: "greeting",
  REASON_FOR_CALL: "reason_for_call",
  CONTACT_INFO: "contact_info",
  INSURANCE_INFO: "insurance_info",
  SCHEDULING: "scheduling",
  CONFIRMATION: "confirmation",
  COMPLETION: "completion",
}

export class IntakeFlowManager {
  constructor(callSid, tenantId) {
    this.callSid = callSid
    this.tenantId = tenantId
    this.currentStage = INTAKE_STAGES.GREETING
    this.collectedInfo = {}
    this.missingInfo = []
    this.attemptCount = {}
  }

  async getNextQuestion() {
    switch (this.currentStage) {
      case INTAKE_STAGES.GREETING:
        return "How can I help you today?"

      case INTAKE_STAGES.REASON_FOR_CALL:
        // Check if this is a new client inquiry
        if (this.collectedInfo.isNewClient) {
          return "I'm happy to help get you scheduled. First I should mention, we provide telehealth services only, we don't accept Medicaid or Medicare, and if services are for a child, we only work with children ages 10 and older. Does that work for you?"
        }
        return "Could you tell me a bit about what brings you to seek counseling services?"

      case INTAKE_STAGES.CONTACT_INFO:
        if (!this.collectedInfo.serviceType) {
          return "What type of service are you looking for? Individual therapy, couples counseling, or child therapy?"
        }
        if (!this.collectedInfo.firstName) {
          return "Great! Let me gather some information to get you started. What's your first name?"
        }
        if (!this.collectedInfo.lastName) {
          return "And your last name?"
        }
        if (!this.collectedInfo.email) {
          return "What's the best email address to reach you at?"
        }
        if (!this.collectedInfo.phone) {
          return "And a good phone number for you?"
        }
        if (!this.collectedInfo.state) {
          return "What state do you live in? We provide services in New Jersey and Pennsylvania."
        }
        if (!this.collectedInfo.insurance) {
          return "What insurance provider do you have?"
        }

        // Child-specific questions
        if (this.collectedInfo.serviceType === "child" && !this.collectedInfo.childName) {
          return "What's your child's name?"
        }

        // Couples-specific questions
        if (this.collectedInfo.serviceType === "couples" && !this.collectedInfo.partnerName) {
          return "What's your partner's name?"
        }
        if (this.collectedInfo.serviceType === "couples" && !this.collectedInfo.partnerEmail) {
          return "And your partner's email address?"
        }
        if (this.collectedInfo.serviceType === "couples" && !this.collectedInfo.partnerPhone) {
          return "And your partner's phone number?"
        }

        if (!this.collectedInfo.availability) {
          return "What days and times work best for you for appointments?"
        }
        break

      case INTAKE_STAGES.CONFIRMATION:
        return this.generateConfirmationSummary()

      case INTAKE_STAGES.COMPLETION:
        return "Perfect! I have all your information. Someone from our team will contact you within 24 hours to schedule your appointment. Is there anything else I can help you with today?"
    }

    return "How else can I assist you today?"
  }

  handleDisclaimerResponse(userInput) {
    const text = userInput.toLowerCase()

    if (text.includes("yes") || text.includes("that works") || text.includes("okay") || text.includes("ok")) {
      this.collectedInfo.disclaimerAccepted = true
      this.currentStage = INTAKE_STAGES.CONTACT_INFO
      return true
    } else if (
      text.includes("no") ||
      text.includes("medicaid") ||
      text.includes("medicare") ||
      text.includes("in person")
    ) {
      this.collectedInfo.disclaimerAccepted = false
      return false
    }

    return null // Unclear response
  }

  async processResponse(userInput, detectedIntent) {
    // Handle disclaimer stage
    if (
      this.currentStage === INTAKE_STAGES.REASON_FOR_CALL &&
      this.collectedInfo.isNewClient &&
      !this.collectedInfo.disclaimerAccepted
    ) {
      const disclaimerResult = this.handleDisclaimerResponse(userInput)

      if (disclaimerResult === false) {
        return {
          response:
            "I understand. Unfortunately, we may not be the right fit for your needs. You might want to contact your insurance provider for other options, or look for providers who accept Medicaid/Medicare or offer in-person services.",
          endCall: true,
        }
      } else if (disclaimerResult === null) {
        return {
          response:
            "Just to clarify - are you okay with telehealth-only services, and do you have private insurance other than Medicaid or Medicare?",
          needsClarification: true,
        }
      }
      // If accepted, continue to contact info collection
      this.currentStage = INTAKE_STAGES.CONTACT_INFO
      return
    }

    // Rest of the existing processResponse logic...
    switch (this.currentStage) {
      case INTAKE_STAGES.REASON_FOR_CALL:
        this.collectedInfo.reason = userInput
        // Check if this is a new client
        if (
          detectedIntent === "new_appointment" ||
          userInput.toLowerCase().includes("new client") ||
          userInput.toLowerCase().includes("schedule")
        ) {
          this.collectedInfo.isNewClient = true
        }
        break

      case INTAKE_STAGES.CONTACT_INFO:
        await this.extractContactInfo(userInput)
        break

      case INTAKE_STAGES.INSURANCE_INFO:
        this.extractInsuranceInfo(userInput)
        this.currentStage = INTAKE_STAGES.SCHEDULING
        break

      case INTAKE_STAGES.SCHEDULING:
        this.extractSchedulingInfo(userInput)
        this.currentStage = INTAKE_STAGES.CONFIRMATION
        break

      case INTAKE_STAGES.CONFIRMATION:
        if (userInput.toLowerCase().includes("yes") || userInput.toLowerCase().includes("correct")) {
          await this.saveIntakeData()
          this.currentStage = INTAKE_STAGES.COMPLETION
        } else {
          this.currentStage = INTAKE_STAGES.CONTACT_INFO // Start over
        }
        break
    }
  }

  async extractContactInfo(input) {
    // Email extraction
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/
    const phoneRegex = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/

    const email = input.match(emailRegex)
    const phone = input.match(phoneRegex)

    if (email) {
      this.collectedInfo.email = email[0]
    }
    if (phone) {
      this.collectedInfo.phone = phone[0]
    }

    // Name extraction (when asking for name specifically)
    if (!this.collectedInfo.name && !email && !phone) {
      // Clean up the name (remove common prefixes)
      let name = input.trim()
      name = name.replace(/^(my name is|i'm|i am|this is|it's)\s+/i, "")
      this.collectedInfo.name = name
    }

    // Check if we have all contact info
    if (this.collectedInfo.name && this.collectedInfo.email && this.collectedInfo.phone) {
      this.currentStage = INTAKE_STAGES.INSURANCE_INFO
    }
  }

  extractInsuranceInfo(input) {
    const text = input.toLowerCase()

    if (text.includes("out of pocket") || text.includes("self pay") || text.includes("no insurance")) {
      this.collectedInfo.insurance = "Self-pay"
    } else if (text.includes("blue cross") || text.includes("bcbs")) {
      this.collectedInfo.insurance = "Blue Cross Blue Shield"
    } else if (text.includes("aetna")) {
      this.collectedInfo.insurance = "Aetna"
    } else if (text.includes("cigna")) {
      this.collectedInfo.insurance = "Cigna"
    } else if (text.includes("united")) {
      this.collectedInfo.insurance = "United Healthcare"
    } else if (text.includes("yes") || text.includes("have insurance")) {
      this.collectedInfo.insurance = "Has insurance (details needed)"
    } else {
      this.collectedInfo.insurance = input.trim()
    }
  }

  extractSchedulingInfo(input) {
    const text = input.toLowerCase()

    // Extract day preferences
    const days = []
    if (text.includes("monday") || text.includes("mon")) days.push("Monday")
    if (text.includes("tuesday") || text.includes("tue")) days.push("Tuesday")
    if (text.includes("wednesday") || text.includes("wed")) days.push("Wednesday")
    if (text.includes("thursday") || text.includes("thu")) days.push("Thursday")
    if (text.includes("friday") || text.includes("fri")) days.push("Friday")
    if (text.includes("weekend") || text.includes("saturday") || text.includes("sunday")) {
      days.push("Weekend")
    }

    // Extract time preferences
    let timePreference = "Flexible"
    if (text.includes("morning")) timePreference = "Morning"
    if (text.includes("afternoon")) timePreference = "Afternoon"
    if (text.includes("evening")) timePreference = "Evening"
    if (text.includes("after work") || text.includes("after 5")) timePreference = "After 5 PM"

    this.collectedInfo.scheduling = {
      preferredDays: days.length > 0 ? days : ["Flexible"],
      preferredTime: timePreference,
      rawInput: input,
    }
  }

  async checkTherapistAvailability() {
    // Mock availability check - integrate with your scheduling system
    const currentHour = new Date().getHours()
    const isBusinessHours = currentHour >= 9 && currentHour <= 17

    if (isBusinessHours) {
      return {
        available: true,
        message: "We have several openings this week and next week.",
        nextAvailable: "Tomorrow at 2 PM",
      }
    } else {
      return {
        available: false,
        message: "Our office hours are 9 AM to 5 PM, Monday through Friday.",
        nextAvailable: "Tomorrow at 9 AM",
      }
    }
  }

  generateConfirmationSummary() {
    const scheduling = this.collectedInfo.scheduling
    const schedulingText = scheduling
      ? `Preferred days: ${scheduling.preferredDays.join(", ")}, Preferred time: ${scheduling.preferredTime}`
      : "Scheduling preferences not specified"

    return `Let me confirm your information: 
    Name: ${this.collectedInfo.name || "Not provided"}
    Email: ${this.collectedInfo.email || "Not provided"}
    Phone: ${this.collectedInfo.phone || "Not provided"}
    Insurance: ${this.collectedInfo.insurance || "Not provided"}
    Reason for seeking counseling: ${this.collectedInfo.reason || "Not specified"}
    ${schedulingText}
    
    Does this all sound correct?`
  }

  async saveIntakeData() {
    try {
      // Save to database
      await supabase.from("intake_forms").insert({
        call_sid: this.callSid,
        tenant_id: this.tenantId,
        name: this.collectedInfo.name,
        email: this.collectedInfo.email,
        phone: this.collectedInfo.phone,
        insurance: this.collectedInfo.insurance,
        reason: this.collectedInfo.reason,
        scheduling_preferences: this.collectedInfo.scheduling,
        completed_at: new Date().toISOString(),
        status: "completed",
      })

      console.log(`✅ Intake data saved for call ${this.callSid}`)
    } catch (error) {
      console.error("Error saving intake data:", error)
    }
  }

  getCompletionPercentage() {
    const requiredFields = ["name", "email", "phone", "reason"]
    const completedFields = requiredFields.filter((field) => this.collectedInfo[field])
    return Math.round((completedFields.length / requiredFields.length) * 100)
  }
}
