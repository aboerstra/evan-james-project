#!/bin/bash

# Script to properly restart the frontend and backend services on the EC2 instance
# This script should be run on the EC2 instance with sudo

echo "Starting service restart process..."

# Function to restart a service properly
restart_service() {
  local service_name=$1
  echo "Restarting $service_name service..."
  
  # Check if the service is running
  if pm2 list | grep -q "$service_name"; then
    echo "Found running instances of $service_name, stopping all..."
    
    # Get all process IDs for this service
    process_ids=$(pm2 list | grep "$service_name" | awk '{print $2}')
    
    # Stop all instances
    for id in $process_ids; do
      echo "Stopping process ID $id..."
      pm2 delete $id
    done
    
    echo "All $service_name instances stopped."
  else
    echo "No running instances of $service_name found."
  fi
  
  # Start a fresh instance
  if [ "$service_name" == "evan-james-backend" ]; then
    echo "Starting new backend instance..."
    cd /home/ubuntu/evan-james-project/backend
    sudo -u ubuntu pm2 start npm --name "evan-james-backend" -- run start
  elif [ "$service_name" == "evan-james-frontend" ]; then
    echo "Starting new frontend instance..."
    cd /home/ubuntu/evan-james-project/frontend
    sudo -u ubuntu pm2 start npm --name "evan-james-frontend" -- run start
  fi
  
  echo "$service_name restarted successfully."
}

# Restart backend service
restart_service "evan-james-backend"

# Restart frontend service
restart_service "evan-james-frontend"

# Save the PM2 process list
echo "Saving PM2 process list..."
pm2 save

# Display current status
echo "Current service status:"
pm2 status

echo "Service restart process completed."
echo "If you need to check logs, use: pm2 logs evan-james-backend or pm2 logs evan-james-frontend"
