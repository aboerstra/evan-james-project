'use strict';

/**
 * Error handling middleware for Strapi
 * Catches errors, logs them, and returns sanitized error messages to the client
 * Also sends errors to Sentry for monitoring and tracking
 */

const { captureException } = require('../utils/sentry');

// Error types that are safe to expose to the client
const SAFE_ERROR_TYPES = [
  'ValidationError',
  'BadRequestError',
  'NotFoundError',
  'ForbiddenError',
  'UnauthorizedError',
  'RateLimitError'
];

// Map of error status codes
const ERROR_STATUS_CODES = {
  ValidationError: 400,
  BadRequestError: 400,
  NotFoundError: 404,
  ForbiddenError: 403,
  UnauthorizedError: 401,
  RateLimitError: 429,
  PayloadTooLargeError: 413,
  UnsupportedMediaTypeError: 415,
  TooManyRequestsError: 429,
  ServerError: 500
};

/**
 * Determines if an error is safe to expose to the client
 * @param {Error} error - The error object
 * @returns {boolean} Whether the error is safe to expose
 */
const isSafeError = (error) => {
  if (!error) return false;
  
  // Check if the error type is in the safe list
  if (error.name && SAFE_ERROR_TYPES.includes(error.name)) {
    return true;
  }
  
  // Check if it's a Strapi validation error
  if (error.details && error.message && error.name === 'ValidationError') {
    return true;
  }
  
  // Check if it's a badRequest error from Strapi
  if (error.status === 400 && error.name === 'BadRequestError') {
    return true;
  }
  
  return false;
};

/**
 * Creates a sanitized error response
 * @param {Error} error - The original error
 * @returns {Object} Sanitized error object
 */
const createSanitizedError = (error) => {
  // Default error
  const sanitizedError = {
    status: 'error',
    message: 'An unexpected error occurred',
    code: 'INTERNAL_SERVER_ERROR',
    statusCode: 500
  };
  
  // If it's a safe error, include more details
  if (isSafeError(error)) {
    sanitizedError.message = error.message || 'Bad request';
    sanitizedError.code = error.name || 'BAD_REQUEST';
    sanitizedError.statusCode = ERROR_STATUS_CODES[error.name] || 400;
    
    // Include validation details if available, but sanitize them
    if (error.details && typeof error.details === 'object') {
      sanitizedError.details = Object.keys(error.details).reduce((acc, key) => {
        // Only include safe fields
        if (['path', 'message', 'name'].includes(key)) {
          acc[key] = error.details[key];
        }
        return acc;
      }, {});
    }
  }
  
  return sanitizedError;
};

/**
 * Error handling middleware factory
 * @param {Object} config - Configuration options
 * @returns {Function} Koa middleware function
 */
module.exports = (config = {}) => {
  const options = {
    logErrors: true,
    exposeErrors: process.env.NODE_ENV === 'development',
    ...config,
  };
  
  return async (ctx, next) => {
    try {
      await next();
    } catch (error) {
      // Log the error
      if (options.logErrors) {
        strapi.log.error({
          error: {
            message: error.message,
            stack: error.stack,
            name: error.name,
            code: error.code,
            details: error.details
          },
          request: {
            method: ctx.method,
            url: ctx.url,
            headers: ctx.headers,
            ip: ctx.ip
          }
        }, 'Request error');
      }
      
      // Set the status code
      ctx.status = error.status || ERROR_STATUS_CODES[error.name] || 500;
      
      // Create the error response
      const errorResponse = options.exposeErrors
        ? { 
            status: 'error',
            message: error.message,
            code: error.name || 'SERVER_ERROR',
            stack: error.stack,
            details: error.details
          }
        : createSanitizedError(error);
      
      // Set the response body
      ctx.body = errorResponse;
      
      // Send error to Sentry for monitoring
      // Don't send validation errors or 4xx client errors to Sentry
      if (ctx.status >= 500 || !isSafeError(error)) {
        captureException(error, {
          user: ctx.state.user ? {
            id: ctx.state.user.id,
            username: ctx.state.user.username,
            email: ctx.state.user.email,
          } : undefined,
          tags: {
            route: ctx.route ? ctx.route.path : undefined,
            method: ctx.method,
            statusCode: ctx.status,
          },
          extras: {
            url: ctx.url,
            query: ctx.query,
            params: ctx.params,
            ip: ctx.ip,
            userAgent: ctx.headers['user-agent'],
          }
        });
      }
      
      // Emit error event for monitoring
      strapi.eventHub.emit('server.error', {
        error,
        ctx
      });
    }
  };
};
