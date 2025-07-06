# Environment Configuration for Evan James Backend (Production/EC2)

These variables are for production deployment on EC2. Convert to .env using:
```bash
../scripts/convert_variables.sh production ec2
```

# Core Application
HOST=0.0.0.0
PORT=1337
APP_KEYS=changeMe1,changeMe2
API_TOKEN_SALT=changeMe
ADMIN_JWT_SECRET=changeMe
TRANSFER_TOKEN_SALT=changeMe
JWT_SECRET=changeMe
PUBLIC_URL=https://api.evanjamesofficial.com

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
CORS_ORIGIN=https://www.evanjamesofficial.com

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
- **DATABASE_HOST**: Database host (localhost or RDS endpoint)
- **DATABASE_PORT**: Database port (3306 for MySQL)
- **DATABASE_NAME**: Database name
- **DATABASE_USERNAME**: Database username
- **DATABASE_PASSWORD**: Database password
- **DATABASE_SSL**: Whether to use SSL for database connection

### File Upload
- **UPLOAD_PROVIDER**: Provider for file uploads (local or aws-s3)
- **UPLOAD_SIZE_LIMIT**: Maximum file size for uploads in bytes (50MB default)

### CORS and Security
- **CORS_ENABLED**: Whether CORS is enabled
- **CORS_ORIGIN**: Allowed origins for CORS (frontend URL)
- **STRAPI_TELEMETRY_DISABLED**: Whether to disable Strapi telemetry

### Error Tracking & Monitoring
- **SENTRY_DSN**: Data Source Name for Sentry error tracking (obtain from Sentry dashboard)
- **SENTRY_ENABLE_DEV**: Whether to enable Sentry in development mode (default: false)

## Production Deployment Notes

1. **Security**: 
   - Generate strong random values for all secrets
   - Store secrets securely (consider AWS Secrets Manager)
   - Rotate secrets regularly

2. **Database**:
   - Consider using an RDS instance for production
   - Enable database backups
   - Use SSL for database connections

3. **File Storage**:
   - Consider using S3 for file storage in production
   - Set up proper backup for uploaded files
   - Configure CDN if needed

4. **Monitoring**:
   - Set up monitoring for the Strapi instance
   - Configure error tracking
   - Set up alerts for critical issues
