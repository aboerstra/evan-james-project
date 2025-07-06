#!/bin/bash

# Script to upload all fix scripts to EC2 server
# Run this script from your local machine

# Configuration
SERVER_USER="ubuntu"
SERVER_HOST="evanjamesofficial.com"
SSH_KEY="~/ejofficial.pem"
REMOTE_DIR="/home/ubuntu"

echo "=== Uploading fix scripts to EC2 server ==="
echo "$(date)"

# Check if SSH key exists
if [ ! -f $(eval echo $SSH_KEY) ]; then
  echo "SSH key not found at $SSH_KEY"
  read -p "Enter the path to your SSH key: " NEW_SSH_KEY
  SSH_KEY=$NEW_SSH_KEY
  
  if [ ! -f $(eval echo $SSH_KEY) ]; then
    echo "ERROR: SSH key not found at $SSH_KEY"
    echo "Please provide a valid SSH key path."
    exit 1
  fi
fi

# Upload scripts
echo "Uploading ec2-troubleshoot.sh..."
scp -i $(eval echo $SSH_KEY) scripts/ec2-troubleshoot.sh $SERVER_USER@$SERVER_HOST:$REMOTE_DIR/

echo "Uploading setup-backend-env.sh..."
scp -i $(eval echo $SSH_KEY) scripts/setup-backend-env.sh $SERVER_USER@$SERVER_HOST:$REMOTE_DIR/

echo "Uploading fix-nginx-config.sh..."
scp -i $(eval echo $SSH_KEY) scripts/fix-nginx-config.sh $SERVER_USER@$SERVER_HOST:$REMOTE_DIR/

# Upload templates
echo "Uploading backend/.env.template..."
ssh -i $(eval echo $SSH_KEY) $SERVER_USER@$SERVER_HOST "mkdir -p $REMOTE_DIR/backend"
scp -i $(eval echo $SSH_KEY) backend/.env.template $SERVER_USER@$SERVER_HOST:$REMOTE_DIR/backend/

# Upload documentation
echo "Uploading ERROR_TROUBLESHOOTING_GUIDE.md..."
ssh -i $(eval echo $SSH_KEY) $SERVER_USER@$SERVER_HOST "mkdir -p $REMOTE_DIR/docs"
scp -i $(eval echo $SSH_KEY) docs/ERROR_TROUBLESHOOTING_GUIDE.md $SERVER_USER@$SERVER_HOST:$REMOTE_DIR/docs/

# Set executable permissions on the remote server
echo "Setting executable permissions..."
ssh -i $(eval echo $SSH_KEY) $SERVER_USER@$SERVER_HOST "chmod +x $REMOTE_DIR/ec2-troubleshoot.sh $REMOTE_DIR/setup-backend-env.sh $REMOTE_DIR/fix-nginx-config.sh"

echo "=== Upload completed successfully! ==="
echo "$(date)"
echo ""
echo "The following files have been uploaded to $REMOTE_DIR on your EC2 server:"
echo "- ec2-troubleshoot.sh: Script to diagnose and fix common errors"
echo "- setup-backend-env.sh: Script to set up backend environment with secure keys"
echo "- fix-nginx-config.sh: Script to fix Nginx configuration issues"
echo "- backend/.env.template: Template for backend environment variables"
echo "- docs/ERROR_TROUBLESHOOTING_GUIDE.md: Detailed guide for fixing 502 and 403 errors"
echo ""
echo "Next steps:"
echo "1. SSH into your EC2 server: ssh -i $SSH_KEY $SERVER_USER@$SERVER_HOST"
echo "2. Run the troubleshooting script: sudo ./ec2-troubleshoot.sh"
echo "3. Set up the backend environment: ./setup-backend-env.sh"
echo "4. Fix Nginx configuration: sudo ./fix-nginx-config.sh"
echo ""
echo "These scripts will help fix the 502 and 403 errors you're experiencing."
