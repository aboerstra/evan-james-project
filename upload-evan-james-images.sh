#!/bin/bash

# Script to upload Evan James project images to the EC2 server
# This script uses the ejofficial.pem file and the EC2 host address from the original command

# Default values
EC2_USER="ubuntu"
EC2_HOST="13.223.13.92"
PEM_FILE="ejofficial.pem"
LOCAL_IMAGES_DIR=""
REMOTE_UPLOADS_DIR="/home/ubuntu/evan-james-project/backend/public/uploads"

# Function to display usage
usage() {
  echo "Usage: $0 -d <local_images_dir>"
  echo "  -d  Local directory containing images to upload (required)"
  echo "  -i  Path to your EC2 .pem key file (default: ejofficial.pem in current directory)"
  echo "  -h  EC2 host address (default: 13.223.13.92)"
  exit 1
}

# Parse command line arguments
while getopts "d:i:h:" opt; do
  case $opt in
    d) LOCAL_IMAGES_DIR="$OPTARG" ;;
    i) PEM_FILE="$OPTARG" ;;
    h) EC2_HOST="$OPTARG" ;;
    *) usage ;;
  esac
done

# Check if local images directory is provided
if [ -z "$LOCAL_IMAGES_DIR" ]; then
  echo "Error: Local images directory is required"
  usage
fi

# Check if the local images directory exists
if [ ! -d "$LOCAL_IMAGES_DIR" ]; then
  echo "Error: Local images directory does not exist: $LOCAL_IMAGES_DIR"
  exit 1
fi

# Check if the PEM file exists
if [ ! -f "$PEM_FILE" ]; then
  # Try to find the PEM file in common locations
  possible_locations=(
    "."
    ".."
    "~"
    "~/.ssh"
    "/home/aboerstra/ultimia/EvanBoerstra/evan-james-project"
  )
  
  for location in "${possible_locations[@]}"; do
    if [ -f "$location/ejofficial.pem" ]; then
      PEM_FILE="$location/ejofficial.pem"
      echo "Found PEM file at: $PEM_FILE"
      break
    fi
  done
  
  if [ ! -f "$PEM_FILE" ]; then
    echo "Error: PEM file not found. Please specify the path to ejofficial.pem using the -i option."
    exit 1
  fi
fi

# Fix permissions on the PEM file
chmod 600 "$PEM_FILE"

# Count the number of images to upload
IMAGE_COUNT=$(find "$LOCAL_IMAGES_DIR" -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.gif" -o -name "*.webp" -o -name "*.svg" \) | wc -l)

if [ "$IMAGE_COUNT" -eq 0 ]; then
  echo "Warning: No image files found in $LOCAL_IMAGES_DIR"
  echo "Looking for files with extensions: .jpg, .jpeg, .png, .gif, .webp, .svg"
  exit 1
fi

echo "Found $IMAGE_COUNT image files to upload."
echo "Uploading to EC2 server: $EC2_USER@$EC2_HOST"
echo "Using PEM file: $PEM_FILE"
echo "Remote uploads directory: $REMOTE_UPLOADS_DIR"
echo

# Confirm with the user
read -p "Do you want to proceed with the upload? (y/n): " confirm
if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
  echo "Upload cancelled."
  exit 0
fi

# Create the remote uploads directory if it doesn't exist
echo "Creating remote uploads directory if it doesn't exist..."
ssh -i "$PEM_FILE" "$EC2_USER@$EC2_HOST" "mkdir -p $REMOTE_UPLOADS_DIR"

# Upload the images
echo "Uploading images to EC2 server..."
rsync -avz --progress -e "ssh -i $PEM_FILE" "$LOCAL_IMAGES_DIR/" "$EC2_USER@$EC2_HOST:$REMOTE_UPLOADS_DIR/"

# Set correct permissions on the uploaded files
echo "Setting correct permissions on uploaded files..."
ssh -i "$PEM_FILE" "$EC2_USER@$EC2_HOST" "sudo chown -R ubuntu:ubuntu $REMOTE_UPLOADS_DIR && sudo chmod -R 755 $REMOTE_UPLOADS_DIR"

# Restart the Strapi backend
echo "Restarting the Strapi backend service..."
ssh -i "$PEM_FILE" "$EC2_USER@$EC2_HOST" "pm2 restart evan-james-backend"

echo "Upload complete! $IMAGE_COUNT images have been uploaded to the Strapi uploads directory."
echo "You should now be able to see and use these images in the Strapi admin panel."
