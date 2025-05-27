/**
 * WebSocket API Route Handler
 * Handles WebSocket upgrade requests for voice streaming
 */
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get('sessionId')
  
  if (!sessionId) {
    return new Response("Missing sessionId parameter", { status: 400 })
  }
  
  // Redirect to the WebSocket server on Render
  const renderWebSocketUrl = process.env.RENDER_WEBSOCKET_URL || "wss://voice-agent-websocket.onrender.com"
  const targetUrl = `${renderWebSocketUrl}/session/${sessionId}`
  
  console.log(`🔄 Redirecting WebSocket session to: ${targetUrl}`)
  
  return new Response(null, {
    status: 307,
    headers: {
      'Location': targetUrl,
      'Upgrade': 'websocket'
    }
  })
}
