import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!)

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const from = formData.get("From") as string
    const to = formData.get("To") as string
    const callSid = formData.get("CallSid") as string

    console.log(`📞 Incoming call from ${from} to ${to} (SID: ${callSid})`)
    console.log("🔍 Querying for counseling tenant...")

    // Try different approaches to query the tenant
    let tenant = null
    let error = null

    // Approach 1: Query with explicit column selection
    try {
      const { data, error: queryError } = await supabase
        .from("tenants")
        .select("id, name, phone_number, active") // Explicitly select columns
        .eq("phone_number", to)
        .single()

      if (queryError) throw queryError
      tenant = data
      console.log("✅ Approach 1 successful:", tenant)
    } catch (err) {
      console.log("❌ Approach 1 failed:", err)
      error = err
    }

    // Approach 2: Query all columns and check what's available
    if (!tenant) {
      try {
        const { data, error: queryError } = await supabase.from("tenants").select("*").eq("phone_number", to).single()

        if (queryError) throw queryError

        console.log("📊 Available columns:", Object.keys(data))
        console.log("📋 Full tenant data:", data)

        // Check if tenant is active using different possible column names
        const isActive = data.active ?? data.Active ?? data.is_active ?? data.status === "active" ?? true

        tenant = {
          ...data,
          active: isActive,
        }
        console.log("✅ Approach 2 successful with fallback")
      } catch (err) {
        console.log("❌ Approach 2 failed:", err)
        error = err
      }
    }

    // Approach 3: Raw SQL query as last resort
    if (!tenant) {
      try {
        const { data, error: queryError } = await supabase.rpc("get_tenant_by_phone", {
          phone_number: to,
        })

        if (queryError) throw queryError
        tenant = data
        console.log("✅ Approach 3 (RPC) successful")
      } catch (err) {
        console.log("❌ Approach 3 failed:", err)
      }
    }

    if (!tenant) {
      throw new Error(`Database error: ${error?.message || "Unknown error"}`)
    }

    // Check if tenant is active (with fallbacks)
    const isActive = tenant.active ?? tenant.is_active ?? tenant.status === "active" ?? true

    if (!isActive) {
      console.log("❌ Tenant is not active")
      return new Response(
        `<?xml version="1.0" encoding="UTF-8"?>
        <Response>
          <Say>This service is currently unavailable. Please try again later.</Say>
          <Hangup/>
        </Response>`,
        {
          headers: { "Content-Type": "text/xml" },
        },
      )
    }

    console.log("✅ Tenant found and active:", tenant.name)

    // Continue with your voice agent logic...
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>
      <Response>
        <Say>Welcome to ${tenant.name}. Please hold while we connect you.</Say>
        <Connect>
          <Stream url="wss://your-websocket-url.com/stream"/>
        </Connect>
      </Response>`,
      {
        headers: { "Content-Type": "text/xml" },
      },
    )
  } catch (error) {
    console.error("💥 Error handling incoming call:", error)

    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>
      <Response>
        <Say>We're experiencing technical difficulties. Please try again later.</Say>
        <Hangup/>
      </Response>`,
      {
        headers: { "Content-Type": "text/xml" },
      },
    )
  }
}
