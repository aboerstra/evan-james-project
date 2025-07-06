#!/bin/bash

# Script to fix multiple instances of backend and frontend services
# This script should be run on the EC2 instance with sudo

echo "Starting fix for multiple service instances..."

# Stop all PM2 processes
echo "Stopping all PM2 processes..."
pm2 stop all
pm2 delete all

echo "All PM2 processes stopped and removed."

# Start a single instance of the backend
echo "Starting a single instance of the backend..."
cd /home/ubuntu/evan-james-project/backend
sudo -u ubuntu pm2 start npm --name "evan-james-backend" -- run start

# Wait for the backend to start
echo "Waiting for backend to start..."
sleep 10

# Start a single instance of the frontend
echo "Starting a single instance of the frontend..."
cd /home/ubuntu/evan-james-project/frontend
sudo -u ubuntu pm2 start npm --name "evan-james-frontend" -- run start

# Save the PM2 process list
echo "Saving PM2 process list..."
pm2 save

# Display current status
echo "Current service status:"
pm2 status

echo "Fix completed. There should now be only one instance of each service running."
echo "If you need to check logs, use: pm2 logs evan-james-backend or pm2 logs evan-james-frontend"
