#!/bin/bash

# Script to pull the latest changes from GitHub and apply the React import fixes on EC2
# This script should be run on the EC2 instance

echo "Starting EC2 fix application process..."

# Navigate to the project directory
cd ~/evan-james-project

# Configure Git to trust the repository directory (to handle ownership issues)
echo "Configuring Git to trust the repository directory..."
git config --global --add safe.directory /home/ubuntu/evan-james-project

# Pull the latest changes from GitHub
echo "Pulling latest changes from GitHub..."
git pull origin main

# Make the fix script executable (in case permissions were not preserved)
echo "Making fix script executable..."
chmod +x ec2-fix-react-imports.sh

# Run the fix script
echo "Running React import fix script..."
./ec2-fix-react-imports.sh

# Restart the frontend service
echo "Restarting the frontend service..."
pm2 restart evan-james-frontend

echo "Fix application process completed."
echo "Check the frontend service status with: pm2 status"
