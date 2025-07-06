'use strict';

/**
 * newsletter-subscription controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const crypto = require('crypto');

module.exports = createCoreController('api::newsletter-subscription.newsletter-subscription', ({ strapi }) => ({
  // Custom route to handle unsubscribe requests
  async unsubscribe(ctx) {
    const { email, token } = ctx.query;
    
    if (!email) {
      return ctx.badRequest('Email is required');
    }
    
    // Find the subscription
    const subscription = await strapi.db.query('api::newsletter-subscription.newsletter-subscription').findOne({
      where: { email }
    });
    
    if (!subscription) {
      return ctx.badRequest('Subscription not found');
    }
    
    // If a token is provided, verify it matches (for one-click unsubscribe)
    if (token) {
      // Generate a verification hash based on the email and a secret
      const crypto = require('crypto');
      const secret = process.env.UNSUBSCRIBE_SECRET || 'evan-james-newsletter';
      const expectedToken = crypto
        .createHash('sha256')
        .update(`${email}:${secret}`)
        .digest('hex');
      
      if (token !== expectedToken) {
        return ctx.badRequest('Invalid unsubscribe token');
      }
      
      // Token is valid, proceed with unsubscribe
      await strapi.entityService.update('api::newsletter-subscription.newsletter-subscription', subscription.id, {
        data: {
          isActive: false,
          unsubscribedAt: new Date().toISOString()
        }
      });
      
      return {
        success: true,
        message: 'You have been successfully unsubscribed.'
      };
    }
    
    // If no token, just return success to confirm the email exists
    // The actual unsubscribe will happen when they confirm on the frontend
    return {
      success: true,
      email
    };
  },
  
  // Custom route to confirm unsubscribe (when user clicks button on unsubscribe page)
  async confirmUnsubscribe(ctx) {
    const { email } = ctx.request.body;
    
    if (!email) {
      return ctx.badRequest('Email is required');
    }
    
    // Find the subscription
    const subscription = await strapi.db.query('api::newsletter-subscription.newsletter-subscription').findOne({
      where: { email }
    });
    
    if (!subscription) {
      return ctx.badRequest('Subscription not found');
    }
    
    // Update the subscription to inactive
    await strapi.entityService.update('api::newsletter-subscription.newsletter-subscription', subscription.id, {
      data: {
        isActive: false,
        unsubscribedAt: new Date().toISOString(),
        pendingSubscription: false,
        verificationToken: null,
        verificationExpires: null
      }
    });
    
    // Log the update for debugging
    console.log(`Unsubscribed email: ${email}, subscription ID: ${subscription.id}`);
    
    return {
      success: true,
      message: 'You have been successfully unsubscribed.'
    };
  },
  // Custom route to verify email subscription
  async verifyEmail(ctx) {
    const { token, email } = ctx.query;
    
    if (!token || !email) {
      return ctx.badRequest('Token and email are required');
    }
    
    // Find the subscription with matching email and token
    const subscription = await strapi.db.query('api::newsletter-subscription.newsletter-subscription').findOne({
      where: { 
        email: email,
        verificationToken: token,
        pendingSubscription: true
      }
    });
    
    if (!subscription) {
      return ctx.badRequest('Invalid or expired verification link');
    }
    
    // Check if token is expired
    const now = new Date();
    if (new Date(subscription.verificationExpires) < now) {
      return ctx.badRequest('Verification link has expired');
    }
    
    // Activate the subscription
    await strapi.entityService.update('api::newsletter-subscription.newsletter-subscription', subscription.id, {
      data: {
        isActive: true,
        pendingSubscription: false,
        verificationToken: null,
        verificationExpires: null,
        subscribedAt: new Date().toISOString(),
        emailVerified: true,
        emailVerifiedAt: new Date().toISOString()
      }
    });
    
    // Return success
    return {
      success: true,
      message: 'Email verified successfully. Your subscription is now active.'
    };
  },
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

    // Validate consent information (CASL compliance)
    if (data.consentGiven === undefined || data.consentGiven !== true) {
      return ctx.badRequest('Explicit consent is required');
    }

    if (!data.consentTimestamp) {
      return ctx.badRequest('Consent timestamp is required');
    }

    // Validate consent timestamp format
    const timestampRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
    if (!timestampRegex.test(data.consentTimestamp) && !data.consentTimestamp.endsWith('Z')) {
      return ctx.badRequest('Invalid consent timestamp format');
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

    // Determine if this is a coming-soon/countdown page signup
    const isComingSoonSignup = data.source === 'coming-soon';
    
    // Generate verification token (only needed for non-coming-soon signups)
    const verificationToken = isComingSoonSignup ? null : crypto.randomBytes(32).toString('hex');
    const tokenExpiration = isComingSoonSignup ? null : (() => {
      const expiration = new Date();
      expiration.setHours(expiration.getHours() + 48); // Token valid for 48 hours
      return expiration;
    })();

    // Sanitize inputs to prevent XSS
    const sanitizedData = {
      email: data.email,
      name: data.name || undefined,
      source: data.source || 'homepage',
      isActive: isComingSoonSignup ? true : false, // Coming-soon signups are immediately active
      subscribedAt: new Date().toISOString(), // Set a default value for subscribedAt
      pendingSubscription: isComingSoonSignup ? false : true, // Coming-soon signups don't need verification
      verificationToken: verificationToken,
      verificationExpires: tokenExpiration,
      preferences: data.preferences || ['new-releases'],
      ipAddress: ctx.request.ip,
      userAgent: ctx.request.headers['user-agent'],
      // CASL compliance fields
      consentGiven: data.consentGiven,
      consentTimestamp: data.consentTimestamp,
      consentSource: data.consentSource || data.source || 'homepage'
    };

    // Create the newsletter subscription with sanitized data
    ctx.request.body.data = sanitizedData;
    
    // Call the default create method with the sanitized data
    const response = await super.create(ctx);
    
    // Send verification email (only for non-coming-soon signups)
    if (!isComingSoonSignup) {
      try {
        const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}&email=${encodeURIComponent(data.email)}`;
        
        // Generate unsubscribe token
        const secret = process.env.UNSUBSCRIBE_SECRET || 'evan-james-newsletter';
        const unsubscribeToken = crypto
          .createHash('sha256')
          .update(`${data.email}:${secret}`)
          .digest('hex');
        
        const unsubscribeUrl = `${process.env.FRONTEND_URL}/unsubscribe?token=${unsubscribeToken}&email=${encodeURIComponent(data.email)}`;
        
        await strapi.plugins['email'].services.email.send({
          to: data.email,
          subject: 'Verify your subscription to Evan James updates',
          html: `
            <p>Thank you for subscribing to updates from Evan James.</p>
            <p>To complete your subscription, please click the link below:</p>
            <p><a href="${verificationUrl}">Verify my email address</a></p>
            <p>This link will expire in 48 hours.</p>
            <p>If you did not request this subscription, you can safely ignore this email.</p>
            <hr style="margin-top: 20px; margin-bottom: 20px; border: 0; border-top: 1px solid #eee;">
            <p style="font-size: 12px; color: #666;">
              This email was sent to ${data.email}. If you no longer wish to receive emails from us, 
              you can <a href="${unsubscribeUrl}">unsubscribe here</a>.
            </p>
            <p style="font-size: 12px; color: #666;">
              &copy; ${new Date().getFullYear()} Evan James | All Rights Reserved
            </p>
          `
        });
      } catch (error) {
        console.error('Error sending verification email:', error);
        // We don't want to fail the request if email sending fails
        // The user can still verify through a resend mechanism
      }
    }
    
    // Return appropriate message based on signup type
    if (isComingSoonSignup) {
      return {
        message: 'Thank you for subscribing! You\'re now signed up for updates.',
        verified: true,
        active: true
      };
    } else {
      return {
        message: 'Please check your email to complete your subscription',
        verified: false,
        active: false
      };
    }
  },

  // Admin route to test Mautic connection
  async testMauticConnection(ctx) {
    try {
      const mauticIntegration = strapi.service('api::newsletter-subscription.mautic-integration');
      const result = await mauticIntegration.testConnection();
      
      return {
        success: result.success,
        message: result.success ? 'Mautic connection successful' : 'Mautic connection failed',
        details: result
      };
    } catch (error) {
      return ctx.badRequest('Error testing Mautic connection: ' + error.message);
    }
  },

  // Admin route to manually sync a subscription to Mautic
  async syncToMautic(ctx) {
    const { id } = ctx.params;
    
    if (!id) {
      return ctx.badRequest('Subscription ID is required');
    }

    try {
      const newsletterService = strapi.service('api::newsletter-subscription.newsletter-subscription');
      const result = await newsletterService.syncToMautic(id);
      
      return {
        success: result.success,
        message: result.success ? 'Subscription synced to Mautic successfully' : 'Failed to sync to Mautic',
        details: result
      };
    } catch (error) {
      return ctx.badRequest('Error syncing to Mautic: ' + error.message);
    }
  },

  // Admin route to bulk sync all subscriptions to Mautic
  async bulkSyncToMautic(ctx) {
    try {
      const newsletterService = strapi.service('api::newsletter-subscription.newsletter-subscription');
      const result = await newsletterService.bulkSyncToMautic();
      
      return {
        success: true,
        message: `Bulk sync completed. ${result.synced} synced, ${result.failed} failed.`,
        details: result
      };
    } catch (error) {
      return ctx.badRequest('Error during bulk sync: ' + error.message);
    }
  }
}));
