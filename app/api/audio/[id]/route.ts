/**
 * API route for storing and serving temporary audio files
 * Used for greeting audio in Twilio calls
 */
import { type NextRequest, NextResponse } from "next/server"

// In-memory storage for temporary audio files
// In production, consider using a more persistent storage solution
const audioStore = new Map<string, Buffer>()

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id
  
  if (!audioStore.has(id)) {
    return new NextResponse("Audio not found", { status: 404 })
  }
  
  const audioBuffer = audioStore.get(id)
  
  return new NextResponse(audioBuffer, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Content-Length": audioBuffer!.byteLength.toString(),
    },
  })
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id
  const audioBuffer = Buffer.from(await request.arrayBuffer())
  
  // Store the audio buffer
  audioStore.set(id, audioBuffer)
  
  // Set expiration (5 minutes)
  setTimeout(() => {
    audioStore.delete(id)
  }, 5 * 60 * 1000)
  
  return NextResponse.json({ success: true, id })
}
