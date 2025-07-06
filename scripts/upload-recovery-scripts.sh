#!/bin/bash

# Script to upload recovery scripts to EC2 server
# Run this script from your local machine

# Configuration
SERVER_USER="ubuntu"
SERVER_HOST="evanjamesofficial.com"
SSH_KEY="~/ejofficial.pem"
REMOTE_DIR="/home/ubuntu"

echo "=== Uploading recovery scripts to EC2 server ==="
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

# Upload resume-deployment.sh
echo "Uploading resume-deployment.sh..."
scp -i $(eval echo $SSH_KEY) scripts/resume-deployment.sh $SERVER_USER@$SERVER_HOST:$REMOTE_DIR/

# Upload setup-swap.sh
echo "Uploading setup-swap.sh..."
scp -i $(eval echo $SSH_KEY) scripts/setup-swap.sh $SERVER_USER@$SERVER_HOST:$REMOTE_DIR/

# Upload troubleshoot-errors.sh
echo "Uploading troubleshoot-errors.sh..."
scp -i $(eval echo $SSH_KEY) scripts/troubleshoot-errors.sh $SERVER_USER@$SERVER_HOST:$REMOTE_DIR/

# Upload documentation
echo "Uploading DEPLOYMENT_RECOVERY_GUIDE.md..."
scp -i $(eval echo $SSH_KEY) docs/DEPLOYMENT_RECOVERY_GUIDE.md $SERVER_USER@$SERVER_HOST:$REMOTE_DIR/

echo "Uploading ERROR_TROUBLESHOOTING_GUIDE.md..."
scp -i $(eval echo $SSH_KEY) docs/ERROR_TROUBLESHOOTING_GUIDE.md $SERVER_USER@$SERVER_HOST:$REMOTE_DIR/

# Set executable permissions on the remote server
echo "Setting executable permissions..."
ssh -i $(eval echo $SSH_KEY) $SERVER_USER@$SERVER_HOST "chmod +x $REMOTE_DIR/resume-deployment.sh $REMOTE_DIR/setup-swap.sh $REMOTE_DIR/troubleshoot-errors.sh"

echo "=== Upload completed successfully! ==="
echo "$(date)"
echo ""
echo "The following files have been uploaded to $REMOTE_DIR on your EC2 server:"
echo "- resume-deployment.sh: Script to resume interrupted deployments"
echo "- setup-swap.sh: Script to set up swap space (run with sudo)"
echo "- troubleshoot-errors.sh: Script to diagnose and fix common errors"
echo "- DEPLOYMENT_RECOVERY_GUIDE.md: Guide with instructions and troubleshooting tips"
echo "- ERROR_TROUBLESHOOTING_GUIDE.md: Detailed guide for fixing 502 and 403 errors"
echo ""
echo "Next steps:"
echo "1. SSH into your EC2 server: ssh -i $SSH_KEY $SERVER_USER@$SERVER_HOST"
echo "2. Set up swap space: sudo ./setup-swap.sh"
echo "3. Resume deployment: ./resume-deployment.sh"
echo "4. If you encounter 502 or 403 errors: sudo ./troubleshoot-errors.sh"
echo "5. Check the DEPLOYMENT_RECOVERY_GUIDE.md for additional troubleshooting tips if needed"
