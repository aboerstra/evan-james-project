#!/bin/bash

# Script to fix React imports and rebuild the frontend
# Created to resolve "ReferenceError: React is not defined" errors

echo "Starting React import fix and rebuild process..."

# Navigate to the project directory
cd ~/evan-james-project

# Fix the Sentry import in performanceMonitoring.js
echo "Fixing Sentry import in performanceMonitoring.js..."
sed -i 's/import Sentry from/import * as Sentry from/g' frontend/services/performanceMonitoring.js

# Add React imports to the affected files
echo "Adding React imports to affected pages..."

# Landing page
sed -i '1s/^/import React from '\''react'\'';\n/' frontend/pages/landing.js
sed -i 's/import { useState, useEffect } from '\''react'\'';/import { useState, useEffect } from '\''react'\'';/' frontend/pages/landing.js

# Admin photo pages
sed -i '1s/^/import React from '\''react'\'';\n/' frontend/pages/admin/photos/new-album.js
sed -i 's/import { useState } from '\''react'\'';/import { useState } from '\''react'\'';/' frontend/pages/admin/photos/new-album.js

sed -i '1s/^/import React from '\''react'\'';\n/' frontend/pages/admin/photos/upload.js
sed -i 's/import { useState, useCallback } from '\''react'\'';/import { useState, useCallback } from '\''react'\'';/' frontend/pages/admin/photos/upload.js

sed -i '1s/^/import React from '\''react'\'';\n/' frontend/pages/admin/photos/albums/[id].js
sed -i 's/import { useState, useEffect } from '\''react'\'';/import { useState, useEffect } from '\''react'\'';/' frontend/pages/admin/photos/albums/[id].js

sed -i '1s/^/import React from '\''react'\'';\n/' frontend/pages/admin/photos/edit-album/[id].js
sed -i 's/import { useState, useEffect } from '\''react'\'';/import { useState, useEffect } from '\''react'\'';/' frontend/pages/admin/photos/edit-album/[id].js

echo "All React imports have been added."

# Rebuild the frontend
echo "Rebuilding the frontend..."
cd frontend
npm run build

echo "Build process completed."
echo "If the build was successful, you can now restart the frontend service:"
echo "pm2 restart evan-james-frontend"
