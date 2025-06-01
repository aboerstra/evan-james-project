# Evan James Website Deployment Guide

This guide explains how to deploy the Evan James artist website in different environments, including local development, WSL2, and production (EC2).

## Environment Setup

### Prerequisites
- Node.js v18.19.1
- MySQL
- PM2 (for process management)
- Git

### Environment Variables Management

We use separate variable files for different environments:

- `frontend-variables.local.md` - Frontend variables for local development
- `frontend-variables.ec2.md` - Frontend variables for production (EC2) deployment
- `backend-variables.local.md` - Backend variables for local development
- `backend-variables.ec2.md` - Backend variables for production (EC2) deployment

To convert these files to `.env` files, use the provided script:

```bash
# For local development
./scripts/convert_variables.sh development local

# For production deployment
./scripts/convert_variables.sh production ec2
```

For more details on environment variable management, see `docs/ENVIRONMENT_VARIABLES.md`.

## Local Development Setup

### Backend Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/aboerstra/evanjamesofficial.git
   cd evanjamesofficial
   ```

2. Set up environment variables:
   ```bash
   ./scripts/convert_variables.sh development local
   ```

3. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

4. Start the development server:
   ```bash
   # Install PM2 globally if not already installed
   npm install -g pm2
   
   # Start Strapi through PM2
   pm2 start npm --name "strapi" -- run develop
   ```

5. Access the admin panel:
   - URL: http://localhost:1337/admin
   - Default admin: admin@example.com (change in production)

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Access the frontend:
   - URL: http://localhost:3000

## WSL2 Setup

### Network Configuration
1. Get WSL2 IP address:
   ```bash
   ip addr show eth0 | grep -oP 'inet \K[\d.]+'
   ```

2. Update IP in .env:
   ```
   PUBLIC_URL=http://<WSL2_IP>:1337
   ```

3. Configure Windows Firewall:
   - Open Windows Defender Firewall with Advanced Security
   - Add Inbound Rule for port 1337
   - Allow TCP
   - Allow for all profiles (Domain, Private, Public)

### Server Configuration
Update the Strapi server configuration in `backend/config/server.js`:

```javascript
module.exports = () => ({
  host: '0.0.0.0',
  port: 1337,
  url: 'http://<WSL2_IP>:1337',
  app: {
    keys: ['myKeyA', 'myKeyB']
  },
  admin: {
    auth: {
      secret: 'myAdminJwtSecret'
    },
  },
});
```

### Starting Strapi in WSL2
1. Stop existing processes:
   ```bash
   pkill -f strapi && pkill -f node && sleep 2
   ```

2. Verify port is free:
   ```bash
   netstat -tulpn | grep :1337
   ```

3. Start Strapi:
   ```bash
   cd backend
   npm run develop
   ```

### Starting Frontend in WSL2
1. Update the frontend environment variables:
   ```
   NEXT_PUBLIC_API_URL=http://<WSL2_IP>:1337
   ```

2. Start the frontend:
   ```bash
   cd frontend
   npm run dev
   ```

## Production Deployment (EC2)

### Prepare Environment Variables

**Before deployment:**
- Ensure both `frontend-variables.ec2.md` and `backend-variables.ec2.md` have appropriate production values
- Double-check sensitive credentials like database passwords and API keys
- Store a secure copy of these production values offline
- Verify that API keys have sufficient quota

### Deploy Backend (Strapi)

1. Clone the repository:
   ```bash
   git clone https://github.com/aboerstra/evanjamesofficial.git
   cd evanjamesofficial
   ```

2. Convert EC2 variables to .env files:
   ```bash
   ./scripts/convert_variables.sh production ec2
   ```

3. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

4. Build Strapi:
   ```bash
   npm run build
   ```

5. Start the production server:
   ```bash
   NODE_ENV=production npm run start
   ```

   Alternatively, use PM2:
   ```bash
   pm2 start npm --name "evan-james-backend" -- run start
   ```

### Deploy Frontend (Next.js)

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the Next.js application:
   ```bash
   npm run build
   ```

4. Start the production server:
   ```bash
   npm run start
   ```

   Alternatively, use PM2:
   ```bash
   pm2 start npm --name "evan-james-frontend" -- run start
   ```

### Configure Nginx

Set up Nginx to proxy requests to both the frontend and backend servers:

```nginx
# Frontend
server {
    listen 80;
    server_name evanjamesofficial.com www.evanjamesofficial.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Backend API
server {
    listen 80;
    server_name api.evanjamesofficial.com;
    
    location / {
        proxy_pass http://localhost:1337;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Set Up SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d evanjamesofficial.com -d www.evanjamesofficial.com
sudo certbot --nginx -d api.evanjamesofficial.com
```

## Security Configuration

### Content Security Policy
Configure Content Security Policy in `backend/config/middlewares.js`:

```javascript
module.exports = [
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'default-src': ["'self'"],
          'img-src': ["'self'", 'data:', 'blob:', 'https://market-assets.strapi.io'],
          'media-src': ["'self'", 'data:', 'blob:'],
          'connect-src': ["'self'", 'https:'],
          'script-src': ["'self'", "'unsafe-inline'", 'cdn.jsdelivr.net'],
          'style-src': ["'self'", "'unsafe-inline'"],
          'frame-src': ["'self'"],
        },
      },
      xframe: {
        enabled: true,
        value: 'SAMEORIGIN',
      },
      hsts: {
        enabled: true,
        maxAge: 31536000,
        includeSubDomains: true,
      },
      xss: {
        enabled: true,
        mode: 'block',
      },
    },
  },
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
```

### CORS Configuration
Configure CORS in `backend/config/middlewares.js`:

```javascript
{
  name: 'strapi::cors',
  config: {
    enabled: true,
    origin: ['http://localhost:3000', 'https://www.evanjamesofficial.com'],
    headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
    keepHeaderOnError: true,
  },
}
```

## Monitoring & Maintenance

### Process Management with PM2

View running processes:
```bash
pm2 list
```

Monitor logs:
```bash
pm2 logs
```

Restart processes:
```bash
pm2 restart all
```

### Database Backup

Set up a cron job for regular database backups:

```bash
# Add to crontab
0 2 * * * /home/ubuntu/evanjamesofficial/scripts/backup-db.sh
```

Create a backup script (`scripts/backup-db.sh`):

```bash
#!/bin/bash
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/home/ubuntu/backups"
mkdir -p $BACKUP_DIR

# Backup MySQL database
mysqldump -u strapi -p'your_password' evan_james_site > $BACKUP_DIR/evan_james_db_$TIMESTAMP.sql

# Compress backup
gzip $BACKUP_DIR/evan_james_db_$TIMESTAMP.sql

# Remove backups older than 30 days
find $BACKUP_DIR -name "evan_james_db_*.sql.gz" -type f -mtime +30 -delete
```

### Media Backup

Set up a cron job for regular media backups:

```bash
# Add to crontab
0 3 * * * /home/ubuntu/evanjamesofficial/scripts/backup-media.sh
```

Create a backup script (`scripts/backup-media.sh`):

```bash
#!/bin/bash
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/home/ubuntu/backups"
MEDIA_DIR="/home/ubuntu/evanjamesofficial/backend/public/uploads"
mkdir -p $BACKUP_DIR

# Backup media files
tar -czf $BACKUP_DIR/evan_james_media_$TIMESTAMP.tar.gz $MEDIA_DIR

# Remove backups older than 30 days
find $BACKUP_DIR -name "evan_james_media_*.tar.gz" -type f -mtime +30 -delete
```

## Troubleshooting

### Connection Issues
1. Verify Strapi is running:
   ```bash
   ps aux | grep node
   ```
2. Check port binding:
   ```bash
   netstat -tulpn | grep :1337
   ```
3. Verify WSL2 IP (if using WSL):
   ```bash
   ip addr show eth0
   ```
4. Test local connection:
   ```bash
   curl -v http://localhost:1337
   ```

### Environment Issues
1. Verify .env exists:
   ```bash
   ls -l .env
   ```
2. Check variable count:
   ```bash
   cat .env | grep -v '^#' | grep -v '^$' | wc -l
   ```

### Process Management
1. Clean shutdown:
   ```bash
   pkill -f strapi && pkill -f node
   ```
2. Verify no lingering processes:
   ```bash
   ps aux | grep -E 'strapi|node'
   ```
3. Check port availability:
   ```bash
   netstat -tulpn | grep :1337
   ```

## Rollback Procedure

If you need to rollback to a previous version:

1. Revert to the previous code version:
   ```bash
   git checkout <previous-commit-hash>
   ```

2. Ensure you're using the corresponding environment variables:
   ```bash
   ./scripts/convert_variables.sh production ec2
   ```

3. Rebuild and restart the services:
   ```bash
   # Backend
   cd backend
   npm install
   npm run build
   pm2 restart evan-james-backend

   # Frontend
   cd ../frontend
   npm install
   npm run build
   pm2 restart evan-james-frontend
   ```

## Quick Reference

### Start Fresh
```bash
pkill -f strapi && pkill -f node && sleep 2
cd backend && npm run develop
```

### Verify Setup
```bash
netstat -tulpn | grep :1337
cat .env | wc -l
curl -v http://localhost:1337
```

### Security Check
```bash
# Check for open ports
netstat -tulpn

# Verify file permissions
ls -la .env config/server.js

# Check process security
ps aux | grep node
```

---

*Last updated: May 31, 2025*
