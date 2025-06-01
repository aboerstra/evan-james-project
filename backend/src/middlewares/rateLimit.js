'use strict';

/**
 * Rate limiting middleware for Strapi
 * Limits the number of requests a client can make in a specified time window
 */

// Simple in-memory store for rate limiting
// For production, consider using Redis or another distributed cache
const store = new Map();

// Clean up the store periodically to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of store.entries()) {
    if (now > value.resetTime) {
      store.delete(key);
    }
  }
}, 60000); // Clean up every minute

/**
 * Rate limiting middleware factory
 * @param {Object} config - Configuration options
 * @param {number} config.windowMs - Time window in milliseconds
 * @param {number} config.max - Maximum number of requests allowed in the window
 * @param {string} config.message - Error message to return when rate limit is exceeded
 * @param {Array<string>} config.excludePaths - Array of paths to exclude from rate limiting
 * @param {boolean} config.enableDynamicBlocklist - Whether to enable dynamic blocklisting
 * @param {number} config.blockDuration - Duration in milliseconds to block IPs that exceed the rate limit too many times
 * @returns {Function} Koa middleware function
 */
module.exports = (config = {}) => {
  const options = {
    windowMs: 60 * 1000, // 1 minute
    max: 100, // 100 requests per minute
    message: 'Too many requests, please try again later.',
    excludePaths: [],
    enableDynamicBlocklist: false,
    blockDuration: 24 * 60 * 60 * 1000, // 24 hours
    ...config,
  };

  // Blocklist for IPs that have exceeded the rate limit too many times
  const blocklist = new Map();

  return async (ctx, next) => {
    // Skip rate limiting for excluded paths
    if (options.excludePaths.some(path => ctx.path.startsWith(path))) {
      return await next();
    }

    const ip = ctx.request.ip;
    
    // Check if IP is blocklisted
    if (options.enableDynamicBlocklist && blocklist.has(ip)) {
      const blockData = blocklist.get(ip);
      if (Date.now() < blockData.expires) {
        ctx.status = 429;
        ctx.body = { 
          error: 'Too Many Requests',
          message: 'Your access has been temporarily blocked due to excessive requests. Please try again later.'
        };
        return;
      } else {
        // Remove from blocklist if block has expired
        blocklist.delete(ip);
      }
    }

    // Create a unique key for this IP
    const key = `${ip}`;
    
    // Get current count and reset time from store
    const current = store.get(key) || {
      count: 0,
      resetTime: Date.now() + options.windowMs,
      consecutiveViolations: 0
    };
    
    // If the reset time has passed, reset the counter
    if (Date.now() > current.resetTime) {
      current.count = 0;
      current.resetTime = Date.now() + options.windowMs;
    }
    
    // Increment the counter
    current.count += 1;
    
    // Update the store
    store.set(key, current);
    
    // Set rate limit headers
    ctx.set('X-RateLimit-Limit', options.max.toString());
    ctx.set('X-RateLimit-Remaining', Math.max(0, options.max - current.count).toString());
    ctx.set('X-RateLimit-Reset', Math.ceil(current.resetTime / 1000).toString());
    
    // If the counter exceeds the limit, return an error
    if (current.count > options.max) {
      // Increment consecutive violations counter
      current.consecutiveViolations += 1;
      
      // If dynamic blocklisting is enabled and the IP has violated the rate limit too many times,
      // add it to the blocklist
      if (options.enableDynamicBlocklist && current.consecutiveViolations >= 5) {
        blocklist.set(ip, {
          expires: Date.now() + options.blockDuration,
          reason: 'Exceeded rate limit too many times'
        });
        
        // Reset consecutive violations
        current.consecutiveViolations = 0;
      }
      
      ctx.status = 429;
      ctx.body = { 
        error: 'Too Many Requests',
        message: options.message
      };
      return;
    }
    
    // Reset consecutive violations if request is successful
    if (current.consecutiveViolations > 0) {
      current.consecutiveViolations = 0;
    }
    
    // Continue to the next middleware
    await next();
  };
};
