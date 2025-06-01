#!/bin/bash

# This script helps update Nginx configuration when changing your application directory structure
# It should be run on your EC2 server after deployment

# Configuration
OLD_PATH="/home/ubuntu/evan-james-full"
NEW_PATH="/home/ubuntu/evan-james"
NGINX_CONF_DIR="/etc/nginx"
BACKUP_ENABLED=true
SERVER_USER="ubuntu"
SERVER_HOST="evanjamesofficial.com"
SSH_KEY=""
RUN_REMOTELY=true  # Set to false to run directly on the server

# Try to find the SSH key if running remotely
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

# Configure SSH command if running remotely
if [ "$RUN_REMOTELY" = true ]; then
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
    SSH_CMD="ssh -i $SSH_KEY"
  else
    SSH_CMD="ssh"
  fi
fi

echo "=== Nginx Configuration Update Tool ==="
echo "$(date)"

# Function to run script directly on server
run_on_server() {
  # Capture the content of this script
  SCRIPT_CONTENT=$(cat "$0")
  
  # Create a temporary script on the server that disables remote mode
  REMOTE_SCRIPT=$(echo "$SCRIPT_CONTENT" | sed 's/RUN_REMOTELY=true/RUN_REMOTELY=false/')
  
  # Execute the modified script on the server with sudo
  echo "Uploading and executing configuration update script on server..."
  echo "$REMOTE_SCRIPT" | $SSH_CMD $SERVER_USER@$SERVER_HOST "cat > /tmp/update-nginx-config.sh && chmod +x /tmp/update-nginx-config.sh && sudo /tmp/update-nginx-config.sh"
  
  EXIT_CODE=$?
  if [ $EXIT_CODE -eq 0 ]; then
    echo "✅ Nginx configuration updated successfully on the remote server."
  else
    echo "❌ Failed to update Nginx configuration on the remote server (exit code: $EXIT_CODE)."
  fi
  
  # Cleanup
  $SSH_CMD $SERVER_USER@$SERVER_HOST "rm /tmp/update-nginx-config.sh" 2>/dev/null || true
  
  return $EXIT_CODE
}

# Run remotely or locally
if [ "$RUN_REMOTELY" = true ]; then
  run_on_server
  exit $?
fi

# When running locally on server, check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then
  echo "Please run this script with sudo: sudo $0"
  exit 1
fi

# Backup Nginx configuration if enabled
if [ "$BACKUP_ENABLED" = true ]; then
  echo "Creating backup of Nginx configuration..."
  TIMESTAMP=$(date +%Y%m%d_%H%M%S)
  tar -czf nginx_config_backup_$TIMESTAMP.tar.gz $NGINX_CONF_DIR
  echo "Backup created: nginx_config_backup_$TIMESTAMP.tar.gz"
fi

# Scan for configuration files with the old path
echo "Scanning for Nginx configuration files containing the old path..."
MATCHING_FILES=$(grep -r --include="*.conf" "$OLD_PATH" $NGINX_CONF_DIR | cut -d':' -f1 | sort | uniq)

if [ -z "$MATCHING_FILES" ]; then
  echo "No Nginx configuration files found referencing: $OLD_PATH"
  echo "No changes needed."
  exit 0
fi

echo "Found the following Nginx configuration files that need to be updated:"
echo "$MATCHING_FILES"
echo ""

# Prompt for confirmation
read -p "Do you want to update these files? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Operation cancelled by user."
  exit 1
fi

# Update the files
echo "Updating Nginx configuration files..."
for FILE in $MATCHING_FILES; do
  echo "Updating: $FILE"
  # Create a backup of the original file
  cp "$FILE" "$FILE.bak"
  # Replace old path with new path
  sed -i "s|$OLD_PATH|$NEW_PATH|g" "$FILE"
done

echo "All files updated. Original files have been backed up with .bak extension."
echo "Testing Nginx configuration..."

# Test Nginx configuration
nginx -t
if [ $? -eq 0 ]; then
  echo "Nginx configuration test successful."
  
  # Reload Nginx
  echo "Reloading Nginx to apply changes..."
  systemctl reload nginx
  if [ $? -eq 0 ]; then
    echo "Nginx reloaded successfully."
    echo "✅ Configuration update complete!"
  else
    echo "❌ Failed to reload Nginx. Please check the configuration manually."
    exit 1
  fi
else
  echo "❌ Nginx configuration test failed. Please check the configuration manually."
  echo "You may restore the backup files by renaming the .bak files."
  exit 1
fi

echo "=== Nginx Configuration Update Completed ==="
echo "$(date)"
