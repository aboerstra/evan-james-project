'use strict';

/**
 * Sentry integration for Strapi
 */

const Sentry = require('@sentry/node');
const { ProfilingIntegration } = require('@sentry/profiling-node');

/**
 * Initialize Sentry
 */
const initSentry = () => {
  // Only initialize if DSN is provided
  if (!process.env.SENTRY_DSN) {
    strapi.log.warn('Sentry DSN not provided. Error tracking disabled.');
    return;
  }

  try {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV || 'development',
      integrations: [
        // Enable HTTP calls tracing
        new Sentry.Integrations.Http({ tracing: true }),
        // Enable Express.js middleware tracing
        new Sentry.Integrations.Express({ app: strapi.server.app }),
        // Enable profiling (performance monitoring)
        new ProfilingIntegration(),
      ],
      // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring
      // We recommend adjusting this value in production
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.2 : 1.0,
      // Capture Strapi request data
      beforeSend(event) {
        // Don't send events in development unless explicitly enabled
        if (process.env.NODE_ENV === 'development' && process.env.SENTRY_ENABLE_DEV !== 'true') {
          return null;
        }
        return event;
      },
    });

    // Sentry handlers are designed for Express, not Koa
    // We'll use a custom approach for Koa
    strapi.server.app.use(async (ctx, next) => {
      try {
        await next();
      } catch (err) {
        Sentry.captureException(err);
        throw err;
      }
    });

    strapi.log.info('Sentry initialized successfully');
  } catch (error) {
    strapi.log.error('Failed to initialize Sentry:', error);
  }
};

/**
 * Capture an exception with Sentry
 * @param {Error} error - The error to capture
 * @param {Object} context - Additional context for the error
 */
const captureException = (error, context = {}) => {
  if (!Sentry) return;
  
  try {
    Sentry.withScope((scope) => {
      // Add additional context
      if (context.user) {
        scope.setUser(context.user);
      }
      
      if (context.tags) {
        Object.entries(context.tags).forEach(([key, value]) => {
          scope.setTag(key, value);
        });
      }
      
      if (context.extras) {
        Object.entries(context.extras).forEach(([key, value]) => {
          scope.setExtra(key, value);
        });
      }
      
      // Capture the exception
      Sentry.captureException(error);
    });
  } catch (sentryError) {
    strapi.log.error('Failed to capture exception with Sentry:', sentryError);
    // Still log the original error
    strapi.log.error('Original error:', error);
  }
};

/**
 * Capture a message with Sentry
 * @param {string} message - The message to capture
 * @param {Object} context - Additional context for the message
 * @param {string} level - The level of the message (info, warning, error)
 */
const captureMessage = (message, context = {}, level = 'info') => {
  if (!Sentry) return;
  
  try {
    Sentry.withScope((scope) => {
      // Add additional context
      if (context.user) {
        scope.setUser(context.user);
      }
      
      if (context.tags) {
        Object.entries(context.tags).forEach(([key, value]) => {
          scope.setTag(key, value);
        });
      }
      
      if (context.extras) {
        Object.entries(context.extras).forEach(([key, value]) => {
          scope.setExtra(key, value);
        });
      }
      
      // Set the level
      scope.setLevel(level);
      
      // Capture the message
      Sentry.captureMessage(message);
    });
  } catch (sentryError) {
    strapi.log.error('Failed to capture message with Sentry:', sentryError);
    // Still log the original message
    strapi.log.error('Original message:', message);
  }
};

module.exports = {
  initSentry,
  captureException,
  captureMessage,
  Sentry
};
