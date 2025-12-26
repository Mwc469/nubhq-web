/**
 * Development-only logging utility
 * Prevents console statements from appearing in production
 */

const isDev = import.meta.env.DEV

export const logger = {
  log: (...args) => {
    if (isDev) console.log(...args)
  },
  error: (...args) => {
    if (isDev) console.error(...args)
  },
  warn: (...args) => {
    if (isDev) console.warn(...args)
  },
  info: (...args) => {
    if (isDev) console.info(...args)
  },
  debug: (...args) => {
    if (isDev) console.debug(...args)
  },
  // For errors that should always be logged (e.g., for error tracking)
  critical: (...args) => {
    console.error(...args)
    // TODO: Send to error tracking service (Sentry, etc.)
  }
}

export default logger
