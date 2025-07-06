#!/bin/bash

# Resume deployment script for Evan James website
# This script helps recover from interrupted deployments
# Run this script on the EC2 server after a reboot or interruption

# Configuration
APP_DIR="/home/ubuntu/evan-james"
BACKUP_ENABLED=true
MEMORY_LIMIT=512  # Memory limit in MB for Node.js

echo "=== Resuming Evan James Website Deployment ==="
echo "$(date)"

# Check if the application directory exists
if [ ! -d "$APP_DIR" ]; then
  echo "ERROR: Application directory $APP_DIR does not exist."
  echo "Please run the simplified-deploy.sh script first to set up the initial structure."
  exit 1
fi

cd "$APP_DIR"

# Check which parts of the deployment need to be resumed
FRONTEND_COMPLETE=false
BACKEND_COMPLETE=false

# Check if frontend is already set up
if [ -d "frontend/node_modules" ] && [ -d "frontend/.next" ]; then
  echo "Frontend dependencies and build appear to be complete."
  FRONTEND_COMPLETE=true
else
  echo "Frontend setup needs to be completed or resumed."
fi

# Check if backend is already set up
if [ -d "backend/node_modules" ]; then
  echo "Backend dependencies appear to be installed."
  BACKEND_COMPLETE=true
else
  echo "Backend dependencies need to be installed."
fi

# Check PM2 status
PM2_INSTALLED=false
if command -v pm2 &> /dev/null; then
  PM2_INSTALLED=true
  echo "PM2 is installed. Checking service status..."
  
  # Check if services are running
  FRONTEND_RUNNING=false
  BACKEND_RUNNING=false
  
  if pm2 list | grep -q "evan-james-frontend"; then
    echo "Frontend service is running in PM2."
    FRONTEND_RUNNING=true
  else
    echo "Frontend service is not running in PM2."
  fi
  
  if pm2 list | grep -q "evan-james-backend"; then
    echo "Backend service is running in PM2."
    BACKEND_RUNNING=true
  else
    echo "Backend service is not running in PM2."
  fi
else
  echo "PM2 is not installed. Will install it during the process."
fi

# Resume frontend setup if needed
if [ "$FRONTEND_COMPLETE" = false ]; then
  echo "Resuming frontend setup..."
  cd "$APP_DIR/frontend"
  
  # Check for environment file
  if [ ! -f .env ]; then
    if [ -f "$APP_DIR/frontend_env_backup" ]; then
      echo "Restoring frontend environment variables from backup..."
      cp "$APP_DIR/frontend_env_backup" "$APP_DIR/frontend/.env"
    else
      echo "Creating new frontend .env file..."
      echo "NEXT_PUBLIC_API_URL=https://api.evanjamesofficial.com" > .env
      echo "WARNING: Created default .env file. You may need to customize it with your specific variables."
    fi
  fi
  
  # Clean up potentially corrupted node_modules
  if [ -d "node_modules" ]; then
    echo "Removing potentially incomplete node_modules directory..."
    rm -rf node_modules
  fi
  
  echo "Installing frontend dependencies with memory limit..."
  NODE_OPTIONS="--max-old-space-size=$MEMORY_LIMIT" npm install
  
  echo "Building frontend..."
  NODE_OPTIONS="--max-old-space-size=$MEMORY_LIMIT" npm run build
  
  cd "$APP_DIR"
fi

# Resume backend setup if needed
if [ "$BACKEND_COMPLETE" = false ]; then
  echo "Resuming backend setup..."
  cd "$APP_DIR/backend"
  
  # Check for environment file
  if [ ! -f .env ]; then
    if [ -f "$APP_DIR/backend_env_backup" ]; then
      echo "Restoring backend environment variables from backup..."
      cp "$APP_DIR/backend_env_backup" "$APP_DIR/backend/.env"
    else
      echo "Note: Backend .env file needs configuration"
      echo "WARNING: No existing .env file found. Please manually configure the backend .env file."
    fi
  fi
  
  # Clean up potentially corrupted node_modules
  if [ -d "node_modules" ]; then
    echo "Removing potentially incomplete node_modules directory..."
    rm -rf node_modules
  fi
  
  echo "Installing backend dependencies with memory limit..."
  NODE_OPTIONS="--max-old-space-size=$MEMORY_LIMIT" npm install
  
  cd "$APP_DIR"
fi

# Install PM2 if needed
if [ "$PM2_INSTALLED" = false ]; then
  echo "Installing PM2..."
  npm install -g pm2
fi

# Start or restart frontend service
if [ "$FRONTEND_RUNNING" = false ]; then
  echo "Setting up frontend service in PM2..."
  cd "$APP_DIR/frontend"
  pm2 stop evan-james-frontend 2>/dev/null || true
  pm2 delete evan-james-frontend 2>/dev/null || true
  pm2 start npm --name "evan-james-frontend" -- run start
  pm2 save
  cd "$APP_DIR"
fi

# Start or restart backend service
if [ "$BACKEND_RUNNING" = false ]; then
  echo "Setting up backend service in PM2..."
  cd "$APP_DIR/backend"
  pm2 stop evan-james-backend 2>/dev/null || true
  pm2 delete evan-james-backend 2>/dev/null || true
  pm2 start npm --name "evan-james-backend" -- run develop
  pm2 save
  cd "$APP_DIR"
fi

# Verify deployment
echo "Verifying deployment..."
echo "PM2 Status:"
pm2 status

echo "=== Deployment recovery completed! ==="
echo "Frontend: https://evanjamesofficial.com"
echo "Backend: https://api.evanjamesofficial.com"
echo "$(date)"

echo ""
echo "Next steps:"
echo "1. Verify that both services are running in PM2"
echo "2. Check that the frontend and backend are accessible"
echo "3. If you encounter any issues, check the logs with 'pm2 logs'"
echo "4. For memory issues, consider increasing the swap space or upgrading the EC2 instance"
