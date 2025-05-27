/**
 * Health check API with environment variable verification
 */
import { NextResponse } from "next/server"

export async function GET() {
  // Check required environment variables
  const envStatus = {
    RENDER_WEBSOCKET_URL: !!process.env.RENDER_WEBSOCKET_URL,
    DEEPGRAM_API_KEY: !!process.env.DEEPGRAM_API_KEY,
    NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    NEXT_PUBLIC_VERCEL_URL: !!process.env.NEXT_PUBLIC_VERCEL_URL || !!process.env.VERCEL_URL,
    GROQ_API_KEY: !!process.env.GROQ_API_KEY,
  }
  
  const missingVars = Object.entries(envStatus)
    .filter(([_, value]) => !value)
    .map(([key]) => key)
  
  if (missingVars.length > 0) {
    return NextResponse.json({
      status: "warning",
      message: "Some environment variables are missing",
      missingVars,
      timestamp: new Date().toISOString(),
    }, { status: 200 })
  }
  
  return NextResponse.json({
    status: "healthy",
    message: "All required environment variables are set",
    timestamp: new Date().toISOString(),
  })
}
