#!/bin/bash

# This script deploys the Evan James frontend to the production server
# Run it from your local machine

# Set the server details
SERVER_USER="ubuntu"
SERVER_IP="3.93.60.230"
SSH_KEY="~/ejofficial.pem"
TARGET_DIR="/home/ubuntu/evan-james"

echo "Deploying Evan James frontend to production server..."

# Create a temporary directory for the build
echo "Creating build directory..."
mkdir -p ./build

# Copy the frontend files
echo "Copying frontend files..."
cp -r ./frontend ./build/

# Create a deployment package
echo "Creating deployment package..."
cd ./build
tar -czf ../frontend-deploy.tar.gz ./frontend
cd ..

# Upload the deployment package to the server
echo "Uploading to server..."
scp -i $SSH_KEY frontend-deploy.tar.gz $SERVER_USER@$SERVER_IP:~

# Extract and set up on the server
echo "Setting up on the server..."
ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP << 'EOT'
mkdir -p evan-james
tar -xzf frontend-deploy.tar.gz -C evan-james

# Set up frontend environment
cd evan-james/frontend
echo "NEXT_PUBLIC_API_URL=https://api.evanjamesofficial.com" > .env.production

# Install dependencies and build the frontend
npm install
npm run build

# Set up PM2 for the frontend
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
fi
pm2 stop evan-james-frontend || true
pm2 delete evan-james-frontend || true
pm2 start npm --name "evan-james-frontend" -- run start
pm2 save
EOT

# Clean up
echo "Cleaning up..."
rm -rf ./build
rm frontend-deploy.tar.gz

echo "Frontend deployment complete!"
echo "Frontend is now running at https://evanjamesofficial.com" 