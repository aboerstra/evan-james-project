#!/bin/bash

# EC2 Troubleshooting Script for Evan James Website
# This script helps diagnose and fix 502 and 403 errors
# Copy and paste this entire script directly into your EC2 server terminal

# Configuration
APP_DIR="/home/ubuntu/evan-james"
NGINX_SITES_DIR="/etc/nginx/sites-available"
NGINX_ENABLED_DIR="/etc/nginx/sites-enabled"
LOG_FILE="/tmp/troubleshoot-$(date +%Y%m%d%H%M%S).log"
SWAP_SIZE_GB=2  # Size of swap file in GB

# Function to log messages
log() {
  echo "$(date +"%Y-%m-%d %H:%M:%S") - $1" | tee -a $LOG_FILE
}

# Function to check if a command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

log "=== Starting Troubleshooting for Evan James Website ==="
log "Checking for common deployment errors..."

# Check if running as root for certain operations
IS_ROOT=false
if [ "$(id -u)" -eq 0 ]; then
  IS_ROOT=true
  log "Running with root privileges - will be able to check and fix Nginx configuration"
else
  log "WARNING: Not running with root privileges - some Nginx checks and fixes will be skipped"
  log "Consider running with sudo if Nginx issues are detected"
fi

# Setup swap space if needed
setup_swap() {
  log "Checking if swap space is needed..."
  
  # Check if swap is already enabled
  SWAP_ENABLED=$(free | grep -i swap | awk '{print $2}')

  if [ "$SWAP_ENABLED" -gt 0 ]; then
    log "✅ Swap is already enabled. Current swap configuration:"
    free -h | tee -a $LOG_FILE
  else
    log "❌ No swap space detected. Setting up ${SWAP_SIZE_GB}GB swap file..."
    
    if [ "$IS_ROOT" = true ]; then
      # Create swap file
      log "Creating swap file..."
      fallocate -l ${SWAP_SIZE_GB}G /swapfile
      
      # Set proper permissions
      log "Setting permissions..."
      chmod 600 /swapfile
      
      # Set up swap area
      log "Setting up swap area..."
      mkswap /swapfile
      
      # Enable swap
      log "Enabling swap..."
      swapon /swapfile
      
      # Add to fstab for persistence across reboots
      if ! grep -q "/swapfile" /etc/fstab; then
        log "Adding swap to /etc/fstab for persistence across reboots..."
        echo '/swapfile none swap sw 0 0' | tee -a /etc/fstab
      fi
      
      # Adjust swappiness for better performance
      log "Adjusting swappiness for better performance..."
      sysctl vm.swappiness=10
      echo "vm.swappiness=10" | tee -a /etc/sysctl.conf
      
      log "✅ Swap setup completed successfully!"
      free -h | tee -a $LOG_FILE
    else
      log "❌ Cannot set up swap space without root privileges"
      log "Please run this script with sudo to set up swap space"
    fi
  fi
}

# Check PM2 status
check_pm2() {
  log "Checking PM2 processes..."
  if command_exists pm2; then
    pm2_status=$(pm2 list)
    log "PM2 Status:"
    echo "$pm2_status" | tee -a $LOG_FILE
    
    # Check if frontend is running
    if echo "$pm2_status" | grep -q "evan-james-frontend"; then
      if echo "$pm2_status" | grep -q "evan-james-frontend.*online"; then
        log "✅ Frontend process is running"
      else
        log "❌ Frontend process exists but is not online"
        log "Attempting to restart frontend..."
        cd "$APP_DIR/frontend"
        pm2 restart evan-james-frontend
      fi
    else
      log "❌ Frontend process is not found in PM2"
      log "Attempting to start frontend..."
      cd "$APP_DIR/frontend"
      pm2 start npm --name "evan-james-frontend" -- run start
    fi
    
    # Check if backend is running
    if echo "$pm2_status" | grep -q "evan-james-backend"; then
      if echo "$pm2_status" | grep -q "evan-james-backend.*online"; then
        log "✅ Backend process is running"
      else
        log "❌ Backend process exists but is not online"
        log "Attempting to restart backend..."
        cd "$APP_DIR/backend"
        pm2 restart evan-james-backend
      fi
    else
      log "❌ Backend process is not found in PM2"
      log "Attempting to start backend..."
      cd "$APP_DIR/backend"
      pm2 start npm --name "evan-james-backend" -- run develop
    fi
  else
    log "❌ PM2 is not installed. Installing..."
    npm install -g pm2
    log "Starting services with PM2..."
    cd "$APP_DIR/frontend"
    pm2 start npm --name "evan-james-frontend" -- run start
    cd "$APP_DIR/backend"
    pm2 start npm --name "evan-james-backend" -- run develop
    pm2 save
  fi
}

# Check application directory structure
check_app_structure() {
  log "Checking application directory structure..."
  if [ -d "$APP_DIR" ]; then
    log "✅ Main application directory exists: $APP_DIR"
    
    # Check frontend directory
    if [ -d "$APP_DIR/frontend" ]; then
      log "✅ Frontend directory exists"
      
      # Check for built files
      if [ -d "$APP_DIR/frontend/.next" ]; then
        log "✅ Frontend build exists"
      else
        log "❌ Frontend build is missing"
        log "Attempting to build frontend..."
        cd "$APP_DIR/frontend"
        npm run build
      fi
      
      # Check for environment file
      if [ -f "$APP_DIR/frontend/.env" ]; then
        log "✅ Frontend environment file exists"
      else
        log "❌ Frontend environment file is missing"
        log "Creating basic frontend .env file..."
        echo "NEXT_PUBLIC_API_URL=https://api.evanjamesofficial.com" > "$APP_DIR/frontend/.env"
        log "⚠️ You may need to customize the frontend .env file with additional variables"
      fi
    else
      log "❌ Frontend directory is missing"
      log "This is a critical issue that requires manual intervention"
    fi
    
    # Check backend directory
    if [ -d "$APP_DIR/backend" ]; then
      log "✅ Backend directory exists"
      
      # Check for environment file
      if [ -f "$APP_DIR/backend/.env" ]; then
        log "✅ Backend environment file exists"
      else
        log "❌ Backend environment file is missing"
        log "⚠️ Backend requires a properly configured .env file to function"
        log "Please create a backend .env file manually with the required configuration"
      fi
    else
      log "❌ Backend directory is missing"
      log "This is a critical issue that requires manual intervention"
    fi
  else
    log "❌ Main application directory is missing: $APP_DIR"
    log "This is a critical issue that requires manual intervention"
  fi
}

# Check Nginx configuration
check_nginx() {
  if [ "$IS_ROOT" = true ]; then
    log "Checking Nginx configuration..."
    
    # Test Nginx configuration
    nginx_test=$(nginx -t 2>&1)
    if echo "$nginx_test" | grep -q "successful"; then
      log "✅ Nginx configuration test passed"
    else
      log "❌ Nginx configuration test failed:"
      echo "$nginx_test" | tee -a $LOG_FILE
    fi
    
    # Check for site configurations
    frontend_config_found=false
    backend_config_found=false
    
    for config_file in "$NGINX_SITES_DIR"/*; do
      if [ -f "$config_file" ]; then
        # Check for frontend configuration
        if grep -q "server_name.*evanjamesofficial\.com" "$config_file"; then
          log "✅ Frontend Nginx configuration found: $config_file"
          frontend_config_found=true
          
          # Check for correct root path
          if grep -q "root.*evan-james/frontend" "$config_file"; then
            log "✅ Frontend root path looks correct"
          else
            log "⚠️ Frontend root path may be incorrect in Nginx config"
            log "Current configuration:"
            grep -A 5 "server_name.*evanjamesofficial\.com" "$config_file" | tee -a $LOG_FILE
            
            # Try to fix the path
            log "Attempting to fix frontend root path..."
            sed -i 's#root .*#root /home/ubuntu/evan-james/frontend;#' "$config_file"
          fi
        fi
        
        # Check for backend configuration
        if grep -q "server_name.*api\.evanjamesofficial\.com" "$config_file"; then
          log "✅ Backend Nginx configuration found: $config_file"
          backend_config_found=true
          
          # Check for correct proxy pass
          if grep -q "proxy_pass.*127\.0\.0\.1:1337" "$config_file"; then
            log "✅ Backend proxy_pass looks correct"
          else
            log "⚠️ Backend proxy_pass may be incorrect in Nginx config"
            log "Current configuration:"
            grep -A 5 "server_name.*api\.evanjamesofficial\.com" "$config_file" | tee -a $LOG_FILE
            
            # Try to fix the proxy_pass
            log "Attempting to fix backend proxy_pass..."
            sed -i 's#proxy_pass .*#proxy_pass http://127.0.0.1:1337;#' "$config_file"
          fi
        fi
      fi
    done
    
    if [ "$frontend_config_found" = false ]; then
      log "❌ Frontend Nginx configuration not found"
    fi
    
    if [ "$backend_config_found" = false ]; then
      log "❌ Backend Nginx configuration not found"
    fi
    
    # Restart Nginx
    log "Restarting Nginx..."
    systemctl restart nginx
    
    # Check if Nginx is running
    if systemctl is-active --quiet nginx; then
      log "✅ Nginx is running"
    else
      log "❌ Nginx is not running"
      log "Attempting to start Nginx..."
      systemctl start nginx
    fi
  else
    log "Skipping Nginx configuration checks (requires root privileges)"
    log "To check Nginx, run: sudo nginx -t"
    log "To restart Nginx, run: sudo systemctl restart nginx"
  fi
}

# Check for 403 errors (permission issues)
check_permissions() {
  log "Checking for potential permission issues (403 errors)..."

  # Check frontend directory permissions
  if [ -d "$APP_DIR/frontend" ]; then
    frontend_owner=$(stat -c '%U' "$APP_DIR/frontend")
    log "Frontend directory owner: $frontend_owner"
    
    if [ "$frontend_owner" != "ubuntu" ] && [ "$frontend_owner" != "www-data" ]; then
      log "⚠️ Frontend directory has unexpected owner: $frontend_owner"
      if [ "$IS_ROOT" = true ]; then
        log "Fixing frontend directory ownership..."
        chown -R ubuntu:ubuntu "$APP_DIR/frontend"
      else
        log "To fix ownership, run: sudo chown -R ubuntu:ubuntu $APP_DIR/frontend"
      fi
    fi
    
    # Check .next directory permissions
    if [ -d "$APP_DIR/frontend/.next" ]; then
      next_perms=$(stat -c '%a' "$APP_DIR/frontend/.next")
      log "Frontend .next directory permissions: $next_perms"
      
      if [ "$next_perms" -lt 755 ]; then
        log "⚠️ Frontend .next directory may have insufficient permissions"
        if [ "$IS_ROOT" = true ]; then
          log "Fixing .next directory permissions..."
          chmod -R 755 "$APP_DIR/frontend/.next"
        else
          log "To fix permissions, run: sudo chmod -R 755 $APP_DIR/frontend/.next"
        fi
      fi
    fi
  fi
}

# Check for 502 errors (backend not running)
check_backend() {
  log "Checking for potential backend connectivity issues (502 errors)..."

  # Check if backend port is in use
  if command_exists netstat; then
    if netstat -tuln | grep -q ":1337"; then
      log "✅ Backend port 1337 is in use"
    else
      log "❌ Backend port 1337 is not in use"
      log "This indicates the backend server is not running correctly"
      log "Checking backend logs..."
      
      if command_exists pm2; then
        pm2 logs evan-james-backend --lines 20 | tee -a $LOG_FILE
      fi
    fi
  else
    log "netstat not available, installing net-tools..."
    if [ "$IS_ROOT" = true ]; then
      apt-get update && apt-get install -y net-tools
      if netstat -tuln | grep -q ":1337"; then
        log "✅ Backend port 1337 is in use"
      else
        log "❌ Backend port 1337 is not in use"
      fi
    else
      log "To install net-tools, run: sudo apt-get update && sudo apt-get install -y net-tools"
    fi
  fi

  # Check backend logs for errors
  log "Checking backend logs for errors..."
  if command_exists pm2; then
    backend_logs=$(pm2 logs evan-james-backend --lines 20 --nostream 2>/dev/null)
    if [ -n "$backend_logs" ]; then
      log "Recent backend logs:"
      echo "$backend_logs" | tee -a $LOG_FILE
    else
      log "No recent backend logs found or unable to retrieve logs"
    fi
  fi
}

# Main execution
setup_swap
check_pm2
check_app_structure
check_nginx
check_permissions
check_backend

# Summary and recommendations
log "=== Troubleshooting Summary ==="
log "Troubleshooting log saved to: $LOG_FILE"
log ""
log "Next steps for 502 errors (Backend API):"
log "1. Verify the backend is running: pm2 status"
log "2. Check backend logs: pm2 logs evan-james-backend"
log "3. Verify backend environment variables: cat $APP_DIR/backend/.env"
log "4. Check Nginx proxy configuration: sudo nano $NGINX_SITES_DIR/your-backend-config"
log "5. Restart backend: pm2 restart evan-james-backend"
log "6. Restart Nginx: sudo systemctl restart nginx"
log ""
log "Next steps for 403 errors (Frontend):"
log "1. Check directory permissions: ls -la $APP_DIR/frontend"
log "2. Verify Nginx configuration: sudo nano $NGINX_SITES_DIR/your-frontend-config"
log "3. Check frontend logs: pm2 logs evan-james-frontend"
log "4. Restart frontend: pm2 restart evan-james-frontend"
log "5. Restart Nginx: sudo systemctl restart nginx"
log ""
log "=== Troubleshooting Complete ==="
echo ""
echo "To view the full troubleshooting log, run: cat $LOG_FILE"
