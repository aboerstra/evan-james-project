'use strict';

/**
 * Performance router
 */

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/performance/metrics',
      handler: 'performance.getMetrics',
      config: {
        policies: [],
        description: 'Get performance metrics',
        tag: {
          plugin: 'admin',
          name: 'Performance Monitoring',
          actionType: 'read'
        }
      }
    },
    {
      method: 'POST',
      path: '/performance/reset',
      handler: 'performance.resetMetrics',
      config: {
        policies: [],
        description: 'Reset performance metrics',
        tag: {
          plugin: 'admin',
          name: 'Performance Monitoring',
          actionType: 'write'
        }
      }
    }
  ]
};
