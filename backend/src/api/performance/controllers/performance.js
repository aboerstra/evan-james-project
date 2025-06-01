'use strict';

/**
 * Performance controller
 */

const { performanceMonitor } = require('../../../middlewares');

module.exports = {
  /**
   * Get performance metrics
   * @param {Object} ctx - Koa context
   */
  getMetrics: async (ctx) => {
    try {
      // Check if user has admin permissions
      const { user } = ctx.state;
      if (!user || !user.roles || !user.roles.some(role => role.code === 'strapi-super-admin')) {
        return ctx.forbidden('You do not have permission to access performance metrics');
      }

      // Get metrics from the performance monitor middleware
      const metrics = performanceMonitor.metrics.getMetrics();

      // Calculate average response times for each endpoint
      const endpointAverages = {};
      Object.keys(metrics.responseTimes.byEndpoint).forEach(endpoint => {
        const data = metrics.responseTimes.byEndpoint[endpoint];
        endpointAverages[endpoint] = data.count > 0 ? data.total / data.count : 0;
      });

      // Format the response
      const formattedMetrics = {
        summary: {
          totalRequests: metrics.requestCounts.total,
          averageResponseTime: metrics.responseTimes.average,
          minResponseTime: metrics.responseTimes.min,
          maxResponseTime: metrics.responseTimes.max,
          slowRequests: metrics.responseTimes.slow.count
        },
        requestCounts: {
          byMethod: metrics.requestCounts.byMethod,
          byStatusCode: metrics.requestCounts.byStatusCode
        },
        endpoints: Object.keys(metrics.requestCounts.byEndpoint).map(endpoint => ({
          path: endpoint,
          requests: metrics.requestCounts.byEndpoint[endpoint],
          averageResponseTime: endpointAverages[endpoint],
          minResponseTime: metrics.responseTimes.byEndpoint[endpoint]?.min,
          maxResponseTime: metrics.responseTimes.byEndpoint[endpoint]?.max,
          slowRequests: metrics.responseTimes.slow.endpoints[endpoint]?.count || 0
        })).sort((a, b) => b.requests - a.requests) // Sort by most requested
      };

      return formattedMetrics;
    } catch (error) {
      ctx.throw(500, error);
    }
  },

  /**
   * Reset performance metrics
   * @param {Object} ctx - Koa context
   */
  resetMetrics: async (ctx) => {
    try {
      // Check if user has admin permissions
      const { user } = ctx.state;
      if (!user || !user.roles || !user.roles.some(role => role.code === 'strapi-super-admin')) {
        return ctx.forbidden('You do not have permission to reset performance metrics');
      }

      // Reset metrics
      performanceMonitor.metrics.reset();

      return {
        message: 'Performance metrics have been reset'
      };
    } catch (error) {
      ctx.throw(500, error);
    }
  }
};
