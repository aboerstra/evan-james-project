/**
 * Error tracking service using Sentry
 * This service provides utilities for tracking errors and exceptions in the frontend
 */

import * as Sentry from '@sentry/nextjs';

/**
 * Capture an exception with Sentry
 * @param {Error} error - The error to capture
 * @param {Object} context - Additional context for the error
 */
export const captureException = (error, context = {}) => {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
    console.error('Error tracking not configured:', error);
    return;
  }
  
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
    console.error('Failed to capture exception with Sentry:', sentryError);
    // Still log the original error
    console.error('Original error:', error);
  }
};

/**
 * Capture a message with Sentry
 * @param {string} message - The message to capture
 * @param {Object} context - Additional context for the message
 * @param {string} level - The level of the message (info, warning, error)
 */
export const captureMessage = (message, context = {}, level = 'info') => {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
    console.log(`[${level}] ${message}`);
    return;
  }
  
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
    console.error('Failed to capture message with Sentry:', sentryError);
    // Still log the original message
    console.log(`[${level}] ${message}`);
  }
};

/**
 * Set user information for Sentry
 * @param {Object} user - User information
 */
export const setUser = (user) => {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return;
  
  try {
    Sentry.setUser(user);
  } catch (error) {
    console.error('Failed to set user for Sentry:', error);
  }
};

/**
 * Clear user information from Sentry
 */
export const clearUser = () => {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return;
  
  try {
    Sentry.setUser(null);
  } catch (error) {
    console.error('Failed to clear user from Sentry:', error);
  }
};

/**
 * Start a transaction for performance monitoring
 * @param {string} name - Transaction name
 * @param {string} op - Operation type
 * @returns {Transaction} Sentry transaction object
 */
export const startTransaction = (name, op) => {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return null;
  
  try {
    return Sentry.startTransaction({ name, op });
  } catch (error) {
    console.error('Failed to start transaction:', error);
    return null;
  }
};

export default {
  captureException,
  captureMessage,
  setUser,
  clearUser,
  startTransaction
};
