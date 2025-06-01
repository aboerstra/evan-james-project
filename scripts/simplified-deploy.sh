#!/bin/bash

# Simplified deployment script for Evan James website
# This script uses a direct Git workflow for easier maintenance
# It should be run ON the EC2 server

# Configuration
APP_DIR="/home/ubuntu/evan-james"
GITHUB_REPO="https://github.com/aboerstra/evan-james-project"
GITHUB_BRANCH="main"
BACKUP_ENABLED=true
GITHUB_ZIP_URL="https://github.com/aboerstra/evan-james-project/archive/refs/heads/main.zip"
USE_ZIP_DOWNLOAD=true  # Set to true to use zip download instead of git clone

echo "=== Starting Evan James Website Deployment ==="
echo "$(date)"

# Create main directory if it doesn't exist
if [ ! -d "$APP_DIR" ]; then
  echo "Creating application directory..."
  mkdir -p "$APP_DIR"
  cd "$APP_DIR"
  
  # Initialize git repository
  echo "Initializing Git repository..."
  git init
  git remote add origin $GITHUB_REPO
  
  # Create initial structure
  mkdir -p frontend backend
else
  cd "$APP_DIR"
fi

# Backup current version if enabled
if [ "$BACKUP_ENABLED" = true ]; then
  echo "Creating backup of current version..."
  TIMESTAMP=$(date +%Y%m%d_%H%M%S)
  
  # Only backup if the directories exist and contain files
  if [ -d "frontend" ] && [ "$(ls -A frontend)" ]; then
    echo "Backing up frontend..."
    cp -r frontend "frontend_backup_$TIMESTAMP"
    
    # Create special backup of environment file
    if [ -f "frontend/.env" ]; then
      echo "Preserving frontend environment variables..."
      cp frontend/.env frontend_env_backup
    fi
  fi
  
  if [ -d "backend" ] && [ "$(ls -A backend)" ]; then
    echo "Backing up backend..."
    cp -r backend "backend_backup_$TIMESTAMP"
    
    # Create special backup of environment file
    if [ -f "backend/.env" ]; then
      echo "Preserving backend environment variables..."
      cp backend/.env backend_env_backup
    fi
  fi
fi

# Fetch latest code
echo "Fetching latest code from GitHub..."

# Using a temporary directory approach to avoid conflicts
TEMP_DIR=$(mktemp -d)

if [ "$USE_ZIP_DOWNLOAD" = true ]; then
  # Direct ZIP download approach (more reliable without authentication)
  echo "Using direct ZIP download from GitHub..."
  TEMP_ZIP="$TEMP_DIR.zip"
  
  echo "Downloading from: $GITHUB_ZIP_URL"
  curl -L "$GITHUB_ZIP_URL" -o "$TEMP_ZIP" --fail --connect-timeout 30
  
  if [ $? -eq 0 ]; then
    echo "Downloaded zip file successfully, extracting..."
    unzip -q "$TEMP_ZIP" -d "$TEMP_DIR"
    
    # Handle GitHub's directory structure in ZIP files
    # The ZIP contains a directory named 'repository-branch'
    ZIP_ROOT_DIR=$(find "$TEMP_DIR" -mindepth 1 -maxdepth 1 -type d | head -n 1)
    if [ -n "$ZIP_ROOT_DIR" ]; then
      echo "Moving files from zip subdirectory: $ZIP_ROOT_DIR"
      # List contents for debugging
      echo "Contents of ZIP root directory:"
      ls -la "$ZIP_ROOT_DIR"
      
      # Move files preserving directories and handle failures gracefully
      cp -r "$ZIP_ROOT_DIR"/* "$TEMP_DIR"/ 2>/dev/null || true
      rm -rf "$ZIP_ROOT_DIR"
    else
      echo "Warning: Could not find expected directory structure in ZIP file"
      echo "Contents of temp directory:"
      ls -la "$TEMP_DIR"
    fi
    
    # Remove the zip file to save space
    rm "$TEMP_ZIP"
  else
    echo "Failed to download repository. Please check URL and network connection."
    echo "ZIP URL used: $GITHUB_ZIP_URL"
    echo "Make sure the repository is public or authentication is properly set up."
    exit 1
  fi
else
  # Git clone approach
  echo "Cloning from $GITHUB_REPO (branch: $GITHUB_BRANCH)"
  git clone --depth 1 -b $GITHUB_BRANCH $GITHUB_REPO $TEMP_DIR || {
    echo "ERROR: Failed to clone repository. Is it public? If not, you may need to set up authentication."
    echo "Trying to download directly as a zip file instead..."
    
    # Alternative approach - download as zip file
    TEMP_ZIP="$TEMP_DIR.zip"
    curl -L "$GITHUB_REPO/archive/$GITHUB_BRANCH.zip" -o "$TEMP_ZIP"
    
    if [ $? -eq 0 ]; then
      echo "Downloaded zip file successfully, extracting..."
      unzip -q "$TEMP_ZIP" -d "$TEMP_DIR"
      mv "$TEMP_DIR"/*/* "$TEMP_DIR"/ || true  # Handle nested directories
      rm "$TEMP_ZIP"
    else
      echo "Failed to download repository. Please check repository URL and access permissions."
      exit 1
    fi
  }
fi

# Check directory structure and copy files
echo "Analyzing repository structure..."

# First check for evan-james-project directory
if [ -d "$TEMP_DIR/evan-james-project" ]; then
  # Copy from nested project directory
  echo "Found nested project directory structure, copying files..."
  # Use rsync with exclude option to prevent overwriting .env files
  rsync -av --exclude='.env' "$TEMP_DIR/evan-james-project/frontend/" "$APP_DIR/frontend/" || {
    echo "Error copying frontend files from nested directory"
    ls -la "$TEMP_DIR/evan-james-project"
  }
  rsync -av --exclude='.env' "$TEMP_DIR/evan-james-project/backend/" "$APP_DIR/backend/" || {
    echo "Error copying backend files from nested directory"
  }
# Next check for direct frontend/backend directories
elif [ -d "$TEMP_DIR/frontend" ] && [ -d "$TEMP_DIR/backend" ]; then
  # Copy from root directory (if repository has been flattened)
  echo "Found top-level frontend/backend directories, copying files..."
  # Use rsync with exclude option to prevent overwriting .env files
  rsync -av --exclude='.env' "$TEMP_DIR/frontend/" "$APP_DIR/frontend/" || {
    echo "Error copying frontend files from root directory"
  }
  rsync -av --exclude='.env' "$TEMP_DIR/backend/" "$APP_DIR/backend/" || {
    echo "Error copying backend files from root directory"
  }
else
  # Last resort - search for the directories recursively
  echo "Standard directory structure not found, searching recursively..."
  FRONTEND_DIR=$(find "$TEMP_DIR" -type d -name "frontend" | head -n 1)
  BACKEND_DIR=$(find "$TEMP_DIR" -type d -name "backend" | head -n 1)
  
  if [ -n "$FRONTEND_DIR" ] && [ -n "$BACKEND_DIR" ]; then
    echo "Found directories through recursive search:"
    echo "Frontend: $FRONTEND_DIR"
    echo "Backend: $BACKEND_DIR"
    
    rsync -av --exclude='.env' "$FRONTEND_DIR/" "$APP_DIR/frontend/" || {
      echo "Error copying frontend files from recursive search"
    }
    rsync -av --exclude='.env' "$BACKEND_DIR/" "$APP_DIR/backend/" || {
      echo "Error copying backend files from recursive search"
    }
  else
    echo "ERROR: Could not find frontend and backend directories in the repository"
    echo "Repository structure:"
    find "$TEMP_DIR" -type d -maxdepth 3
    exit 1
  fi
fi

# Clean up temporary directory
echo "Cleaning up temporary files..."
rm -rf $TEMP_DIR

# Install dependencies and build frontend
echo "Setting up frontend..."
cd "$APP_DIR/frontend"

# Restore or create environment file
if [ -f "$APP_DIR/frontend_env_backup" ]; then
  echo "Restoring frontend environment variables from backup..."
  cp "$APP_DIR/frontend_env_backup" "$APP_DIR/frontend/.env"
  rm "$APP_DIR/frontend_env_backup"
elif [ ! -f .env ]; then
  echo "Creating new frontend .env file..."
  echo "NEXT_PUBLIC_API_URL=https://api.evanjamesofficial.com" > .env
  echo "WARNING: Created default .env file. You may need to customize it with your specific variables."
fi

echo "Installing frontend dependencies..."
npm install

echo "Building frontend..."
npm run build

# Restart frontend service
echo "Restarting frontend service..."
if command -v pm2 &> /dev/null; then
  pm2 stop evan-james-frontend 2>/dev/null || true
  pm2 delete evan-james-frontend 2>/dev/null || true
  pm2 start npm --name "evan-james-frontend" -- run start
  pm2 save
else
  echo "PM2 not found. Installing..."
  npm install -g pm2
  pm2 start npm --name "evan-james-frontend" -- run start
  pm2 save
fi

# Set up backend
echo "Setting up backend..."
cd "$APP_DIR/backend"

# Restore or create environment file
if [ -f "$APP_DIR/backend_env_backup" ]; then
  echo "Restoring backend environment variables from backup..."
  cp "$APP_DIR/backend_env_backup" "$APP_DIR/backend/.env"
  rm "$APP_DIR/backend_env_backup"
elif [ ! -f .env ]; then
  echo "Note: Backend .env file needs configuration"
  echo "WARNING: No existing .env file found. Please manually configure the backend .env file."
fi

echo "Installing backend dependencies..."
npm install

# Restart backend service
echo "Restarting backend service..."
if command -v pm2 &> /dev/null; then
  pm2 stop evan-james-backend 2>/dev/null || true
  pm2 delete evan-james-backend 2>/dev/null || true
  pm2 start npm --name "evan-james-backend" -- run develop
  pm2 save
else
  echo "PM2 not found. Installing..."
  npm install -g pm2
  pm2 start npm --name "evan-james-backend" -- run develop
  pm2 save
fi

echo "=== Deployment completed successfully! ==="
echo "Frontend: https://evanjamesofficial.com"
echo "Backend: https://api.evanjamesofficial.com"
echo "$(date)"
