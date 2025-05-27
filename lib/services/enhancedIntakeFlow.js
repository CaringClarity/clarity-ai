/**
 * Enhanced Intake Flow Service with Business Logic Integration
 * Handles new client onboarding with mandatory disclaimers and data collection
 */
import { createClient } from "@supabase/supabase-js"
import MessageHandlingService from "./messageHandlingService.js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

export const INTAKE_STAGES = {
  GREETING: "greeting",
  DISCLAIMER: "disclaimer",
  SERVICE_TYPE: "service_type",
  CONTACT_INFO: "contact_info",
  ADDITIONAL_INFO: "additional_info",
  INSURANCE_INFO: "insurance_info",
  AVAILABILITY: "availability",
  CONFIRMATION: "confirmation",
  COMPLETION: "completion",
}

export class EnhancedIntakeFlow {
  constructor(callSid, tenantId) {
    this.callSid = callSid
    this.tenantId = tenantId
    this.currentStage = INTAKE_STAGES.GREETING
    this.collectedInfo = {}
    this.messageService = new MessageHandlingService(tenantId)
    this.disclaimerDelivered = false
    this.disclaimerAccepted = false
  }

  async processNewClientInquiry(userInput, conversationHistory) {
    try {
      // Detect if this is a new client inquiry
      if (this.isNewClientInquiry(userInput) && !this.disclaimerDelivered) {
        this.currentStage = INTAKE_STAGES.DISCLAIMER
        this.disclaimerDelivered = true
        return {
          response: this.getDisclaimerMessage(),
          stage: this.currentStage,
          requiresResponse: true,
        }
      }

      // Process based on current stage
      return await this.processStage(userInput)
    } catch (error) {
      console.error("Error in intake flow:", error)
      return {
        response: "I'm sorry, I'm having trouble with your request. Let me have someone call you back to assist you.",
        error: true,
      }
    }
  }

  isNewClientInquiry(userInput) {
    const text = userInput.toLowerCase()
    const newClientKeywords = [
      "new client",
      "first appointment",
      "start therapy",
      "begin counseling",
      "looking for a therapist",
      "need therapy",
      "want to schedule",
      "make an appointment",
      "book a session",
      "initial consultation",
      "new patient",
      "become a client",
    ]

    return newClientKeywords.some((keyword) => text.includes(keyword))
  }

  getDisclaimerMessage() {
    return "I'm happy to help get you scheduled. First I should mention, we provide telehealth services only, we don't accept Medicaid or Medicare, and if services are for a child, we only work with children ages 10 and older. Does that work for you?"
  }

  async processStage(userInput) {
    switch (this.currentStage) {
      case INTAKE_STAGES.DISCLAIMER:
        return this.handleDisclaimerResponse(userInput)

      case INTAKE_STAGES.SERVICE_TYPE:
        return this.handleServiceTypeResponse(userInput)

      case INTAKE_STAGES.CONTACT_INFO:
        return this.handleContactInfoResponse(userInput)

      case INTAKE_STAGES.ADDITIONAL_INFO:
        return this.handleAdditionalInfoResponse(userInput)

      case INTAKE_STAGES.INSURANCE_INFO:
        return this.handleInsuranceResponse(userInput)

      case INTAKE_STAGES.AVAILABILITY:
        return this.handleAvailabilityResponse(userInput)

      case INTAKE_STAGES.CONFIRMATION:
        return this.handleConfirmationResponse(userInput)

      default:
        return this.getNextQuestion()
    }
  }

  handleDisclaimerResponse(userInput) {
    const text = userInput.toLowerCase()

    if (text.includes("yes") || text.includes("that works") || text.includes("okay") || text.includes("ok")) {
      this.disclaimerAccepted = true
      this.currentStage = INTAKE_STAGES.SERVICE_TYPE
      return {
        response:
          "Great! What type of service are you looking for? Individual therapy, couples counseling, or child therapy?",
        stage: this.currentStage,
      }
    } else if (
      text.includes("no") ||
      text.includes("medicaid") ||
      text.includes("medicare") ||
      text.includes("in person") ||
      text.includes("under 10") ||
      text.includes("younger")
    ) {
      return {
        response:
          "I understand. Unfortunately, we may not be the right fit for your needs. You might want to contact your insurance provider for other options, or look for providers who accept Medicaid/Medicare or offer in-person services. Is there anything else I can help you with today?",
        endIntake: true,
      }
    } else {
      return {
        response:
          "Just to clarify - are you okay with telehealth-only services, and do you have private insurance other than Medicaid or Medicare? If services are for a child, they need to be 10 years or older.",
        stage: this.currentStage,
      }
    }
  }

  handleServiceTypeResponse(userInput) {
    const text = userInput.toLowerCase()

    if (text.includes("individual")) {
      this.collectedInfo.serviceType = "individual"
    } else if (text.includes("couple") || text.includes("marriage") || text.includes("relationship")) {
      this.collectedInfo.serviceType = "couples"
    } else if (text.includes("child") || text.includes("kid") || text.includes("teen")) {
      this.collectedInfo.serviceType = "child"
    } else {
      return {
        response:
          "I want to make sure I understand correctly. Are you looking for individual therapy, couples counseling, or child therapy?",
        stage: this.currentStage,
      }
    }

    this.currentStage = INTAKE_STAGES.CONTACT_INFO
    return {
      response: "Perfect! Let me gather some information to get you started. What's your first name?",
      stage: this.currentStage,
    }
  }

  handleContactInfoResponse(userInput) {
    // Collect contact information step by step
    if (!this.collectedInfo.firstName) {
      this.collectedInfo.firstName = this.extractName(userInput)
      return {
        response: "And your last name?",
        stage: this.currentStage,
      }
    }

    if (!this.collectedInfo.lastName) {
      this.collectedInfo.lastName = this.extractName(userInput)
      return {
        response: "What's the best email address to reach you at?",
        stage: this.currentStage,
      }
    }

    if (!this.collectedInfo.email) {
      const email = this.extractEmail(userInput)
      if (email) {
        this.collectedInfo.email = email
        return {
          response: "And a good phone number for you?",
          stage: this.currentStage,
        }
      } else {
        return {
          response: "I didn't catch a valid email address. Could you please repeat your email?",
          stage: this.currentStage,
        }
      }
    }

    if (!this.collectedInfo.phone) {
      const phone = this.extractPhone(userInput)
      if (phone) {
        this.collectedInfo.phone = phone
        return {
          response: "What state do you live in? We provide services in New Jersey and Pennsylvania.",
          stage: this.currentStage,
        }
      } else {
        return {
          response: "I didn't catch a valid phone number. Could you please repeat your phone number?",
          stage: this.currentStage,
        }
      }
    }

    if (!this.collectedInfo.state) {
      const state = this.extractState(userInput)
      if (state) {
        this.collectedInfo.state = state
        // Check if we need additional info based on service type
        if (this.collectedInfo.serviceType === "child" || this.collectedInfo.serviceType === "couples") {
          this.currentStage = INTAKE_STAGES.ADDITIONAL_INFO
          return this.getAdditionalInfoQuestion()
        } else {
          this.currentStage = INTAKE_STAGES.INSURANCE_INFO
          return {
            response: "What insurance provider do you have?",
            stage: this.currentStage,
          }
        }
      } else {
        return {
          response:
            "I need to know which state you're in to match you with the right provider. Are you in New Jersey or Pennsylvania?",
          stage: this.currentStage,
        }
      }
    }

    return this.getNextQuestion()
  }

  getAdditionalInfoQuestion() {
    if (this.collectedInfo.serviceType === "child" && !this.collectedInfo.childName) {
      return {
        response: "What's your child's name?",
        stage: this.currentStage,
      }
    }

    if (this.collectedInfo.serviceType === "couples" && !this.collectedInfo.partnerName) {
      return {
        response: "What's your partner's name?",
        stage: this.currentStage,
      }
    }

    if (this.collectedInfo.serviceType === "couples" && !this.collectedInfo.partnerEmail) {
      return {
        response: "And your partner's email address?",
        stage: this.currentStage,
      }
    }

    if (this.collectedInfo.serviceType === "couples" && !this.collectedInfo.partnerPhone) {
      return {
        response: "And your partner's phone number?",
        stage: this.currentStage,
      }
    }

    // Move to insurance if all additional info collected
    this.currentStage = INTAKE_STAGES.INSURANCE_INFO
    return {
      response: "What insurance provider do you have?",
      stage: this.currentStage,
    }
  }

  handleAdditionalInfoResponse(userInput) {
    if (this.collectedInfo.serviceType === "child" && !this.collectedInfo.childName) {
      this.collectedInfo.childName = this.extractName(userInput)
      this.currentStage = INTAKE_STAGES.INSURANCE_INFO
      return {
        response: "What insurance provider do you have?",
        stage: this.currentStage,
      }
    }

    if (this.collectedInfo.serviceType === "couples") {
      if (!this.collectedInfo.partnerName) {
        this.collectedInfo.partnerName = this.extractName(userInput)
        return {
          response: "And your partner's email address?",
          stage: this.currentStage,
        }
      }

      if (!this.collectedInfo.partnerEmail) {
        const email = this.extractEmail(userInput)
        if (email) {
          this.collectedInfo.partnerEmail = email
          return {
            response: "And your partner's phone number?",
            stage: this.currentStage,
          }
        } else {
          return {
            response: "I didn't catch a valid email address for your partner. Could you please repeat it?",
            stage: this.currentStage,
          }
        }
      }

      if (!this.collectedInfo.partnerPhone) {
        const phone = this.extractPhone(userInput)
        if (phone) {
          this.collectedInfo.partnerPhone = phone
          this.currentStage = INTAKE_STAGES.INSURANCE_INFO
          return {
            response: "What insurance provider do you have?",
            stage: this.currentStage,
          }
        } else {
          return {
            response: "I didn't catch a valid phone number. Could you please repeat your partner's phone number?",
            stage: this.currentStage,
          }
        }
      }
    }

    return this.getNextQuestion()
  }

  async handleInsuranceResponse(userInput) {
    const insurance = await this.validateInsurance(userInput)
    this.collectedInfo.insurance = insurance.name
    this.collectedInfo.insuranceAccepted = insurance.accepted

    if (!insurance.accepted) {
      return {
        response: `I see you have ${insurance.name}. Unfortunately, we don't accept that insurance. We accept Aetna, Cigna, Horizon Blue Cross Blue Shield, Magellan, MHC, Evernorth, United Healthcare, Optum, and Care Bridge EAP. We also offer self-pay options. Would you like information about our self-pay rates?`,
        stage: this.currentStage,
      }
    }

    this.currentStage = INTAKE_STAGES.AVAILABILITY
    return {
      response: "Excellent! What days and times work best for you for appointments?",
      stage: this.currentStage,
    }
  }

  handleAvailabilityResponse(userInput) {
    this.collectedInfo.availability = userInput
    this.currentStage = INTAKE_STAGES.CONFIRMATION
    return {
      response: this.generateConfirmationSummary(),
      stage: this.currentStage,
    }
  }

  async handleConfirmationResponse(userInput) {
    const text = userInput.toLowerCase()

    if (text.includes("yes") || text.includes("correct") || text.includes("right")) {
      // Save intake data and send to appropriate staff
      await this.completeIntake()
      this.currentStage = INTAKE_STAGES.COMPLETION
      return {
        response:
          "Perfect! I have all your information. Someone from our team will contact you within 24 hours to schedule your appointment. Is there anything else I can help you with today?",
        stage: this.currentStage,
        intakeCompleted: true,
      }
    } else {
      // Start over or clarify
      this.currentStage = INTAKE_STAGES.CONTACT_INFO
      return {
        response: "No problem, let me gather your information again. What's your first name?",
        stage: this.currentStage,
      }
    }
  }

  async completeIntake() {
    try {
      // Save to database
      const { data: intakeRecord } = await supabase
        .from("intake_forms")
        .insert({
          call_sid: this.callSid,
          tenant_id: this.tenantId,
          first_name: this.collectedInfo.firstName,
          last_name: this.collectedInfo.lastName,
          email: this.collectedInfo.email,
          phone: this.collectedInfo.phone,
          state: this.collectedInfo.state,
          service_type: this.collectedInfo.serviceType,
          insurance: this.collectedInfo.insurance,
          insurance_accepted: this.collectedInfo.insuranceAccepted,
          availability: this.collectedInfo.availability,
          child_name: this.collectedInfo.childName,
          partner_name: this.collectedInfo.partnerName,
          partner_email: this.collectedInfo.partnerEmail,
          partner_phone: this.collectedInfo.partnerPhone,
          completed_at: new Date().toISOString(),
          status: "completed",
        })
        .select()
        .single()

      // Send intake notification to Stephanie
      await this.messageService.sendIntakeMessage(this.collectedInfo, this.callSid)

      console.log(`✅ Intake completed for ${this.collectedInfo.firstName} ${this.collectedInfo.lastName}`)
    } catch (error) {
      console.error("Error completing intake:", error)
      throw error
    }
  }

  generateConfirmationSummary() {
    let summary = `Let me confirm your information:\n\n`
    summary += `Name: ${this.collectedInfo.firstName} ${this.collectedInfo.lastName}\n`
    summary += `Email: ${this.collectedInfo.email}\n`
    summary += `Phone: ${this.collectedInfo.phone}\n`
    summary += `State: ${this.collectedInfo.state}\n`
    summary += `Service Type: ${this.collectedInfo.serviceType}\n`
    summary += `Insurance: ${this.collectedInfo.insurance}\n`

    if (this.collectedInfo.childName) {
      summary += `Child's Name: ${this.collectedInfo.childName}\n`
    }

    if (this.collectedInfo.partnerName) {
      summary += `Partner: ${this.collectedInfo.partnerName}\n`
      summary += `Partner Email: ${this.collectedInfo.partnerEmail}\n`
      summary += `Partner Phone: ${this.collectedInfo.partnerPhone}\n`
    }

    summary += `Availability: ${this.collectedInfo.availability}\n\n`
    summary += `Does this all sound correct?`

    return summary
  }

  // Helper methods for data extraction
  extractName(input) {
    let name = input.trim()
    name = name.replace(/^(my name is|i'm|i am|this is|it's)\s+/i, "")
    return name
  }

  extractEmail(input) {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/
    const match = input.match(emailRegex)
    return match ? match[0] : null
  }

  extractPhone(input) {
    const phoneRegex = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/
    const match = input.match(phoneRegex)
    return match ? match[0] : null
  }

  extractState(input) {
    const text = input.toLowerCase()
    if (text.includes("new jersey") || text.includes("nj")) return "NJ"
    if (text.includes("pennsylvania") || text.includes("pa")) return "PA"
    return null
  }

  async validateInsurance(input) {
    try {
      const { data: insuranceProviders } = await supabase
        .from("insurance_providers")
        .select("*")
        .eq("tenant_id", this.tenantId)

      const text = input.toLowerCase()

      // Check against known insurance providers
      for (const provider of insuranceProviders) {
        if (text.includes(provider.name.toLowerCase())) {
          return {
            name: provider.name,
            accepted: provider.accepted,
          }
        }
      }

      // Default to unknown insurance
      return {
        name: input.trim(),
        accepted: false,
      }
    } catch (error) {
      console.error("Error validating insurance:", error)
      return {
        name: input.trim(),
        accepted: false,
      }
    }
  }

  getNextQuestion() {
    return {
      response: "I'm sorry, I didn't catch that. Could you please repeat?",
      stage: this.currentStage,
    }
  }
}

export default EnhancedIntakeFlow
