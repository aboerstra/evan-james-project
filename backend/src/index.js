'use strict';

const { initSentry } = require('./utils/sentry');
const performanceMonitor = require('./middlewares/performanceMonitor');

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }) {
    // Register performance monitoring middleware
    const performanceMiddleware = performanceMonitor({
      logPerformance: true,
      trackSlowRequests: true,
      slowThreshold: 1000,
      sendToSentry: true,
      skipPaths: ['/health', '/_health', '/favicon.ico', '/documentation']
    });

    // Add the middleware to Strapi's middleware stack
    strapi.server.use(performanceMiddleware);
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    // Initialize Sentry for error tracking
    initSentry();
    
    // Set up public permissions for site-settings
    const publicRole = await strapi
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'public' } });

    if (publicRole) {
      await strapi
        .query('plugin::users-permissions.permission')
        .create({
          data: {
            action: 'api::site-settings.site-settings.find',
            role: publicRole.id,
          },
        });

      await strapi
        .query('plugin::users-permissions.permission')
        .create({
          data: {
            action: 'api::site-settings.site-settings.update',
            role: publicRole.id,
          },
        });

      console.log('✅ Site Settings permissions set up for public access');
    }
  },
};
