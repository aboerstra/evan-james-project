#!/bin/bash

# Script to fix "Build directory is not writeable" error for Next.js on EC2
# Run this script on your EC2 instance

# Change ownership of the frontend directory to your user
sudo chown -R ubuntu:ubuntu ~/evan-james-project/frontend

# If needed, remove the existing .next directory before rebuilding
rm -rf ~/evan-james-project/frontend/.next

# Then try building again
cd ~/evan-james-project/frontend
npm run build

# After a successful build, start or restart the frontend service with PM2
pm2 list | grep -q "evan-james-frontend" && pm2 restart evan-james-frontend || pm2 start npm --name "evan-james-frontend" -- run start

# Make sure Nginx is properly configured and running
sudo systemctl status nginx

# If needed, restart Nginx
sudo systemctl restart nginx

echo "Script completed. Check above for any errors."
