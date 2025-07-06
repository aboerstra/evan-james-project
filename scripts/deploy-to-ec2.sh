#!/bin/bash

# Script to deploy the Evan James website to your EC2 server
# This script has the EC2 connection details baked in

# EC2 server address
EC2_SERVER="ubuntu@evanjamesofficial.com"

# Check if PEM file is provided as argument
if [ $# -eq 1 ]; then
  EC2_KEY="$1"
else
  # Try to find the PEM file in common locations
  if [ -f "scripts/ejofficial.pem" ]; then
    EC2_KEY="scripts/ejofficial.pem"
  elif [ -f "$HOME/ejofficial.pem" ]; then
    EC2_KEY="$HOME/ejofficial.pem"
  elif [ -f "$HOME/.ssh/ejofficial.pem" ]; then
    EC2_KEY="$HOME/.ssh/ejofficial.pem"
  else
    echo "Error: PEM file not found."
    echo "Please provide the path to your PEM file as an argument:"
    echo "  ./scripts/deploy-to-ec2.sh /path/to/ejofficial.pem"
    exit 1
  fi
fi

echo "Using EC2 key at: $EC2_KEY"

# Check if the key file exists
if [ ! -f "$EC2_KEY" ]; then
  echo "Error: EC2 key file not found at $EC2_KEY"
  echo "Please provide the correct path to your EC2 key file:"
  echo "  ./scripts/deploy-to-ec2.sh /path/to/ejofficial.pem"
  exit 1
fi

# Fix permissions on the key file
echo "Setting correct permissions on the key file..."
chmod 600 "$EC2_KEY"

# Upload the setup script and documentation
echo "Uploading setup files to $EC2_SERVER..."
scp -i "$EC2_KEY" scripts/ec2-setup-complete.sh "$EC2_SERVER:~/"
scp -i "$EC2_KEY" scripts/fix-nextjs-export.sh "$EC2_SERVER:~/"
scp -i "$EC2_KEY" scripts/fix-strapi-uploads.sh "$EC2_SERVER:~/"
scp -i "$EC2_KEY" scripts/kill-port-process.sh "$EC2_SERVER:~/"
scp -i "$EC2_KEY" README-EC2-SETUP.md "$EC2_SERVER:~/"
scp -i "$EC2_KEY" EC2-DEPLOYMENT-CHECKLIST.md "$EC2_SERVER:~/"
scp -i "$EC2_KEY" docs/NEXTJS_EXPORT_ERROR_FIX.md "$EC2_SERVER:~/"
scp -i "$EC2_KEY" docs/STRAPI_UPLOADS_ERROR_FIX.md "$EC2_SERVER:~/"
scp -i "$EC2_KEY" docs/PORT_IN_USE_ERROR_FIX.md "$EC2_SERVER:~/"

# Make the scripts executable on the server
echo "Making the scripts executable..."
ssh -i "$EC2_KEY" "$EC2_SERVER" "chmod +x ~/ec2-setup-complete.sh && chmod +x ~/fix-nextjs-export.sh && chmod +x ~/fix-strapi-uploads.sh && chmod +x ~/kill-port-process.sh"

echo "Files uploaded successfully!"
echo ""
echo "To complete the deployment:"
echo "1. SSH into your server: ssh -i $EC2_KEY $EC2_SERVER"
echo "2. Run the setup script: ./ec2-setup-complete.sh"
echo "   (or with SSL: ./ec2-setup-complete.sh --with-ssl)"
echo ""
echo "If you encounter Next.js export errors during deployment:"
echo "3. Read the documentation: cat NEXTJS_EXPORT_ERROR_FIX.md"
echo "4. Run the fix script: ./fix-nextjs-export.sh"
echo "5. Restart the frontend service: pm2 restart frontend"
echo ""
echo "If you encounter Strapi uploads folder errors:"
echo "1. Read the documentation: cat STRAPI_UPLOADS_ERROR_FIX.md"
echo "2. Run the fix script: ./fix-strapi-uploads.sh"
echo "3. Restart the backend service: pm2 restart backend"
echo ""
echo "If you encounter port in use errors (e.g., port 1337 already in use):"
echo "1. Read the documentation: cat PORT_IN_USE_ERROR_FIX.md"
echo "2. Run the port process killer script: ./kill-port-process.sh 1337"
echo "3. Follow the interactive prompts to identify and kill the process"
echo ""
echo "Would you like to SSH into the server now? (y/n)"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
  echo "Connecting to $EC2_SERVER..."
  ssh -i "$EC2_KEY" "$EC2_SERVER"
fi
