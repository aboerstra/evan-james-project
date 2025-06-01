# Environment Variable Management Guide

This guide explains how to manage environment variables in the Evan James project for both local development and production deployment on EC2.

## Overview

The project uses a structured approach to manage environment variables:

1. Environment variable templates are stored in markdown files:
   - `backend-variables.local.md` and `backend-variables.ec2.md` for the backend
   - `frontend-variables.local.md` and `frontend-variables.ec2.md` for the frontend

2. These templates are converted to `.env` files using the `convert_variables.sh` script

3. Environment variables are validated using the `validate-env.js` script

4. Different environments (local vs production) use different variable sets

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
