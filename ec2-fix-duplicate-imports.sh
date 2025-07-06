#!/bin/bash

# Script to fix duplicate React imports and rebuild the frontend
# This script should be run on the EC2 instance

echo "Starting duplicate import fix process..."

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

# Rebuild the frontend
echo "Rebuilding the frontend..."
cd frontend
npm run build

# Restart the frontend service
echo "Restarting the frontend service..."
pm2 start npm --name "evan-james-frontend" -- run start

echo "Duplicate import fix process completed."
echo "Check the frontend service status with: pm2 status"
