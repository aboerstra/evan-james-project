# Performance Monitoring Guide

This document provides a comprehensive guide to the performance monitoring system implemented in the Evan James project, covering both backend and frontend monitoring.

## Overview

The performance monitoring system tracks and analyzes the performance of both the backend API and frontend application. It provides insights into:

- API response times
- Slow API endpoints
- Page load performance
- Resource loading performance
- JavaScript execution performance
- User interaction performance

The system integrates with Sentry for alerting on performance issues and uses structured logging for detailed performance data.

## Backend Performance Monitoring

### Middleware

The backend uses a custom performance monitoring middleware (`performanceMonitor.js`) that tracks API request performance metrics. The middleware is configured in `backend/config/middlewares.js` and is applied to all API requests.

#### Key Features

- Tracks request counts by endpoint, method, and status code
- Measures response times for all API requests
- Identifies and logs slow requests (configurable threshold)
- Sends alerts to Sentry for very slow requests
- Provides real-time performance metrics

#### Configuration Options

```javascript
const customPerformanceMonitor = performanceMonitor({
  // Log all requests with performance data
  logPerformance: true,
  // Track slow requests (requests that exceed slowThreshold)
  trackSlowRequests: true,
  // Threshold in ms to consider a request "slow"
  slowThreshold: process.env.NODE_ENV === 'production' ? 1000 : 2000,
  // Send performance data to Sentry
  sendToSentry: process.env.NODE_ENV === 'production',
  // Skip monitoring for certain paths
  skipPaths: ['/health', '/_health', '/favicon.ico', '/documentation']
});
```

### Performance Metrics API

The backend exposes a performance metrics API that provides access to the collected performance data. This API is only accessible to authenticated admin users.

#### Endpoints

- `GET /api/performance/metrics` - Get current performance metrics
- `POST /api/performance/reset` - Reset performance metrics

#### Example Response

```json
{
  "summary": {
    "totalRequests": 1250,
    "averageResponseTime": 87.5,
    "minResponseTime": 12,
    "maxResponseTime": 3200,
    "slowRequests": 15
  },
  "requestCounts": {
    "byMethod": {
      "GET": 980,
      "POST": 220,
      "PUT": 35,
      "DELETE": 15
    },
    "byStatusCode": {
      "200": 1180,
      "201": 35,
      "400": 20,
      "401": 10,
      "500": 5
    }
  },
  "endpoints": [
    {
      "path": "/api/albums",
      "requests": 350,
      "averageResponseTime": 65.2,
      "minResponseTime": 15,
      "maxResponseTime": 1200,
      "slowRequests": 3
    },
    // More endpoints...
  ]
}
```

## Frontend Performance Monitoring

### Performance Monitoring Service

The frontend uses a performance monitoring service (`performanceMonitoring.js`) that tracks various performance metrics on the client side. The service is initialized in the application's entry point (`_app.js`).

#### Key Features

- Tracks page load performance
- Monitors API request performance
- Tracks resource loading performance (images, scripts, etc.)
- Monitors JavaScript execution (long tasks)
- Tracks user interaction performance
- Integrates with Sentry for alerting

#### Metrics Tracked

1. **Page Load Metrics**
   - Total page load time
   - DOM content loaded time
   - First paint time
   - Backend time (time to first byte)
   - Frontend time (rendering time)

2. **API Request Metrics**
   - Request duration
   - Success/failure status
   - Slow requests (> 1 second)

3. **Resource Load Metrics**
   - Resource type (image, script, etc.)
   - Load duration
   - Slow resource loads (> 500ms)

4. **JavaScript Execution Metrics**
   - Long tasks (> 50ms)
   - JavaScript errors

5. **User Interaction Metrics**
   - Interaction type (click, submit, etc.)
   - Interaction duration
   - Slow interactions (> 300ms)

### Usage in API Client

The frontend API client (`api.js`) uses the performance monitoring service to track API request performance:

```javascript
export async function fetchAPI(path, urlParamsObject = {}, options = {}) {
  // ... existing code ...

  const startTime = performance.now();
  let status = 0;

  try {
    // Trigger API call
    const response = await fetch(requestUrl, mergedOptions);
    status = response.status;

    // ... existing code ...
    
    // Track API request performance
    const duration = performance.now() - startTime;
    performanceMonitoring.trackApiRequest(path, duration, status);
    
    return data;
  } catch (error) {
    // ... existing code ...
    
    // Track failed API request
    const duration = performance.now() - startTime;
    performanceMonitoring.trackApiRequest(path, duration, status || 0);
    
    throw error;
  }
}
```

## Integration with Sentry

Both the backend and frontend performance monitoring systems integrate with Sentry for alerting on performance issues:

### Backend

```javascript
// Send to Sentry if it's a slow request
if (options.sendToSentry && responseTime > options.slowThreshold) {
  Sentry.captureMessage(`Slow API Request: ${method} ${route} - ${responseTime}ms`, {
    level: 'warning',
    tags: {
      method,
      route,
      responseTime,
      statusCode
    }
  });
}
```

### Frontend

```javascript
// Send to Sentry if page load is slow (> 3 seconds)
if (pageLoadTime > 3000) {
  Sentry.captureMessage(`Slow page load: ${pagePath} - ${pageLoadTime}ms`, {
    level: 'warning',
    tags: {
      pagePath,
      pageLoadTime,
      domContentLoadedTime,
      firstPaintTime,
      backendTime,
      frontendTime
    }
  });
}
```

## Best Practices

### Backend

1. **Monitor Slow Endpoints**
   - Regularly review the performance metrics API to identify slow endpoints
   - Optimize database queries for slow endpoints
   - Consider caching frequently accessed data

2. **Set Appropriate Thresholds**
   - Adjust the `slowThreshold` based on your application's requirements
   - Use different thresholds for development and production environments

3. **Log Performance Data**
   - Enable `logPerformance` to log all request performance data
   - Use log levels appropriately (debug for normal requests, warn for slow requests)

### Frontend

1. **Optimize Page Load Performance**
   - Use Next.js Image component for optimized images
   - Implement code splitting to reduce initial bundle size
   - Use server-side rendering or static generation where appropriate

2. **Optimize API Requests**
   - Batch related API requests where possible
   - Implement caching for frequently accessed data
   - Use pagination for large datasets

3. **Monitor Resource Loading**
   - Optimize image sizes and formats
   - Use lazy loading for below-the-fold content
   - Minimize third-party scripts

## Troubleshooting

### Common Performance Issues

1. **Slow API Endpoints**
   - Check database queries (missing indexes, complex joins)
   - Look for N+1 query problems
   - Check for external API calls that might be slow

2. **Slow Page Loads**
   - Large JavaScript bundles
   - Unoptimized images
   - Render-blocking resources
   - Too many API requests on page load

3. **Long JavaScript Tasks**
   - Complex calculations in the main thread
   - Heavy DOM manipulations
   - Inefficient event handlers

### Debugging Tools

1. **Backend**
   - Performance metrics API (`/api/performance/metrics`)
   - Structured logs with performance data
   - Sentry performance monitoring

2. **Frontend**
   - Browser DevTools Performance panel
   - Lighthouse audits
   - `performanceMonitoring.getMetrics()` in browser console
   - Sentry performance monitoring

## Conclusion

The performance monitoring system provides comprehensive insights into the performance of both the backend API and frontend application. By regularly monitoring and optimizing performance, you can ensure a fast and responsive experience for users of the Evan James website.

---

*Last updated: May 31, 2025*
