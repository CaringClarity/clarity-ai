/**
 * Twilio Media Stream WebSocket Handler for Deepgram integration
 */
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const callSid = searchParams.get('callSid')
  const tenantId = searchParams.get('tenantId')
  const userId = searchParams.get('userId')
  
  // Redirect to the actual WebSocket server on Render
  const renderWebSocketUrl = process.env.RENDER_WEBSOCKET_URL || "wss://voice-agent-websocket.onrender.com"
  const targetUrl = `${renderWebSocketUrl}/stream?callSid=${callSid}&tenantId=${tenantId}&userId=${userId || 'anonymous'}`
  
  console.log(`🔄 Redirecting WebSocket connection to: ${targetUrl}`)
  
  return new Response(null, {
    status: 307,
    headers: {
      'Location': targetUrl,
      'Upgrade': 'websocket'
    }
  })
}
