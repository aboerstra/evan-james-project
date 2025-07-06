#!/bin/bash

# Script to fix Next.js export errors on the EC2 server
# This script should be run on the EC2 server after the main setup script

echo "Starting Next.js export fix..."

# Navigate to the frontend directory
cd ~/evan-james/frontend || { echo "Frontend directory not found!"; exit 1; }

# Backup the next.config.js file
cp next.config.js next.config.js.backup
echo "Backed up next.config.js to next.config.js.backup"

# Update the next.config.js file to exclude problematic paths from export
cat > next.config.js << 'EOL'
const { withSentryConfig } = require('@sentry/nextjs');

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'api.evanjamesofficial.com'],
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Exclude problematic paths from export
  exportPathMap: async function (defaultPathMap) {
    // Remove problematic paths
    delete defaultPathMap['/admin/photos/albums/[id]'];
    delete defaultPathMap['/admin/photos/edit-album/[id]'];
    delete defaultPathMap['/admin/photos/new-album'];
    delete defaultPathMap['/admin/photos/upload'];
    delete defaultPathMap['/landing'];
    
    return defaultPathMap;
  },
};

const sentryWebpackPluginOptions = {
  silent: true,
};

module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions);
EOL

echo "Updated next.config.js to exclude problematic export paths"

# Clean the build directory
echo "Cleaning previous build..."
rm -rf .next
rm -rf out

# Rebuild the frontend
echo "Rebuilding the frontend..."
npm run build

echo "Next.js export fix completed!"
echo "If the build was successful, restart the frontend service with: pm2 restart frontend"
