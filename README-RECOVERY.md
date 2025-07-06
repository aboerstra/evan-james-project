# Deployment Recovery Tools

This set of tools is designed to help you recover from interrupted deployments and prevent memory-related issues on your EC2 server.

## Available Scripts

### 1. Resume Deployment Script (`scripts/resume-deployment.sh`)

This script helps you recover from an interrupted deployment process, such as when the server hangs or crashes during dependency installation.

**Features:**
- Automatically detects which parts of the deployment need to be completed
- Cleans up potentially corrupted installations
- Uses memory limits to prevent server hangs during npm install
- Sets up PM2 services for both frontend and backend
- Preserves environment variables

**Usage on EC2 server:**
```bash
chmod +x resume-deployment.sh
./resume-deployment.sh
```

### 2. Swap Space Setup Script (`scripts/setup-swap.sh`)

This script sets up swap space on your EC2 server to prevent out-of-memory errors during deployment.

**Features:**
- Creates a 2GB swap file (configurable)
- Sets appropriate permissions and configurations
- Makes swap persistent across reboots
- Optimizes swappiness for better performance

**Usage on EC2 server:**
```bash
sudo chmod +x setup-swap.sh
sudo ./setup-swap.sh
```

### 3. Error Troubleshooting Script (`scripts/troubleshoot-errors.sh`)

This script diagnoses and fixes common deployment errors, particularly 502 (backend) and 403 (frontend) errors.

**Features:**
- Checks PM2 processes and restarts them if needed
- Verifies application directory structure and permissions
- Examines Nginx configuration for common issues
- Checks for port availability and service status
- Provides detailed logs and next steps for resolution

**Usage on EC2 server:**
```bash
sudo chmod +x troubleshoot-errors.sh
sudo ./troubleshoot-errors.sh
```

### 4. Upload Recovery Scripts (`scripts/upload-recovery-scripts.sh`)

This script uploads the recovery tools to your EC2 server from your local machine.

**Features:**
- Uploads all recovery scripts and documentation
- Sets executable permissions on the remote server
- Provides clear next steps after upload

**Usage on local machine:**
```bash
chmod +x scripts/upload-recovery-scripts.sh
./scripts/upload-recovery-scripts.sh
```

## Deployment Recovery Process

If your deployment was interrupted (e.g., server hang during npm install):

1. **From your local machine:**
   ```bash
   ./scripts/upload-recovery-scripts.sh
   ```

2. **On the EC2 server:**
   ```bash
   # Set up swap space to prevent future memory issues
   sudo ./setup-swap.sh
   
   # Resume the interrupted deployment
   ./resume-deployment.sh
   ```

3. **Verify deployment:**
   ```bash
   # Check PM2 services
   pm2 status
   
   # Check logs if needed
   pm2 logs
   ```

## Troubleshooting Common Errors

If you encounter errors after deployment:

### For 502 Bad Gateway (Backend API):

1. **Run the troubleshooting script:**
   ```bash
   sudo ./troubleshoot-errors.sh
   ```

2. **Check specific backend issues:**
   ```bash
   # Verify backend is running
   pm2 status
   
   # Check backend logs
   pm2 logs evan-james-backend
   
   # Verify backend environment variables
   cat /home/ubuntu/evan-james/backend/.env
   ```

3. **Restart services if needed:**
   ```bash
   # Restart backend
   pm2 restart evan-james-backend
   
   # Restart Nginx
   sudo systemctl restart nginx
   ```

### For 403 Forbidden (Frontend):

1. **Run the troubleshooting script:**
   ```bash
   sudo ./troubleshoot-errors.sh
   ```

2. **Check specific frontend issues:**
   ```bash
   # Check directory permissions
   ls -la /home/ubuntu/evan-james/frontend
   
   # Fix permissions if needed
   sudo chmod -R 755 /home/ubuntu/evan-james/frontend/.next
   
   # Restart frontend
   pm2 restart evan-james-frontend
   ```

## Additional Documentation

For more detailed information, refer to:

- `docs/DEPLOYMENT_RECOVERY_GUIDE.md`: Comprehensive guide with troubleshooting tips
- `docs/SIMPLIFIED_DEPLOYMENT_GUIDE.md`: Guide for the standard deployment process
- `DEPLOYMENT_SUMMARY.md`: Overview of the complete deployment system

## Preventing Future Issues

To prevent similar issues in the future:

1. Always ensure adequate swap space is configured on your EC2 server
2. Consider using a larger EC2 instance type for deployments
3. Use memory limits when running memory-intensive operations
4. Install dependencies in production mode when possible
