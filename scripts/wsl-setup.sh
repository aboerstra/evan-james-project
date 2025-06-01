#!/bin/bash

# WSL Setup Script for Evan James Website
# This script helps set up the development environment in WSL

echo "Setting up development environment in WSL for Evan James Website..."

# Install essential packages
echo "Installing essential packages..."
sudo apt update
sudo apt install -y build-essential git curl wget vim

# Install Node.js via NVM
echo "Installing Node.js via NVM..."
if [ ! -d "$HOME/.nvm" ]; then
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
  [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
  nvm install 16
  nvm use 16
else
  echo "NVM is already installed. Skipping..."
fi

# Install PostgreSQL if not installed
echo "Installing PostgreSQL..."
if ! command -v psql &> /dev/null; then
  sudo apt install -y postgresql postgresql-contrib
  sudo service postgresql start
  sudo -u postgres createuser --superuser $USER || true
  createdb evan_james_site || true
else
  echo "PostgreSQL is already installed. Skipping..."
fi

# Enable PostgreSQL to start automatically
echo "Enabling PostgreSQL to start automatically in WSL..."
if ! grep -q "sudo service postgresql start" ~/.bashrc; then
  echo "# Start PostgreSQL when WSL launches" >> ~/.bashrc
  echo "if service postgresql status 2>&1 | grep -q 'not running'; then" >> ~/.bashrc
  echo "  sudo service postgresql start" >> ~/.bashrc
  echo "fi" >> ~/.bashrc
fi

# Setup completed
echo "WSL setup completed! You can now run the project using ./dev.sh"
echo "After opening a new terminal, or run these commands in your current terminal:"
echo "source ~/.bashrc"
echo "./dev.sh" 