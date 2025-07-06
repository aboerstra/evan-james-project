#!/bin/bash

# Script to fix permissions on the .next directory and rebuild the frontend
# This script should be run on the EC2 instance with sudo

echo "Starting permission fix process..."

# Fix permissions on the .next directory
echo "Fixing permissions on the .next directory..."
sudo rm -rf /home/ubuntu/evan-james-project/frontend/.next
sudo mkdir -p /home/ubuntu/evan-james-project/frontend/.next
sudo chown -R ubuntu:ubuntu /home/ubuntu/evan-james-project/frontend/.next
sudo chmod -R 755 /home/ubuntu/evan-james-project/frontend/.next

# Rebuild the frontend
echo "Rebuilding the frontend..."
cd /home/ubuntu/evan-james-project/frontend
sudo -u ubuntu npm run build

# Restart the frontend service
echo "Restarting the frontend service..."
pm2 restart evan-james-frontend

echo "Permission fix process completed."
echo "Check the frontend service status with: pm2 status"
