#!/bin/bash

# Script to update PM2 configuration to use evan-james-project directory
# This script should be run on the EC2 instance

echo "Starting PM2 update process..."

# Stop and delete current PM2 services
echo "Stopping and deleting current PM2 services..."
pm2 stop all
pm2 delete all

# Apply React import fixes to evan-james-project directory
echo "Applying React import fixes to evan-james-project directory..."

# Navigate to the project directory
cd /home/ubuntu/evan-james-project

# Fix the Sentry import in performanceMonitoring.js
echo "Fixing Sentry import in performanceMonitoring.js..."
sed -i 's/import Sentry from/import * as Sentry from/g' frontend/services/performanceMonitoring.js

# Add React imports to the affected files
echo "Adding React imports to affected pages..."

# Landing page
echo "Fixing landing.js..."
sed -i '1s/^/import React from '\''react'\'';\n/' frontend/pages/landing.js

# Admin photo pages
echo "Fixing new-album.js..."
sed -i '1s/^/import React from '\''react'\'';\n/' frontend/pages/admin/photos/new-album.js

echo "Fixing upload.js..."
sed -i '1s/^/import React from '\''react'\'';\n/' frontend/pages/admin/photos/upload.js

echo "Fixing albums/[id].js..."
sed -i '1s/^/import React from '\''react'\'';\n/' frontend/pages/admin/photos/albums/[id].js

echo "Fixing edit-album/[id].js..."
sed -i '1s/^/import React from '\''react'\'';\n/' frontend/pages/admin/photos/edit-album/[id].js

echo "All React imports have been added."

# Rebuild the frontend
echo "Rebuilding the frontend..."
cd frontend
npm run build

# Set up new PM2 services
echo "Setting up new PM2 services..."
cd /home/ubuntu/evan-james-project

# Start backend service
echo "Starting backend service..."
cd backend
pm2 start npm --name "evan-james-backend" -- run start

# Start frontend service
echo "Starting frontend service..."
cd ../frontend
pm2 start npm --name "evan-james-frontend" -- run start

# Save PM2 configuration
echo "Saving PM2 configuration..."
pm2 save

# Display PM2 status
echo "PM2 services status:"
pm2 status

echo "PM2 update process completed."
