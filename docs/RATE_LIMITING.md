# Rate Limiting Guide

This document outlines the rate limiting implementation for the Evan James website API, including configuration options and best practices.

## Overview

Rate limiting is a security measure that helps:

- Prevent abuse and brute force attacks
- Protect against DoS (Denial of Service) attacks
- Ensure fair usage of API resources
- Reduce server load during traffic spikes
- Protect sensitive endpoints from excessive requests

## Implementation

The project implements a custom rate limiting middleware that:

1. Tracks requests by IP address
2. Applies different limits to different types of endpoints
3. Returns appropriate HTTP status codes and headers
4. Supports dynamic blocklisting for repeated violations
5. Provides configurable options for different use cases

## Rate Limiting Configuration

The rate limiting middleware is configured in `backend/config/middlewares.js` with different settings for different types of endpoints:

### General API Endpoints

```javascript
const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 minutes
  message: 'Too many requests from this IP, please try again after 15 minutes',
  excludePaths: ['/admin', '/uploads', '/favicon.ico', '/documentation'],
});
```

### Authentication Endpoints

```javascript
const authRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 requests per hour
  message: 'Too many authentication attempts from this IP, please try again after an hour',
  enableDynamicBlocklist: true, // Enable dynamic blocklisting
});
```

### Contact Form Submissions

```javascript
const contactRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 requests per hour
  message: 'Too many contact form submissions from this IP, please try again after an hour',
  enableDynamicBlocklist: true, // Enable dynamic blocklisting
});
```

### Newsletter Subscriptions

```javascript
const newsletterRateLimit = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 3, // 3 requests per day
  message: 'Too many newsletter subscription attempts from this IP, please try again tomorrow',
});
```

## Rate Limiting Headers

The rate limiting middleware sets the following HTTP headers on responses:

- `X-RateLimit-Limit`: The maximum number of requests allowed in the current time window
- `X-RateLimit-Remaining`: The number of requests remaining in the current time window
- `X-RateLimit-Reset`: The time at which the current rate limit window resets (in Unix time)

These headers help clients understand their rate limit status and adjust their request patterns accordingly.

## Dynamic Blocklisting

For sensitive endpoints like authentication and contact form submissions, the middleware includes a dynamic blocklisting feature:

- If an IP address exceeds the rate limit 5 times consecutively, it is added to a blocklist
- Blocklisted IPs are temporarily blocked from making requests to the endpoint
- The block duration is configurable (default: 24 hours)
- After the block expires, the IP is removed from the blocklist

This feature provides additional protection against persistent attackers.

## Configuration Options

The rate limiting middleware supports the following configuration options:

| Option | Description | Default |
|--------|-------------|---------|
| `windowMs` | Time window in milliseconds | 60000 (1 minute) |
| `max` | Maximum number of requests allowed in the window | 100 |
| `message` | Error message to return when rate limit is exceeded | 'Too many requests, please try again later.' |
| `excludePaths` | Array of paths to exclude from rate limiting | [] |
| `enableDynamicBlocklist` | Whether to enable dynamic blocklisting | false |
| `blockDuration` | Duration in milliseconds to block IPs that exceed the rate limit too many times | 86400000 (24 hours) |

## Implementation Details

The rate limiting middleware is implemented in `backend/src/middlewares/rateLimit.js` and uses a simple in-memory store to track request counts. For production environments with multiple server instances, consider replacing the in-memory store with a distributed cache like Redis.

### Memory Management

The middleware includes a cleanup mechanism that runs every minute to remove expired entries from the in-memory store, preventing memory leaks.

## Best Practices for Rate Limiting

1. **Set appropriate limits**: Balance security with usability. Limits that are too strict may frustrate legitimate users, while limits that are too lenient may not provide adequate protection.

2. **Apply different limits to different endpoints**: More sensitive or resource-intensive endpoints should have stricter limits.

3. **Provide clear error messages**: When a client exceeds the rate limit, provide a clear error message that explains the limit and when they can try again.

4. **Use a distributed cache in production**: For production environments with multiple server instances, use a distributed cache like Redis to store rate limiting data.

5. **Monitor rate limit violations**: Set up monitoring to track rate limit violations and adjust limits as needed.

6. **Consider user authentication**: For authenticated users, consider using user IDs instead of IP addresses for more accurate rate limiting.

7. **Implement retry-after headers**: Include a `Retry-After` header in rate limit responses to indicate when the client can try again.

## Handling Rate Limit Errors in the Frontend

When a rate limit is exceeded, the API returns a 429 Too Many Requests status code with a JSON error message. Frontend applications should handle these errors gracefully:

```javascript
try {
  const response = await fetch('/api/endpoint');
  if (response.status === 429) {
    const data = await response.json();
    // Display a user-friendly message
    showErrorMessage(data.message);
    // Optionally, disable the form or button temporarily
    disableSubmitButton(true);
    // Get the reset time from headers if available
    const resetTime = response.headers.get('X-RateLimit-Reset');
    if (resetTime) {
      const waitTime = Math.ceil((parseInt(resetTime) * 1000 - Date.now()) / 1000 / 60);
      showWaitTimeMessage(`Please try again in approximately ${waitTime} minutes.`);
    }
  } else {
    // Handle normal response
  }
} catch (error) {
  // Handle other errors
}
```

## Customizing Rate Limits

To customize rate limits for specific endpoints, modify the configuration in `backend/config/middlewares.js`. For example, to increase the limit for newsletter subscriptions:

```javascript
const newsletterRateLimit = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 5, // Increased from 3 to 5
  message: 'Too many newsletter subscription attempts from this IP, please try again tomorrow',
});
```

## Monitoring and Maintenance

Regularly review rate limit violations to identify potential attacks or issues with legitimate users hitting limits. Adjust rate limits as needed based on this data.

Consider implementing more sophisticated rate limiting in the future, such as:

- Rate limiting based on user ID for authenticated users
- Graduated rate limiting (e.g., first violation gets a warning, subsequent violations get longer blocks)
- Rate limiting based on resource usage rather than just request count

## References

- [OWASP API Security Top 10: API4:2019 Lack of Resources & Rate Limiting](https://owasp.org/API-Security/editions/2019/en/0xa4-lack-of-resources-and-rate-limiting/)
- [MDN: HTTP 429 Too Many Requests](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/429)
- [Rate Limiting Best Practices](https://cloud.google.com/architecture/rate-limiting-strategies-techniques)

---

*Last updated: May 31, 2025*
