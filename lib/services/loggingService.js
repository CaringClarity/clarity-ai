/**
 * Enhanced logging service for voice assistant
 * Provides centralized logging with database persistence
 */
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export const LogLevel = {
  DEBUG: "debug",
  INFO: "info",
  WARN: "warn",
  ERROR: "error",
  FATAL: "fatal",
}

export async function logEvent(level, category, message, metadata = {}) {
  try {
    const logEntry = {
      level,
      category,
      message,
      metadata,
      timestamp: new Date().toISOString(),
    }
    
    // Console logging
    console[level === LogLevel.FATAL ? "error" : level](`[${category}] ${message}`, metadata)
    
    // Store in database for persistence
    await supabase.from("system_logs").insert(logEntry)
    
    return true
  } catch (error) {
    console.error("Error logging event:", error)
    return false
  }
}

// Helper functions for common log types
export const logDebug = (category, message, metadata = {}) => logEvent(LogLevel.DEBUG, category, message, metadata)
export const logInfo = (category, message, metadata = {}) => logEvent(LogLevel.INFO, category, message, metadata)
export const logWarn = (category, message, metadata = {}) => logEvent(LogLevel.WARN, category, message, metadata)
export const logError = (category, message, metadata = {}) => logEvent(LogLevel.ERROR, category, message, metadata)
export const logFatal = (category, message, metadata = {}) => logEvent(LogLevel.FATAL, category, message, metadata)
