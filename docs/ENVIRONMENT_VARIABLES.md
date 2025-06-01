# Environment Variable Management Guide

This document provides a comprehensive guide for managing environment variables in the Evan James project, covering both local development and production deployment.

## Overview

The project uses a structured approach to manage environment variables:

1. Environment variable templates are stored in markdown files:
   - `backend-variables.local.md` and `backend-variables.ec2.md` for the backend
   - `frontend-variables.local.md` and `frontend-variables.ec2.md` for the frontend

2. These templates are converted to `.env` files using the `convert_variables.sh` script

3. Environment variables are validated using the `validate-env.js` script

4. Different environments (local vs production) use different variable sets

## Why This Approach?

We use separate variable files for several reasons:
1. They can be safely committed to version control (without actual secrets)
2. They provide documentation about required environment variables
3. They allow for clear separation between development and production values
4. They simplify deployment to different environments

## Setting Up Environment Variables

### For Local Development

1. Navigate to the project root directory
2. Run the conversion script:
   ```bash
   ./scripts/convert_variables.sh development local
   ```
3. This will:
   - Create `.env` files for both frontend and backend
   - Validate the environment variables
   - Report any issues

4. Review any warnings or errors and fix them as needed

### For Production Deployment

1. Navigate to the project root directory
2. Run the conversion script:
   ```bash
   ./scripts/convert_variables.sh production ec2
   ```
3. This will:
   - Create `.env` files for both frontend and backend
   - Validate the environment variables
   - Report any issues and fail if there are critical errors

4. Fix any errors before proceeding with deployment

## Converting to .env Files

The `convert_variables.sh` script automates the conversion from variable files to `.env` files:

```bash
# For local development
./scripts/convert_variables.sh development local

# For production deployment
./scripts/convert_variables.sh production ec2
```

This script will:
1. Extract environment variables from the appropriate variable files
2. Create `.env` files in the appropriate directories
3. Validate that the conversion was successful

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
  - **IMPORTANT**: This is a paid API service. Monitor usage to avoid unexpected charges.
  - Consider rotating this key periodically for security reasons.
  - Never commit the actual key value to version control.

#### Error Tracking & Monitoring
- `NEXT_PUBLIC_SENTRY_DSN`: Data Source Name for Sentry error tracking
  - Obtain from the Sentry dashboard after creating a project
  - Required for error tracking and monitoring in production
  - Used by both the ErrorBoundary component and global error handlers

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

## Customizing Environment Variables

### Modifying Existing Variables

1. **DO NOT** edit the `.env` files directly, as they will be overwritten
2. Instead, edit the appropriate template file:
   - For local backend: `backend/backend-variables.local.md`
   - For production backend: `backend/backend-variables.ec2.md`
   - For local frontend: `frontend/frontend-variables.local.md`
   - For production frontend: `frontend/frontend-variables.ec2.md`

3. Run the conversion script again to update the `.env` files

### Adding New Variables

1. Add the new variable to the appropriate template file(s)
2. If the variable requires validation, update the `scripts/validate-env.js` file
3. Document the new variable in the template file
4. Run the conversion script to update the `.env` files

## Security Best Practices

1. **Never commit actual secrets to version control**
   - The template files should contain placeholder values like `changeMe`
   - Real secrets should be added manually or via a secure secret management system

2. **Use different secrets for different environments**
   - Development and production should use different secret values
   - This limits the impact of a secret being compromised

3. **Rotate secrets regularly**
   - Set up a schedule to rotate sensitive values like JWT secrets
   - Document the rotation process

4. **Secure production secrets**
   - Consider using AWS Secrets Manager or similar for production
   - Limit access to production secrets to authorized personnel only

5. **Validate environment variables**
   - Always run the validation script before deployment
   - Fix any validation errors before proceeding

6. **Use strong passwords and secrets**
   - All passwords must be at least 12 characters long
   - All secrets must be at least 32 characters long
   - Include a mix of uppercase, lowercase, numbers, and special characters
   - Never use common patterns or easily guessable values

7. **Avoid hardcoded credentials**
   - Never include actual credentials in code or configuration files
   - Use environment variables for all sensitive information
   - The validation script will detect potential hardcoded credentials

8. **Use secure protocols**
   - Always use HTTPS for production URLs
   - The validation script will warn about insecure HTTP usage

9. **Implement proper CORS settings**
   - Never use wildcard (*) CORS settings in production
   - Specify exact allowed origins
   - The validation script will warn about overly permissive CORS settings

## Environment Variable Rotation Schedule

It's recommended to rotate sensitive credentials regularly:

- JWT secrets: Every 90 days
- Admin passwords: Every 60 days
- API tokens: Every 30 days
- Stability API key: Every 60 days or after heavy usage

## Troubleshooting

### Common Issues

1. **Validation errors**
   - Check the error message for details
   - Update the variable in the template file
   - Run the conversion script again

2. **Missing variables**
   - Add the missing variable to the template file
   - Run the conversion script again

3. **Default values in production**
   - Replace default values with actual values
   - Ensure secrets are properly secured

4. **Inconsistent URLs**
   - Ensure URLs are consistent across variables
   - Use HTTPS for production URLs

### Getting Help

If you encounter issues with environment variables:

1. Check this guide for information about the variable
2. Review the validation error messages
3. Check the template files for documentation
4. Consult the Strapi or Next.js documentation for specific variables

---

*Last updated: May 31, 2025*
