# Error Fix Guide for Evan James Website

This guide provides instructions for fixing the 502 Bad Gateway and 403 Forbidden errors on the Evan James website.

## Quick Start

1. **From your local machine**, upload the fix scripts to your EC2 server:
   ```bash
   chmod +x scripts/upload-fix-scripts.sh
   ./scripts/upload-fix-scripts.sh
   ```

2. **On your EC2 server**, run the following scripts in order:
   ```bash
   # 1. Run the troubleshooting script to diagnose issues
   sudo ./ec2-troubleshoot.sh
   
   # 2. Set up the backend environment with secure keys
   ./setup-backend-env.sh
   
   # 3. Fix Nginx configuration
   sudo ./fix-nginx-config.sh
   ```

## Understanding the Errors

### 502 Bad Gateway (Backend API)

The 502 error at api.evanjamesofficial.com indicates that Nginx cannot connect to the backend Strapi server. This is likely due to:

1. **Missing backend environment file**: The troubleshooting script detected that the backend .env file is missing, which is critical for the backend to function.
2. **Incorrect Nginx configuration**: The proxy_pass directive may be pointing to the wrong port or address.
3. **Backend service not running**: The PM2 process for the backend may not be running or may have crashed.

### 403 Forbidden (Frontend)

The 403 error at evanjamesofficial.com indicates that Nginx doesn't have permission to access the frontend files or the configuration is incorrect. This could be due to:

1. **Incorrect Nginx configuration**: The root directory in the Nginx configuration may be incorrect.
2. **Permission issues**: The Nginx user may not have permission to read the frontend files.

## Available Scripts

### 1. EC2 Troubleshooting Script (`ec2-troubleshoot.sh`)

This script diagnoses common deployment errors and attempts to fix them automatically.

**Features:**
- Checks PM2 processes and restarts them if needed
- Verifies application directory structure and permissions
- Examines Nginx configuration for common issues
- Checks for port availability and service status
- Provides detailed logs and next steps for resolution

### 2. Backend Environment Setup Script (`setup-backend-env.sh`)

This script sets up the backend environment file with secure keys.

**Features:**
- Generates secure random keys for the backend
- Creates a properly configured .env file from a template
- Restarts the backend service to apply the new environment variables

### 3. Nginx Configuration Fix Script (`fix-nginx-config.sh`)

This script fixes common Nginx configuration issues.

**Features:**
- Creates proper Nginx configurations for both frontend and backend
- Backs up existing configurations before making changes
- Tests the new configuration before applying it
- Restores the backup if the new configuration fails

### 4. Upload Fix Scripts (`upload-fix-scripts.sh`)

This script uploads all the fix scripts to your EC2 server.

**Features:**
- Uploads all necessary scripts and templates
- Sets executable permissions on the remote server
- Provides clear next steps after upload

## Detailed Fix Process

### Step 1: Run the Troubleshooting Script

The troubleshooting script will identify issues with your deployment and attempt to fix them automatically.

```bash
sudo ./ec2-troubleshoot.sh
```

This script will:
- Check if PM2 is running the frontend and backend services
- Verify the application directory structure
- Check for environment files
- Examine Nginx configuration
- Check file permissions
- Verify port availability

### Step 2: Set Up the Backend Environment

The backend environment setup script will create a properly configured .env file for the backend.

```bash
./setup-backend-env.sh
```

This script will:
- Generate secure random keys for the backend
- Create a .env file from the template
- Restart the backend service to apply the new environment variables

### Step 3: Fix Nginx Configuration

The Nginx configuration fix script will create proper Nginx configurations for both the frontend and backend.

```bash
sudo ./fix-nginx-config.sh
```

This script will:
- Back up existing Nginx configurations
- Create new configurations with the correct settings
- Test the new configurations
- Apply the new configurations if they pass the test
- Restore the backup if the new configurations fail

## Verifying the Fix

After running all the scripts, you should be able to access:

- Frontend: https://evanjamesofficial.com
- Backend API: https://api.evanjamesofficial.com
- Backend Admin: https://api.evanjamesofficial.com/admin

If you still encounter issues, check the logs:

```bash
# Check frontend logs
pm2 logs evan-james-frontend

# Check backend logs
pm2 logs evan-james-backend

# Check Nginx error logs
sudo tail -n 100 /var/log/nginx/error.log
```

## Preventing Future Issues

1. **Regular backups**: Set up regular backups of your database and configuration files.
2. **Monitoring**: Implement monitoring to detect issues before they cause downtime.
3. **Documentation**: Keep documentation up-to-date with any changes to the deployment process.
4. **Testing**: Test changes in a staging environment before deploying to production.
