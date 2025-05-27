/**
 * Speech synthesis service for Clara Voice Assistant
 * MIGRATED: From ElevenLabs to Deepgram TTS
 * Enhanced error handling and retry logic
 */

/**
 * Synthesize speech from text using Deepgram TTS
 * @param {string} text - Text to synthesize
 * @returns {Promise<Buffer>} - Audio buffer
 */
export async function synthesizeSpeech(text) {
  const MAX_RETRIES = 2
  let retries = MAX_RETRIES

  while (retries >= 0) {
    try {
      if (!process.env.DEEPGRAM_API_KEY) {
        throw new Error("Deepgram API key is missing")
      }

      console.log(`Synthesizing speech with Deepgram, text length: ${text.length} characters`)

      // Call Deepgram TTS API
      const response = await fetch("https://api.deepgram.com/v1/speak?model=aura-asteria-en", {
        method: "POST",
        headers: {
          Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) {
        throw new Error(`Deepgram TTS API error: ${response.status}`)
      }

      const audioArrayBuffer = await response.arrayBuffer()
      console.log(`Speech synthesis successful, received ${audioArrayBuffer.byteLength} bytes`)

      return Buffer.from(audioArrayBuffer)
    } catch (error) {
      retries--

      if (error.message.includes("401")) {
        console.error("Authentication failed with Deepgram API. Please check your API key.")
        break // Don't retry on auth errors
      }

      if (retries < 0) {
        console.error(`Exceeded maximum retry attempts for speech synthesis: ${error.message}`)
        throw new Error(`Failed to synthesize speech after ${MAX_RETRIES} attempts: ${error.message}`)
      }

      console.warn(`Retrying speech synthesis (${retries} attempts left)`)
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
  }

  throw new Error("Failed to synthesize speech. Check Deepgram API key and service status.")
}

/**
 * Verify Deepgram API key is valid
 * @returns {Promise<boolean>} - Whether the API key is valid
 */
export async function verifyDeepgramApiKey() {
  try {
    if (!process.env.DEEPGRAM_API_KEY) {
      console.error("Deepgram API key is missing")
      return false
    }

    // Test the API key with a simple request
    const response = await fetch("https://api.deepgram.com/v1/projects", {
      headers: {
        Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
      },
    })

    if (response.ok) {
      console.log("Deepgram API key is valid")
      return true
    }

    return false
  } catch (error) {
    console.error(`Error verifying Deepgram API key: ${error.message}`)
    return false
  }
}

export default {
  synthesizeSpeech,
  verifyDeepgramApiKey,
}
