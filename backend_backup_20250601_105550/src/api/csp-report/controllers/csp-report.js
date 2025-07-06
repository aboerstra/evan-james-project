'use strict';

/**
 * CSP violation report controller
 */

module.exports = {
  /**
   * Handle CSP violation reports
   * @param {Object} ctx - Koa context
   */
  async report(ctx) {
    try {
      // Get the CSP violation report from the request body
      const report = ctx.request.body;
      
      // Log the CSP violation report
      strapi.log.warn({
        message: 'CSP Violation Report',
        report,
        timestamp: new Date().toISOString(),
        userAgent: ctx.request.headers['user-agent'],
        ip: ctx.request.ip,
        url: ctx.request.headers['referer'] || 'Unknown',
      });
      
      // Return a success response
      ctx.status = 204; // No content
      return;
    } catch (error) {
      // Log the error
      strapi.log.error({
        message: 'Error processing CSP violation report',
        error: {
          message: error.message,
          stack: error.stack,
        },
      });
      
      // Return an error response
      ctx.status = 500;
      return { error: 'Error processing CSP violation report' };
    }
  }
};
