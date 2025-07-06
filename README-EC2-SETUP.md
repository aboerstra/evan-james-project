# Evan James Website - EC2 Setup Guide

This guide provides instructions for setting up the Evan James website on an EC2 server using the simplified setup script.

## Prerequisites

- An EC2 instance running Ubuntu
- Domain names configured to point to your EC2 instance:
  - `evanjamesofficial.com` and `www.evanjamesofficial.com` for the frontend
  - `api.evanjamesofficial.com` for the backend
- Node.js v18.19.1 installed on your EC2 instance

## Setup Instructions

1. Clone the repository on your EC2 server:
   ```bash
   git clone https://github.com/aboerstra/evan-james-project.git
   cd evan-james-project
   ```

2. Make the setup script executable:
   ```bash
   chmod +x scripts/ec2-setup-complete.sh
   ```

3. Run the setup script:
   ```bash
   ./scripts/ec2-setup-complete.sh
   ```

   If you want to set up SSL certificates with Let's Encrypt, run:
   ```bash
   ./scripts/ec2-setup-complete.sh --with-ssl
   ```

4. After the script completes, you should be able to access:
   - Frontend: `https://evanjamesofficial.com`
   - Backend API: `https://api.evanjamesofficial.com`
   - Backend Admin: `https://api.evanjamesofficial.com/admin`

## What the Script Does

The `ec2-setup-complete.sh` script performs the following tasks:

1. **Backend Setup**:
   - Creates necessary directories
   - Installs backend dependencies
   - Creates a proper `.env` file with secure random keys
   - Builds the Strapi backend
   - Seeds the database with initial content types and sample data
   - Starts the backend with PM2

2. **Frontend Setup**:
   - Creates necessary directories
   - Installs frontend dependencies
   - Creates a proper `.env` file
   - Builds the Next.js frontend
   - Starts the frontend with PM2

3. **Nginx Configuration**:
   - Creates Nginx configurations for both frontend and backend
   - Sets up proper proxy settings
   - Configures caching for static assets
   - Adds security headers
   - Enables the sites and restarts Nginx

4. **SSL Setup** (if `--with-ssl` flag is used):
   - Installs Certbot
   - Obtains SSL certificates for both domains
   - Configures Nginx to use HTTPS

5. **Final Steps**:
   - Sets up PM2 to start on boot
   - Displays status information

## Troubleshooting

If you encounter any issues during or after setup:

1. Check the setup log file (path will be displayed at the end of the script output)
2. Check PM2 logs: `pm2 logs`
3. Check Nginx error logs: `sudo tail -f /var/log/nginx/error.log`
4. Check Strapi logs: `pm2 logs evan-james-backend`
5. Check Next.js logs: `pm2 logs evan-james-frontend`

## Manual Steps (if needed)

If you need to run any steps manually:

### Backend Setup

```bash
cd ~/evan-james/backend
npm install
npm run build
node ./scripts/seed-initial-data.js
pm2 start npm --name "evan-james-backend" -- run start
```

### Frontend Setup

```bash
cd ~/evan-james/frontend
npm install
npm run build
pm2 start npm --name "evan-james-frontend" -- run start
```

### Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/evanjamesofficial.com
sudo nano /etc/nginx/sites-available/api.evanjamesofficial.com
sudo nginx -t
sudo systemctl restart nginx
```

### SSL Setup

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d evanjamesofficial.com -d www.evanjamesofficial.com
sudo certbot --nginx -d api.evanjamesofficial.com
