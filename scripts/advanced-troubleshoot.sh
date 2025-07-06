#!/bin/bash

# Advanced Troubleshooting Script for Evan James Website
# This script performs in-depth diagnostics to identify persistent errors
# Run with sudo: sudo ./advanced-troubleshoot.sh

# Configuration
LOG_FILE="/tmp/advanced-troubleshoot-$(date +%Y%m%d%H%M%S).log"
APP_DIR="/home/ubuntu/evan-james"
FRONTEND_DIR="$APP_DIR/frontend"
BACKEND_DIR="$APP_DIR/backend"
NGINX_SITES_DIR="/etc/nginx/sites-available"
NGINX_ENABLED_DIR="/etc/nginx/sites-enabled"
FRONTEND_DOMAIN="evanjamesofficial.com"
BACKEND_DOMAIN="api.evanjamesofficial.com"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to log messages
log() {
  echo -e "$(date +"%Y-%m-%d %H:%M:%S") - $1" | tee -a $LOG_FILE
}

# Function to check if running as root
check_root() {
  if [ "$(id -u)" -ne 0 ]; then
    log "${RED}❌ This script must be run as root (with sudo)${NC}"
    exit 1
  fi
}

# Function to check if a service is running
check_service() {
  local service=$1
  if systemctl is-active --quiet $service; then
    log "${GREEN}✅ $service is running${NC}"
    return 0
  else
    log "${RED}❌ $service is not running${NC}"
    return 1
  fi
}

# Function to check if a port is in use
check_port() {
  local port=$1
  local process=$2
  if netstat -tuln | grep -q ":$port "; then
    local pid=$(lsof -i :$port -t)
    if [ -n "$pid" ]; then
      local process_name=$(ps -p $pid -o comm=)
      log "${GREEN}✅ Port $port is in use by $process_name (PID: $pid)${NC}"
    else
      log "${GREEN}✅ Port $port is in use${NC}"
    fi
    return 0
  else
    log "${RED}❌ Port $port is not in use by $process${NC}"
    return 1
  fi
}

# Function to check PM2 processes
check_pm2_processes() {
  log "${BLUE}=== Checking PM2 Processes ===${NC}"
  
  # Check if PM2 is installed
  if ! command -v pm2 &> /dev/null; then
    log "${RED}❌ PM2 is not installed${NC}"
    return 1
  fi
  
  # Get PM2 process list
  local pm2_list=$(sudo -u ubuntu pm2 list)
  echo "$pm2_list" >> $LOG_FILE
  
  # Check frontend process
  if echo "$pm2_list" | grep -q "evan-james-frontend.*online"; then
    log "${GREEN}✅ Frontend PM2 process is running${NC}"
    
    # Get more details about the frontend process
    local frontend_info=$(sudo -u ubuntu pm2 show evan-james-frontend)
    echo "$frontend_info" >> $LOG_FILE
    
    # Check restart count
    local restart_count=$(echo "$frontend_info" | grep "restart count" | awk '{print $4}')
    if [ "$restart_count" -gt 10 ]; then
      log "${YELLOW}⚠️ Frontend has restarted $restart_count times, which may indicate issues${NC}"
    fi
    
    # Check memory usage
    local memory=$(echo "$frontend_info" | grep "memory" | awk '{print $4}')
    log "   Frontend memory usage: $memory"
    
    # Check uptime
    local uptime=$(echo "$frontend_info" | grep "uptime" | awk '{print $4" "$5}')
    log "   Frontend uptime: $uptime"
  else
    log "${RED}❌ Frontend PM2 process is not running${NC}"
    log "   Attempting to start frontend process..."
    sudo -u ubuntu pm2 start $FRONTEND_DIR/server.js --name evan-james-frontend
  fi
  
  # Check backend process
  if echo "$pm2_list" | grep -q "evan-james-backend.*online"; then
    log "${GREEN}✅ Backend PM2 process is running${NC}"
    
    # Get more details about the backend process
    local backend_info=$(sudo -u ubuntu pm2 show evan-james-backend)
    echo "$backend_info" >> $LOG_FILE
    
    # Check restart count
    local restart_count=$(echo "$backend_info" | grep "restart count" | awk '{print $4}')
    if [ "$restart_count" -gt 10 ]; then
      log "${YELLOW}⚠️ Backend has restarted $restart_count times, which may indicate issues${NC}"
    fi
    
    # Check memory usage
    local memory=$(echo "$backend_info" | grep "memory" | awk '{print $4}')
    log "   Backend memory usage: $memory"
    
    # Check uptime
    local uptime=$(echo "$backend_info" | grep "uptime" | awk '{print $4" "$5}')
    log "   Backend uptime: $uptime"
  else
    log "${RED}❌ Backend PM2 process is not running${NC}"
    log "   Attempting to start backend process..."
    cd $BACKEND_DIR && sudo -u ubuntu pm2 start npm --name evan-james-backend -- run start
  fi
  
  # Check if ports are in use
  check_port 3000 "Frontend (Next.js)"
  check_port 1337 "Backend (Strapi)"
}

# Function to check Nginx configuration
check_nginx_configuration() {
  log "${BLUE}=== Checking Nginx Configuration ===${NC}"
  
  # Check if Nginx is installed
  if ! command -v nginx &> /dev/null; then
    log "${RED}❌ Nginx is not installed${NC}"
    return 1
  fi
  
  # Check if Nginx is running
  check_service nginx
  
  # Test Nginx configuration
  log "Testing Nginx configuration..."
  local nginx_test=$(nginx -t 2>&1)
  if echo "$nginx_test" | grep -q "successful"; then
    log "${GREEN}✅ Nginx configuration test passed${NC}"
  else
    log "${RED}❌ Nginx configuration test failed:${NC}"
    echo "$nginx_test" | tee -a $LOG_FILE
  fi
  
  # Check frontend site configuration
  if [ -f "$NGINX_SITES_DIR/$FRONTEND_DOMAIN" ]; then
    log "${GREEN}✅ Frontend Nginx configuration exists${NC}"
    
    # Check if the site is enabled
    if [ -L "$NGINX_ENABLED_DIR/$FRONTEND_DOMAIN" ]; then
      log "${GREEN}✅ Frontend site is enabled${NC}"
    else
      log "${RED}❌ Frontend site is not enabled${NC}"
      log "   Enabling frontend site..."
      ln -sf "$NGINX_SITES_DIR/$FRONTEND_DOMAIN" "$NGINX_ENABLED_DIR/"
    fi
    
    # Check frontend configuration content
    local frontend_config=$(cat "$NGINX_SITES_DIR/$FRONTEND_DOMAIN")
    echo "Frontend Nginx configuration:" >> $LOG_FILE
    echo "$frontend_config" >> $LOG_FILE
    
    # Check for common issues in frontend configuration
    if ! echo "$frontend_config" | grep -q "proxy_pass http://localhost:3000"; then
      log "${RED}❌ Frontend configuration is missing or has incorrect proxy_pass directive${NC}"
    else
      log "${GREEN}✅ Frontend configuration has correct proxy_pass directive${NC}"
    fi
    
    if ! echo "$frontend_config" | grep -q "proxy_set_header Host"; then
      log "${YELLOW}⚠️ Frontend configuration is missing proxy_set_header Host directive${NC}"
    fi
    
    if ! echo "$frontend_config" | grep -q "proxy_http_version 1.1"; then
      log "${YELLOW}⚠️ Frontend configuration is missing proxy_http_version directive${NC}"
    fi
  else
    log "${RED}❌ Frontend Nginx configuration does not exist${NC}"
  fi
  
  # Check backend site configuration
  if [ -f "$NGINX_SITES_DIR/$BACKEND_DOMAIN" ]; then
    log "${GREEN}✅ Backend Nginx configuration exists${NC}"
    
    # Check if the site is enabled
    if [ -L "$NGINX_ENABLED_DIR/$BACKEND_DOMAIN" ]; then
      log "${GREEN}✅ Backend site is enabled${NC}"
    else
      log "${RED}❌ Backend site is not enabled${NC}"
      log "   Enabling backend site..."
      ln -sf "$NGINX_SITES_DIR/$BACKEND_DOMAIN" "$NGINX_ENABLED_DIR/"
    fi
    
    # Check backend configuration content
    local backend_config=$(cat "$NGINX_SITES_DIR/$BACKEND_DOMAIN")
    echo "Backend Nginx configuration:" >> $LOG_FILE
    echo "$backend_config" >> $LOG_FILE
    
    # Check for common issues in backend configuration
    if ! echo "$backend_config" | grep -q "proxy_pass http://127.0.0.1:1337"; then
      log "${RED}❌ Backend configuration is missing or has incorrect proxy_pass directive${NC}"
    else
      log "${GREEN}✅ Backend configuration has correct proxy_pass directive${NC}"
    fi
    
    if ! echo "$backend_config" | grep -q "proxy_set_header Host"; then
      log "${YELLOW}⚠️ Backend configuration is missing proxy_set_header Host directive${NC}"
    fi
    
    if ! echo "$backend_config" | grep -q "client_max_body_size"; then
      log "${YELLOW}⚠️ Backend configuration is missing client_max_body_size directive${NC}"
    fi
  else
    log "${RED}❌ Backend Nginx configuration does not exist${NC}"
  fi
}

# Function to check SSL certificates
check_ssl_certificates() {
  log "${BLUE}=== Checking SSL Certificates ===${NC}"
  
  # Check if certbot is installed
  if ! command -v certbot &> /dev/null; then
    log "${RED}❌ Certbot is not installed${NC}"
    return 1
  fi
  
  # Check frontend SSL certificate
  if [ -d "/etc/letsencrypt/live/$FRONTEND_DOMAIN" ]; then
    log "${GREEN}✅ Frontend SSL certificate exists${NC}"
    
    # Check certificate expiration
    local frontend_expiry=$(openssl x509 -enddate -noout -in /etc/letsencrypt/live/$FRONTEND_DOMAIN/fullchain.pem | cut -d= -f2)
    log "   Frontend certificate expires: $frontend_expiry"
    
    # Check if certificate is referenced in Nginx configuration
    if [ -f "$NGINX_SITES_DIR/$FRONTEND_DOMAIN" ]; then
      if grep -q "ssl_certificate.*$FRONTEND_DOMAIN" "$NGINX_SITES_DIR/$FRONTEND_DOMAIN"; then
        log "${GREEN}✅ Frontend SSL certificate is referenced in Nginx configuration${NC}"
      else
        log "${RED}❌ Frontend SSL certificate is not referenced in Nginx configuration${NC}"
      fi
    fi
  else
    log "${RED}❌ Frontend SSL certificate does not exist${NC}"
    log "   You may need to run: sudo certbot --nginx -d $FRONTEND_DOMAIN -d www.$FRONTEND_DOMAIN"
  fi
  
  # Check backend SSL certificate
  if [ -d "/etc/letsencrypt/live/$BACKEND_DOMAIN" ]; then
    log "${GREEN}✅ Backend SSL certificate exists${NC}"
    
    # Check certificate expiration
    local backend_expiry=$(openssl x509 -enddate -noout -in /etc/letsencrypt/live/$BACKEND_DOMAIN/fullchain.pem | cut -d= -f2)
    log "   Backend certificate expires: $backend_expiry"
    
    # Check if certificate is referenced in Nginx configuration
    if [ -f "$NGINX_SITES_DIR/$BACKEND_DOMAIN" ]; then
      if grep -q "ssl_certificate.*$BACKEND_DOMAIN" "$NGINX_SITES_DIR/$BACKEND_DOMAIN"; then
        log "${GREEN}✅ Backend SSL certificate is referenced in Nginx configuration${NC}"
      else
        log "${RED}❌ Backend SSL certificate is not referenced in Nginx configuration${NC}"
      fi
    fi
  else
    log "${RED}❌ Backend SSL certificate does not exist${NC}"
    log "   You may need to run: sudo certbot --nginx -d $BACKEND_DOMAIN"
  fi
}

# Function to check file permissions
check_file_permissions() {
  log "${BLUE}=== Checking File Permissions ===${NC}"
  
  # Check if application directories exist
  if [ -d "$APP_DIR" ]; then
    log "${GREEN}✅ Application directory exists: $APP_DIR${NC}"
    
    # Check ownership
    local app_owner=$(stat -c '%U:%G' "$APP_DIR")
    log "   Application directory owner: $app_owner"
    
    if [ "$app_owner" != "ubuntu:ubuntu" ]; then
      log "${YELLOW}⚠️ Application directory is not owned by ubuntu:ubuntu${NC}"
      log "   Fixing ownership..."
      chown -R ubuntu:ubuntu "$APP_DIR"
    fi
    
    # Check permissions
    local app_perms=$(stat -c '%a' "$APP_DIR")
    log "   Application directory permissions: $app_perms"
    
    if [ "$app_perms" != "755" ]; then
      log "${YELLOW}⚠️ Application directory does not have 755 permissions${NC}"
      log "   Fixing permissions..."
      chmod -R 755 "$APP_DIR"
    fi
  else
    log "${RED}❌ Application directory does not exist: $APP_DIR${NC}"
  fi
  
  # Check frontend directory
  if [ -d "$FRONTEND_DIR" ]; then
    log "${GREEN}✅ Frontend directory exists: $FRONTEND_DIR${NC}"
    
    # Check if server.js exists
    if [ -f "$FRONTEND_DIR/server.js" ]; then
      log "${GREEN}✅ Frontend server.js exists${NC}"
      
      # Check ownership
      local server_owner=$(stat -c '%U:%G' "$FRONTEND_DIR/server.js")
      log "   server.js owner: $server_owner"
      
      if [ "$server_owner" != "ubuntu:ubuntu" ]; then
        log "${YELLOW}⚠️ server.js is not owned by ubuntu:ubuntu${NC}"
        log "   Fixing ownership..."
        chown ubuntu:ubuntu "$FRONTEND_DIR/server.js"
      fi
      
      # Check permissions
      local server_perms=$(stat -c '%a' "$FRONTEND_DIR/server.js")
      log "   server.js permissions: $server_perms"
      
      if [ "$server_perms" != "644" ] && [ "$server_perms" != "755" ]; then
        log "${YELLOW}⚠️ server.js does not have correct permissions${NC}"
        log "   Fixing permissions..."
        chmod 755 "$FRONTEND_DIR/server.js"
      fi
    else
      log "${RED}❌ Frontend server.js does not exist${NC}"
    fi
  else
    log "${RED}❌ Frontend directory does not exist: $FRONTEND_DIR${NC}"
  fi
  
  # Check backend directory
  if [ -d "$BACKEND_DIR" ]; then
    log "${GREEN}✅ Backend directory exists: $BACKEND_DIR${NC}"
    
    # Check if .env file exists
    if [ -f "$BACKEND_DIR/.env" ]; then
      log "${GREEN}✅ Backend .env file exists${NC}"
      
      # Check ownership
      local env_owner=$(stat -c '%U:%G' "$BACKEND_DIR/.env")
      log "   .env owner: $env_owner"
      
      if [ "$env_owner" != "ubuntu:ubuntu" ]; then
        log "${YELLOW}⚠️ .env is not owned by ubuntu:ubuntu${NC}"
        log "   Fixing ownership..."
        chown ubuntu:ubuntu "$BACKEND_DIR/.env"
      fi
      
      # Check permissions
      local env_perms=$(stat -c '%a' "$BACKEND_DIR/.env")
      log "   .env permissions: $env_perms"
      
      if [ "$env_perms" != "644" ] && [ "$env_perms" != "600" ]; then
        log "${YELLOW}⚠️ .env does not have correct permissions${NC}"
        log "   Fixing permissions..."
        chmod 600 "$BACKEND_DIR/.env"
      fi
      
      # Check if .env file has content
      local env_size=$(stat -c '%s' "$BACKEND_DIR/.env")
      if [ "$env_size" -eq 0 ]; then
        log "${RED}❌ Backend .env file is empty${NC}"
      else
        log "${GREEN}✅ Backend .env file has content (size: $env_size bytes)${NC}"
        
        # Check for required environment variables
        local env_content=$(cat "$BACKEND_DIR/.env")
        if ! echo "$env_content" | grep -q "APP_KEYS="; then
          log "${RED}❌ Backend .env file is missing APP_KEYS${NC}"
        fi
        
        if ! echo "$env_content" | grep -q "API_TOKEN_SALT="; then
          log "${RED}❌ Backend .env file is missing API_TOKEN_SALT${NC}"
        fi
        
        if ! echo "$env_content" | grep -q "ADMIN_JWT_SECRET="; then
          log "${RED}❌ Backend .env file is missing ADMIN_JWT_SECRET${NC}"
        fi
        
        if ! echo "$env_content" | grep -q "DATABASE_CLIENT="; then
          log "${RED}❌ Backend .env file is missing DATABASE_CLIENT${NC}"
        fi
      fi
    else
      log "${RED}❌ Backend .env file does not exist${NC}"
    fi
  else
    log "${RED}❌ Backend directory does not exist: $BACKEND_DIR${NC}"
  fi
}

# Function to check connectivity
check_connectivity() {
  log "${BLUE}=== Checking Connectivity ===${NC}"
  
  # Check if curl is installed
  if ! command -v curl &> /dev/null; then
    log "${RED}❌ curl is not installed${NC}"
    return 1
  fi
  
  # Check local connectivity to frontend
  log "Checking local connectivity to frontend (port 3000)..."
  local frontend_response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)
  if [ "$frontend_response" = "200" ] || [ "$frontend_response" = "301" ] || [ "$frontend_response" = "302" ]; then
    log "${GREEN}✅ Frontend is accessible locally (HTTP $frontend_response)${NC}"
  else
    log "${RED}❌ Frontend is not accessible locally (HTTP $frontend_response)${NC}"
    log "   Checking frontend logs..."
    sudo -u ubuntu pm2 logs evan-james-frontend --lines 20 >> $LOG_FILE
  fi
  
  # Check local connectivity to backend
  log "Checking local connectivity to backend (port 1337)..."
  local backend_response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:1337)
  if [ "$backend_response" = "200" ] || [ "$backend_response" = "301" ] || [ "$backend_response" = "302" ]; then
    log "${GREEN}✅ Backend is accessible locally (HTTP $backend_response)${NC}"
  else
    log "${RED}❌ Backend is not accessible locally (HTTP $backend_response)${NC}"
    log "   Checking backend logs..."
    sudo -u ubuntu pm2 logs evan-james-backend --lines 20 >> $LOG_FILE
  fi
  
  # Check external connectivity to frontend
  log "Checking external connectivity to frontend..."
  local frontend_ext_response=$(curl -s -o /dev/null -w "%{http_code}" -k https://$FRONTEND_DOMAIN)
  if [ "$frontend_ext_response" = "200" ] || [ "$frontend_ext_response" = "301" ] || [ "$frontend_ext_response" = "302" ]; then
    log "${GREEN}✅ Frontend is accessible externally (HTTP $frontend_ext_response)${NC}"
  else
    log "${RED}❌ Frontend is not accessible externally (HTTP $frontend_ext_response)${NC}"
    log "   Checking Nginx error logs..."
    tail -n 50 /var/log/nginx/error.log >> $LOG_FILE
  fi
  
  # Check external connectivity to backend
  log "Checking external connectivity to backend..."
  local backend_ext_response=$(curl -s -o /dev/null -w "%{http_code}" -k https://$BACKEND_DOMAIN)
  if [ "$backend_ext_response" = "200" ] || [ "$backend_ext_response" = "301" ] || [ "$backend_ext_response" = "302" ]; then
    log "${GREEN}✅ Backend is accessible externally (HTTP $backend_ext_response)${NC}"
  else
    log "${RED}❌ Backend is not accessible externally (HTTP $backend_ext_response)${NC}"
    log "   Checking Nginx error logs..."
    tail -n 50 /var/log/nginx/error.log >> $LOG_FILE
  fi
}

# Function to check logs
check_logs() {
  log "${BLUE}=== Checking Logs ===${NC}"
  
  # Check Nginx error logs
  log "Checking Nginx error logs..."
  local nginx_errors=$(tail -n 100 /var/log/nginx/error.log)
  echo "Nginx error logs:" >> $LOG_FILE
  echo "$nginx_errors" >> $LOG_FILE
  
  # Look for common errors in Nginx logs
  if echo "$nginx_errors" | grep -q "permission denied"; then
    log "${RED}❌ Nginx error logs contain permission denied errors${NC}"
    log "   This may indicate file permission issues"
  fi
  
  if echo "$nginx_errors" | grep -q "no such file or directory"; then
    log "${RED}❌ Nginx error logs contain 'no such file or directory' errors${NC}"
    log "   This may indicate missing files or incorrect paths"
  fi
  
  if echo "$nginx_errors" | grep -q "connect() failed"; then
    log "${RED}❌ Nginx error logs contain connection failures${NC}"
    log "   This may indicate that the backend service is not running"
  fi
  
  # Check PM2 logs
  log "Checking PM2 logs..."
  
  # Frontend logs
  local frontend_logs=$(sudo -u ubuntu pm2 logs evan-james-frontend --lines 50 --nostream)
  echo "Frontend PM2 logs:" >> $LOG_FILE
  echo "$frontend_logs" >> $LOG_FILE
  
  # Look for common errors in frontend logs
  if echo "$frontend_logs" | grep -q "Error:"; then
    log "${RED}❌ Frontend logs contain errors${NC}"
    local frontend_errors=$(echo "$frontend_logs" | grep -A 3 "Error:")
    echo "Frontend errors:" >> $LOG_FILE
    echo "$frontend_errors" >> $LOG_FILE
  fi
  
  # Backend logs
  local backend_logs=$(sudo -u ubuntu pm2 logs evan-james-backend --lines 50 --nostream)
  echo "Backend PM2 logs:" >> $LOG_FILE
  echo "$backend_logs" >> $LOG_FILE
  
  # Look for common errors in backend logs
  if echo "$backend_logs" | grep -q "Error:"; then
    log "${RED}❌ Backend logs contain errors${NC}"
    local backend_errors=$(echo "$backend_logs" | grep -A 3 "Error:")
    echo "Backend errors:" >> $LOG_FILE
    echo "$backend_errors" >> $LOG_FILE
  fi
}

# Function to fix common issues
fix_common_issues() {
  log "${BLUE}=== Fixing Common Issues ===${NC}"
  
  # Restart PM2 processes
  log "Restarting PM2 processes..."
  sudo -u ubuntu pm2 restart all
  
  # Restart Nginx
  log "Restarting Nginx..."
  systemctl restart nginx
  
  # Check if the fixes resolved the issues
  log "Checking if fixes resolved the issues..."
  
  # Check frontend connectivity
  local frontend_response=$(curl -s -o /dev/null -w "%{http_code}" -k https://$FRONTEND_DOMAIN)
  if [ "$frontend_response" = "200" ] || [ "$frontend_response" = "301" ] || [ "$frontend_response" = "302" ]; then
    log "${GREEN}✅ Frontend is now accessible (HTTP $frontend_response)${NC}"
  else
    log "${RED}❌ Frontend is still not accessible (HTTP $frontend_response)${NC}"
  fi
  
  # Check backend connectivity
  local backend_response=$(curl -s -o /dev/null -w "%{http_code}" -k https://$BACKEND_DOMAIN)
  if [ "$backend_response" = "200" ] || [ "$backend_response" = "301" ] || [ "$backend_response" = "302" ]; then
    log "${GREEN}✅ Backend is now accessible (HTTP $backend_response)${NC}"
  else
    log "${RED}❌ Backend is still not accessible (HTTP $backend_response)${NC}"
  fi
}

# Main function
main() {
  log "${BLUE}=== Advanced Troubleshooting for Evan James Website ===${NC}"
  log "Log file: $LOG_FILE"
  
  # Check if running as root
  check_root
  
  # Run all checks
  check_pm2_processes
  check_nginx_configuration
  check_ssl_certificates
  check_file_permissions
  check_connectivity
  check_logs
  
  # Fix common issues
  fix_common_issues
  
  log "${BLUE}=== Troubleshooting Complete ===${NC}"
  log "For detailed logs, check: $LOG_FILE"
  
  # Provide next steps
  log "${YELLOW}=== Next Steps ===${NC}"
  log "1. Check the detailed logs for specific errors: $LOG_FILE"
  log "2. If the frontend is still not accessible, try rebuilding it:"
  log "   cd $FRONTEND_DIR && sudo -u ubuntu npm run build"
  log "3. If the backend is still not accessible, try rebuilding it:"
  log "   cd $BACKEND_DIR && sudo -u ubuntu npm run build"
  log "4. If SSL certificate issues were detected, run certbot to obtain new certificates:"
  log "   sudo certbot --nginx -d $FRONTEND_DOMAIN -d www.$FRONTEND_DOMAIN"
  log "   sudo certbot --nginx -d $BACKEND_DOMAIN"
  log "5. If file permission issues were detected, ensure all files have the correct ownership:"
  log "   sudo chown -R ubuntu:ubuntu $APP_DIR"
  log "6. If Nginx configuration issues were detected, manually check the configurations:"
  log "   sudo nano $NGINX_SITES_DIR/$FRONTEND_DOMAIN"
  log "   sudo nano $NGINX_SITES_DIR/$BACKEND_DOMAIN"
}

# Run the main function
main
