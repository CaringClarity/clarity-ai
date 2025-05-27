/**
 * Detailed Health Check API Route
 * Comprehensive system health monitoring
 */
import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: NextRequest) {
  const healthCheck = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    service: "Caring Clarity AI Assistant",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
    checks: {},
    dependencies: {},
  }

  try {
    // Check 1: Database Connection
    try {
      const { data, error } = await supabase.from("tenants").select("count").limit(1)
      healthCheck.checks.database = {
        status: error ? "unhealthy" : "healthy",
        message: error ? error.message : "Database connected",
        responseTime: Date.now(),
      }
    } catch (error) {
      healthCheck.checks.database = {
        status: "unhealthy",
        message: error.message,
      }
    }

    // Check 2: Environment Variables
    const requiredEnvVars = [
      "NEXT_PUBLIC_SUPABASE_URL",
      "SUPABASE_SERVICE_ROLE_KEY",
      "DEEPGRAM_API_KEY",
      "GROQ_API_KEY",
      "TWILIO_ACCOUNT_SID",
      "TWILIO_AUTH_TOKEN",
      "RESEND_API_KEY",
    ]

    const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar])

    healthCheck.checks.environment = {
      status: missingEnvVars.length === 0 ? "healthy" : "unhealthy",
      message:
        missingEnvVars.length === 0 ? "All environment variables present" : `Missing: ${missingEnvVars.join(", ")}`,
      missing: missingEnvVars,
    }

    // Check 3: External Dependencies
    healthCheck.dependencies = {
      supabase: {
        status: healthCheck.checks.database.status,
        url: process.env.NEXT_PUBLIC_SUPABASE_URL ? "configured" : "missing",
      },
      deepgram: {
        status: process.env.DEEPGRAM_API_KEY ? "configured" : "missing",
        model: process.env.DEEPGRAM_MODEL || "nova-2",
        ttsModel: process.env.DEEPGRAM_TTS_MODEL || "aura-2-athena-en",
      },
      groq: {
        status: process.env.GROQ_API_KEY ? "configured" : "missing",
      },
      twilio: {
        status: process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN ? "configured" : "missing",
        phoneNumber: process.env.TWILIO_PHONE_NUMBER || "not configured",
      },
      resend: {
        status: process.env.RESEND_API_KEY ? "configured" : "missing",
      },
    }

    // Check 4: Business Data
    try {
      const { data: tenant } = await supabase
        .from("tenants")
        .select("id")
        .eq("business_name", "Caring Clarity Counseling")
        .single()

      if (tenant) {
        const [businessInfo, providers, insurance, knowledgeBase] = await Promise.all([
          supabase.from("business_info").select("count").eq("tenant_id", tenant.id),
          supabase.from("providers").select("count").eq("tenant_id", tenant.id),
          supabase.from("insurance_providers").select("count").eq("tenant_id", tenant.id),
          supabase.from("knowledge_base").select("count").eq("tenant_id", tenant.id),
        ])

        healthCheck.checks.businessData = {
          status: "healthy",
          tenant: "found",
          businessInfo: businessInfo.data?.length || 0,
          providers: providers.data?.length || 0,
          insurance: insurance.data?.length || 0,
          knowledgeBase: knowledgeBase.data?.length || 0,
        }
      } else {
        healthCheck.checks.businessData = {
          status: "unhealthy",
          message: "Caring Clarity tenant not found",
        }
      }
    } catch (error) {
      healthCheck.checks.businessData = {
        status: "unhealthy",
        message: error.message,
      }
    }

    // Overall health status
    const allChecks = Object.values(healthCheck.checks)
    const unhealthyChecks = allChecks.filter((check: any) => check.status === "unhealthy")

    if (unhealthyChecks.length > 0) {
      healthCheck.status = "unhealthy"
    }

    // Add deployment info
    healthCheck.deployment = {
      url: process.env.NEXT_PUBLIC_APP_URL || "not configured",
      region: process.env.VERCEL_REGION || "unknown",
      buildTime: process.env.BUILD_TIME || "unknown",
    }

    return NextResponse.json(healthCheck)
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
