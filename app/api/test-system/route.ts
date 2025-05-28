/**
 * System Testing API Route
 * Tests all major components of the voice agent
 */
import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { generateAIResponse } from "@/lib/services/conversationService"
import KnowledgeBaseService from "@/lib/services/knowledgeBaseService"
import MessageHandlingService from "@/lib/services/messageHandlingService"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { testType = "full" } = await request.json()
    const results = {
      timestamp: new Date().toISOString(),
      testType,
      results: {},
      overall: "pending",
    }

    // Get tenant ID
    const { data: tenant } = await supabase
      .from("tenants")
      .select("id")
      .eq("business_name", "Caring Clarity Counseling")
      .single()

    if (!tenant) {
      throw new Error("Tenant not found")
    }

    // Test 1: Database Connectivity
    console.log("🧪 Testing database connectivity...")
    try {
      const { data: businessInfo } = await supabase
        .from("business_info")
        .select("*")
        .eq("tenant_id", tenant.id)
        .single()
      results.results.database = {
        status: "pass",
        message: "Database connected successfully",
        data: businessInfo ? "Business info found" : "No business info",
      }
    } catch (error) {
      results.results.database = {
        status: "fail",
        message: `Database error: ${error.message}`,
      }
    }

    // Test 2: Knowledge Base
    console.log("🧪 Testing knowledge base...")
    try {
      const kbService = new KnowledgeBaseService(tenant.id)
      const answer = await kbService.findAnswer("What services do you offer?")
      results.results.knowledgeBase = {
        status: answer ? "pass" : "fail",
        message: answer ? "Knowledge base working" : "No answer found",
        sampleAnswer: answer?.substring(0, 100) + "...",
      }
    } catch (error) {
      results.results.knowledgeBase = {
        status: "fail",
        message: `Knowledge base error: ${error.message}`,
      }
    }

    // Test 3: AI Response Generation
    console.log("🧪 Testing AI response generation...")
    try {
      const response = await generateAIResponse("Hello, I need help", [], "test-call-123")
      results.results.aiResponse = {
        status: response.response ? "pass" : "fail",
        message: "AI response generated",
        sampleResponse: response.response?.substring(0, 100) + "...",
        latency: response.latency,
      }
    } catch (error) {
      results.results.aiResponse = {
        status: "fail",
        message: `AI response error: ${error.message}`,
      }
    }

    // Test 4: Message Handling
    console.log("🧪 Testing message handling...")
    try {
      const messageService = new MessageHandlingService(tenant.id)
      const testResult = await messageService.sendMessage({
        type: "general",
        urgency: "low",
        callerInfo: { first_name: "Test", last_name: "User", phone: "555-0123", email: "test@example.com" },
        content: "This is a test message",
        callSid: "test-call-123",
      })
      results.results.messageHandling = {
        status: testResult.success ? "pass" : "fail",
        message: testResult.success ? "Message sent successfully" : "Message failed",
        messageId: testResult.messageId,
      }
    } catch (error) {
      results.results.messageHandling = {
        status: "fail",
        message: `Message handling error: ${error.message}`,
      }
    }

    // Test 5: Provider Lookup
    console.log("🧪 Testing provider lookup...")
    try {
      const kbService = new KnowledgeBaseService(tenant.id)
      const providers = await kbService.getProviders("NJ")
      results.results.providerLookup = {
        status: providers.length > 0 ? "pass" : "fail",
        message: `Found ${providers.length} NJ providers`,
        providerCount: providers.length,
      }
    } catch (error) {
      results.results.providerLookup = {
        status: "fail",
        message: `Provider lookup error: ${error.message}`,
      }
    }

    // Test 6: Insurance Validation
    console.log("🧪 Testing insurance validation...")
    try {
      const kbService = new KnowledgeBaseService(tenant.id)
      const insurance = await kbService.getInsuranceInfo("Aetna")
      results.results.insuranceValidation = {
        status: insurance.length > 0 ? "pass" : "fail",
        message: `Found ${insurance.length} insurance records`,
        insuranceCount: insurance.length,
      }
    } catch (error) {
      results.results.insuranceValidation = {
        status: "fail",
        message: `Insurance validation error: ${error.message}`,
      }
    }

    // Test 7: Crisis Detection
    console.log("🧪 Testing crisis detection...")
    try {
      const response = await generateAIResponse("I want to hurt myself", [], "test-crisis-123")
      results.results.crisisDetection = {
        status: response.crisis ? "pass" : "fail",
        message: response.crisis ? "Crisis detected correctly" : "Crisis not detected",
        escalated: response.escalation?.escalate || false,
      }
    } catch (error) {
      results.results.crisisDetection = {
        status: "fail",
        message: `Crisis detection error: ${error.message}`,
      }
    }

    // Test 8: Intake Flow
    console.log("🧪 Testing intake flow...")
    try {
      const response = await generateAIResponse("I'm a new client looking for therapy", [], "test-intake-123")
      results.results.intakeFlow = {
        status: response.intent === "new_appointment" ? "pass" : "fail",
        message: "Intake flow triggered",
        intent: response.intent,
        confidence: response.confidence,
      }
    } catch (error) {
      results.results.intakeFlow = {
        status: "fail",
        message: `Intake flow error: ${error.message}`,
      }
    }

    // Calculate overall status
    const testResults = Object.values(results.results)
    const passCount = testResults.filter((test: any) => test.status === "pass").length
    const totalTests = testResults.length

    if (passCount === totalTests) {
      results.overall = "pass"
    } else if (passCount > totalTests / 2) {
      results.overall = "partial"
    } else {
      results.overall = "fail"
    }

    results.summary = {
      passed: passCount,
      total: totalTests,
      percentage: Math.round((passCount / totalTests) * 100),
    }

    console.log(`🧪 System test completed: ${passCount}/${totalTests} tests passed`)

    return NextResponse.json(results)
  } catch (error) {
    console.error("System test error:", error)
    return NextResponse.json(
      {
        error: "System test failed",
        message: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
