#!/bin/bash

# Script to fix PM2 configuration and services
# This script should be run on the EC2 instance with sudo

echo "Starting PM2 and services fix process..."

# Navigate to the project directory
cd /home/ubuntu/evan-james-project

# Stop all services
echo "Stopping all services..."
pm2 stop all
pm2 delete all

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

# Start the backend service
echo "Starting the backend service..."
cd /home/ubuntu/evan-james-project/backend
sudo -u ubuntu pm2 start npm --name "evan-james-backend" -- run start

# Wait for the backend to start
echo "Waiting for the backend to start..."
sleep 10

# Start the frontend service
echo "Starting the frontend service..."
cd /home/ubuntu/evan-james-project/frontend
sudo -u ubuntu pm2 start npm --name "evan-james-frontend" -- run start

# Save the PM2 configuration
echo "Saving the PM2 configuration..."
sudo -u ubuntu pm2 save

echo "PM2 and services fix process completed."
echo "Check the services with: pm2 status"
