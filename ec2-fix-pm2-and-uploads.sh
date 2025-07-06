#!/bin/bash

# Script to fix PM2 configuration and upload images to Strapi
# This script should be run on the EC2 instance with sudo

echo "Starting PM2 and uploads fix process..."

# Navigate to the project directory
cd /home/ubuntu/evan-james-project

# Stop all frontend instances
echo "Stopping all frontend instances..."
pm2 delete evan-james-frontend
sudo pm2 delete evan-james-frontend

# Create the uploads directory in the backend if it doesn't exist
echo "Creating uploads directory in the backend..."
mkdir -p /home/ubuntu/evan-james-project/backend/public/uploads

# Copy the frontend images to the Strapi uploads directory
echo "Copying frontend images to Strapi uploads directory..."
cp -r /home/ubuntu/evan-james-project/frontend/public/images/* /home/ubuntu/evan-james-project/backend/public/uploads/

# Set the correct permissions
echo "Setting correct permissions..."
chown -R ubuntu:ubuntu /home/ubuntu/evan-james-project/backend/public/uploads
chmod -R 755 /home/ubuntu/evan-james-project/backend/public/uploads

# Restart the backend service
echo "Restarting the backend service..."
pm2 restart evan-james-backend

# Start the frontend service with the correct user
echo "Starting the frontend service..."
cd /home/ubuntu/evan-james-project/frontend
sudo -u ubuntu pm2 start npm --name "evan-james-frontend" -- run start

# Save the PM2 configuration
echo "Saving the PM2 configuration..."
sudo -u ubuntu pm2 save

echo "PM2 and uploads fix process completed."
echo "Check the services with: pm2 status"
