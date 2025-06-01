'use strict';

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/site-status',
      handler: 'site-settings.getStatus',
      config: {
        auth: false,
      }
    },
    {
      method: 'PUT',
      path: '/site-status',
      handler: 'site-settings.updateStatus',
      config: {
        auth: {
          scope: ['api::site-settings.site-settings.update']
        }
      }
    }
  ]
};
