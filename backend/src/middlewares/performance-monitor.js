'use strict';

/**
 * Performance monitoring middleware
 */

const performanceMonitor = require('./performanceMonitor');

module.exports = (config, { strapi }) => {
  // Get the middleware with the provided configuration
  const middleware = performanceMonitor(config);

  // Return the middleware function
  return async (ctx, next) => {
    return middleware(ctx, next);
  };
};
