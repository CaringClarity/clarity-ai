import { NextResponse } from "next/server"
import { twilioClient } from "@/lib/twilio"
import { supabase } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { to, from, url } = body

    console.log("📞 Received call request:", body)

    // Database interaction to fetch Twilio account SID and Auth Token
    console.log("🔑 Fetching Twilio credentials from database...")

    // Get default tenant (counseling practice) - simplified query without active column
    console.log("🔍 Querying for counseling tenant...")
    const { data: tenants, error: tenantError } = await supabase
      .from("tenants")
      .select("id, name, business_type, settings")
      .eq("business_type", "counseling")
      .limit(1)

    if (tenantError) {
      console.error("🚨 Error fetching tenant:", tenantError)
      return NextResponse.json({ error: "Failed to fetch tenant" }, { status: 500 })
    }

    if (!tenants || tenants.length === 0) {
      console.warn("⚠️ No counseling tenant found.")
      return NextResponse.json({ error: "No counseling tenant found" }, { status: 404 })
    }

    const tenant = tenants[0]
    const twilioAccountSid = tenant.settings.twilio_account_sid
    const twilioAuthToken = tenant.settings.twilio_auth_token

    if (!twilioAccountSid || !twilioAuthToken) {
      console.error("❌ Twilio Account SID or Auth Token not found in tenant settings.")
      return NextResponse.json({ error: "Twilio credentials not found" }, { status: 500 })
    }

    console.log("✅ Twilio credentials fetched successfully.")

    // Initialize Twilio client with credentials from the database
    const client = twilioClient(twilioAccountSid, twilioAuthToken)

    // Make the call
    console.log(`📞 Initiating call from ${from} to ${to} using URL: ${url}`)

    const call = await client.calls.create({
      to: to,
      from: from,
      url: url,
    })

    console.log(`📞 Call initiated with SID: ${call.sid}`)

    return NextResponse.json({ sid: call.sid }, { status: 200 })
  } catch (error: any) {
    console.error("🚨 Error in POST:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
