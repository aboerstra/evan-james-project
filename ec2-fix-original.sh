#!/bin/bash

# Script to fix React imports in the project directory and restart the services
# This script should be run on the EC2 instance

echo "Starting fix process for project directory..."

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

# Restart the frontend service
echo "Restarting the frontend service..."
pm2 restart evan-james-frontend

echo "Fix process completed."
echo "Check the frontend service status with: pm2 status"
