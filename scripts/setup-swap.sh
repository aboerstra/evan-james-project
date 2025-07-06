#!/bin/bash

# Script to set up swap space on EC2 instance
# This helps prevent out-of-memory errors during deployment
# Run this script with sudo on the EC2 server

# Configuration
SWAP_SIZE_GB=2  # Size of swap file in GB

echo "=== Setting up swap space ($SWAP_SIZE_GB GB) ==="
echo "$(date)"

# Check if swap is already enabled
SWAP_ENABLED=$(free | grep -i swap | awk '{print $2}')

if [ "$SWAP_ENABLED" -gt 0 ]; then
  echo "Swap is already enabled. Current swap configuration:"
  free -h
  
  read -p "Do you want to add more swap space? (y/n): " ADD_MORE
  if [ "$ADD_MORE" != "y" ]; then
    echo "Exiting without changes."
    exit 0
  fi
fi

# Check if running as root
if [ "$(id -u)" -ne 0 ]; then
  echo "ERROR: This script must be run as root (with sudo)."
  echo "Please run: sudo $0"
  exit 1
fi

# Create swap file
echo "Creating $SWAP_SIZE_GB GB swap file..."
fallocate -l ${SWAP_SIZE_GB}G /swapfile

# Set proper permissions
echo "Setting permissions..."
chmod 600 /swapfile

# Set up swap area
echo "Setting up swap area..."
mkswap /swapfile

# Enable swap
echo "Enabling swap..."
swapon /swapfile

# Add to fstab for persistence across reboots
if ! grep -q "/swapfile" /etc/fstab; then
  echo "Adding swap to /etc/fstab for persistence across reboots..."
  echo '/swapfile none swap sw 0 0' | tee -a /etc/fstab
else
  echo "Swap entry already exists in /etc/fstab."
fi

# Verify swap is active
echo "Verifying swap configuration:"
free -h

# Adjust swappiness for better performance
echo "Adjusting swappiness for better performance..."
sysctl vm.swappiness=10
echo "vm.swappiness=10" | tee -a /etc/sysctl.conf

echo "=== Swap setup completed successfully! ==="
echo "$(date)"
echo ""
echo "Current memory and swap configuration:"
free -h
echo ""
echo "Note: The system will use this swap space automatically when needed."
echo "This should help prevent out-of-memory errors during deployment."
