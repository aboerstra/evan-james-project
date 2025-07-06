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
    // Mautic integration routes (admin only)
    {
      method: 'GET',
      path: '/newsletter-subscriptions/mautic/test-connection',
      handler: 'newsletter-subscription.testMauticConnection',
      config: {
        policies: ['admin::isAuthenticatedAdmin'],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/newsletter-subscriptions/:id/sync-to-mautic',
      handler: 'newsletter-subscription.syncToMautic',
      config: {
        policies: ['admin::isAuthenticatedAdmin'],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/newsletter-subscriptions/bulk-sync-to-mautic',
      handler: 'newsletter-subscription.bulkSyncToMautic',
      config: {
        policies: ['admin::isAuthenticatedAdmin'],
        middlewares: [],
      },
    },
  ],
};
