# [ARCHIVED] Environment Variable Management Plan

> **Note**: This document has been archived. Please refer to the new consolidated [Environment Variables Guide](../ENVIRONMENT_VARIABLES.md) for the most up-to-date information.

This document outlines the strategy for managing environment variables in the Evan James project, covering both local development and production deployment on EC2 at evanjamesofficial.com.

## Current State

### Backend
- `.env.example`: Basic example with minimal variables
- `env.template`: More comprehensive template with descriptions
- No structured approach for managing different environments (local vs production)

### Frontend
- `.env.example`: Minimal example with only API URL
- `frontend-variables.local.md` and `frontend-variables.ec2.md`: Good documentation but contains actual sensitive values
- `convert_variables.sh`: Script to convert variables from MD files to .env files

## Improvement Plan

### 1. Create Structured Environment Files

#### Backend
1. Create separate environment templates for different environments:
   - `backend-variables.local.md`: For local development
   - `backend-variables.ec2.md`: For production deployment

2. Update the existing `env.template` to be more comprehensive and include:
   - Clear descriptions for each variable
   - Placeholder values (not actual secrets)
   - Categorization of variables by purpose

#### Frontend
1. Update the existing frontend variable files:
   - Remove any actual sensitive values (API keys, secrets)
   - Replace with placeholder values
   - Ensure comprehensive documentation

### 2. Implement Environment Variable Validation

1. Create a validation script for both backend and frontend:
   - Check for required variables
   - Validate format of certain variables (URLs, API keys)
   - Warn about potentially insecure configurations

2. Integrate validation into the deployment process:
   - Run validation before starting the application
   - Fail deployment if critical variables are missing or invalid

### 3. Secure Sensitive Values

1. Implement a secure method for managing secrets:
   - Use AWS Secrets Manager for production secrets
   - Use local encrypted storage for development secrets
   - Never commit actual secrets to version control

2. Update the `convert_variables.sh` script to:
   - Support fetching secrets from secure storage
   - Include validation steps
   - Provide clear error messages

### 4. Document Environment Variables

1. Create comprehensive documentation for all environment variables:
   - Purpose and impact of each variable
   - Required format and validation rules
   - Default values and when they're appropriate
   - Security implications

2. Include environment variable documentation in:
   - Developer onboarding materials
   - Deployment guides
   - Troubleshooting documentation

## Implementation Steps

### Phase 1: Documentation and Templates

1. Create `backend-variables.local.md` and `backend-variables.ec2.md` files
2. Update frontend variable files to remove sensitive values
3. Create comprehensive environment variable documentation

### Phase 2: Validation and Security

1. Implement environment variable validation script
2. Set up secure secret management
3. Update deployment scripts to include validation

### Phase 3: Integration and Testing

1. Test environment variable management in local development
2. Test environment variable management in staging deployment
3. Implement in production deployment

## Environment Variable Categories

### Backend Variables

#### Core Application
- `HOST`: Server host (typically 0.0.0.0)
- `PORT`: Server port (typically 1337)
- `APP_KEYS`: Application encryption keys
- `API_TOKEN_SALT`: Salt for API token generation
- `ADMIN_JWT_SECRET`: Secret for admin JWT tokens
- `TRANSFER_TOKEN_SALT`: Salt for transfer tokens
- `JWT_SECRET`: Secret for user JWT tokens
- `PUBLIC_URL`: Public URL of the Strapi server

#### Database
- `DATABASE_CLIENT`: Database client (mysql2, postgres, etc.)
- `DATABASE_HOST`: Database host
- `DATABASE_PORT`: Database port
- `DATABASE_NAME`: Database name
- `DATABASE_USERNAME`: Database username
- `DATABASE_PASSWORD`: Database password
- `DATABASE_SSL`: Whether to use SSL for database connection

#### File Upload
- `UPLOAD_PROVIDER`: Provider for file uploads (local, aws-s3, etc.)
- `UPLOAD_SIZE_LIMIT`: Maximum file size for uploads

#### CORS and Security
- `CORS_ENABLED`: Whether CORS is enabled
- `CORS_ORIGIN`: Allowed origins for CORS
- `STRAPI_TELEMETRY_DISABLED`: Whether to disable Strapi telemetry

#### Email (if needed)
- `SMTP_HOST`: SMTP server host
- `SMTP_PORT`: SMTP server port
- `SMTP_USERNAME`: SMTP username
- `SMTP_PASSWORD`: SMTP password
- `SMTP_FROM`: From email address
- `SMTP_REPLY_TO`: Reply-to email address

#### S3 Storage (if using)
- `S3_ACCESS_KEY_ID`: AWS access key ID
- `S3_ACCESS_SECRET`: AWS secret access key
- `S3_BUCKET`: S3 bucket name
- `S3_REGION`: S3 region

#### Redis Cache (if using)
- `REDIS_HOST`: Redis host
- `REDIS_PORT`: Redis port
- `REDIS_PASSWORD`: Redis password
- `REDIS_DATABASE`: Redis database number

### Frontend Variables

#### API Configuration
- `NEXT_PUBLIC_API_URL`: URL to the Strapi backend API
- `NEXT_PUBLIC_SITE_URL`: URL to the frontend site

#### Authentication
- `NEXTAUTH_URL`: Used by NextAuth.js for authentication
- `NEXTAUTH_SECRET`: Secret used by NextAuth.js

#### External Services
- `STABILITY_API_KEY`: API key for Stability AI image generation

#### Analytics
- `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID`: Google Analytics tracking ID

## Environment-Specific Configurations

### Local Development

#### Backend
- `HOST`: 0.0.0.0
- `PORT`: 1337
- `PUBLIC_URL`: http://localhost:1337
- `DATABASE_HOST`: 127.0.0.1
- `CORS_ORIGIN`: http://localhost:3000

#### Frontend
- `NEXT_PUBLIC_API_URL`: http://localhost:1337
- `NEXT_PUBLIC_SITE_URL`: http://localhost:3000
- `NEXTAUTH_URL`: http://localhost:3000

### Production (EC2)

#### Backend
- `HOST`: 0.0.0.0
- `PORT`: 1337
- `PUBLIC_URL`: https://api.evanjamesofficial.com
- `DATABASE_HOST`: (RDS endpoint or local database)
- `CORS_ORIGIN`: https://www.evanjamesofficial.com

#### Frontend
- `NEXT_PUBLIC_API_URL`: https://api.evanjamesofficial.com
- `NEXT_PUBLIC_SITE_URL`: https://www.evanjamesofficial.com
- `NEXTAUTH_URL`: https://www.evanjamesofficial.com

## Security Considerations

1. **Never commit actual secrets to version control**
2. **Use different secrets for different environments**
3. **Rotate secrets regularly**
4. **Limit access to production secrets**
5. **Implement proper error handling that doesn't expose sensitive information**
6. **Validate all environment variables before using them**
7. **Monitor for unauthorized access attempts**
8. **Implement proper logging that doesn't include sensitive information**
