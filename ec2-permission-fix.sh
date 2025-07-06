#!/bin/bash

# Script to fix permissions on the EC2 instance and apply React import fixes
# This script should be run on the EC2 instance with sudo

echo "Starting permission fix and React import fix process..."

# Fix repository permissions
echo "Fixing repository permissions..."
sudo chown -R ubuntu:ubuntu /home/ubuntu/evan-james-project
sudo chmod -R 755 /home/ubuntu/evan-james-project

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
sed -i 's/import { useState, useEffect } from '\''react'\'';/import { useState, useEffect } from '\''react'\'';/' frontend/pages/landing.js

# Admin photo pages
echo "Fixing new-album.js..."
sed -i '1s/^/import React from '\''react'\'';\n/' frontend/pages/admin/photos/new-album.js
sed -i 's/import { useState } from '\''react'\'';/import { useState } from '\''react'\'';/' frontend/pages/admin/photos/new-album.js

echo "Fixing upload.js..."
sed -i '1s/^/import React from '\''react'\'';\n/' frontend/pages/admin/photos/upload.js
sed -i 's/import { useState, useCallback } from '\''react'\'';/import { useState, useCallback } from '\''react'\'';/' frontend/pages/admin/photos/upload.js

echo "Fixing albums/[id].js..."
sed -i '1s/^/import React from '\''react'\'';\n/' frontend/pages/admin/photos/albums/[id].js
sed -i 's/import { useState, useEffect } from '\''react'\'';/import { useState, useEffect } from '\''react'\'';/' frontend/pages/admin/photos/albums/[id].js

echo "Fixing edit-album/[id].js..."
sed -i '1s/^/import React from '\''react'\'';\n/' frontend/pages/admin/photos/edit-album/[id].js
sed -i 's/import { useState, useEffect } from '\''react'\'';/import { useState, useEffect } from '\''react'\'';/' frontend/pages/admin/photos/edit-album/[id].js

echo "All React imports have been added."

# Rebuild the frontend
echo "Rebuilding the frontend..."
cd frontend
npm run build

echo "Build process completed."
echo "Restarting the frontend service..."
pm2 restart evan-james-frontend

echo "Fix process completed."
echo "Check the frontend service status with: pm2 status"
