#!/bin/bash

# EC2 Setup Script for Evan James Website
# Run this script on a fresh EC2 instance to set up the environment

# Update system
echo "Updating system..."
sudo apt update && sudo apt upgrade -y

# Install required packages
echo "Installing dependencies..."
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common git nginx certbot python3-certbot-nginx

# Install Docker
echo "Installing Docker..."
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io

# Install Docker Compose
echo "Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Add current user to docker group
sudo usermod -aG docker $USER

# Clone repository (replace with your actual repository)
echo "Cloning repository..."
git clone https://github.com/yourusername/evan-james-website.git /home/$USER/evan-james-website

# Configure Nginx
echo "Configuring Nginx..."
sudo cp /home/$USER/evan-james-website/nginx/nginx.conf /etc/nginx/nginx.conf
sudo systemctl enable nginx
sudo systemctl restart nginx

# Setup SSL with Certbot (replace with your actual domain)
echo "Setting up SSL (you'll need to complete this step manually)..."
echo "Run: sudo certbot --nginx -d evanjamesmusic.com -d www.evanjamesmusic.com"

echo "Setup complete! Please log out and log back in for Docker permissions to take effect."
echo "Then navigate to your project directory and run ./deploy.sh" 