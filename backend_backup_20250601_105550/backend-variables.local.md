# Environment Configuration for Evan James Backend (Local Development)

These variables are for local development. Convert to .env using:
```bash
../scripts/convert_variables.sh development local
```

# Core Application
HOST=0.0.0.0
PORT=1337
APP_KEYS=changeMe1,changeMe2
API_TOKEN_SALT=changeMe
ADMIN_JWT_SECRET=changeMe
TRANSFER_TOKEN_SALT=changeMe
JWT_SECRET=changeMe
PUBLIC_URL=http://localhost:1337

# Database Configuration
DATABASE_CLIENT=mysql2
DATABASE_HOST=127.0.0.1
DATABASE_PORT=3306
DATABASE_NAME=evan_james_site
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=changeMe
DATABASE_SSL=false

# File Upload
UPLOAD_PROVIDER=local
UPLOAD_SIZE_LIMIT=50000000

# CORS Configuration
CORS_ENABLED=true
CORS_ORIGIN=http://localhost:3000

# Security
STRAPI_TELEMETRY_DISABLED=true

# Error Tracking & Monitoring
SENTRY_DSN=changeMe
SENTRY_ENABLE_DEV=false

## Environment Variable Guide

### Core Application
- **HOST**: Server host (0.0.0.0 allows connections from any IP)
- **PORT**: Server port for Strapi (default: 1337)
- **APP_KEYS**: Used to encrypt session data, should be comma-separated random strings
- **API_TOKEN_SALT**: Used to generate API tokens
- **ADMIN_JWT_SECRET**: Secret used to generate admin JWT tokens
- **TRANSFER_TOKEN_SALT**: Used for transfer tokens when importing/exporting data
- **JWT_SECRET**: Secret used to generate user JWT tokens
- **PUBLIC_URL**: Public URL of the Strapi server, used for media URLs and callbacks

### Database
- **DATABASE_CLIENT**: Database client to use (mysql2, postgres, sqlite)
- **DATABASE_HOST**: Database host (localhost for local development)
- **DATABASE_PORT**: Database port (3306 for MySQL)
- **DATABASE_NAME**: Database name
- **DATABASE_USERNAME**: Database username
- **DATABASE_PASSWORD**: Database password
- **DATABASE_SSL**: Whether to use SSL for database connection

### File Upload
- **UPLOAD_PROVIDER**: Provider for file uploads (local for local development)
- **UPLOAD_SIZE_LIMIT**: Maximum file size for uploads in bytes (50MB default)

### CORS and Security
- **CORS_ENABLED**: Whether CORS is enabled
- **CORS_ORIGIN**: Allowed origins for CORS (frontend URL)
- **STRAPI_TELEMETRY_DISABLED**: Whether to disable Strapi telemetry

### Error Tracking & Monitoring
- **SENTRY_DSN**: Data Source Name for Sentry error tracking (obtain from Sentry dashboard)
- **SENTRY_ENABLE_DEV**: Whether to enable Sentry in development mode (default: false)
