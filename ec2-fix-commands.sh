#!/bin/bash
# Script to fix the "Build directory is not writeable" error on EC2
# Copy and paste these commands into your SSH session on the EC2 instance

# Step 1: Navigate to the project directory
cd ~/evan-james-project

# Step 2: Change ownership of the frontend directory to your user
sudo chown -R ubuntu:ubuntu frontend

# Step 3: Remove the existing .next directory if it exists
rm -rf frontend/.next

# Step 4: Navigate to the frontend directory
cd frontend

# Step 5: Try building with increased memory allocation
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build

# If the build still fails, uncomment and run this command instead:
# pm2 start npm --name "evan-james-frontend" -- run dev

# Step 6: Check if Nginx is properly configured
sudo systemctl status nginx

# Step 7: Restart Nginx if needed
sudo systemctl restart nginx

echo "Script completed. Check above for any errors."
