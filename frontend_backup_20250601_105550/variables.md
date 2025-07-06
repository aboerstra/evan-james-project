# Environment Variables for Evan James Frontend

Copy these variables to a `.env` file in the frontend directory:

```
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:1337
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=taintedBlueSecret

# Optional Analytics
# NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

## Production Environment Variables

For production, use:

```
# API Configuration
NEXT_PUBLIC_API_URL=https://api.evanjamesofficial.com
NEXT_PUBLIC_SITE_URL=https://www.evanjamesofficial.com

# Authentication
NEXTAUTH_URL=https://www.evanjamesofficial.com
NEXTAUTH_SECRET=unique_secret_value_here

# Optional Analytics
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

## Environment Variable Guide

- **NEXT_PUBLIC_API_URL**: URL to the Strapi backend API
- **NEXT_PUBLIC_SITE_URL**: URL to the frontend site
- **NEXTAUTH_URL**: Used by NextAuth.js for authentication
- **NEXTAUTH_SECRET**: Secret used by NextAuth.js
- **NEXT_PUBLIC_GOOGLE_ANALYTICS_ID**: Google Analytics tracking ID (optional) 