#!/bin/bash

# Improved script to fix Strapi uploads
# This script should be run on the EC2 instance with sudo

echo "Starting improved Strapi uploads fix process..."

# Navigate to the project directory
cd /home/ubuntu/evan-james-project || { echo "Project directory not found!"; exit 1; }

# Check if frontend images directory exists and has files
echo "Checking frontend images directory..."
if [ ! -d "frontend/public/images" ]; then
  echo "ERROR: Frontend images directory does not exist!"
  echo "Expected path: /home/ubuntu/evan-james-project/frontend/public/images"
  exit 1
fi

# Count files in frontend images directory
file_count=$(find frontend/public/images -type f | wc -l)
echo "Found $file_count files in frontend images directory."

if [ "$file_count" -eq 0 ]; then
  echo "WARNING: No files found in frontend images directory!"
  echo "Please check if images are stored in a different location."
  
  # List contents of public directory to help identify where images might be
  echo "Contents of frontend/public directory:"
  ls -la frontend/public
fi

# Create the uploads directory in the backend if it doesn't exist
echo "Creating uploads directory in the backend..."
mkdir -p backend/public/uploads

# Copy the frontend images to the Strapi uploads directory with verbose output
echo "Copying frontend images to Strapi uploads directory..."
if [ "$file_count" -gt 0 ]; then
  # Use rsync for better feedback and error handling
  rsync -av frontend/public/images/ backend/public/uploads/
else
  echo "Attempting to find images in other common locations..."
  
  # Check some common alternative locations
  potential_locations=(
    "frontend/public/img"
    "frontend/public/assets/images"
    "frontend/public/assets/img"
    "frontend/public/static/images"
    "frontend/public/static/img"
    "frontend/assets/images"
  )
  
  for location in "${potential_locations[@]}"; do
    if [ -d "$location" ]; then
      echo "Found potential images in: $location"
      echo "Copying from this location..."
      rsync -av "$location/" backend/public/uploads/
      break
    fi
  done
fi

# Set the correct permissions
echo "Setting correct permissions..."
chown -R ubuntu:ubuntu backend/public/uploads
chmod -R 755 backend/public/uploads

# Verify files were copied
echo "Verifying files were copied..."
backend_file_count=$(find backend/public/uploads -type f | wc -l)
echo "Number of files in backend uploads directory: $backend_file_count"

if [ "$backend_file_count" -eq 0 ]; then
  echo "WARNING: No files were copied to the backend uploads directory!"
  echo "You may need to manually copy images to: /home/ubuntu/evan-james-project/backend/public/uploads/"
else
  echo "Successfully copied $backend_file_count files to the backend uploads directory."
fi

# Check if the backend is running
echo "Checking if the backend is running..."
if ! pm2 show evan-james-backend > /dev/null 2>&1; then
  echo "Starting the backend service..."
  cd /home/ubuntu/evan-james-project/backend
  sudo -u ubuntu pm2 start npm --name "evan-james-backend" -- run start
else
  echo "Restarting the backend service..."
  pm2 restart evan-james-backend
fi

# Check if the frontend is running
echo "Checking if the frontend is running..."
if ! pm2 show evan-james-frontend > /dev/null 2>&1; then
  echo "Starting the frontend service..."
  cd /home/ubuntu/evan-james-project/frontend
  sudo -u ubuntu pm2 start npm --name "evan-james-frontend" -- run start
else
  echo "Restarting the frontend service..."
  pm2 restart evan-james-frontend
fi

echo "Strapi uploads fix process completed."
echo "Check the backend and frontend services with: pm2 status"
echo "If images are still not appearing, you may need to manually upload them through the Strapi admin panel."
