'use strict';

/**
 * newsletter-subscription controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::newsletter-subscription.newsletter-subscription', ({ strapi }) => ({
  // Override the create method to add validation
  async create(ctx) {
    const { data } = ctx.request.body;

    // Validate required fields
    if (!data.email) {
      return ctx.badRequest('Email is required');
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(data.email)) {
      return ctx.badRequest('Please provide a valid email address');
    }

    // Validate email length
    if (data.email.length > 100) {
      return ctx.badRequest('Email should be less than 100 characters');
    }

    // Validate name length if provided
    if (data.name && data.name.length > 100) {
      return ctx.badRequest('Name should be less than 100 characters');
    }

    // Validate source if provided
    const validSources = ['homepage', 'tour-page', 'merch-page', 'coming-soon', 'footer', 'other'];
    if (data.source && !validSources.includes(data.source)) {
      return ctx.badRequest('Invalid source value');
    }

    // Validate preferences if provided
    if (data.preferences && !Array.isArray(data.preferences)) {
      return ctx.badRequest('Preferences should be an array');
    }

    // Check if email already exists
    const existingSubscription = await strapi.db.query('api::newsletter-subscription.newsletter-subscription').findOne({
      where: { email: data.email }
    });

    if (existingSubscription) {
      // If the subscription exists but is inactive, reactivate it
      if (!existingSubscription.isActive) {
        await strapi.entityService.update('api::newsletter-subscription.newsletter-subscription', existingSubscription.id, {
          data: {
            isActive: true,
            unsubscribedAt: null,
            subscribedAt: new Date().toISOString(),
            preferences: data.preferences || existingSubscription.preferences,
            source: data.source || existingSubscription.source
          }
        });
        return { message: 'Subscription reactivated successfully' };
      }
      // If already active, just return success
      return { message: 'Already subscribed' };
    }

    // Sanitize inputs to prevent XSS
    const sanitizedData = {
      email: strapi.sanitize.sanitizeInput(data.email),
      name: data.name ? strapi.sanitize.sanitizeInput(data.name) : undefined,
      source: data.source || 'homepage',
      isActive: true,
      subscribedAt: data.subscribedAt || new Date().toISOString(),
      preferences: data.preferences || ['new-releases'],
      ipAddress: ctx.request.ip,
      userAgent: ctx.request.headers['user-agent']
    };

    // Create the newsletter subscription with sanitized data
    ctx.request.body.data = sanitizedData;
    
    // Call the default create method with the sanitized data
    const response = await super.create(ctx);
    
    return response;
  }
}));
