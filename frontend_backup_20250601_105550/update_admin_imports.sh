#!/bin/bash

# Update one-level nested admin pages
find pages/admin -maxdepth 2 -name "*.js" | xargs sed -i 's/import { AdminLayout } from '\''\.\.\/dashboard'\''/import AdminLayout from '\''\.\.\/\.\.\/components\/AdminLayout'\''/g'

# Update two-level nested admin pages (like photos/upload.js)
find pages/admin/*/new.js pages/admin/*/upload.js pages/admin/*/index.js pages/admin/*/new-album.js -type f 2>/dev/null | xargs sed -i 's/import { AdminLayout } from '\''\.\.\/dashboard'\''/import AdminLayout from '\''\.\.\/\.\.\/\.\.\/components\/AdminLayout'\''/g'

# Update three-level nested admin pages (like photos/edit/[id].js)
find pages/admin/*/*/[a-z]*.js -type f 2>/dev/null | xargs sed -i 's/import { AdminLayout } from '\''\.\.\/\.\.\/dashboard'\''/import AdminLayout from '\''\.\.\/\.\.\/\.\.\/\.\.\/components\/AdminLayout'\''/g'

echo "Updated AdminLayout imports in all admin pages" 