#!/bin/bash

# Script to rebuild the frontend with correct image paths
# This script should be run on the EC2 instance with sudo

echo "Starting frontend rebuild process..."

# Navigate to the project directory
cd /home/ubuntu/evan-james-project

# Stop the frontend service
echo "Stopping the frontend service..."
pm2 stop evan-james-frontend

# Clean the .next directory
echo "Cleaning the .next directory..."
rm -rf /home/ubuntu/evan-james-project/frontend/.next
mkdir -p /home/ubuntu/evan-james-project/frontend/.next
chown -R ubuntu:ubuntu /home/ubuntu/evan-james-project/frontend/.next
chmod -R 755 /home/ubuntu/evan-james-project/frontend/.next

# Rebuild the frontend
echo "Rebuilding the frontend..."
cd /home/ubuntu/evan-james-project/frontend
sudo -u ubuntu npm run build

# Start the frontend service
echo "Starting the frontend service..."
pm2 start npm --name "evan-james-frontend" -- run start

echo "Frontend rebuild process completed."
echo "Check the frontend service status with: pm2 status"
