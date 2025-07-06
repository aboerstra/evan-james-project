#!/bin/bash

# Script to fix Strapi uploads
# This script should be run on the EC2 instance with sudo

echo "Starting Strapi uploads fix process..."

# Navigate to the project directory
cd /home/ubuntu/evan-james-project

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

# Check if the backend is running
echo "Checking if the backend is running..."
if ! pm2 show evan-james-backend > /dev/null 2>&1; then
  echo "Starting the backend service..."
  cd /home/ubuntu/evan-james-project/backend
  sudo -u ubuntu pm2 start npm --name "evan-james-backend" -- run start
else
  echo "Restarting the backend service..."
  pm2 restart evan-james-backend
fi

# Check if the frontend is running
echo "Checking if the frontend is running..."
if ! pm2 show evan-james-frontend > /dev/null 2>&1; then
  echo "Starting the frontend service..."
  cd /home/ubuntu/evan-james-project/frontend
  sudo -u ubuntu pm2 start npm --name "evan-james-frontend" -- run start
else
  echo "Restarting the frontend service..."
  pm2 restart evan-james-frontend
fi

echo "Strapi uploads fix process completed."
echo "Check the backend and frontend services with: pm2 status"
