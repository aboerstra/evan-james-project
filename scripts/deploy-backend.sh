#!/bin/bash

# This script deploys the Evan James backend (Strapi) to the production server
# Run it from your local machine

# Set the server details
SERVER_USER="ubuntu"
SERVER_IP="3.93.60.230"
SSH_KEY="~/ejofficial.pem"
TARGET_DIR="/home/ubuntu/evan-james"

echo "Deploying Evan James backend to production server..."

# Create a temporary directory for the build
echo "Creating build directory..."
mkdir -p ./build

# Copy the backend files
echo "Copying backend files..."
cp -r ./backend ./build/
cp ./init-db.sh ./build/

# Create a deployment package
echo "Creating deployment package..."
cd ./build
tar -czf ../backend-deploy.tar.gz ./backend ./init-db.sh
cd ..

# Upload the deployment package to the server
echo "Uploading to server..."
scp -i $SSH_KEY backend-deploy.tar.gz $SERVER_USER@$SERVER_IP:~

# Extract and set up on the server
echo "Setting up on the server..."
ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP << 'EOT'
mkdir -p evan-james
tar -xzf backend-deploy.tar.gz -C evan-james
cd evan-james
chmod +x init-db.sh
./init-db.sh

# Install dependencies and build the backend
cd backend
npm install
npm run build
echo "Setting up PM2 for the backend..."
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
fi
pm2 stop evan-james-backend || true
pm2 delete evan-james-backend || true
pm2 start npm --name "evan-james-backend" -- run start
pm2 save
EOT

# Clean up
echo "Cleaning up..."
rm -rf ./build
rm backend-deploy.tar.gz

echo "Backend deployment complete!"
echo "Backend is now running at http://$SERVER_IP:1337"
echo "Admin panel is accessible at http://$SERVER_IP:1337/admin" 