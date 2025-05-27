import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    console.log("Speech-to-text API called")

    const formData = await request.formData()
    const audioFile = formData.get("audio") as File

    if (!audioFile) {
      console.error("No audio file provided")
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 })
    }

    console.log("Audio file received:", {
      name: audioFile.name,
      type: audioFile.type,
      size: audioFile.size,
    })

    // Check if Deepgram API key exists
    if (!process.env.DEEPGRAM_API_KEY) {
      console.error("DEEPGRAM_API_KEY not found in environment variables")
      return NextResponse.json({ error: "Deepgram API key not configured" }, { status: 500 })
    }

    // Convert the audio file to the format Deepgram expects
    const audioBuffer = await audioFile.arrayBuffer()
    console.log("Audio buffer size:", audioBuffer.byteLength)

    const deepgramUrl = "https://api.deepgram.com/v1/listen?model=nova-2&smart_format=true&language=en-US"

    console.log("Calling Deepgram API...")
    const response = await fetch(deepgramUrl, {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
        "Content-Type": audioFile.type || "audio/webm",
      },
      body: audioBuffer,
    })

    console.log("Deepgram response status:", response.status)
    console.log("Deepgram response headers:", Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Deepgram API error:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      })
      return NextResponse.json(
        {
          error: `Deepgram API error: ${response.status} - ${errorText}`,
        },
        { status: 500 },
      )
    }

    const result = await response.json()
    console.log("Deepgram result:", JSON.stringify(result, null, 2))

    const transcript = result.results?.channels?.[0]?.alternatives?.[0]?.transcript || ""
    console.log("Extracted transcript:", transcript)

    return NextResponse.json({ transcript })
  } catch (error) {
    console.error("Speech-to-text error:", error)
    return NextResponse.json(
      {
        error: `Failed to process speech: ${error instanceof Error ? error.message : "Unknown error"}`,
      },
      { status: 500 },
    )
  }
}
