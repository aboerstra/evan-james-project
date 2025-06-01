# Structured Logging Guide

This document provides information about the structured logging system implemented in the Evan James project.

## Overview

The structured logging system provides a consistent way to log information across both the frontend and backend of the application. It integrates with Sentry for error tracking and provides a standardized format for log messages.

## Features

- **Structured Log Format**: All logs include contextual information such as timestamp, log level, and environment.
- **Log Levels**: Support for multiple log levels (error, warn, info, debug, trace).
- **Sentry Integration**: Error logs are automatically sent to Sentry for tracking.
- **Component-Based Logging**: Create logger instances for specific components.
- **Request Logging**: Automatic logging of API requests with response times and status codes.
- **Database Query Logging**: Optional logging of database queries in development.
- **Sanitization**: Automatic sanitization of sensitive data in logs.

## Backend Logging

### Usage

The backend logging utility is available at `backend/src/utils/logger.js` and can be used as follows:

```javascript
const logger = require('../utils/logger');

// Basic logging
logger.info('This is an info message');
logger.debug('This is a debug message', { additionalData: 'value' });
logger.warn('This is a warning', { userId: 123 });
logger.error('This is an error', new Error('Something went wrong'), { userId: 123 });

// Component-specific logger
const userLogger = logger.createLogger('user-service');
userLogger.info('User logged in', { userId: 123 });

// Database query logging (development only)
logger.logQuery('SELECT * FROM users WHERE id = ?', [123], 5.2);

// API request logging (handled automatically by middleware)
```

### Log Levels

- **FATAL**: Critical errors that cause the application to crash.
- **ERROR**: Errors that affect functionality but don't crash the application.
- **WARN**: Warnings about potential issues.
- **INFO**: General information about application operation.
- **DEBUG**: Detailed information for debugging.
- **TRACE**: Very detailed tracing information.

### Request Logging Middleware

The request logging middleware automatically logs all API requests with:

- Request method and URL
- Response status code
- Response time
- User information (if authenticated)
- IP address
- User agent

Configuration options:

```javascript
const requestLogger = require('../middlewares/requestLogger');

const logger = requestLogger({
  logBody: false,        // Whether to log request bodies
  logHeaders: false,     // Whether to log request headers
  logResponse: false,    // Whether to log response bodies
  skipPaths: ['/health'] // Paths to skip logging
});
```

## Frontend Logging

### Usage

The frontend logging utility is available at `frontend/services/logger.js` and can be used as follows:

```javascript
import logger from '../services/logger';

// Basic logging
logger.info('This is an info message');
logger.debug('This is a debug message', { additionalData: 'value' });
logger.warn('This is a warning', { userId: 123 });
logger.error('This is an error', new Error('Something went wrong'), { userId: 123 });

// Component-specific logger
const authLogger = logger.createLogger('auth-component');
authLogger.info('User logged in', { userId: 123 });

// Set log level (default is based on environment)
logger.setLogLevel(logger.LOG_LEVELS.DEBUG);
```

### Log Levels

- **ERROR**: Errors that affect functionality.
- **WARN**: Warnings about potential issues.
- **INFO**: General information about application operation.
- **DEBUG**: Detailed information for debugging.
- **TRACE**: Very detailed tracing information.

## Integration with Sentry

Both frontend and backend logging systems integrate with Sentry for error tracking:

- All `error` level logs are sent to Sentry automatically.
- `warn` level logs can optionally be sent to Sentry by setting the `sendToSentry` parameter to `true`.
- Additional context data is attached to Sentry events.

## Best Practices

1. **Use Appropriate Log Levels**:
   - Use `error` for actual errors that need attention.
   - Use `warn` for potential issues that don't immediately affect functionality.
   - Use `info` for significant events in the application.
   - Use `debug` for detailed information useful during development.
   - Use `trace` for very detailed debugging information.

2. **Include Contextual Information**:
   - Always include relevant context with log messages.
   - For user-related logs, include user ID.
   - For entity-related logs, include entity ID.

3. **Sanitize Sensitive Data**:
   - Never log passwords, tokens, or other sensitive information.
   - The logging system automatically sanitizes some sensitive fields, but be cautious with custom data.

4. **Use Component Loggers**:
   - Create component-specific loggers for better organization.
   - This makes it easier to filter logs by component.

5. **Be Concise But Clear**:
   - Log messages should be concise but descriptive.
   - Include enough information to understand the context without reading code.

## Configuration

### Backend

The backend logging system uses Strapi's built-in logger with enhanced structured formatting. No additional configuration is needed.

The request logging middleware can be configured in `backend/config/middlewares.js`:

```javascript
const customRequestLogger = requestLogger({
  logBody: process.env.NODE_ENV === 'development',
  logHeaders: false,
  logResponse: false,
  skipPaths: ['/health', '/_health', '/favicon.ico', '/documentation']
});
```

### Frontend

The frontend logging system's default log level is based on the environment:
- Production: `INFO` level and above
- Development: `DEBUG` level and above

You can override this by calling `setLogLevel()` with the desired level.

## Viewing Logs

### Development

In development, logs are output to the console with structured formatting.

### Production

In production:
- Backend logs are handled by Strapi's logging system.
- Frontend logs are sent to the browser console.
- Error logs are sent to Sentry for monitoring and alerting.

## Future Improvements

Potential future improvements to the logging system:

1. **Log Aggregation**: Implement a centralized log aggregation system (e.g., ELK stack).
2. **Log Rotation**: Implement log rotation for file-based logs.
3. **Performance Metrics**: Enhance logging with performance metrics.
4. **User Activity Tracking**: Implement more comprehensive user activity logging.
5. **Audit Logging**: Add specific audit logging for security-sensitive operations.
