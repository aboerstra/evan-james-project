#!/bin/bash

# Script to set up the backend environment file with secure keys
# Run this script on your EC2 server in the evan-james directory

# Configuration
APP_DIR="/home/ubuntu/evan-james"
BACKEND_DIR="$APP_DIR/backend"
ENV_FILE="$BACKEND_DIR/.env"
ENV_TEMPLATE="$BACKEND_DIR/.env.template"
LOG_FILE="/tmp/backend-env-setup-$(date +%Y%m%d%H%M%S).log"

# Function to log messages
log() {
  echo "$(date +"%Y-%m-%d %H:%M:%S") - $1" | tee -a $LOG_FILE
}

# Function to generate a random key
generate_key() {
  node -e "console.log(require('crypto').randomBytes(16).toString('base64'))"
}

log "=== Setting up Backend Environment File ==="

# Check if backend directory exists
if [ ! -d "$BACKEND_DIR" ]; then
  log "❌ Backend directory not found at $BACKEND_DIR"
  log "Please make sure you're running this script on the EC2 server with the correct directory structure"
  exit 1
fi

# Check if .env file already exists
if [ -f "$ENV_FILE" ]; then
  log "⚠️ Backend .env file already exists at $ENV_FILE"
  read -p "Do you want to overwrite it? (y/n): " overwrite
  if [ "$overwrite" != "y" ]; then
    log "Operation cancelled. Existing .env file will not be modified."
    exit 0
  fi
  log "Creating backup of existing .env file..."
  cp "$ENV_FILE" "$ENV_FILE.backup-$(date +%Y%m%d%H%M%S)"
fi

# Check if .env.template exists locally
if [ -f "$ENV_TEMPLATE" ]; then
  log "✅ Found .env.template file"
else
  log "⚠️ No .env.template file found, creating a basic template..."
  
  # Create a basic template
  cat > "$ENV_TEMPLATE" << EOL
# Strapi Backend Environment Configuration

# Server Configuration
HOST=0.0.0.0
PORT=1337
APP_KEYS=key1,key2,key3,key4
API_TOKEN_SALT=tokensalt
ADMIN_JWT_SECRET=jwtsecret
JWT_SECRET=jwtsecret

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
  
  log "✅ Basic .env.template created"
fi

# Create new .env file with generated keys
log "Generating secure keys and creating .env file..."

# Generate random keys
APP_KEY1=$(generate_key)
APP_KEY2=$(generate_key)
APP_KEY3=$(generate_key)
APP_KEY4=$(generate_key)
API_TOKEN_SALT=$(generate_key)
ADMIN_JWT_SECRET=$(generate_key)
JWT_SECRET=$(generate_key)

# Create .env file from template, replacing placeholder keys with generated ones
cat "$ENV_TEMPLATE" | \
  sed "s/APP_KEYS=.*$/APP_KEYS=$APP_KEY1,$APP_KEY2,$APP_KEY3,$APP_KEY4/" | \
  sed "s/API_TOKEN_SALT=.*$/API_TOKEN_SALT=$API_TOKEN_SALT/" | \
  sed "s/ADMIN_JWT_SECRET=.*$/ADMIN_JWT_SECRET=$ADMIN_JWT_SECRET/" | \
  sed "s/JWT_SECRET=.*$/JWT_SECRET=$JWT_SECRET/" > "$ENV_FILE"

log "✅ Backend .env file created with secure keys at $ENV_FILE"

# Check if PM2 is running the backend
if command -v pm2 >/dev/null 2>&1; then
  if pm2 list | grep -q "evan-james-backend"; then
    log "Restarting backend service to apply new environment variables..."
    pm2 restart evan-james-backend
    log "✅ Backend service restarted"
  else
    log "Starting backend service..."
    cd "$BACKEND_DIR"
    pm2 start npm --name "evan-james-backend" -- run develop
    log "✅ Backend service started"
  fi
else
  log "⚠️ PM2 not found. Please restart the backend service manually to apply the new environment variables."
fi

log "=== Backend Environment Setup Complete ==="
log "You should now be able to access the backend API at https://api.evanjamesofficial.com"
log "If you still encounter issues, check the backend logs with: pm2 logs evan-james-backend"
