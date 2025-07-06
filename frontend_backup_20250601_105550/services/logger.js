/**
 * Structured Logging Service
 * 
 * This service provides structured logging capabilities for the frontend,
 * with integration to Sentry for error tracking.
 */

import { captureMessage, captureException, setContext } from './errorTracking';

// Log levels
export const LOG_LEVELS = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
  TRACE: 'trace'
};

// Default log level based on environment
const DEFAULT_LOG_LEVEL = process.env.NODE_ENV === 'production' 
  ? LOG_LEVELS.INFO 
  : LOG_LEVELS.DEBUG;

// Log level priority (higher number = higher priority)
const LOG_LEVEL_PRIORITY = {
  [LOG_LEVELS.ERROR]: 5,
  [LOG_LEVELS.WARN]: 4,
  [LOG_LEVELS.INFO]: 3,
  [LOG_LEVELS.DEBUG]: 2,
  [LOG_LEVELS.TRACE]: 1
};

// Current log level
let currentLogLevel = DEFAULT_LOG_LEVEL;

/**
 * Set the current log level
 * @param {string} level - One of the LOG_LEVELS values
 */
export const setLogLevel = (level) => {
  if (LOG_LEVELS[level.toUpperCase()]) {
    currentLogLevel = LOG_LEVELS[level.toUpperCase()];
  } else {
    console.warn(`Invalid log level: ${level}. Using default: ${DEFAULT_LOG_LEVEL}`);
    currentLogLevel = DEFAULT_LOG_LEVEL;
  }
};

/**
 * Check if a log level should be displayed based on current log level
 * @param {string} level - The log level to check
 * @returns {boolean} - Whether the log should be displayed
 */
const shouldLog = (level) => {
  return LOG_LEVEL_PRIORITY[level] >= LOG_LEVEL_PRIORITY[currentLogLevel];
};

/**
 * Format a log message with additional context
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {Object} data - Additional data to log
 * @returns {Object} - Formatted log object
 */
const formatLog = (level, message, data = {}) => {
  const timestamp = new Date().toISOString();
  const context = {
    timestamp,
    level,
    environment: process.env.NODE_ENV,
    ...data
  };

  return {
    message,
    context
  };
};

/**
 * Log a message to the console with structured format
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {Object} data - Additional data to log
 */
const logToConsole = (level, message, data) => {
  if (!shouldLog(level)) return;

  const { context } = formatLog(level, message, data);
  
  // Use appropriate console method based on level
  switch (level) {
    case LOG_LEVELS.ERROR:
      console.error(message, context);
      break;
    case LOG_LEVELS.WARN:
      console.warn(message, context);
      break;
    case LOG_LEVELS.INFO:
      console.info(message, context);
      break;
    case LOG_LEVELS.DEBUG:
      console.debug(message, context);
      break;
    case LOG_LEVELS.TRACE:
    default:
      console.log(message, context);
      break;
  }
};

/**
 * Log an error message and send to Sentry
 * @param {string} message - Error message
 * @param {Error|null} error - Error object (optional)
 * @param {Object} data - Additional context data
 */
export const error = (message, error = null, data = {}) => {
  logToConsole(LOG_LEVELS.ERROR, message, data);
  
  if (error) {
    // Add context to Sentry
    setContext('logger', data);
    captureException(error, {
      level: 'error',
      tags: {
        logger: true
      },
      extras: {
        ...data
      }
    });
  } else {
    // No error object, just capture the message
    captureMessage(message, {
      level: 'error',
      tags: {
        logger: true
      },
      extras: {
        ...data
      }
    });
  }
};

/**
 * Log a warning message and optionally send to Sentry
 * @param {string} message - Warning message
 * @param {Object} data - Additional context data
 * @param {boolean} sendToSentry - Whether to send to Sentry
 */
export const warn = (message, data = {}, sendToSentry = false) => {
  logToConsole(LOG_LEVELS.WARN, message, data);
  
  if (sendToSentry) {
    captureMessage(message, {
      level: 'warning',
      tags: {
        logger: true
      },
      extras: {
        ...data
      }
    });
  }
};

/**
 * Log an info message
 * @param {string} message - Info message
 * @param {Object} data - Additional context data
 */
export const info = (message, data = {}) => {
  logToConsole(LOG_LEVELS.INFO, message, data);
};

/**
 * Log a debug message
 * @param {string} message - Debug message
 * @param {Object} data - Additional context data
 */
export const debug = (message, data = {}) => {
  logToConsole(LOG_LEVELS.DEBUG, message, data);
};

/**
 * Log a trace message
 * @param {string} message - Trace message
 * @param {Object} data - Additional context data
 */
export const trace = (message, data = {}) => {
  logToConsole(LOG_LEVELS.TRACE, message, data);
};

/**
 * Create a logger instance with a specific component name
 * @param {string} component - Component name
 * @returns {Object} - Logger instance
 */
export const createLogger = (component) => {
  return {
    error: (message, error = null, data = {}) => 
      error(message, error, { ...data, component }),
    warn: (message, data = {}, sendToSentry = false) => 
      warn(message, { ...data, component }, sendToSentry),
    info: (message, data = {}) => 
      info(message, { ...data, component }),
    debug: (message, data = {}) => 
      debug(message, { ...data, component }),
    trace: (message, data = {}) => 
      trace(message, { ...data, component })
  };
};

// Default export
export default {
  setLogLevel,
  error,
  warn,
  info,
  debug,
  trace,
  createLogger,
  LOG_LEVELS
};
