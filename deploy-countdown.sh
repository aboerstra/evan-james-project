#!/bin/bash

# Script to deploy the countdown page as the main website on EC2
# This will replace the current website with the countdown page

EC2_SERVER="ubuntu@evanjamesofficial.com"
EC2_KEY="ejofficial.pem"

echo "Deploying countdown page to replace main website..."

# Check if the key file exists
if [ ! -f "$EC2_KEY" ]; then
  echo "Error: EC2 key file not found at $EC2_KEY"
  exit 1
fi

# Fix permissions on the key file
chmod 600 "$EC2_KEY"

# Upload countdown files
echo "Uploading countdown files..."
scp -i "$EC2_KEY" ../countdown/countdown.html "$EC2_SERVER:~/countdown.html"
scp -i "$EC2_KEY" ../countdown/evanjames_logo_400_transparent2.png "$EC2_SERVER:~/evanjames_logo_400_transparent2.png"
scp -i "$EC2_KEY" ../countdown/tv.gif "$EC2_SERVER:~/tv.gif"
scp -i "$EC2_KEY" ../countdown/ejsilhouette_tr2.png "$EC2_SERVER:~/ejsilhouette_tr2.png"

# Create deployment script on server
echo "Creating deployment script on server..."
cat << 'EOF' > temp_deploy_script.sh
#!/bin/bash

echo "Stopping current services..."
pm2 stop all 2>/dev/null || true

echo "Backing up current website..."
sudo mkdir -p /var/backups/website-$(date +%Y%m%d-%H%M%S)
sudo cp -r /var/www/html/* /var/backups/website-$(date +%Y%m%d-%H%M%S)/ 2>/dev/null || true

echo "Clearing current website directory..."
sudo rm -rf /var/www/html/*

echo "Deploying countdown page..."
sudo cp ~/countdown.html /var/www/html/index.html
sudo cp ~/evanjames_logo_400_transparent2.png /var/www/html/
sudo cp ~/tv.gif /var/www/html/
sudo cp ~/ejsilhouette_tr2.png /var/www/html/

echo "Setting proper permissions..."
sudo chown -R www-data:www-data /var/www/html/
sudo chmod -R 755 /var/www/html/

echo "Restarting nginx..."
sudo systemctl restart nginx

echo "Countdown page deployed successfully!"
echo "Visit https://evanjamesofficial.com to see the countdown page"

# Clean up uploaded files
rm -f ~/countdown.html ~/evanjames_logo_400_transparent2.png ~/tv.gif ~/ejsilhouette_tr2.png
EOF

# Upload and execute the deployment script
scp -i "$EC2_KEY" temp_deploy_script.sh "$EC2_SERVER:~/deploy_countdown.sh"
ssh -i "$EC2_KEY" "$EC2_SERVER" "chmod +x ~/deploy_countdown.sh && ./deploy_countdown.sh"

# Clean up local temp file
rm -f temp_deploy_script.sh

echo ""
echo "Deployment complete!"
echo "The countdown page is now live at https://evanjamesofficial.com"
echo ""
echo "Note: This has replaced your existing website with the countdown page."
echo "The previous website has been backed up on the server in /var/backups/"
