/**
 * Configuration management
 * Centralized environment variable handling
 */

export function getConfig() {
  return {
    // Deepgram Configuration
    DEEPGRAM_API_KEY: process.env.DEEPGRAM_API_KEY,
    DEEPGRAM_LANGUAGE: process.env.DEEPGRAM_LANGUAGE || "en-US",
    DEEPGRAM_MODEL: process.env.DEEPGRAM_MODEL || "nova-2",
    DEEPGRAM_TTS_MODEL: process.env.DEEPGRAM_TTS_MODEL || "aura-2-athena-en", // Athena as default

    // Groq Configuration
    GROQ_API_KEY: process.env.GROQ_API_KEY,

    // Twilio Configuration
    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
    TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER,

    // Application Configuration
    PUBLIC_URL: process.env.NEXT_PUBLIC_APP_URL,

    // Database Configuration
    SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  }
}

export default getConfig
