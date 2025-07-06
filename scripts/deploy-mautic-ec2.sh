#!/bin/bash

# =========================================================
# Mautic Deployment Script for EC2
# =========================================================
# This script deploys Mautic marketing automation platform on EC2:
# - Downloads and installs Mautic
# - Configures Apache/Nginx for Mautic
# - Sets up SSL certificates (optional)
# - Configures proper permissions and security
#
# Usage: bash deploy-mautic-ec2.sh [--with-ssl]
# =========================================================

# Configuration
MAUTIC_DIR="/home/ubuntu/mautic"
MAUTIC_DOMAIN="mautic.evanjamesofficial.com"
LOG_FILE="/tmp/mautic-setup-$(date +%Y%m%d%H%M%S).log"
SETUP_SSL=false
MAUTIC_VERSION="5.1.1"

# Check for SSL flag
if [[ "$1" == "--with-ssl" ]]; then
  SETUP_SSL=true
fi

# Function to log messages
log() {
  echo "$(date +"%Y-%m-%d %H:%M:%S") - $1" | tee -a $LOG_FILE
}

# Function to check if a command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Function to handle errors
handle_error() {
  log "❌ ERROR: $1"
  log "Check the log file for details: $LOG_FILE"
  exit 1
}

# Start setup
log "=== Starting Mautic Deployment ==="
log "Mautic directory: $MAUTIC_DIR"
log "Domain: $MAUTIC_DOMAIN"
log "Setup SSL: $SETUP_SSL"

# Update system packages
log "Updating system packages..."
sudo apt update || handle_error "Failed to update system packages"

# Install required packages
log "Installing required packages..."
sudo apt install -y wget unzip curl php8.1 php8.1-fpm php8.1-mysql php8.1-xml php8.1-mbstring php8.1-curl php8.1-zip php8.1-gd php8.1-intl php8.1-bcmath php8.1-imap php8.1-soap || handle_error "Failed to install required packages"

# Install MySQL if not already installed
if ! command_exists mysql; then
  log "Installing MySQL..."
  sudo apt install -y mysql-server || handle_error "Failed to install MySQL"
  
  # Secure MySQL installation
  log "Securing MySQL installation..."
  sudo mysql_secure_installation || log "⚠️ Warning: MySQL secure installation may need manual completion"
fi

# Create Mautic directory
log "Creating Mautic directory..."
sudo mkdir -p "$MAUTIC_DIR" || handle_error "Failed to create Mautic directory"

# Download Mautic
log "Downloading Mautic v$MAUTIC_VERSION..."
cd /tmp
wget "https://github.com/mautic/mautic/releases/download/$MAUTIC_VERSION/$MAUTIC_VERSION.zip" -O mautic.zip || handle_error "Failed to download Mautic"

# Extract Mautic
log "Extracting Mautic..."
sudo unzip -q mautic.zip -d "$MAUTIC_DIR" || handle_error "Failed to extract Mautic"

# Set proper permissions
log "Setting proper permissions..."
sudo chown -R www-data:www-data "$MAUTIC_DIR" || handle_error "Failed to set ownership"
sudo chmod -R 755 "$MAUTIC_DIR" || handle_error "Failed to set permissions"
sudo chmod -R 775 "$MAUTIC_DIR/var/cache" "$MAUTIC_DIR/var/logs" "$MAUTIC_DIR/var/spool" "$MAUTIC_DIR/media" "$MAUTIC_DIR/translations" || handle_error "Failed to set writable permissions"

# Create MySQL database for Mautic
log "Creating MySQL database for Mautic..."
MYSQL_ROOT_PASSWORD=$(openssl rand -base64 16)
MAUTIC_DB_PASSWORD=$(openssl rand -base64 16)

sudo mysql -e "CREATE DATABASE IF NOT EXISTS mautic;" || handle_error "Failed to create Mautic database"
sudo mysql -e "CREATE USER IF NOT EXISTS 'mautic'@'localhost' IDENTIFIED BY '$MAUTIC_DB_PASSWORD';" || handle_error "Failed to create Mautic database user"
sudo mysql -e "GRANT ALL PRIVILEGES ON mautic.* TO 'mautic'@'localhost';" || handle_error "Failed to grant database privileges"
sudo mysql -e "FLUSH PRIVILEGES;" || handle_error "Failed to flush database privileges"

# Save database credentials
log "Saving database credentials..."
cat > "/tmp/mautic-db-credentials.txt" << EOL
Mautic Database Credentials:
Database Name: mautic
Username: mautic
Password: $MAUTIC_DB_PASSWORD
Host: localhost

Save these credentials - you'll need them during Mautic setup!
EOL

log "✅ Database credentials saved to /tmp/mautic-db-credentials.txt"

# =========================================================
# NGINX CONFIGURATION
# =========================================================
log "=== Setting up Nginx Configuration for Mautic ==="

# Check if Nginx is installed
if ! command_exists nginx; then
  log "Installing Nginx..."
  sudo apt install -y nginx || handle_error "Failed to install Nginx"
fi

# Create Nginx configuration for Mautic
log "Creating Nginx configuration for Mautic..."
sudo bash -c "cat > /etc/nginx/sites-available/$MAUTIC_DOMAIN << EOL
server {
    listen 80;
    server_name $MAUTIC_DOMAIN;
    root $MAUTIC_DIR;
    index index.php index.html index.htm;

    # Security headers
    add_header X-Frame-Options 'SAMEORIGIN';
    add_header X-XSS-Protection '1; mode=block';
    add_header X-Content-Type-Options 'nosniff';
    add_header Referrer-Policy 'strict-origin-when-cross-origin';

    # Increase max body size for uploads
    client_max_body_size 100M;

    # Main location block
    location / {
        try_files \\\$uri \\\$uri/ /index.php?\\\$args;
    }

    # PHP processing
    location ~ \\.php\$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        fastcgi_param SCRIPT_FILENAME \\\$document_root\\\$fastcgi_script_name;
        include fastcgi_params;
    }

    # Deny access to sensitive files
    location ~ /\\. {
        deny all;
    }

    location ~ /(app|vendor)/ {
        deny all;
    }

    # Cache static assets
    location ~* \\.(jpg|jpeg|png|gif|ico|css|js|woff|woff2|ttf|svg)\$ {
        expires 1y;
        add_header Cache-Control 'public, immutable';
    }

    # Mautic specific configurations
    location ~* ^/index\\.php {
        fastcgi_split_path_info ^(.+\\.php)(/.+)\$;
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME \\\$document_root\\\$fastcgi_script_name;
        include fastcgi_params;
    }

    # Tracking pixel
    location = /mtracking.gif {
        access_log off;
        expires max;
        try_files \\\$uri /index.php?\\\$args;
    }

    # Deny access to specific directories
    location ^~ /var/ {
        deny all;
    }
}
EOL" || handle_error "Failed to create Mautic Nginx configuration"

# Enable Mautic site
log "Enabling Mautic Nginx site..."
sudo ln -sf "/etc/nginx/sites-available/$MAUTIC_DOMAIN" "/etc/nginx/sites-enabled/" || handle_error "Failed to enable Mautic Nginx site"

# Test Nginx configuration
log "Testing Nginx configuration..."
sudo nginx -t || handle_error "Nginx configuration test failed"

# Restart Nginx and PHP-FPM
log "Restarting Nginx and PHP-FPM..."
sudo systemctl restart nginx || handle_error "Failed to restart Nginx"
sudo systemctl restart php8.1-fpm || handle_error "Failed to restart PHP-FPM"

log "✅ Nginx configuration completed"

# =========================================================
# SSL SETUP (OPTIONAL)
# =========================================================
if [ "$SETUP_SSL" = true ]; then
  log "=== Setting up SSL with Let's Encrypt ==="
  
  # Check if certbot is installed
  if ! command_exists certbot; then
    log "Installing Certbot..."
    sudo apt install -y certbot python3-certbot-nginx || handle_error "Failed to install Certbot"
  fi
  
  # Obtain SSL certificates for Mautic
  log "Obtaining SSL certificates for Mautic..."
  sudo certbot --nginx -d "$MAUTIC_DOMAIN" --non-interactive --agree-tos --email "admin@evanjamesofficial.com" || log "⚠️ Warning: Failed to obtain SSL certificates for Mautic"
  
  log "✅ SSL setup completed"
fi

# =========================================================
# FINAL STEPS
# =========================================================
log "=== Final Steps ==="

# Set up cron jobs for Mautic
log "Setting up Mautic cron jobs..."
(sudo crontab -l 2>/dev/null; echo "*/5 * * * * php $MAUTIC_DIR/bin/console mautic:segments:update") | sudo crontab -
(sudo crontab -l 2>/dev/null; echo "*/5 * * * * php $MAUTIC_DIR/bin/console mautic:campaigns:update") | sudo crontab -
(sudo crontab -l 2>/dev/null; echo "*/5 * * * * php $MAUTIC_DIR/bin/console mautic:campaigns:trigger") | sudo crontab -

# Display status
log "Displaying Nginx status..."
sudo systemctl status nginx --no-pager

log "Displaying PHP-FPM status..."
sudo systemctl status php8.1-fpm --no-pager

# Clean up
log "Cleaning up temporary files..."
rm -f /tmp/mautic.zip

log "=== Mautic Deployment Completed Successfully! ==="
if [ "$SETUP_SSL" = true ]; then
  log "Mautic URL: https://$MAUTIC_DOMAIN"
else
  log "Mautic URL: http://$MAUTIC_DOMAIN"
fi

log "Database credentials saved to: /tmp/mautic-db-credentials.txt"
log "Setup log saved to: $LOG_FILE"

echo ""
echo "==================================================="
echo "🎉 Mautic Deployment Completed Successfully!"
echo "==================================================="
if [ "$SETUP_SSL" = true ]; then
  echo "Mautic URL: https://$MAUTIC_DOMAIN"
else
  echo "Mautic URL: http://$MAUTIC_DOMAIN"
fi
echo ""
echo "Next Steps:"
echo "1. Visit your Mautic URL to complete the web-based setup"
echo "2. Use the database credentials from /tmp/mautic-db-credentials.txt"
echo "3. Configure your DNS to point $MAUTIC_DOMAIN to your EC2 IP"
echo ""
echo "Database Credentials:"
cat /tmp/mautic-db-credentials.txt
echo ""
echo "To run this script with SSL setup:"
echo "$0 --with-ssl"
echo "==================================================="
