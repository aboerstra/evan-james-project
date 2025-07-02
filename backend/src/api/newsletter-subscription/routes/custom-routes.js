'use strict';

/**
 * Custom routes for newsletter-subscription
 */

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/newsletter-subscriptions/verify',
      handler: 'newsletter-subscription.verifyEmail',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/newsletter-subscriptions/unsubscribe',
      handler: 'newsletter-subscription.unsubscribe',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/newsletter-subscriptions/confirm-unsubscribe',
      handler: 'newsletter-subscription.confirmUnsubscribe',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};
