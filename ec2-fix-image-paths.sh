#!/bin/bash

# Script to fix image paths in the frontend code
# This script should be run on the EC2 instance with sudo

echo "Starting image path fix process..."

# Navigate to the project directory
cd /home/ubuntu/evan-james-project

# Create a temporary directory for the Strapi uploads
echo "Creating temporary directory for Strapi uploads..."
mkdir -p /home/ubuntu/evan-james-project/backend/public/uploads/temp

# Copy the frontend images to the Strapi uploads directory
echo "Copying frontend images to Strapi uploads directory..."
cp -r /home/ubuntu/evan-james-project/frontend/public/images/* /home/ubuntu/evan-james-project/backend/public/uploads/

# Set the correct permissions
echo "Setting correct permissions..."
chown -R ubuntu:ubuntu /home/ubuntu/evan-james-project/backend/public/uploads
chmod -R 755 /home/ubuntu/evan-james-project/backend/public/uploads

# Restart the backend service to apply the changes
echo "Restarting the backend service..."
pm2 restart evan-james-backend

# Restart the frontend service to apply the changes
echo "Restarting the frontend service..."
pm2 restart evan-james-frontend

echo "Image path fix process completed."
echo "Check the frontend and backend services with: pm2 status"
