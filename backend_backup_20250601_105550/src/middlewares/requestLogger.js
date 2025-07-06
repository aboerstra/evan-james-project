/**
 * Request Logger Middleware
 * 
 * This middleware logs all API requests with structured logging.
 */

const logger = require('../utils/logger');

/**
 * Request logger middleware
 * @param {Object} config - Configuration options
 * @returns {Function} - Koa middleware function
 */
module.exports = (config = {}) => {
  const options = {
    // Log request body (disabled by default for security and performance)
    logBody: false,
    // Log request headers (disabled by default for security)
    logHeaders: false,
    // Log response body (disabled by default for performance)
    logResponse: false,
    // Skip logging for certain paths (e.g. health checks)
    skipPaths: ['/health', '/_health', '/favicon.ico'],
    // Override with provided config
    ...config
  };

  return async (ctx, next) => {
    // Skip logging for specified paths
    if (options.skipPaths.includes(ctx.path)) {
      return next();
    }

    const start = Date.now();
    const requestData = {
      method: ctx.method,
      url: ctx.url,
      ip: ctx.ip,
      userAgent: ctx.headers['user-agent']
    };

    // Add request body if enabled and exists
    if (options.logBody && ctx.request.body) {
      // Sanitize sensitive data from request body
      const sanitizedBody = { ...ctx.request.body };
      
      // Remove sensitive fields
      if (sanitizedBody.password) sanitizedBody.password = '[REDACTED]';
      if (sanitizedBody.passwordConfirmation) sanitizedBody.passwordConfirmation = '[REDACTED]';
      if (sanitizedBody.currentPassword) sanitizedBody.currentPassword = '[REDACTED]';
      if (sanitizedBody.newPassword) sanitizedBody.newPassword = '[REDACTED]';
      if (sanitizedBody.token) sanitizedBody.token = '[REDACTED]';
      
      requestData.body = sanitizedBody;
    }

    // Add request headers if enabled
    if (options.logHeaders) {
      // Sanitize sensitive headers
      const sanitizedHeaders = { ...ctx.headers };
      
      // Remove sensitive headers
      if (sanitizedHeaders.authorization) sanitizedHeaders.authorization = '[REDACTED]';
      if (sanitizedHeaders.cookie) sanitizedHeaders.cookie = '[REDACTED]';
      
      requestData.headers = sanitizedHeaders;
    }

    // Add user info if available
    if (ctx.state && ctx.state.user) {
      requestData.user = {
        id: ctx.state.user.id,
        email: ctx.state.user.email
      };
    }

    // Log the incoming request
    logger.info(`Incoming request: ${ctx.method} ${ctx.url}`, requestData);

    try {
      // Process the request
      await next();
    } catch (error) {
      // Calculate response time
      const responseTime = Date.now() - start;
      
      // Log error with request details
      logger.error(
        `Request error: ${ctx.method} ${ctx.url}`,
        error,
        {
          ...requestData,
          status: ctx.status,
          responseTime: `${responseTime}ms`,
          error: {
            message: error.message,
            stack: error.stack
          }
        }
      );
      
      // Re-throw the error to be handled by error middleware
      throw error;
    }

    // Calculate response time
    const responseTime = Date.now() - start;
    
    // Prepare response data
    const responseData = {
      ...requestData,
      status: ctx.status,
      responseTime: `${responseTime}ms`
    };
    
    // Add response body if enabled
    if (options.logResponse && ctx.body) {
      // For large responses, just log the type and size
      if (typeof ctx.body === 'object' && ctx.body !== null) {
        responseData.responseBody = {
          type: 'object',
          size: JSON.stringify(ctx.body).length
        };
      } else if (typeof ctx.body === 'string') {
        responseData.responseBody = {
          type: 'string',
          size: ctx.body.length
        };
      }
    }
    
    // Log based on status code
    if (ctx.status >= 500) {
      logger.error(`Server error: ${ctx.method} ${ctx.url}`, null, responseData);
    } else if (ctx.status >= 400) {
      logger.warn(`Client error: ${ctx.method} ${ctx.url}`, responseData);
    } else {
      logger.info(`Request completed: ${ctx.method} ${ctx.url}`, responseData);
    }
  };
};
