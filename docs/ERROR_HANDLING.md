# Error Handling Guide

This document outlines the error handling strategy for the Evan James website, including both frontend and backend error handling.

## Table of Contents

1. [Overview](#overview)
2. [Frontend Error Handling](#frontend-error-handling)
   - [Error Boundary](#error-boundary)
   - [API Error Handling](#api-error-handling)
   - [Form Validation](#form-validation)
3. [Backend Error Handling](#backend-error-handling)
   - [Global Error Middleware](#global-error-middleware)
   - [Controller Error Handling](#controller-error-handling)
   - [Database Error Handling](#database-error-handling)
4. [Error Tracking with Sentry](#error-tracking-with-sentry)
   - [Frontend Integration](#frontend-integration)
   - [Backend Integration](#backend-integration)
   - [Custom Error Context](#custom-error-context)
5. [Error Logging](#error-logging)
6. [Best Practices](#best-practices)

## Overview

The Evan James website implements a comprehensive error handling strategy to ensure a smooth user experience while providing developers with the information needed to diagnose and fix issues. The strategy includes:

- Client-side error boundaries to prevent UI crashes
- Consistent API error responses
- Form validation with clear error messages
- Server-side error middleware
- Error tracking with Sentry
- Structured error logging

## Frontend Error Handling

### Error Boundary

React Error Boundaries are used to catch JavaScript errors anywhere in the component tree and display fallback UI instead of crashing the entire application.

```jsx
// Usage example
import ErrorBoundary from '../components/ErrorBoundary';

function MyComponent() {
  return (
    <ErrorBoundary componentName="MyComponent">
      {/* Your component content */}
    </ErrorBoundary>
  );
}
```

The main application is wrapped in an ErrorBoundary in `_app.js` to catch any unhandled errors.

### API Error Handling

API requests use a consistent error handling pattern:

```javascript
try {
  const response = await api.get('/endpoint');
  // Handle success
} catch (error) {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const { status, data } = error.response;
    // Handle different status codes
    if (status === 401) {
      // Handle unauthorized
    } else if (status === 404) {
      // Handle not found
    } else {
      // Handle other errors
    }
  } else if (error.request) {
    // The request was made but no response was received
    // Handle network errors
  } else {
    // Something happened in setting up the request that triggered an Error
    // Handle other errors
  }
}
```

### Form Validation

Forms use React Hook Form for validation with clear error messages:

```jsx
const { register, handleSubmit, formState: { errors } } = useForm();

// Display validation errors
{errors.email && <span className="error">{errors.email.message}</span>}
```

## Backend Error Handling

### Global Error Middleware

A global error handling middleware catches all unhandled errors in the Strapi application:

```javascript
// backend/src/middlewares/errorHandler.js
module.exports = (config = {}) => {
  return async (ctx, next) => {
    try {
      await next();
    } catch (error) {
      // Log and handle the error
      // ...
    }
  };
};
```

### Controller Error Handling

Controllers use try/catch blocks to handle errors:

```javascript
module.exports = {
  async find(ctx) {
    try {
      // Controller logic
    } catch (error) {
      // Handle and log the error
      ctx.throw(500, 'Internal server error');
    }
  }
};
```

### Database Error Handling

Database operations are wrapped in try/catch blocks:

```javascript
try {
  const result = await strapi.query('api::model.model').findOne({
    where: { id: ctx.params.id }
  });
  // Process result
} catch (error) {
  // Handle database error
}
```

## Error Tracking with Sentry

The application uses Sentry for error tracking and monitoring in both frontend and backend.

### Frontend Integration

Sentry is integrated with Next.js using the `@sentry/nextjs` package:

1. Configuration files:
   - `sentry.client.config.js` - Client-side configuration
   - `sentry.server.config.js` - Server-side configuration

2. Error tracking service:
   - `services/errorTracking.js` - Provides utilities for tracking errors

3. Usage:
   ```javascript
   import { captureException } from '../services/errorTracking';
   
   try {
     // Code that might throw an error
   } catch (error) {
     captureException(error, {
       tags: { component: 'ComponentName' }
     });
   }
   ```

### Backend Integration

Sentry is integrated with Strapi using the `@sentry/node` package:

1. Initialization in `src/index.js`
2. Integration with error middleware
3. Utility functions in `src/utils/sentry.js`

### Custom Error Context

Both frontend and backend Sentry integrations support adding custom context to errors:

```javascript
captureException(error, {
  user: {
    id: user.id,
    email: user.email
  },
  tags: {
    feature: 'checkout',
    environment: process.env.NODE_ENV
  },
  extras: {
    additionalData: 'value'
  }
});
```

## Error Logging

In addition to Sentry, errors are logged to the console with contextual information:

- Frontend: Uses console.error with structured information
- Backend: Uses Strapi's logging system (strapi.log)

## Best Practices

1. **Always use try/catch blocks** for async operations
2. **Provide meaningful error messages** to users
3. **Add context to errors** when sending to Sentry
4. **Don't expose sensitive information** in error messages
5. **Use Error Boundaries** around complex components
6. **Validate user input** on both client and server
7. **Handle network errors** gracefully
8. **Log errors** with sufficient context for debugging
9. **Monitor Sentry** for new error types
10. **Fix common errors** promptly

## Environment Variables

### Frontend

- `NEXT_PUBLIC_SENTRY_DSN`: Sentry Data Source Name for error tracking

### Backend

- `SENTRY_DSN`: Sentry Data Source Name for error tracking
- `SENTRY_ENABLE_DEV`: Whether to enable Sentry in development mode (default: false)
