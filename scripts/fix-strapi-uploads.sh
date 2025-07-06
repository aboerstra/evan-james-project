#!/bin/bash

# Script to fix the Strapi uploads folder issue on the EC2 server
# This script should be run on the EC2 server

echo "Starting Strapi uploads folder fix..."

# Navigate to the backend directory
cd ~/evan-james/backend || { echo "Backend directory not found!"; exit 1; }

# Create the uploads directory if it doesn't exist
echo "Creating uploads directory..."
mkdir -p public/uploads

# Set proper permissions
echo "Setting proper permissions..."
chmod -R 755 public/uploads

# Create a .gitkeep file to ensure the directory is tracked by git
touch public/uploads/.gitkeep

echo "Uploads folder fix completed!"
echo "You can now restart the Strapi backend with: pm2 restart backend"
