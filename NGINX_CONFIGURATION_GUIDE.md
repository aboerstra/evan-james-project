# Nginx Configuration Guide

This guide outlines the steps to update your Nginx configuration for the new directory structure on your EC2 server.

## Prerequisites

- SSH access to your EC2 server
- The SSH key file (~/ejofficial.pem)
- Sudo privileges on the server

## Manual Nginx Configuration Update

If you need to manually update your Nginx configuration:

### 1. Connect to your server

```bash
ssh -i ~/ejofficial.pem ubuntu@evanjamesofficial.com
```

### 2. Backup your current Nginx configuration

```bash
sudo cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.backup.$(date +%Y%m%d)
```

### 3. Edit the Nginx configuration file

```bash
sudo nano /etc/nginx/sites-available/default
```

### 4. Update the paths in the configuration

Locate the following sections and update the paths:

For the frontend:
```
location / {
    # Change this from:
    # proxy_pass http://localhost:3000;
    # or
    # root /home/ubuntu/evan-james-full/frontend/.next;
    
    # To:
    proxy_pass http://localhost:3000;
    # or 
    # root /home/ubuntu/evan-james/frontend/.next;
    
    # ...other settings...
}
```

For the backend:
```
location /api/ {
    # Change this from:
    # proxy_pass http://localhost:1337;
    
    # To:
    proxy_pass http://localhost:1337;
    
    # ...other settings...
}
```

### 5. Test and reload the Nginx configuration

```bash
# Test the configuration
sudo nginx -t

# If the test is successful, reload Nginx
sudo systemctl reload nginx
```

## Automated Nginx Configuration Update

Alternatively, you can use the provided script to update your Nginx configuration:

```bash
# Run the script
./scripts/update-nginx-config.sh
```

This script will:
1. Scan for Nginx configuration files containing the old path
2. Create backups of the found files
3. Update the paths in the configuration files
4. Test the configuration
5. Reload Nginx if the test is successful

## Verification

After updating the Nginx configuration, verify that your website is accessible:

```bash
# Check if Nginx is running
sudo systemctl status nginx

# Test the frontend
curl -I https://evanjamesofficial.com

# Test the backend
curl -I https://api.evanjamesofficial.com
```

## Troubleshooting

If you encounter issues with the Nginx configuration:

1. **Check Nginx error logs**:
   ```bash
   sudo tail -f /var/log/nginx/error.log
   ```

2. **Verify that Nginx is listening on the correct ports**:
   ```bash
   sudo netstat -tlnp | grep nginx
   ```

3. **Check that your applications are running**:
   ```bash
   pm2 status
   ```

4. **Restore from backup if needed**:
   ```bash
   sudo cp /etc/nginx/sites-available/default.backup.YYYYMMDD /etc/nginx/sites-available/default
   sudo systemctl reload nginx
   ```

## Common Nginx Configuration Issues

1. **404 Not Found errors**: Check that the path to your application files is correct in the Nginx configuration.

2. **502 Bad Gateway errors**: Ensure that your application servers (PM2-managed Node.js processes) are running.

3. **SSL certificate issues**: Verify that your SSL certificates are properly configured in the Nginx configuration.

4. **Permission issues**: Ensure that Nginx has permission to access the application files.
