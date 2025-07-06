# Error Troubleshooting Guide

This guide provides detailed information on troubleshooting common errors encountered after deployment, specifically 502 Bad Gateway and 403 Forbidden errors.

## Quick Fix

For a quick automated fix, run the troubleshooting script:

```bash
sudo chmod +x troubleshoot-errors.sh
sudo ./troubleshoot-errors.sh
```

This script will automatically check for common issues and attempt to fix them. If the script doesn't resolve your issues, continue with the manual troubleshooting steps below.

## 502 Bad Gateway (Backend API)

A 502 Bad Gateway error indicates that the backend server (Strapi) is not running or not accessible.

### Common Causes

1. **Backend service not running**: The PM2 process for the backend may have crashed or failed to start.
2. **Incorrect Nginx configuration**: The proxy_pass directive may be pointing to the wrong port or address.
3. **Backend port not in use**: The backend application may not be listening on the expected port (1337).
4. **Environment configuration issues**: Missing or incorrect environment variables in the backend .env file.
5. **Database connection problems**: The backend cannot connect to the database.

### Troubleshooting Steps

#### 1. Check if the backend service is running

```bash
# Check PM2 status
pm2 status

# If the backend is not running or in error state, restart it
pm2 restart evan-james-backend

# If the backend is not in the PM2 list, start it
cd /home/ubuntu/evan-james/backend
pm2 start npm --name "evan-james-backend" -- run develop
```

#### 2. Check backend logs for errors

```bash
# View the last 50 lines of backend logs
pm2 logs evan-james-backend --lines 50

# Look for error messages related to:
# - Database connection
# - Port conflicts
# - Missing environment variables
# - Syntax errors in code
```

#### 3. Verify backend environment variables

```bash
# Check if .env file exists
ls -la /home/ubuntu/evan-james/backend/.env

# View the contents of the .env file
cat /home/ubuntu/evan-james/backend/.env
```

Ensure the .env file contains all required variables, including:
- `HOST` (usually 0.0.0.0)
- `PORT` (usually 1337)
- `DATABASE_*` settings
- `ADMIN_JWT_SECRET`
- `API_TOKEN_SALT`
- `APP_KEYS`

#### 4. Check if the backend port is in use

```bash
# Check if port 1337 is in use
netstat -tuln | grep 1337

# If netstat is not available, install it
sudo apt-get update && sudo apt-get install -y net-tools
```

#### 5. Check Nginx configuration

```bash
# Find the Nginx configuration file for the backend
sudo grep -r "api.evanjamesofficial.com" /etc/nginx/sites-available/

# Check the configuration file
sudo cat /etc/nginx/sites-available/your-backend-config-file

# Verify the proxy_pass directive points to 127.0.0.1:1337
# It should look something like:
# proxy_pass http://127.0.0.1:1337;
```

#### 6. Test Nginx configuration and restart

```bash
# Test Nginx configuration
sudo nginx -t

# If the test passes, restart Nginx
sudo systemctl restart nginx
```

## 403 Forbidden (Frontend)

A 403 Forbidden error indicates that Nginx can't access the frontend files due to permission issues or incorrect configuration.

### Common Causes

1. **Permission issues**: The Nginx user (www-data) doesn't have permission to read the frontend files.
2. **Incorrect Nginx configuration**: The root directory in the Nginx configuration may be incorrect.
3. **Missing or incomplete build**: The frontend may not have been built correctly.
4. **Incorrect file ownership**: The files may be owned by a user that Nginx can't access.

### Troubleshooting Steps

#### 1. Check frontend directory permissions

```bash
# Check permissions on the frontend directory
ls -la /home/ubuntu/evan-james/frontend

# Check permissions on the .next directory (built files)
ls -la /home/ubuntu/evan-james/frontend/.next
```

The directories should have at least 755 permissions (rwxr-xr-x), and the Nginx user (www-data) should be able to read the files.

#### 2. Fix permissions if needed

```bash
# Set appropriate permissions on the frontend directory
sudo chmod -R 755 /home/ubuntu/evan-james/frontend

# Ensure the .next directory has appropriate permissions
sudo chmod -R 755 /home/ubuntu/evan-james/frontend/.next
```

#### 3. Check file ownership

```bash
# Check ownership of the frontend directory
stat -c '%U:%G' /home/ubuntu/evan-james/frontend

# If needed, change ownership to a user that Nginx can access
sudo chown -R ubuntu:ubuntu /home/ubuntu/evan-james/frontend
```

#### 4. Check Nginx configuration

```bash
# Find the Nginx configuration file for the frontend
sudo grep -r "evanjamesofficial.com" /etc/nginx/sites-available/

# Check the configuration file
sudo cat /etc/nginx/sites-available/your-frontend-config-file

# Verify the root directive points to the correct directory
# It should look something like:
# root /home/ubuntu/evan-james/frontend;
```

#### 5. Verify the frontend build

```bash
# Check if the .next directory exists and contains files
ls -la /home/ubuntu/evan-james/frontend/.next

# If the build is missing or incomplete, rebuild the frontend
cd /home/ubuntu/evan-james/frontend
npm run build
```

#### 6. Restart services

```bash
# Restart the frontend service
pm2 restart evan-james-frontend

# Restart Nginx
sudo systemctl restart nginx
```

## Advanced Troubleshooting

If the above steps don't resolve the issues, try these advanced troubleshooting techniques:

### Check Nginx Error Logs

```bash
# Check Nginx error logs
sudo tail -n 100 /var/log/nginx/error.log
```

### Test Backend Directly

```bash
# Test if the backend is responding directly (bypassing Nginx)
curl http://localhost:1337/api/health

# If you get a response, the backend is working but Nginx proxy is misconfigured
```

### Check System Resources

```bash
# Check system resources
free -h
df -h
top
```

### Restart the Server

As a last resort, you can try restarting the EC2 instance:

```bash
sudo reboot
```

After the server restarts, run the resume-deployment.sh script to ensure all services are properly started:

```bash
./resume-deployment.sh
```

## Common Error Messages and Solutions

### Backend (502 Bad Gateway)

| Error Message | Likely Cause | Solution |
|---------------|--------------|----------|
| "Error: connect ECONNREFUSED 127.0.0.1:1337" | Backend not running | Restart backend with PM2 |
| "Error: connect ETIMEDOUT" | Backend hanging or unresponsive | Restart backend and check logs |
| "Error: getaddrinfo ENOTFOUND" | DNS resolution issue | Check Nginx configuration |
| "Error: database connection" | Database issues | Check database credentials in .env |

### Frontend (403 Forbidden)

| Error Message | Likely Cause | Solution |
|---------------|--------------|----------|
| "Permission denied" in Nginx logs | File permission issues | Fix permissions with chmod |
| "Directory index forbidden" | Missing index file or incorrect root | Check Nginx configuration |
| "No such file or directory" | Incorrect path in Nginx config | Update Nginx configuration |
| "Failed to load resource" in browser console | Missing or inaccessible assets | Check file permissions and paths |

## Preventing Future Issues

1. **Regular backups**: Set up regular backups of your database and configuration files.
2. **Monitoring**: Implement monitoring to detect issues before they cause downtime.
3. **Logging**: Ensure comprehensive logging is enabled to help diagnose issues.
4. **Testing**: Test changes in a staging environment before deploying to production.
5. **Documentation**: Keep documentation up-to-date with any changes to the deployment process.
