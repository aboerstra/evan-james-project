/**
 * Performance Monitoring Service
 * 
 * This service provides utilities for monitoring frontend performance metrics
 * and reporting them to the backend or external monitoring services.
 */

import Sentry from '@sentry/nextjs';
import logger from './logger';

// Initialize metrics storage
const metrics = {
  // Page load metrics
  pageLoads: {},
  // API request metrics
  apiRequests: {},
  // Resource load metrics
  resourceLoads: {},
  // User interactions
  interactions: {},
  // JavaScript errors
  jsErrors: 0,
  // Long tasks (tasks that take more than 50ms)
  longTasks: []
};

/**
 * Performance monitoring service
 */
const performanceMonitoring = {
  /**
   * Initialize performance monitoring
   */
  init: () => {
    if (typeof window === 'undefined') return;

    // Monitor page load performance
    if (window.performance && window.performance.timing) {
      window.addEventListener('load', performanceMonitoring.capturePageLoadMetrics);
    }

    // Monitor long tasks
    if ('PerformanceObserver' in window) {
      try {
        // Monitor long tasks (tasks that take more than 50ms)
        const longTaskObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            metrics.longTasks.push({
              duration: entry.duration,
              startTime: entry.startTime,
              name: entry.name,
              timestamp: new Date().toISOString()
            });
            
            // Keep only the last 50 long tasks
            if (metrics.longTasks.length > 50) {
              metrics.longTasks.shift();
            }
            
            // Log long tasks that take more than 100ms
            if (entry.duration > 100) {
              logger.warn(`Long task detected: ${entry.duration.toFixed(2)}ms`, {
                duration: entry.duration,
                name: entry.name
              });
            }
          });
        });
        
        longTaskObserver.observe({ entryTypes: ['longtask'] });
        
        // Monitor resource timing
        const resourceObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            // Only track resources that take more than 500ms to load
            if (entry.duration > 500) {
              const resourceType = entry.initiatorType || 'unknown';
              
              if (!metrics.resourceLoads[resourceType]) {
                metrics.resourceLoads[resourceType] = {
                  count: 0,
                  totalDuration: 0,
                  slowResources: []
                };
              }
              
              metrics.resourceLoads[resourceType].count++;
              metrics.resourceLoads[resourceType].totalDuration += entry.duration;
              
              // Track slow resources
              metrics.resourceLoads[resourceType].slowResources.push({
                name: entry.name,
                duration: entry.duration,
                timestamp: new Date().toISOString()
              });
              
              // Keep only the last 10 slow resources per type
              if (metrics.resourceLoads[resourceType].slowResources.length > 10) {
                metrics.resourceLoads[resourceType].slowResources.shift();
              }
              
              // Log slow resource loads
              logger.debug(`Slow resource load: ${resourceType} - ${entry.duration.toFixed(2)}ms`, {
                resourceType,
                name: entry.name,
                duration: entry.duration
              });
            }
          });
        });
        
        resourceObserver.observe({ entryTypes: ['resource'] });
      } catch (error) {
        logger.error('Error setting up performance observers', error);
      }
    }

    // Monitor unhandled errors
    window.addEventListener('error', (event) => {
      metrics.jsErrors++;
      
      // Log the error
      logger.error('Unhandled JavaScript error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });
  },

  /**
   * Capture page load metrics
   */
  capturePageLoadMetrics: () => {
    if (typeof window === 'undefined' || !window.performance || !window.performance.timing) return;
    
    const timing = window.performance.timing;
    const pagePath = window.location.pathname;
    
    // Calculate timing metrics
    const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
    const domContentLoadedTime = timing.domContentLoadedEventEnd - timing.navigationStart;
    const firstPaintTime = timing.responseEnd - timing.navigationStart;
    const backendTime = timing.responseEnd - timing.requestStart;
    const frontendTime = timing.loadEventEnd - timing.responseEnd;
    
    // Store metrics
    metrics.pageLoads[pagePath] = {
      timestamp: new Date().toISOString(),
      pageLoadTime,
      domContentLoadedTime,
      firstPaintTime,
      backendTime,
      frontendTime
    };
    
    // Log page load metrics
    logger.info(`Page loaded: ${pagePath} - ${pageLoadTime}ms`, {
      pagePath,
      pageLoadTime,
      domContentLoadedTime,
      firstPaintTime,
      backendTime,
      frontendTime
    });
    
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
  },

  /**
   * Track API request performance
   * @param {string} endpoint - API endpoint
   * @param {number} duration - Request duration in ms
   * @param {number} status - HTTP status code
   */
  trackApiRequest: (endpoint, duration, status) => {
    if (!metrics.apiRequests[endpoint]) {
      metrics.apiRequests[endpoint] = {
        count: 0,
        totalDuration: 0,
        statuses: {},
        slowRequests: []
      };
    }
    
    metrics.apiRequests[endpoint].count++;
    metrics.apiRequests[endpoint].totalDuration += duration;
    
    // Track status codes
    if (!metrics.apiRequests[endpoint].statuses[status]) {
      metrics.apiRequests[endpoint].statuses[status] = 0;
    }
    metrics.apiRequests[endpoint].statuses[status]++;
    
    // Track slow requests (> 1 second)
    if (duration > 1000) {
      metrics.apiRequests[endpoint].slowRequests.push({
        duration,
        status,
        timestamp: new Date().toISOString()
      });
      
      // Keep only the last 10 slow requests per endpoint
      if (metrics.apiRequests[endpoint].slowRequests.length > 10) {
        metrics.apiRequests[endpoint].slowRequests.shift();
      }
      
      // Log slow API requests
      logger.warn(`Slow API request: ${endpoint} - ${duration}ms (${status})`, {
        endpoint,
        duration,
        status
      });
      
      // Send to Sentry if request is very slow (> 3 seconds)
      if (duration > 3000) {
        Sentry.captureMessage(`Very slow API request: ${endpoint} - ${duration}ms (${status})`, {
          level: 'warning',
          tags: {
            endpoint,
            duration,
            status
          }
        });
      }
    }
  },

  /**
   * Track user interaction
   * @param {string} action - User action (e.g., 'click', 'submit')
   * @param {string} element - Element interacted with
   * @param {number} duration - Interaction duration in ms (if applicable)
   */
  trackInteraction: (action, element, duration = null) => {
    const key = `${action}:${element}`;
    
    if (!metrics.interactions[key]) {
      metrics.interactions[key] = {
        count: 0,
        totalDuration: 0,
        slowInteractions: []
      };
    }
    
    metrics.interactions[key].count++;
    
    if (duration !== null) {
      metrics.interactions[key].totalDuration += duration;
      
      // Track slow interactions (> 300ms)
      if (duration > 300) {
        metrics.interactions[key].slowInteractions.push({
          duration,
          timestamp: new Date().toISOString()
        });
        
        // Keep only the last 10 slow interactions per key
        if (metrics.interactions[key].slowInteractions.length > 10) {
          metrics.interactions[key].slowInteractions.shift();
        }
        
        // Log slow interactions
        logger.debug(`Slow interaction: ${key} - ${duration}ms`, {
          action,
          element,
          duration
        });
      }
    }
  },

  /**
   * Get current metrics
   * @returns {Object} Current performance metrics
   */
  getMetrics: () => {
    return {
      ...metrics,
      timestamp: new Date().toISOString()
    };
  },

  /**
   * Reset metrics
   */
  resetMetrics: () => {
    metrics.pageLoads = {};
    metrics.apiRequests = {};
    metrics.resourceLoads = {};
    metrics.interactions = {};
    metrics.jsErrors = 0;
    metrics.longTasks = [];
  }
};

export default performanceMonitoring;
