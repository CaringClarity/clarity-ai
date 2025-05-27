import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { text, voiceModel } = await request.json()

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 })
    }

    // Use provided voice model or default to Athena
    const model = voiceModel || "aura-2-athena-en"

    const response = await fetch(`https://api.deepgram.com/v1/speak?model=${model}`, {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: text,
      }),
    })

    if (!response.ok) {
      throw new Error(`Deepgram TTS API error: ${response.status}`)
    }

    const audioBuffer = await response.arrayBuffer()

    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.byteLength.toString(),
      },
    })
  } catch (error) {
    console.error("Text-to-speech error:", error)
    return NextResponse.json({ error: "Failed to generate speech" }, { status: 500 })
  }
}
