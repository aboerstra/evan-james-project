#!/bin/bash

# Script to fix Strapi image paths in the frontend code
# This script should be run on the EC2 instance with sudo

echo "Starting Strapi image path fix process..."

# Navigate to the project directory
cd /home/ubuntu/evan-james-project

# Create the uploads directory in the backend if it doesn't exist
echo "Creating uploads directory in the backend..."
mkdir -p /home/ubuntu/evan-james-project/backend/public/uploads

# Copy the frontend images to the Strapi uploads directory
echo "Copying frontend images to Strapi uploads directory..."
cp -r /home/ubuntu/evan-james-project/frontend/public/images/* /home/ubuntu/evan-james-project/backend/public/uploads/

# Set the correct permissions
echo "Setting correct permissions..."
chown -R ubuntu:ubuntu /home/ubuntu/evan-james-project/backend/public/uploads
chmod -R 755 /home/ubuntu/evan-james-project/backend/public/uploads

# Create a symbolic link for the uploads directory in the nginx configuration
echo "Creating symbolic link for uploads directory..."
ln -sf /home/ubuntu/evan-james-project/backend/public/uploads /var/www/html/uploads

# Update nginx configuration to serve the uploads directory
echo "Updating nginx configuration..."
cat > /etc/nginx/sites-available/uploads.conf << 'EOF'
server {
    listen 80;
    server_name api.evanjamesofficial.com;

    location /uploads/ {
        alias /home/ubuntu/evan-james-project/backend/public/uploads/;
        try_files $uri $uri/ =404;
    }

    location / {
        proxy_pass http://localhost:1337;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Enable the new configuration
echo "Enabling the new nginx configuration..."
ln -sf /etc/nginx/sites-available/uploads.conf /etc/nginx/sites-enabled/uploads.conf

# Restart nginx to apply the changes
echo "Restarting nginx..."
systemctl restart nginx

# Restart the backend service
echo "Restarting the backend service..."
pm2 restart evan-james-backend

# Restart the frontend service
echo "Restarting the frontend service..."
pm2 restart evan-james-frontend

echo "Strapi image path fix process completed."
echo "Check the frontend and backend services with: pm2 status"
