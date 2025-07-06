#!/bin/bash

# Script to upload the EC2 setup script to your EC2 server
# Usage: ./upload-setup-script.sh <path-to-pem-file> <ec2-server-address>

# Check if arguments are provided
if [ $# -lt 2 ]; then
  echo "Usage: $0 <path-to-pem-file> <ec2-server-address>"
  echo "Example: $0 ~/keys/evan-james.pem ubuntu@ec2-12-34-56-78.compute-1.amazonaws.com"
  exit 1
fi

PEM_FILE=$1
EC2_SERVER=$2

# Check if PEM file exists
if [ ! -f "$PEM_FILE" ]; then
  echo "Error: PEM file not found at $PEM_FILE"
  exit 1
fi

# Fix permissions on the key file
echo "Setting correct permissions on the key file..."
chmod 600 "$PEM_FILE"

# Upload the setup script
echo "Uploading EC2 setup script to $EC2_SERVER..."
scp -i "$PEM_FILE" scripts/ec2-setup-complete.sh "$EC2_SERVER:~/"
scp -i "$PEM_FILE" README-EC2-SETUP.md "$EC2_SERVER:~/"

# Make the script executable on the server
echo "Making the script executable..."
ssh -i "$PEM_FILE" "$EC2_SERVER" "chmod +x ~/ec2-setup-complete.sh"

echo "Upload complete!"
echo "To run the setup script on your EC2 server, SSH into the server and run:"
echo "  ./ec2-setup-complete.sh"
echo "Or with SSL setup:"
echo "  ./ec2-setup-complete.sh --with-ssl"
