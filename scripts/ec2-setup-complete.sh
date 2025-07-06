#!/bin/bash

# =========================================================
# Evan James Website - Complete EC2 Setup Script
# =========================================================
# This script performs a complete setup of the Evan James website on an EC2 server:
# - Sets up the backend with proper environment variables
# - Installs all dependencies
# - Builds the Strapi backend
# - Seeds the database with content types and sample data
# - Sets up the frontend with proper configuration
# - Configures Nginx for both services
# - Sets up SSL certificates (optional)
# - Starts both services with PM2
#
# Usage: bash ec2-setup-complete.sh [--with-ssl]
# =========================================================

# Configuration
APP_DIR="/home/ubuntu/evan-james"
BACKEND_DIR="$APP_DIR/backend"
FRONTEND_DIR="$APP_DIR/frontend"
LOG_FILE="/tmp/evan-james-setup-$(date +%Y%m%d%H%M%S).log"
SETUP_SSL=false

# Check for SSL flag
if [[ "$1" == "--with-ssl" ]]; then
  SETUP_SSL=true
fi

# Function to log messages
log() {
  echo "$(date +"%Y-%m-%d %H:%M:%S") - $1" | tee -a $LOG_FILE
}

# Function to generate a random key
generate_key() {
  openssl rand -base64 16
}

# Function to check if a command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Function to handle errors
handle_error() {
  log "❌ ERROR: $1"
  log "Check the log file for details: $LOG_FILE"
  exit 1
}

# Start setup
log "=== Starting Evan James Website Setup ==="
log "Setup directory: $APP_DIR"
log "Setup SSL: $SETUP_SSL"

# Create main directory if it doesn't exist
if [ ! -d "$APP_DIR" ]; then
  log "Creating application directory..."
  mkdir -p "$APP_DIR" || handle_error "Failed to create application directory"
fi

# Check if PM2 is installed
if ! command_exists pm2; then
  log "Installing PM2 globally..."
  npm install -g pm2 || handle_error "Failed to install PM2"
fi

# =========================================================
# BACKEND SETUP
# =========================================================
log "=== Setting up Backend ==="

# Create backend directory if it doesn't exist
if [ ! -d "$BACKEND_DIR" ]; then
  log "Creating backend directory..."
  mkdir -p "$BACKEND_DIR" || handle_error "Failed to create backend directory"
fi

# Navigate to backend directory
cd "$BACKEND_DIR" || handle_error "Failed to navigate to backend directory"

# Check if we need to copy files from the repository
if [ ! -f "$BACKEND_DIR/package.json" ]; then
  log "Copying backend files from repository..."
  cp -r /home/ubuntu/evan-james-project/backend/* "$BACKEND_DIR/" || handle_error "Failed to copy backend files"
fi

# Install backend dependencies
log "Installing backend dependencies..."
npm install || handle_error "Failed to install backend dependencies"

# Create .env file with secure keys
log "Creating backend .env file with secure keys..."
if [ -f "$BACKEND_DIR/.env.template" ]; then
  cp "$BACKEND_DIR/.env.template" "$BACKEND_DIR/.env" || handle_error "Failed to create .env from template"
else
  log "Creating basic .env file..."
  cat > "$BACKEND_DIR/.env" << EOL
# Strapi Backend Environment Configuration

# Server Configuration
HOST=0.0.0.0
PORT=1337
APP_KEYS=placeholder
API_TOKEN_SALT=placeholder
ADMIN_JWT_SECRET=placeholder
JWT_SECRET=placeholder

# Database Configuration
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db

# Security Configuration
CORS_ORIGIN=https://evanjamesofficial.com,http://localhost:3000
CORS_CREDENTIALS=true

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=100
EOL
fi

# Generate secure keys
APP_KEY1=$(generate_key)
APP_KEY2=$(generate_key)
APP_KEY3=$(generate_key)
APP_KEY4=$(generate_key)
API_TOKEN_SALT=$(generate_key)
ADMIN_JWT_SECRET=$(generate_key)
JWT_SECRET=$(generate_key)

# Update .env file with secure keys
sed -i "s/APP_KEYS=.*$/APP_KEYS=$APP_KEY1,$APP_KEY2,$APP_KEY3,$APP_KEY4/" .env
sed -i "s/API_TOKEN_SALT=.*$/API_TOKEN_SALT=$API_TOKEN_SALT/" .env
sed -i "s/ADMIN_JWT_SECRET=.*$/ADMIN_JWT_SECRET=$ADMIN_JWT_SECRET/" .env
sed -i "s/JWT_SECRET=.*$/JWT_SECRET=$JWT_SECRET/" .env

log "✅ Backend .env file created with secure keys"

# Build Strapi
log "Building Strapi backend..."
npm run build || handle_error "Failed to build Strapi backend"

# Seed initial data
log "Seeding initial data (content types and sample data)..."
node ./scripts/seed-initial-data.js || log "⚠️ Warning: Failed to seed initial data. You may need to run this manually later."

# Start Strapi with PM2
log "Starting Strapi backend with PM2..."
pm2 stop evan-james-backend 2>/dev/null || true
pm2 delete evan-james-backend 2>/dev/null || true
pm2 start npm --name "evan-james-backend" -- run start || handle_error "Failed to start Strapi backend with PM2"
pm2 save

log "✅ Backend setup completed"

# =========================================================
# FRONTEND SETUP
# =========================================================
log "=== Setting up Frontend ==="

# Create frontend directory if it doesn't exist
if [ ! -d "$FRONTEND_DIR" ]; then
  log "Creating frontend directory..."
  mkdir -p "$FRONTEND_DIR" || handle_error "Failed to create frontend directory"
fi

# Navigate to frontend directory
cd "$FRONTEND_DIR" || handle_error "Failed to navigate to frontend directory"

# Check if we need to copy files from the repository
if [ ! -f "$FRONTEND_DIR/package.json" ]; then
  log "Copying frontend files from repository..."
  cp -r /home/ubuntu/evan-james-project/frontend/* "$FRONTEND_DIR/" || handle_error "Failed to copy frontend files"
fi

# Install frontend dependencies
log "Installing frontend dependencies..."
npm install || handle_error "Failed to install frontend dependencies"

# Create .env file
log "Creating frontend .env file..."
cat > "$FRONTEND_DIR/.env" << EOL
# Frontend Environment Configuration

# API Configuration
NEXT_PUBLIC_API_URL=https://api.evanjamesofficial.com

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://evanjamesofficial.com
EOL

log "✅ Frontend .env file created"

# Build Next.js frontend
log "Building Next.js frontend..."
npm run build || handle_error "Failed to build Next.js frontend"

# Start frontend with PM2
log "Starting frontend with PM2..."
pm2 stop evan-james-frontend 2>/dev/null || true
pm2 delete evan-james-frontend 2>/dev/null || true
pm2 start npm --name "evan-james-frontend" -- run start || handle_error "Failed to start frontend with PM2"
pm2 save

log "✅ Frontend setup completed"

# =========================================================
# NGINX CONFIGURATION
# =========================================================
log "=== Setting up Nginx Configuration ==="

# Check if Nginx is installed
if ! command_exists nginx; then
  log "Installing Nginx..."
  sudo apt update
  sudo apt install -y nginx || handle_error "Failed to install Nginx"
fi

# Create Nginx configuration for frontend
log "Creating Nginx configuration for frontend..."
sudo bash -c "cat > /etc/nginx/sites-available/evanjamesofficial.com << EOL
server {
    listen 80;
    server_name evanjamesofficial.com www.evanjamesofficial.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \\\$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \\\$host;
        proxy_cache_bypass \\\$http_upgrade;
        proxy_set_header X-Real-IP \\\$remote_addr;
        proxy_set_header X-Forwarded-For \\\$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \\\$scheme;
    }
    
    # Cache static assets
    location ~* \\.(jpg|jpeg|png|gif|ico|css|js|woff|woff2|ttf|svg)\$ {
        expires 1y;
        add_header Cache-Control 'public, immutable';
        proxy_pass http://localhost:3000;
    }
    
    # Security headers
    add_header X-Frame-Options 'SAMEORIGIN';
    add_header X-XSS-Protection '1; mode=block';
    add_header X-Content-Type-Options 'nosniff';
    add_header Referrer-Policy 'strict-origin-when-cross-origin';
}
EOL" || handle_error "Failed to create frontend Nginx configuration"

# Create Nginx configuration for backend
log "Creating Nginx configuration for backend..."
sudo bash -c "cat > /etc/nginx/sites-available/api.evanjamesofficial.com << EOL
server {
    listen 80;
    server_name api.evanjamesofficial.com;
    
    location / {
        proxy_pass http://localhost:1337;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \\\$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \\\$host;
        proxy_cache_bypass \\\$http_upgrade;
        proxy_set_header X-Real-IP \\\$remote_addr;
        proxy_set_header X-Forwarded-For \\\$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \\\$scheme;
    }
    
    # Cache static assets
    location ~* \\.(jpg|jpeg|png|gif|ico|css|js|woff|woff2|ttf|svg)\$ {
        expires 1y;
        add_header Cache-Control 'public, immutable';
        proxy_pass http://localhost:1337;
    }
    
    # Increase max body size for uploads
    client_max_body_size 100M;
    
    # Security headers
    add_header X-Frame-Options 'SAMEORIGIN';
    add_header X-XSS-Protection '1; mode=block';
    add_header X-Content-Type-Options 'nosniff';
    add_header Referrer-Policy 'strict-origin-when-cross-origin';
}
EOL" || handle_error "Failed to create backend Nginx configuration"

# Enable sites
log "Enabling Nginx sites..."
sudo ln -sf /etc/nginx/sites-available/evanjamesofficial.com /etc/nginx/sites-enabled/ || handle_error "Failed to enable frontend Nginx site"
sudo ln -sf /etc/nginx/sites-available/api.evanjamesofficial.com /etc/nginx/sites-enabled/ || handle_error "Failed to enable backend Nginx site"

# Test Nginx configuration
log "Testing Nginx configuration..."
sudo nginx -t || handle_error "Nginx configuration test failed"

# Restart Nginx
log "Restarting Nginx..."
sudo systemctl restart nginx || handle_error "Failed to restart Nginx"

log "✅ Nginx configuration completed"

# =========================================================
# SSL SETUP (OPTIONAL)
# =========================================================
if [ "$SETUP_SSL" = true ]; then
  log "=== Setting up SSL with Let's Encrypt ==="
  
  # Check if certbot is installed
  if ! command_exists certbot; then
    log "Installing Certbot..."
    sudo apt update
    sudo apt install -y certbot python3-certbot-nginx || handle_error "Failed to install Certbot"
  fi
  
  # Obtain SSL certificates for frontend
  log "Obtaining SSL certificates for frontend..."
  sudo certbot --nginx -d evanjamesofficial.com -d www.evanjamesofficial.com --non-interactive --agree-tos --email admin@evanjamesofficial.com || log "⚠️ Warning: Failed to obtain SSL certificates for frontend"
  
  # Obtain SSL certificates for backend
  log "Obtaining SSL certificates for backend..."
  sudo certbot --nginx -d api.evanjamesofficial.com --non-interactive --agree-tos --email admin@evanjamesofficial.com || log "⚠️ Warning: Failed to obtain SSL certificates for backend"
  
  log "✅ SSL setup completed"
fi

# =========================================================
# FINAL STEPS
# =========================================================
log "=== Final Steps ==="

# Save PM2 process list
log "Saving PM2 process list..."
pm2 save || log "⚠️ Warning: Failed to save PM2 process list"

# Set up PM2 to start on boot
log "Setting up PM2 to start on boot..."
pm2 startup || log "⚠️ Warning: Failed to set up PM2 startup script"

# Display status
log "Displaying PM2 status..."
pm2 status

# Display Nginx status
log "Displaying Nginx status..."
sudo systemctl status nginx --no-pager

log "=== Setup Completed Successfully! ==="
log "Frontend: https://evanjamesofficial.com"
log "Backend API: https://api.evanjamesofficial.com"
log "Backend Admin: https://api.evanjamesofficial.com/admin"

log "You can check the setup log at: $LOG_FILE"
log "If you encounter any issues, check the following logs:"
log "- PM2 logs: pm2 logs"
log "- Nginx error logs: sudo tail -f /var/log/nginx/error.log"

echo ""
echo "==================================================="
echo "🎉 Evan James Website Setup Completed Successfully!"
echo "==================================================="
echo "Frontend: https://evanjamesofficial.com"
echo "Backend API: https://api.evanjamesofficial.com"
echo "Backend Admin: https://api.evanjamesofficial.com/admin"
echo ""
echo "Run the following command to make this script executable:"
echo "chmod +x $0"
echo ""
echo "To run this script with SSL setup:"
echo "$0 --with-ssl"
echo "==================================================="
