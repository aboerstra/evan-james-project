/**
 * Performance Monitoring Middleware
 * 
 * This middleware tracks API performance metrics and can report them
 * to monitoring services or log them for analysis.
 */

const logger = require('../utils/logger');
const Sentry = require('../utils/sentry');

/**
 * Performance monitoring middleware
 * @param {Object} config - Configuration options
 * @returns {Function} - Koa middleware function
 */
module.exports = (config = {}) => {
  const options = {
    // Log all requests with performance data
    logPerformance: true,
    // Track slow requests (requests that exceed slowThreshold)
    trackSlowRequests: true,
    // Threshold in ms to consider a request "slow"
    slowThreshold: 1000,
    // Send performance data to Sentry
    sendToSentry: true,
    // Skip monitoring for certain paths
    skipPaths: ['/health', '/_health', '/favicon.ico'],
    // Override with provided config
    ...config
  };

  // Store performance metrics for analysis
  const performanceMetrics = {
    requestCounts: {
      total: 0,
      byEndpoint: {},
      byMethod: {},
      byStatusCode: {}
    },
    responseTimes: {
      total: 0,
      count: 0,
      min: Number.MAX_SAFE_INTEGER,
      max: 0,
      byEndpoint: {},
      slow: {
        count: 0,
        endpoints: {}
      }
    },
    // Reset metrics (e.g., on a schedule)
    reset: () => {
      performanceMetrics.requestCounts.total = 0;
      performanceMetrics.requestCounts.byEndpoint = {};
      performanceMetrics.requestCounts.byMethod = {};
      performanceMetrics.requestCounts.byStatusCode = {};
      performanceMetrics.responseTimes.total = 0;
      performanceMetrics.responseTimes.count = 0;
      performanceMetrics.responseTimes.min = Number.MAX_SAFE_INTEGER;
      performanceMetrics.responseTimes.max = 0;
      performanceMetrics.responseTimes.byEndpoint = {};
      performanceMetrics.responseTimes.slow.count = 0;
      performanceMetrics.responseTimes.slow.endpoints = {};
    },
    // Get average response time
    getAverageResponseTime: () => {
      return performanceMetrics.responseTimes.count > 0
        ? performanceMetrics.responseTimes.total / performanceMetrics.responseTimes.count
        : 0;
    },
    // Get current metrics snapshot
    getMetrics: () => {
      return {
        requestCounts: { ...performanceMetrics.requestCounts },
        responseTimes: {
          ...performanceMetrics.responseTimes,
          average: performanceMetrics.getAverageResponseTime()
        }
      };
    }
  };

  // Expose metrics for external access (e.g., for a metrics endpoint)
  module.exports.metrics = performanceMetrics;

  return async (ctx, next) => {
    // Skip monitoring for specified paths
    if (options.skipPaths.includes(ctx.path)) {
      return next();
    }

    const start = Date.now();
    const route = ctx.path;
    const method = ctx.method;

    try {
      // Process the request
      await next();
    } finally {
      // Calculate response time
      const responseTime = Date.now() - start;
      const statusCode = ctx.status;

      // Update request counts
      performanceMetrics.requestCounts.total++;
      
      // By endpoint
      if (!performanceMetrics.requestCounts.byEndpoint[route]) {
        performanceMetrics.requestCounts.byEndpoint[route] = 0;
      }
      performanceMetrics.requestCounts.byEndpoint[route]++;
      
      // By method
      if (!performanceMetrics.requestCounts.byMethod[method]) {
        performanceMetrics.requestCounts.byMethod[method] = 0;
      }
      performanceMetrics.requestCounts.byMethod[method]++;
      
      // By status code
      if (!performanceMetrics.requestCounts.byStatusCode[statusCode]) {
        performanceMetrics.requestCounts.byStatusCode[statusCode] = 0;
      }
      performanceMetrics.requestCounts.byStatusCode[statusCode]++;

      // Update response times
      performanceMetrics.responseTimes.total += responseTime;
      performanceMetrics.responseTimes.count++;
      performanceMetrics.responseTimes.min = Math.min(performanceMetrics.responseTimes.min, responseTime);
      performanceMetrics.responseTimes.max = Math.max(performanceMetrics.responseTimes.max, responseTime);
      
      // By endpoint
      if (!performanceMetrics.responseTimes.byEndpoint[route]) {
        performanceMetrics.responseTimes.byEndpoint[route] = {
          total: 0,
          count: 0,
          min: Number.MAX_SAFE_INTEGER,
          max: 0
        };
      }
      performanceMetrics.responseTimes.byEndpoint[route].total += responseTime;
      performanceMetrics.responseTimes.byEndpoint[route].count++;
      performanceMetrics.responseTimes.byEndpoint[route].min = Math.min(
        performanceMetrics.responseTimes.byEndpoint[route].min,
        responseTime
      );
      performanceMetrics.responseTimes.byEndpoint[route].max = Math.max(
        performanceMetrics.responseTimes.byEndpoint[route].max,
        responseTime
      );

      // Track slow requests
      if (options.trackSlowRequests && responseTime > options.slowThreshold) {
        performanceMetrics.responseTimes.slow.count++;
        
        if (!performanceMetrics.responseTimes.slow.endpoints[route]) {
          performanceMetrics.responseTimes.slow.endpoints[route] = {
            count: 0,
            times: []
          };
        }
        
        performanceMetrics.responseTimes.slow.endpoints[route].count++;
        // Keep the last 10 slow response times for this endpoint
        performanceMetrics.responseTimes.slow.endpoints[route].times.push({
          time: responseTime,
          timestamp: new Date().toISOString(),
          method,
          statusCode
        });
        
        // Limit the array to the last 10 entries
        if (performanceMetrics.responseTimes.slow.endpoints[route].times.length > 10) {
          performanceMetrics.responseTimes.slow.endpoints[route].times.shift();
        }
      }

      // Log performance data
      if (options.logPerformance) {
        const logLevel = responseTime > options.slowThreshold ? 'warn' : 'debug';
        logger[logLevel](
          `API Performance: ${method} ${route} - ${responseTime}ms (${statusCode})`,
          {
            method,
            route,
            responseTime,
            statusCode,
            slow: responseTime > options.slowThreshold
          }
        );
      }

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
    }
  };
};
