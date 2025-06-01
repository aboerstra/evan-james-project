# Content Security Policy (CSP) Guide

This document provides information about the Content Security Policy implementation for the Evan James website, including configuration details, testing procedures, and maintenance guidelines.

## What is Content Security Policy?

Content Security Policy (CSP) is a security standard that helps prevent cross-site scripting (XSS), clickjacking, and other code injection attacks. CSP works by specifying which content sources are considered trusted, and instructing the browser to only execute or render resources from those trusted sources.

## Why CSP is Important

- **Prevents XSS Attacks**: By restricting which scripts can run on your page, CSP helps prevent malicious script injection.
- **Reduces Risk of Data Theft**: Helps prevent unauthorized data exfiltration by controlling where data can be sent.
- **Improves Security Posture**: Demonstrates a commitment to security best practices.
- **Provides Defense in Depth**: Adds an additional layer of security beyond input validation and output encoding.

## Current CSP Configuration

### Backend (Strapi) Configuration

The backend CSP is configured in `backend/config/middlewares.js` and includes the following directives:

```javascript
contentSecurityPolicy: {
  useDefaults: true,
  directives: {
    'default-src': ["'self'"],
    'connect-src': ["'self'", 'https:'],
    'img-src': ["'self'", 'data:', 'blob:', 'https://market-assets.strapi.io', 'https://www.evanjamesofficial.com', 'https://api.evanjamesofficial.com'],
    'media-src': ["'self'", 'data:', 'blob:'],
    'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
    'style-src': ["'self'", "'unsafe-inline'"],
    'font-src': ["'self'", 'data:'],
    'frame-src': ["'self'"],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    upgradeInsecureRequests: null,
  },
}
```

### Frontend (Next.js) Configuration

The frontend CSP is configured in `frontend/next.config.js` and includes the following directives:

```javascript
{
  key: 'Content-Security-Policy', 
  value: "default-src 'self'; img-src 'self' data: blob: https://api.evanjamesofficial.com https://www.evanjamesofficial.com; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; font-src 'self' data:; connect-src 'self' https://api.evanjamesofficial.com https://www.evanjamesofficial.com; media-src 'self' data: blob: https://api.evanjamesofficial.com; frame-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; manifest-src 'self'; worker-src 'self' blob:;" 
}
```

## Directive Explanations

| Directive | Purpose | Current Configuration |
|-----------|---------|------------------------|
| `default-src` | Fallback for other directives | `'self'` (only allow resources from the same origin) |
| `connect-src` | Controls URLs for fetch, WebSocket, etc. | `'self'`, `https:` (backend), specific domains (frontend) |
| `img-src` | Controls image sources | `'self'`, `data:`, `blob:`, and specific domains |
| `media-src` | Controls audio/video sources | `'self'`, `data:`, `blob:` |
| `script-src` | Controls JavaScript sources | `'self'`, `'unsafe-inline'`, `'unsafe-eval'` |
| `style-src` | Controls CSS sources | `'self'`, `'unsafe-inline'` |
| `font-src` | Controls font sources | `'self'`, `data:` |
| `frame-src` | Controls iframe sources | `'self'` |
| `object-src` | Controls plugin sources | `'none'` (blocks all plugins) |
| `base-uri` | Controls `<base>` element | `'self'` |
| `form-action` | Controls where forms can submit to | `'self'` |
| `manifest-src` | Controls manifest sources | `'self'` |
| `worker-src` | Controls worker script sources | `'self'`, `blob:` |

## Security Considerations

### Current Limitations

- The use of `'unsafe-inline'` and `'unsafe-eval'` in `script-src` is not ideal from a security perspective but is currently necessary for the proper functioning of the application.
- In the future, consider implementing nonces or hashes to replace `'unsafe-inline'` for scripts.

### Recommended Future Improvements

1. **Replace `'unsafe-inline'` with Nonces or Hashes**:
   ```javascript
   'script-src': ["'self'", "'nonce-{random-nonce}'"]
   ```

2. **Tighten `connect-src` Directive**:
   - Specify exact API endpoints rather than allowing all HTTPS connections

### CSP Violation Reporting

CSP violation reporting has been implemented to help monitor and identify potential security issues. When a browser blocks content due to CSP restrictions, it sends a report to our reporting endpoint.

#### Backend Implementation

The backend includes a dedicated endpoint for receiving CSP violation reports:

```javascript
// Route: /api/csp-report
// Controller: backend/src/api/csp-report/controllers/csp-report.js
```

The CSP configuration in `backend/config/middlewares.js` includes the following reporting directives:

```javascript
'report-uri': ['/api/csp-report'],
'report-to': 'csp-endpoint'
```

#### Frontend Implementation

The frontend CSP configuration in `frontend/next.config.js` includes reporting directives that send violation reports to the backend API:

```javascript
report-uri https://api.evanjamesofficial.com/api/csp-report; report-to csp-endpoint;
```

#### Monitoring CSP Violations

CSP violations are logged in the Strapi server logs with a warning level. These logs include:
- The violated directive
- The blocked URI
- The document URI where the violation occurred
- User agent information
- IP address information

Regular review of these logs can help identify:
- Legitimate content being blocked that should be allowed
- Potential XSS or injection attempts
- Third-party scripts that need to be added to the allowed sources

## Testing CSP Configuration

### Manual Testing

1. **Browser Developer Tools**:
   - Open Chrome/Firefox Developer Tools
   - Check the Console for CSP violation messages
   - Test loading resources from non-allowed sources to verify blocking

2. **CSP Evaluation Tools**:
   - Use [CSP Evaluator](https://csp-evaluator.withgoogle.com/) to analyze your policy
   - Use [Security Headers](https://securityheaders.com/) to check overall security headers

### Automated Testing

1. **Set Up CSP Reporting**:
   - Configure a reporting endpoint
   - Analyze violations during testing

2. **Integration Tests**:
   - Add tests that verify resources load correctly
   - Add negative tests that verify blocked resources are indeed blocked

## Troubleshooting Common Issues

### Content Blocked by CSP

If legitimate content is being blocked:

1. Check browser console for specific CSP violation messages
2. Identify the directive that's blocking the content
3. Update the CSP configuration to allow the specific resource
4. Test to ensure the content now loads correctly

### Third-Party Integrations

When adding new third-party services:

1. Identify all domains the service needs to access
2. Update relevant CSP directives to include these domains
3. Test the integration thoroughly
4. Monitor for CSP violations after deployment

## Maintenance Guidelines

### Regular Review

- Review CSP configuration quarterly
- Check for any unnecessary permissions
- Look for opportunities to tighten security

### When Adding New Features

1. Identify any new content sources required
2. Update CSP configuration accordingly
3. Test thoroughly before deployment
4. Monitor for CSP violations after deployment

### CSP Violation Monitoring

- Set up a process to regularly review CSP violation reports
- Investigate unexpected violations promptly
- Update CSP configuration as needed based on legitimate violations

## References

- [MDN Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Google CSP Guide](https://developers.google.com/web/fundamentals/security/csp)
- [CSP Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html)
- [Strapi Security Documentation](https://docs.strapi.io/developer-docs/latest/setup-deployment-guides/configurations/required/middlewares.html#security)
- [Next.js Security Headers](https://nextjs.org/docs/advanced-features/security-headers)

---

*Last updated: May 31, 2025*
