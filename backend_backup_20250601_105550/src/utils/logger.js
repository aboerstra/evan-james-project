/**
 * Structured Logging Utility
 * 
 * This utility enhances Strapi's built-in logging with structured logging capabilities
 * and Sentry integration.
 */

const { captureMessage, captureException, setContext } = require('./sentry');

/**
 * Log levels
 */
const LOG_LEVELS = {
  FATAL: 'fatal',
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
  TRACE: 'trace'
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
  return {
    timestamp,
    level,
    message,
    environment: process.env.NODE_ENV,
    ...data
  };
};

/**
 * Log a fatal error message and send to Sentry
 * @param {string} message - Error message
 * @param {Error|null} error - Error object (optional)
 * @param {Object} data - Additional context data
 */
const fatal = (message, error = null, data = {}) => {
  const formattedLog = formatLog(LOG_LEVELS.FATAL, message, data);
  strapi.log.error(formattedLog);
  
  if (error) {
    // Add context to Sentry
    setContext('logger', data);
    captureException(error, {
      level: 'fatal',
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
      level: 'fatal',
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
 * Log an error message and send to Sentry
 * @param {string} message - Error message
 * @param {Error|null} error - Error object (optional)
 * @param {Object} data - Additional context data
 */
const error = (message, error = null, data = {}) => {
  const formattedLog = formatLog(LOG_LEVELS.ERROR, message, data);
  strapi.log.error(formattedLog);
  
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
const warn = (message, data = {}, sendToSentry = false) => {
  const formattedLog = formatLog(LOG_LEVELS.WARN, message, data);
  strapi.log.warn(formattedLog);
  
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
const info = (message, data = {}) => {
  const formattedLog = formatLog(LOG_LEVELS.INFO, message, data);
  strapi.log.info(formattedLog);
};

/**
 * Log a debug message
 * @param {string} message - Debug message
 * @param {Object} data - Additional context data
 */
const debug = (message, data = {}) => {
  const formattedLog = formatLog(LOG_LEVELS.DEBUG, message, data);
  strapi.log.debug(formattedLog);
};

/**
 * Create a logger instance with a specific component name
 * @param {string} component - Component name
 * @returns {Object} - Logger instance
 */
const createLogger = (component) => {
  return {
    fatal: (message, error = null, data = {}) => 
      fatal(message, error, { ...data, component }),
    error: (message, error = null, data = {}) => 
      error(message, error, { ...data, component }),
    warn: (message, data = {}, sendToSentry = false) => 
      warn(message, { ...data, component }, sendToSentry),
    info: (message, data = {}) => 
      info(message, { ...data, component }),
    debug: (message, data = {}) => 
      debug(message, { ...data, component })
  };
};

/**
 * Log a database query (for debugging purposes)
 * @param {string} query - SQL query
 * @param {Array} params - Query parameters
 * @param {number} duration - Query duration in milliseconds
 */
const logQuery = (query, params = [], duration = 0) => {
  if (process.env.NODE_ENV === 'development') {
    debug('Database Query', {
      query,
      params,
      duration: `${duration}ms`
    });
  }
};

/**
 * Log an API request
 * @param {Object} ctx - Koa context
 * @param {number} responseTime - Response time in milliseconds
 */
const logRequest = (ctx, responseTime = 0) => {
  const { method, url, status } = ctx;
  const level = status >= 500 ? LOG_LEVELS.ERROR : 
                status >= 400 ? LOG_LEVELS.WARN : 
                LOG_LEVELS.INFO;
  
  const data = {
    method,
    url,
    status,
    responseTime: `${responseTime}ms`,
    userAgent: ctx.headers['user-agent'],
    ip: ctx.ip
  };
  
  // Add user info if available
  if (ctx.state && ctx.state.user) {
    data.user = {
      id: ctx.state.user.id,
      email: ctx.state.user.email
    };
  }
  
  switch (level) {
    case LOG_LEVELS.ERROR:
      error(`API Request Error: ${method} ${url}`, null, data);
      break;
    case LOG_LEVELS.WARN:
      warn(`API Request Warning: ${method} ${url}`, data);
      break;
    default:
      info(`API Request: ${method} ${url}`, data);
      break;
  }
};

module.exports = {
  LOG_LEVELS,
  fatal,
  error,
  warn,
  info,
  debug,
  createLogger,
  logQuery,
  logRequest
};
