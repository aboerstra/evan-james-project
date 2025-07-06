#!/bin/bash

# Script to check the status of images in the frontend and backend directories
# This script should be run on the EC2 instance

echo "Checking image directories on EC2 instance..."

# Check if frontend images directory exists
echo "Checking if frontend images directory exists..."
if [ -d "/home/ubuntu/evan-james-project/frontend/public/images" ]; then
  echo "Frontend images directory exists."
  
  # Count files in frontend images directory
  file_count=$(find /home/ubuntu/evan-james-project/frontend/public/images -type f | wc -l)
  echo "Number of files in frontend images directory: $file_count"
  
  # List some files for verification
  echo "Sample files in frontend images directory:"
  ls -la /home/ubuntu/evan-james-project/frontend/public/images | head -n 10
else
  echo "Frontend images directory does not exist!"
fi

# Check if backend uploads directory exists
echo "Checking if backend uploads directory exists..."
if [ -d "/home/ubuntu/evan-james-project/backend/public/uploads" ]; then
  echo "Backend uploads directory exists."
  
  # Count files in backend uploads directory
  file_count=$(find /home/ubuntu/evan-james-project/backend/public/uploads -type f | wc -l)
  echo "Number of files in backend uploads directory: $file_count"
  
  # List some files for verification
  echo "Sample files in backend uploads directory:"
  ls -la /home/ubuntu/evan-james-project/backend/public/uploads | head -n 10
else
  echo "Backend uploads directory does not exist!"
fi

# Check permissions
echo "Checking permissions on directories..."
echo "Frontend images directory permissions:"
ls -ld /home/ubuntu/evan-james-project/frontend/public/images
echo "Backend uploads directory permissions:"
ls -ld /home/ubuntu/evan-james-project/backend/public/uploads

echo "Check complete."
