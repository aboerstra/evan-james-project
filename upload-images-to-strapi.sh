#!/bin/bash

# Script to upload local images to Strapi uploads directory on EC2
# This script should be run from your local machine

# Default values
EC2_USER="ubuntu"
EC2_HOST=""
PEM_FILE=""
LOCAL_IMAGES_DIR=""
REMOTE_UPLOADS_DIR="/home/ubuntu/evan-james-project/backend/public/uploads"

# Function to display usage
usage() {
  echo "Usage: $0 -i <pem_file> -h <ec2_host> -d <local_images_dir>"
  echo "  -i  Path to your EC2 .pem key file"
  echo "  -h  EC2 host address (e.g., ec2-xx-xx-xx-xx.compute-1.amazonaws.com)"
  echo "  -d  Local directory containing images to upload"
  echo "  -u  EC2 username (default: ubuntu)"
  echo "  -r  Remote uploads directory (default: /home/ubuntu/evan-james-project/backend/public/uploads)"
  exit 1
}

# Parse command line arguments
while getopts "i:h:d:u:r:" opt; do
  case $opt in
    i) PEM_FILE="$OPTARG" ;;
    h) EC2_HOST="$OPTARG" ;;
    d) LOCAL_IMAGES_DIR="$OPTARG" ;;
    u) EC2_USER="$OPTARG" ;;
    r) REMOTE_UPLOADS_DIR="$OPTARG" ;;
    *) usage ;;
  esac
done

# Check required parameters
if [ -z "$PEM_FILE" ] || [ -z "$EC2_HOST" ] || [ -z "$LOCAL_IMAGES_DIR" ]; then
  echo "Error: Missing required parameters"
  usage
fi

# Check if the local images directory exists
if [ ! -d "$LOCAL_IMAGES_DIR" ]; then
  echo "Error: Local images directory does not exist: $LOCAL_IMAGES_DIR"
  exit 1
fi

# Check if the PEM file exists
if [ ! -f "$PEM_FILE" ]; then
  echo "Error: PEM file does not exist: $PEM_FILE"
  exit 1
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
