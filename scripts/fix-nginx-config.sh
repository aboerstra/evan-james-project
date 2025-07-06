#!/bin/bash

# Script to fix Nginx configuration for Evan James website
# Run this script with sudo on your EC2 server

# Configuration
NGINX_SITES_DIR="/etc/nginx/sites-available"
NGINX_ENABLED_DIR="/etc/nginx/sites-enabled"
APP_DIR="/home/ubuntu/evan-james"
FRONTEND_DIR="$APP_DIR/frontend"
BACKEND_DIR="$APP_DIR/backend"
LOG_FILE="/tmp/nginx-fix-$(date +%Y%m%d%H%M%S).log"

# Function to log messages
log() {
  echo "$(date +"%Y-%m-%d %H:%M:%S") - $1" | tee -a $LOG_FILE
}

# Check if running as root
if [ "$(id -u)" -ne 0 ]; then
  log "❌ This script must be run as root (with sudo)"
  exit 1
fi

log "=== Fixing Nginx Configuration for Evan James Website ==="

# Create backup directory
BACKUP_DIR="/tmp/nginx-backup-$(date +%Y%m%d%H%M%S)"
mkdir -p "$BACKUP_DIR"
log "Created backup directory: $BACKUP_DIR"

# Backup existing Nginx configurations
log "Backing up existing Nginx configurations..."
cp -r "$NGINX_SITES_DIR"/* "$BACKUP_DIR/"
log "✅ Nginx configurations backed up to $BACKUP_DIR"

# Create frontend configuration
log "Creating frontend Nginx configuration..."
cat > "$NGINX_SITES_DIR/evanjamesofficial.com" << EOL
server {
    listen 80;
    server_name evanjamesofficial.com www.evanjamesofficial.com;

    # Redirect HTTP to HTTPS
    location / {
        return 301 https://\$host\$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name evanjamesofficial.com www.evanjamesofficial.com;

    # SSL configuration
    ssl_certificate /etc/letsencrypt/live/evanjamesofficial.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/evanjamesofficial.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Root directory for frontend
    root /home/ubuntu/evan-james/frontend;

    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff|woff2|ttf|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Next.js configuration
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Content-Type-Options "nosniff";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
}
EOL
log "✅ Frontend Nginx configuration created"

# Create backend configuration
log "Creating backend Nginx configuration..."
cat > "$NGINX_SITES_DIR/api.evanjamesofficial.com" << EOL
server {
    listen 80;
    server_name api.evanjamesofficial.com;

    # Redirect HTTP to HTTPS
    location / {
        return 301 https://\$host\$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name api.evanjamesofficial.com;

    # SSL configuration
    ssl_certificate /etc/letsencrypt/live/api.evanjamesofficial.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.evanjamesofficial.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Proxy to Strapi backend
    location / {
        proxy_pass http://127.0.0.1:1337;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff|woff2|ttf|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Increase max body size for uploads
    client_max_body_size 100M;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Content-Type-Options "nosniff";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
}
EOL
log "✅ Backend Nginx configuration created"

# Check if SSL certificates exist
if [ ! -d "/etc/letsencrypt/live/evanjamesofficial.com" ] || [ ! -d "/etc/letsencrypt/live/api.evanjamesofficial.com" ]; then
  log "⚠️ SSL certificates may not exist. You may need to run certbot to obtain SSL certificates."
  log "Run: sudo certbot --nginx -d evanjamesofficial.com -d www.evanjamesofficial.com"
  log "Run: sudo certbot --nginx -d api.evanjamesofficial.com"
fi

# Enable the sites
log "Enabling sites in Nginx..."
ln -sf "$NGINX_SITES_DIR/evanjamesofficial.com" "$NGINX_ENABLED_DIR/"
ln -sf "$NGINX_SITES_DIR/api.evanjamesofficial.com" "$NGINX_ENABLED_DIR/"

# Test Nginx configuration
log "Testing Nginx configuration..."
nginx_test=$(nginx -t 2>&1)
if echo "$nginx_test" | grep -q "successful"; then
  log "✅ Nginx configuration test passed"
  
  # Restart Nginx
  log "Restarting Nginx..."
  systemctl restart nginx
  
  if systemctl is-active --quiet nginx; then
    log "✅ Nginx restarted successfully"
  else
    log "❌ Failed to restart Nginx"
    log "Restoring backup configurations..."
    cp -r "$BACKUP_DIR"/* "$NGINX_SITES_DIR/"
    systemctl restart nginx
    log "Backup configurations restored"
  fi
else
  log "❌ Nginx configuration test failed:"
  echo "$nginx_test" | tee -a $LOG_FILE
  log "Restoring backup configurations..."
  cp -r "$BACKUP_DIR"/* "$NGINX_SITES_DIR/"
  systemctl restart nginx
  log "Backup configurations restored"
fi

log "=== Nginx Configuration Fix Complete ==="
log "If you still encounter issues, check the Nginx error logs:"
log "sudo tail -n 100 /var/log/nginx/error.log"
