'use strict';

/**
 * Health router
 */

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/api/health',
      handler: 'health.check',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};
