'use strict';

/**
 * CSP violation report routes
 */

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/csp-report',
      handler: 'csp-report.report',
      config: {
        policies: [],
        middlewares: [],
        // This endpoint should be public and not require authentication
        auth: false,
      },
    },
  ],
};
