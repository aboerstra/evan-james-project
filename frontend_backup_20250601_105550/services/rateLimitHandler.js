/**
 * Rate Limit Handler
 * 
 * Utility functions for handling rate limit responses from the API
 */

/**
 * Extracts rate limit information from response headers
 * 
 * @param {Response} response - The fetch API response object
 * @returns {Object} Rate limit information
 */
export const getRateLimitInfo = (response) => {
  return {
    limit: parseInt(response.headers.get('X-RateLimit-Limit') || '0'),
    remaining: parseInt(response.headers.get('X-RateLimit-Remaining') || '0'),
    reset: parseInt(response.headers.get('X-RateLimit-Reset') || '0'),
    isLimited: response.status === 429
  };
};

/**
 * Calculates the wait time in minutes until the rate limit resets
 * 
 * @param {number} resetTime - The reset time in Unix timestamp (seconds)
 * @returns {number} Wait time in minutes
 */
export const getWaitTimeMinutes = (resetTime) => {
  const now = Math.floor(Date.now() / 1000);
  const waitTimeSeconds = Math.max(0, resetTime - now);
  return Math.ceil(waitTimeSeconds / 60);
};

/**
 * Creates a user-friendly message for rate limit errors
 * 
 * @param {Object} rateLimitInfo - Rate limit information from getRateLimitInfo
 * @param {string} defaultMessage - Default message to show if no specific info is available
 * @returns {string} User-friendly error message
 */
export const getRateLimitMessage = (rateLimitInfo, defaultMessage = 'Too many requests. Please try again later.') => {
  if (!rateLimitInfo.isLimited) {
    return null;
  }
  
  if (rateLimitInfo.reset) {
    const waitMinutes = getWaitTimeMinutes(rateLimitInfo.reset);
    if (waitMinutes > 0) {
      return `Rate limit exceeded. Please try again in ${waitMinutes} ${waitMinutes === 1 ? 'minute' : 'minutes'}.`;
    }
  }
  
  return defaultMessage;
};

/**
 * Handles rate limit errors in fetch requests
 * 
 * @param {Response} response - The fetch API response object
 * @param {Function} onRateLimited - Callback function to handle rate limit errors
 * @returns {Promise<Response>} The original response if not rate limited
 * @throws {Error} If rate limited
 */
export const handleRateLimit = async (response, onRateLimited) => {
  if (response.status === 429) {
    const rateLimitInfo = getRateLimitInfo(response);
    const errorData = await response.json().catch(() => ({ message: 'Rate limit exceeded' }));
    const message = errorData.message || getRateLimitMessage(rateLimitInfo);
    
    if (onRateLimited) {
      onRateLimited(message, rateLimitInfo);
    }
    
    throw new Error(message);
  }
  
  return response;
};

/**
 * Creates a fetch wrapper that handles rate limiting
 * 
 * @param {Function} fetchFn - The original fetch function
 * @param {Function} onRateLimited - Callback function to handle rate limit errors
 * @returns {Function} Wrapped fetch function that handles rate limiting
 */
export const createRateLimitAwareFetch = (fetchFn, onRateLimited) => {
  return async (...args) => {
    const response = await fetchFn(...args);
    return handleRateLimit(response, onRateLimited);
  };
};

/**
 * Example usage:
 * 
 * // Basic usage
 * try {
 *   const response = await fetch('/api/endpoint');
 *   await handleRateLimit(response, (message) => {
 *     showErrorToast(message);
 *     disableSubmitButton(true);
 *   });
 *   const data = await response.json();
 *   // Process data
 * } catch (error) {
 *   console.error(error);
 * }
 * 
 * // Advanced usage with wrapper
 * const rateLimitAwareFetch = createRateLimitAwareFetch(fetch, (message, info) => {
 *   showErrorToast(message);
 *   if (info.reset) {
 *     scheduleRetry(info.reset * 1000);
 *   }
 * });
 * 
 * try {
 *   const response = await rateLimitAwareFetch('/api/endpoint');
 *   const data = await response.json();
 *   // Process data
 * } catch (error) {
 *   // Handle other errors
 * }
 */
