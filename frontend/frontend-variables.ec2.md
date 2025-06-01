# Environment Variables for Evan James Frontend (Production/EC2)

These variables are for production deployment. Convert to .env using:
```bash
./convert_variables.sh production ec2
```

# API Configuration
NEXT_PUBLIC_API_URL=https://api.evanjamesofficial.com
NEXT_PUBLIC_SITE_URL=https://www.evanjamesofficial.com

# Authentication
NEXTAUTH_URL=https://www.evanjamesofficial.com
NEXTAUTH_SECRET=changeMe

# AI and Image Generation
STABILITY_API_KEY=changeMe

# Error Tracking & Monitoring
NEXT_PUBLIC_SENTRY_DSN=changeMe

# Optional Analytics
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX

## Environment Variable Guide

- **NEXT_PUBLIC_API_URL**: URL to the Strapi backend API
- **NEXT_PUBLIC_SITE_URL**: URL to the frontend site
- **NEXTAUTH_URL**: Used by NextAuth.js for authentication
- **NEXTAUTH_SECRET**: Secret used by NextAuth.js (generate a strong random value)
- **STABILITY_API_KEY**: API key for Stability AI image generation (obtain from Stability AI dashboard)
- **NEXT_PUBLIC_SENTRY_DSN**: Data Source Name for Sentry error tracking (obtain from Sentry dashboard)
- **NEXT_PUBLIC_GOOGLE_ANALYTICS_ID**: Google Analytics tracking ID (optional)

## Production Deployment Notes

1. **Security**:
   - Generate strong random values for all secrets
   - Store secrets securely (consider AWS Secrets Manager)
   - Rotate secrets regularly
   - Use different secrets than development environment

2. **API Keys**:
   - Use production API keys for all external services
   - Set appropriate restrictions on API keys (IP, domain, etc.)
   - Monitor API key usage for unusual activity

3. **Monitoring**:
   - Set up error tracking (Sentry)
   - Configure performance monitoring
   - Set up alerts for critical issues

4. **Deployment**:
   - Verify all environment variables before deployment
   - Test with production environment variables in staging
   - Document deployment process
