#!/bin/bash

# Remote deployment script for Evan James website
# This script can be run from your local machine to initiate
# the deployment process on your EC2 server

# Configuration
SERVER_USER="ubuntu"
SERVER_HOST="evanjamesofficial.com"
SSH_KEY=""
REMOTE_SCRIPT_PATH="/home/ubuntu/simplified-deploy.sh"
LOCAL_SCRIPT_PATH="./scripts/simplified-deploy.sh"

# Try to find the SSH key
find_ssh_key() {
  # Common key locations
  POSSIBLE_KEYS=(
    "~/ejofficial.pem"  # This is the primary key path for this project
    "~/.ssh/ejofficial.pem"
    "~/.ssh/id_rsa"
    "~/.ssh/id_ed25519"
    "~/.ssh/id_ecdsa"
    "~/.ssh/id_dsa"
    "~/evan-james-key.pem"
  )
  
  for key in "${POSSIBLE_KEYS[@]}"; do
    expanded_path="${key/#\~/$HOME}"
    if [ -f "$expanded_path" ]; then
      echo "Found SSH key: $expanded_path"
      SSH_KEY="$expanded_path"
      return 0
    fi
  done
  
  return 1
}

# Find SSH key or prompt for it
if [ -z "$SSH_KEY" ]; then
  if ! find_ssh_key; then
    echo "No SSH key found automatically."
    read -p "Please enter the path to your SSH key file: " USER_KEY
    if [ -f "$USER_KEY" ]; then
      SSH_KEY="$USER_KEY"
    else
      echo "Invalid key file. Assuming you're using SSH agent or config."
      # Will try without explicit key
    fi
  fi
fi

# Build the SSH command
if [ -n "$SSH_KEY" ]; then
  SSH_CMD="ssh -i $SSH_KEY -o ConnectTimeout=10 -o ServerAliveInterval=5 -o ServerAliveCountMax=3"
  SCP_CMD="scp -i $SSH_KEY -o ConnectTimeout=10"
else
  SSH_CMD="ssh -o ConnectTimeout=10 -o ServerAliveInterval=5 -o ServerAliveCountMax=3"
  SCP_CMD="scp -o ConnectTimeout=10"
fi

echo "=== Initiating Remote Deployment Process ==="
echo "$(date)"

# Check if the local deployment script exists
if [ ! -f "$LOCAL_SCRIPT_PATH" ]; then
  echo "❌ Error: Local deployment script not found at $LOCAL_SCRIPT_PATH"
  exit 1
fi

# Upload the deployment script to the server if it doesn't exist or if --force flag is used
echo "Checking for deployment script on server..."
echo "Attempting to connect to $SERVER_USER@$SERVER_HOST..."

if ! $SSH_CMD $SERVER_USER@$SERVER_HOST "echo SSH connection successful" > /dev/null 2>&1; then
  echo "❌ Error: Failed to establish SSH connection to $SERVER_HOST"
  echo "Please check your network connection and SSH configuration."
  echo "See SSH_TROUBLESHOOTING.md for detailed troubleshooting steps."
  exit 1
fi

echo "SSH connection established successfully."

if [[ "$1" == "--force" ]] || ! $SSH_CMD $SERVER_USER@$SERVER_HOST "test -f $REMOTE_SCRIPT_PATH" > /dev/null 2>&1; then
  echo "Uploading deployment script to server..."
  $SCP_CMD $LOCAL_SCRIPT_PATH $SERVER_USER@$SERVER_HOST:$REMOTE_SCRIPT_PATH
  
  if [ $? -eq 0 ]; then
    # Make the script executable
    $SSH_CMD $SERVER_USER@$SERVER_HOST "chmod +x $REMOTE_SCRIPT_PATH"
    echo "Deployment script uploaded and made executable."
  else
    echo "❌ Error: Failed to upload deployment script."
    echo "Attempting alternative method - direct file creation on server..."
    
    # Create the script directly on the server
    cat $LOCAL_SCRIPT_PATH | $SSH_CMD $SERVER_USER@$SERVER_HOST "cat > $REMOTE_SCRIPT_PATH && chmod +x $REMOTE_SCRIPT_PATH"
    
    if [ $? -eq 0 ]; then
      echo "Deployment script created on server via direct content transfer."
    else
      echo "❌ Error: Could not create deployment script on server."
      echo "Please manually upload the script to your server."
      exit 1
    fi
  fi
else
  echo "Deployment script already exists on server."
fi

# Execute the deployment script on the server
echo "Executing deployment script on server..."
echo "This may take several minutes. Please be patient."
echo "----------------------------------------"

$SSH_CMD $SERVER_USER@$SERVER_HOST "$REMOTE_SCRIPT_PATH"

# Check if the deployment was successful
if [ $? -eq 0 ]; then
  echo "----------------------------------------"
  echo "✅ Remote deployment completed successfully!"
  echo "Frontend: https://evanjamesofficial.com"
  echo "Backend: https://api.evanjamesofficial.com"
else
  echo "----------------------------------------"
  echo "❌ Remote deployment encountered errors. Please check the output above."
fi

echo "$(date)"
