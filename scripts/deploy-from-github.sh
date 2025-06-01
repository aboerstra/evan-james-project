#!/bin/bash

# This script clones the evan-james-project from GitHub to the EC2 server
# Run it from your local machine

# Set the server details
SERVER_USER="ubuntu"
SERVER_HOST="evanjamesofficial.com"
SSH_KEY="~/ejofficial.pem"
TARGET_DIR="/home/ubuntu/evan-james-full"
GITHUB_REPO="https://github.com/aboerstra/evanjamesofficial.git"
REPO_BRANCH="main"
PROJECT_PATH="evan-james-project"

echo "Deploying Evan James project from GitHub to EC2 server..."

# SSH into the server and perform the deployment
ssh -i $SSH_KEY $SERVER_USER@$SERVER_HOST << EOF
  echo "Connected to server. Starting deployment process..."
  
  # Create target directory if it doesn't exist or backup existing files
  if [ ! -d "$TARGET_DIR" ]; then
    echo "Creating target directory..."
    mkdir -p "$TARGET_DIR"
  else
    echo "Target directory exists, creating backups of critical files..."
    timestamp=\$(date +%Y%m%d_%H%M%S)
    
    # Backup any existing files that might be overwritten
    if [ -d "$TARGET_DIR/frontend" ]; then
      echo "Backing up frontend directory..."
      mv "$TARGET_DIR/frontend" "$TARGET_DIR/frontend_backup_\$timestamp"
    fi
    
    if [ -d "$TARGET_DIR/backend" ]; then
      echo "Backing up backend directory..."
      mv "$TARGET_DIR/backend" "$TARGET_DIR/backend_backup_\$timestamp"
    fi
  fi

  # Clone the repository
  echo "Cloning from GitHub repository..."
  git clone -b $REPO_BRANCH $GITHUB_REPO temp_repo
  
  # Copy only the contents of the evan-james-project directory to the target
  echo "Copying project files to target directory..."
  cp -r temp_repo/$PROJECT_PATH/* "$TARGET_DIR/"
  
  # Clean up the temporary clone
  echo "Cleaning up temporary files..."
  rm -rf temp_repo
  
  # Set up environment if needed
  cd $TARGET_DIR
  
  # Set up frontend environment
  if [ -d "$TARGET_DIR/frontend" ]; then
    echo "Setting up frontend..."
    cd "$TARGET_DIR/frontend"
    
    # Create production environment file if it doesn't exist
    if [ ! -f .env ]; then
      echo "Creating frontend .env file..."
      echo "NEXT_PUBLIC_API_URL=https://api.evanjamesofficial.com" > .env
    fi
    
    # Install dependencies and build
    echo "Installing frontend dependencies..."
    npm install
    
    echo "Building frontend..."
    npm run build
    
    # Set up PM2 for the frontend
    echo "Setting up PM2 for frontend..."
    if ! command -v pm2 &> /dev/null; then
      echo "Installing PM2..."
      npm install -g pm2
    fi
    
    pm2 stop evan-james-frontend 2>/dev/null || true
    pm2 delete evan-james-frontend 2>/dev/null || true
    pm2 start npm --name "evan-james-frontend" -- run start
    pm2 save
    
    cd ..
  fi
  
  # Set up backend environment
  if [ -d "$TARGET_DIR/backend" ]; then
    echo "Setting up backend..."
    cd "$TARGET_DIR/backend"
    
    # Create environment file if it doesn't exist
    if [ ! -f .env ]; then
      echo "Creating backend .env file..."
      echo "Please manually configure backend .env file if needed."
    fi
    
    # Install dependencies
    echo "Installing backend dependencies..."
    npm install
    
    # Set up PM2 for the backend
    echo "Setting up PM2 for backend..."
    if ! command -v pm2 &> /dev/null; then
      echo "Installing PM2..."
      npm install -g pm2
    fi
    
    pm2 stop evan-james-backend 2>/dev/null || true
    pm2 delete evan-james-backend 2>/dev/null || true
    pm2 start npm --name "evan-james-backend" -- run develop
    pm2 save
    
    cd ..
  fi
  
  echo "Deployment completed successfully!"
EOF

# Check if the SSH command was successful
if [ $? -eq 0 ]; then
  echo "✅ Deployment completed successfully!"
  echo "Frontend should be running at https://evanjamesofficial.com"
  echo "Backend should be running at https://api.evanjamesofficial.com"
else
  echo "❌ Deployment failed. Please check the error messages above."
fi
