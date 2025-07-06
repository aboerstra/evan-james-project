#!/bin/bash

# Script to fix duplicate React imports and rebuild the frontend
# This script should be run on the EC2 instance with sudo

echo "Starting duplicate React import fix process..."

# Navigate to the project directory
cd /home/ubuntu/evan-james-project

# Fix duplicate React imports
echo "Fixing duplicate React imports..."

# Landing page
echo "Fixing landing.js..."
sed -i '1d' frontend/pages/landing.js

# Admin photo pages
echo "Fixing new-album.js..."
sed -i '1d' frontend/pages/admin/photos/new-album.js

echo "Fixing upload.js..."
sed -i '1d' frontend/pages/admin/photos/upload.js

echo "Fixing albums/[id].js..."
sed -i '1d' frontend/pages/admin/photos/albums/[id].js

echo "Fixing edit-album/[id].js..."
sed -i '1d' frontend/pages/admin/photos/edit-album/[id].js

echo "All duplicate React imports have been removed."

# Fix permissions on the .next directory
echo "Fixing permissions on the .next directory..."
rm -rf /home/ubuntu/evan-james-project/frontend/.next
mkdir -p /home/ubuntu/evan-james-project/frontend/.next
chown -R ubuntu:ubuntu /home/ubuntu/evan-james-project/frontend/.next
chmod -R 755 /home/ubuntu/evan-james-project/frontend/.next

# Rebuild the frontend
echo "Rebuilding the frontend..."
cd frontend
sudo -u ubuntu npm run build

# Start the frontend service
echo "Starting the frontend service..."
pm2 start npm --name "evan-james-frontend" -- run start

echo "Duplicate React import fix process completed."
echo "Check the frontend service status with: pm2 status"
