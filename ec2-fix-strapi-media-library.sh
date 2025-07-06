#!/bin/bash

# Script to fix Strapi media library issues when images exist but don't appear in the UI
# This script should be run on the EC2 instance with sudo

echo "Starting Strapi media library fix process..."

# Navigate to the project directory
cd /home/ubuntu/evan-james-project || { echo "Project directory not found!"; exit 1; }

# Check if the backend uploads directory exists and has files
echo "Checking backend uploads directory..."
if [ ! -d "backend/public/uploads" ]; then
  echo "ERROR: Uploads directory does not exist!"
  echo "Creating uploads directory..."
  mkdir -p backend/public/uploads
  echo "You will need to upload images to this directory."
  exit 1
fi

# Count files in backend uploads directory
file_count=$(find backend/public/uploads -type f | wc -l)
echo "Found $file_count files in backend uploads directory."

if [ "$file_count" -eq 0 ]; then
  echo "ERROR: No files found in uploads directory!"
  echo "You need to upload images to the uploads directory first."
  exit 1
fi

# Navigate to the backend directory
cd backend || { echo "Backend directory not found!"; exit 1; }

# Check if the SQLite database exists
if [ ! -f ".tmp/data.db" ]; then
  echo "WARNING: SQLite database not found at expected location."
  echo "Checking alternative locations..."
  
  # Try to find the database file
  db_file=$(find . -name "*.db" | head -n 1)
  
  if [ -z "$db_file" ]; then
    echo "ERROR: Could not find SQLite database file."
    echo "This script assumes Strapi is using SQLite. If you're using a different database, manual intervention may be required."
  else
    echo "Found database file at: $db_file"
  fi
else
  echo "Found SQLite database at .tmp/data.db"
fi

# Fix permissions on the uploads directory
echo "Setting correct permissions on uploads directory..."
chmod -R 755 public/uploads
chown -R ubuntu:ubuntu public/uploads

# Clear Strapi cache
echo "Clearing Strapi cache..."
rm -rf .cache
mkdir -p .cache
chmod 755 .cache

# Stop the Strapi service
echo "Stopping Strapi service..."
pm2 stop evan-james-backend

# Wait a moment
sleep 5

# Start the Strapi service
echo "Starting Strapi service..."
sudo -u ubuntu pm2 start npm --name "evan-james-backend" -- run start

# Wait for Strapi to start
echo "Waiting for Strapi to start (30 seconds)..."
sleep 30

# Check if Strapi is running
if pm2 show evan-james-backend | grep -q "online"; then
  echo "Strapi is running."
else
  echo "WARNING: Strapi may not have started properly."
  echo "Check the logs with: pm2 logs evan-james-backend"
fi

echo "Strapi media library fix process completed."
echo "If images still don't appear in the Strapi UI, try the following:"
echo "1. Log out and log back in to the Strapi admin panel"
echo "2. Check the Strapi logs with: pm2 logs evan-james-backend"
echo "3. Try uploading a new image through the Strapi admin panel"
echo "4. If all else fails, you may need to rebuild the Strapi database entries for the media library"
