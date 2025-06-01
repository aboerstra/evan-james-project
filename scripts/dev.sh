#!/bin/bash

# Local development script for Evan James Website

# Function to check if MySQL is installed
check_mysql() {
  if command -v mysql >/dev/null 2>&1; then
    echo "MySQL is installed."
  else
    echo "MySQL is not installed. Please install it before continuing."
    echo "You can install it with: sudo apt install mysql-server"
    exit 1
  fi
}

# Function to start backend
start_backend() {
  echo "Starting Strapi backend..."
  cd backend
  npm install
  npm run develop
}

# Function to start frontend
start_frontend() {
  echo "Starting Next.js frontend..."
  cd frontend
  npm install
  npm run dev
}

# Main execution
echo "Evan James Website - Local Development"
echo "------------------------------------"

# Check requirements
check_mysql

# Start services
echo "Choose what to start:"
echo "1. Backend (Strapi)"
echo "2. Frontend (Next.js)"
echo "3. Both (in separate terminals)"
read -p "Enter option (1-3): " option

case $option in
  1)
    start_backend
    ;;
  2)
    start_frontend
    ;;
  3)
    echo "Starting both services in separate terminals..."
    gnome-terminal --tab --title="Backend" --command="bash -c 'cd $(pwd)/backend && npm install && npm run develop; bash'" || {
      echo "Failed to open new terminal. Starting backend in this terminal instead."
      start_backend
      exit 0
    }
    gnome-terminal --tab --title="Frontend" --command="bash -c 'cd $(pwd)/frontend && npm install && npm run dev; bash'" || {
      echo "Failed to open new terminal. Please open a new terminal and run:"
      echo "cd $(pwd)/frontend && npm install && npm run dev"
    }
    ;;
  *)
    echo "Invalid option. Exiting."
    exit 1
    ;;
esac

echo "Development environment started!" 