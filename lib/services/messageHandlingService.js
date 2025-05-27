/**
 * Message Handling Service
 * Handles SMS and Email delivery for staff notifications
 */
import { createClient } from "@supabase/supabase-js"
import twilio from "twilio"
import { Resend } from "resend"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
const resend = new Resend(process.env.RESEND_API_KEY)

export const MESSAGE_TYPES = {
  BILLING: "billing",
  APPOINTMENT: "appointment",
  INTAKE: "intake",
  GENERAL: "general",
  CRISIS: "crisis",
  PROVIDER_INQUIRY: "provider_inquiry",
  CARE_MANAGEMENT: "care_management",
}

export const URGENCY_LEVELS = {
  CRITICAL: "critical", // Crisis situations
  HIGH: "high", // Billing, appointments
  MEDIUM: "medium", // General inquiries
  LOW: "low", // Information requests
}

export class MessageHandlingService {
  constructor(tenantId) {
    this.tenantId = tenantId
  }

  async sendMessage(messageData) {
    try {
      const { type, urgency = URGENCY_LEVELS.MEDIUM, callerInfo, content, callSid, additionalData = {} } = messageData

      // Determine routing based on message type
      const routing = this.getMessageRouting(type)

      // Create message record
      const messageRecord = await this.createMessageRecord({
        type,
        urgency,
        callerInfo,
        content,
        callSid,
        routing,
        additionalData,
      })

      // Send notifications based on urgency and type
      const results = await this.deliverMessage(messageRecord, routing)

      console.log(`✅ Message sent successfully: ${messageRecord.id}`)
      return {
        success: true,
        messageId: messageRecord.id,
        deliveryResults: results,
      }
    } catch (error) {
      console.error("Error sending message:", error)
      return {
        success: false,
        error: error.message,
      }
    }
  }

  getMessageRouting(messageType) {
    const routingConfig = {
      [MESSAGE_TYPES.BILLING]: {
        sms: { number: "856-889-8434", contact: "Jessica" },
        email: { address: "jessica@caringclaritycounseling.com", contact: "Jessica" },
        urgency: URGENCY_LEVELS.HIGH,
      },
      [MESSAGE_TYPES.APPOINTMENT]: {
        sms: { number: "856-889-8434", contact: "Jessica" },
        email: { address: "jessica@caringclaritycounseling.com", contact: "Jessica" },
        urgency: URGENCY_LEVELS.HIGH,
      },
      [MESSAGE_TYPES.INTAKE]: {
        email: { address: "stephaniep@caringclaritycounseling.com", contact: "Stephanie" },
        cc: ["jessica@caringclaritycounseling.com"],
        urgency: URGENCY_LEVELS.MEDIUM,
      },
      [MESSAGE_TYPES.CRISIS]: {
        sms: { number: "856-889-8434", contact: "Jessica" },
        email: { address: "jessica@caringclaritycounseling.com", contact: "Jessica" },
        urgency: URGENCY_LEVELS.CRITICAL,
      },
      [MESSAGE_TYPES.CARE_MANAGEMENT]: {
        sms: { number: "856-340-2991", contact: "Erik Coleman" },
        email: { address: "erik@caringclaritycounseling.com", contact: "Erik Coleman" },
        urgency: URGENCY_LEVELS.HIGH,
      },
      [MESSAGE_TYPES.GENERAL]: {
        email: { address: "jessica@caringclaritycounseling.com", contact: "Jessica" },
        urgency: URGENCY_LEVELS.MEDIUM,
      },
    }

    return routingConfig[messageType] || routingConfig[MESSAGE_TYPES.GENERAL]
  }

  async createMessageRecord(messageData) {
    try {
      const { data, error } = await supabase
        .from("staff_messages")
        .insert({
          tenant_id: this.tenantId,
          message_type: messageData.type,
          urgency: messageData.urgency,
          caller_name: messageData.callerInfo?.name,
          caller_phone: messageData.callerInfo?.phone,
          caller_email: messageData.callerInfo?.email,
          content: messageData.content,
          call_sid: messageData.callSid,
          routing_info: messageData.routing,
          additional_data: messageData.additionalData,
          status: "pending",
          created_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error creating message record:", error)
      throw error
    }
  }

  async deliverMessage(messageRecord, routing) {
    const results = {
      sms: null,
      email: null,
    }

    try {
      // Send SMS for urgent messages
      if (routing.sms && (routing.urgency === URGENCY_LEVELS.CRITICAL || routing.urgency === URGENCY_LEVELS.HIGH)) {
        results.sms = await this.sendSMS(messageRecord, routing.sms)
      }

      // Always send email for record keeping
      if (routing.email) {
        results.email = await this.sendEmail(messageRecord, routing)
      }

      // Update message status
      await this.updateMessageStatus(messageRecord.id, "delivered", results)

      return results
    } catch (error) {
      await this.updateMessageStatus(messageRecord.id, "failed", { error: error.message })
      throw error
    }
  }

  async sendSMS(messageRecord, smsConfig) {
    try {
      const smsContent = this.formatSMSContent(messageRecord)

      const message = await twilioClient.messages.create({
        body: smsContent,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: `+1${smsConfig.number.replace(/\D/g, "")}`,
      })

      console.log(`📱 SMS sent to ${smsConfig.contact}: ${message.sid}`)

      return {
        success: true,
        messageSid: message.sid,
        recipient: smsConfig.contact,
        phone: smsConfig.number,
      }
    } catch (error) {
      console.error("Error sending SMS:", error)
      return {
        success: false,
        error: error.message,
      }
    }
  }

  async sendEmail(messageRecord, routing) {
    try {
      const emailContent = this.formatEmailContent(messageRecord)

      const emailData = {
        from: "Clara AI Assistant <clara@caringclaritycounseling.com>",
        to: [routing.email.address],
        subject: emailContent.subject,
        html: emailContent.html,
      }

      // Add CC recipients if specified
      if (routing.cc && routing.cc.length > 0) {
        emailData.cc = routing.cc
      }

      const { data, error } = await resend.emails.send(emailData)

      if (error) throw error

      console.log(`📧 Email sent to ${routing.email.contact}: ${data.id}`)

      return {
        success: true,
        emailId: data.id,
        recipient: routing.email.contact,
        email: routing.email.address,
      }
    } catch (error) {
      console.error("Error sending email:", error)
      return {
        success: false,
        error: error.message,
      }
    }
  }

  formatSMSContent(messageRecord) {
    const urgencyEmoji = {
      [URGENCY_LEVELS.CRITICAL]: "🚨",
      [URGENCY_LEVELS.HIGH]: "⚡",
      [URGENCY_LEVELS.MEDIUM]: "📋",
      [URGENCY_LEVELS.LOW]: "ℹ️",
    }

    const emoji = urgencyEmoji[messageRecord.urgency] || "📋"

    let content = `${emoji} Caring Clarity - ${messageRecord.message_type.toUpperCase()}\n\n`

    if (messageRecord.caller_name) {
      content += `From: ${messageRecord.caller_name}\n`
    }

    if (messageRecord.caller_phone) {
      content += `Phone: ${messageRecord.caller_phone}\n`
    }

    content += `\nMessage: ${messageRecord.content}`

    // Keep SMS under 160 characters when possible
    if (content.length > 160) {
      content = content.substring(0, 157) + "..."
    }

    return content
  }

  formatEmailContent(messageRecord) {
    const subject = `${messageRecord.urgency.toUpperCase()}: ${messageRecord.message_type} - ${messageRecord.caller_name || "Unknown Caller"}`

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .info-box { background-color: #f8fafc; border-left: 4px solid #2563eb; padding: 15px; margin: 15px 0; }
          .urgency-high { border-left-color: #dc2626; }
          .urgency-critical { border-left-color: #dc2626; background-color: #fef2f2; }
          .caller-info { background-color: #f1f5f9; padding: 15px; border-radius: 8px; margin: 15px 0; }
          .footer { background-color: #f8fafc; padding: 15px; text-align: center; font-size: 12px; color: #64748b; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Caring Clarity Counseling</h1>
          <p>Message from Clara AI Assistant</p>
        </div>
        
        <div class="content">
          <div class="info-box ${messageRecord.urgency === URGENCY_LEVELS.HIGH ? "urgency-high" : ""} ${messageRecord.urgency === URGENCY_LEVELS.CRITICAL ? "urgency-critical" : ""}">
            <strong>Message Type:</strong> ${messageRecord.message_type.toUpperCase()}<br>
            <strong>Urgency:</strong> ${messageRecord.urgency.toUpperCase()}<br>
            <strong>Time:</strong> ${new Date(messageRecord.created_at).toLocaleString()}
            ${messageRecord.call_sid ? `<br><strong>Call ID:</strong> ${messageRecord.call_sid}` : ""}
          </div>

          <div class="caller-info">
            <h3>Caller Information</h3>
            <p><strong>Name:</strong> ${messageRecord.caller_name || "Not provided"}</p>
            <p><strong>Phone:</strong> ${messageRecord.caller_phone || "Not provided"}</p>
            <p><strong>Email:</strong> ${messageRecord.caller_email || "Not provided"}</p>
          </div>

          <div class="info-box">
            <h3>Message Content</h3>
            <p>${messageRecord.content}</p>
          </div>

          ${
            messageRecord.additional_data && Object.keys(messageRecord.additional_data).length > 0
              ? `
            <div class="info-box">
              <h3>Additional Information</h3>
              <pre>${JSON.stringify(messageRecord.additional_data, null, 2)}</pre>
            </div>
          `
              : ""
          }
        </div>

        <div class="footer">
          <p>This message was automatically generated by Clara AI Assistant</p>
          <p>Caring Clarity Counseling | 855-968-7862</p>
        </div>
      </body>
      </html>
    `

    return { subject, html }
  }

  async updateMessageStatus(messageId, status, deliveryResults = {}) {
    try {
      await supabase
        .from("staff_messages")
        .update({
          status,
          delivery_results: deliveryResults,
          updated_at: new Date().toISOString(),
        })
        .eq("id", messageId)
    } catch (error) {
      console.error("Error updating message status:", error)
    }
  }

  // Helper methods for common message types
  async sendBillingMessage(callerInfo, inquiry, callSid) {
    return this.sendMessage({
      type: MESSAGE_TYPES.BILLING,
      urgency: URGENCY_LEVELS.HIGH,
      callerInfo,
      content: `Billing inquiry: ${inquiry}`,
      callSid,
    })
  }

  async sendAppointmentMessage(callerInfo, request, availability, callSid) {
    return this.sendMessage({
      type: MESSAGE_TYPES.APPOINTMENT,
      urgency: URGENCY_LEVELS.HIGH,
      callerInfo,
      content: `Appointment request: ${request}`,
      callSid,
      additionalData: { availability },
    })
  }

  async sendIntakeMessage(intakeData, callSid) {
    return this.sendMessage({
      type: MESSAGE_TYPES.INTAKE,
      urgency: URGENCY_LEVELS.MEDIUM,
      callerInfo: {
        name: `${intakeData.firstName} ${intakeData.lastName}`,
        phone: intakeData.phone,
        email: intakeData.email,
      },
      content: `New client intake completed`,
      callSid,
      additionalData: intakeData,
    })
  }

  async sendCrisisMessage(callerInfo, situation, callSid) {
    return this.sendMessage({
      type: MESSAGE_TYPES.CRISIS,
      urgency: URGENCY_LEVELS.CRITICAL,
      callerInfo,
      content: `CRISIS SITUATION: ${situation}`,
      callSid,
    })
  }
}

export default MessageHandlingService
