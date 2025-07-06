# Deployment Recovery Guide

This guide provides instructions for recovering from interrupted deployments, particularly when the server hangs or crashes during the installation of dependencies.

## Using the Resume Deployment Script

If your deployment was interrupted (e.g., due to server hang, crash, or reboot), you can use the `resume-deployment.sh` script to continue from where it left off:

1. Make the script executable:
   ```bash
   chmod +x scripts/resume-deployment.sh
   ```

2. Run the script:
   ```bash
   ./scripts/resume-deployment.sh
   ```

The script will:
- Check which parts of the deployment have already been completed
- Clean up any potentially corrupted installations
- Install missing dependencies with memory limits to prevent hanging
- Set up PM2 services for both frontend and backend
- Verify the deployment status

## Memory Issues During Deployment

If you're experiencing memory issues during deployment (particularly during `npm install`), here are some solutions:

### 1. Increase Swap Space

Adding swap space can help prevent out-of-memory errors:

```bash
# Check current swap
free -h

# Create a 2GB swap file
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Make swap permanent
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Verify swap is active
free -h
```

### 2. Optimize Node.js Memory Usage

The resume script already sets memory limits for Node.js, but you can adjust the `MEMORY_LIMIT` value in the script if needed:

```bash
# Edit the script to change the memory limit
nano scripts/resume-deployment.sh

# Find and modify this line:
MEMORY_LIMIT=512  # Memory limit in MB for Node.js
```

### 3. Install Dependencies in Production Mode

Installing in production mode can reduce memory usage:

```bash
cd /home/ubuntu/evan-james/backend
NODE_ENV=production npm install --production
```

Then install development dependencies separately if needed:

```bash
npm install --only=dev
```

### 4. Upgrade EC2 Instance

If you continue to experience memory issues, consider upgrading to an EC2 instance with more RAM:

1. Stop your current instance
2. Change the instance type to one with more memory (e.g., t3.medium or higher)
3. Start the instance
4. Resume the deployment

## Troubleshooting

### Check PM2 Logs

If services aren't starting correctly, check the PM2 logs:

```bash
# View all logs
pm2 logs

# View specific service logs
pm2 logs evan-james-frontend
pm2 logs evan-james-backend
```

### Verify Directory Structure

Ensure the directory structure is correct:

```bash
ls -la /home/ubuntu/evan-james
ls -la /home/ubuntu/evan-james/frontend
ls -la /home/ubuntu/evan-james/backend
```

### Check Environment Variables

Verify that environment variables are properly set:

```bash
cat /home/ubuntu/evan-james/frontend/.env
cat /home/ubuntu/evan-james/backend/.env
```

### Nginx Configuration

If the services are running but not accessible via the domain, check the Nginx configuration:

```bash
sudo nginx -t
sudo systemctl status nginx
```

## Manual Recovery Steps

If the resume script doesn't work for any reason, here are the manual steps:

1. Clean up potentially corrupted installations:
   ```bash
   cd /home/ubuntu/evan-james/backend
   rm -rf node_modules
   ```

2. Install dependencies with memory limits:
   ```bash
   NODE_OPTIONS="--max-old-space-size=512" npm install
   ```

3. Set up PM2 services:
   ```bash
   pm2 stop evan-james-backend 2>/dev/null || true
   pm2 delete evan-james-backend 2>/dev/null || true
   pm2 start npm --name "evan-james-backend" -- run develop
   pm2 save
   ```

4. Repeat similar steps for the frontend if needed.

## Preventing Future Issues

To prevent similar issues in the future:

1. Always ensure adequate swap space is configured
2. Consider using a larger EC2 instance for deployments
3. Schedule deployments during off-peak hours
4. Use the `--production` flag with npm install for production environments
5. Consider using Docker for more isolated and reproducible deployments
