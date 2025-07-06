# Environment Variables for Evan James Frontend (Local Development)

These variables are for local development. Convert to .env using:
```bash
./convert_variables.sh development local
```

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:1337
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=changeMe

# AI and Image Generation
STABILITY_API_KEY=changeMe

# Error Tracking & Monitoring
NEXT_PUBLIC_SENTRY_DSN=changeMe

# Optional Analytics
# NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX

## Environment Variable Guide

- **NEXT_PUBLIC_API_URL**: URL to the Strapi backend API
- **NEXT_PUBLIC_SITE_URL**: URL to the frontend site
- **NEXTAUTH_URL**: Used by NextAuth.js for authentication
- **NEXTAUTH_SECRET**: Secret used by NextAuth.js (generate a strong random value)
- **STABILITY_API_KEY**: API key for Stability AI image generation (obtain from Stability AI dashboard)
- **NEXT_PUBLIC_SENTRY_DSN**: Data Source Name for Sentry error tracking (obtain from Sentry dashboard)
- **NEXT_PUBLIC_GOOGLE_ANALYTICS_ID**: Google Analytics tracking ID (optional)

## Security Notes

1. **Never commit actual secrets to version control**
2. **Generate different secrets for development and production**
3. **Store production secrets securely**
4. **Rotate API keys and secrets regularly**
