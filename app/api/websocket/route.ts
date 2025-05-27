/**
 * WebSocket API Route Handler
 * Handles WebSocket upgrade requests for voice streaming
 */
import type { NextRequest } from "next/server"

// This will be handled by the streaming service
export async function GET(request: NextRequest) {
  return new Response("WebSocket endpoint - handled by streaming service", { status: 200 })
}
