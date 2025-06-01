'use strict';

/**
 * Health controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::health.health', ({ strapi }) => ({
  async check(ctx) {
    try {
      // Check database connection
      await strapi.db.connection.raw('SELECT 1');
      
      // Return health status
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV,
        database: 'connected',
        version: strapi.config.get('info.version', 'unknown'),
      };
    } catch (error) {
      ctx.status = 503;
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error.message,
      };
    }
  },
}));
