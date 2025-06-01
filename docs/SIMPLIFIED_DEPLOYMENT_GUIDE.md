# Simplified Deployment Guide for Evan James Project

This guide outlines a streamlined approach to managing your project structure and deployment process to minimize complexity and reduce maintenance overhead.

## Project Structure Recommendations

### Current Structure Issues

Your current setup has a few structural challenges:

1. **Nested Repository Structure**: Your GitHub repository has a nested `evan-james-project` directory that contains the actual project files
2. **Multiple Deployment Approaches**: Several deployment scripts with different methods (Docker, PM2, direct file copying)
3. **Complex EC2 Directory Layout**: Additional nesting on your EC2 server with nested project directories

### Recommended Structure

For simpler management, consider:

```
GitHub Repository
├── frontend/           # Frontend application
├── backend/            # Backend application
├── scripts/            # Deployment and utility scripts
├── docs/               # Documentation
└── .github/            # GitHub workflows/config
```

```
EC2 Server
├── evan-james/        # Main application directory
│   ├── frontend/      # Frontend application
│   └── backend/       # Backend application
└── backups/           # Optional directory for backups
```

## New Deployment Scripts

Two new deployment scripts have been created to simplify your workflow:

### 1. `simplified-deploy.sh`

This script runs directly on your EC2 server and:

- Creates a clean directory structure
- Pulls the latest code from GitHub
- Handles both nested and flat repository structures
- Backs up existing code before deployment
- **Preserves your environment variables (.env files)** during updates
- Installs dependencies and builds applications
- Configures PM2 services

### 2. `remote-deploy.sh`

This script runs from your local machine and:

- Uploads the server deployment script if needed
- Initiates the deployment process remotely
- Provides clear feedback on deployment status

## Implementation Steps

### Step 1: Flatten Your GitHub Repository

1. Create a new repository (recommended) with the flat structure
   - OR use GitHub web interface to reorganize files in place
   - OR create a new branch with the restructured content

2. Move everything from `evan-james-project/` to the repository root:
   ```bash
   # Local example of flattening
   git clone https://github.com/aboerstra/evanjamesofficial.git
   cd evanjamesofficial
   cp -r evan-james-project/* .
   rm -rf evan-james-project
   git add .
   git commit -m "Flatten repository structure"
   git push
   ```

### Step 2: Set Up EC2 Server

1. Create a simplified directory structure on EC2:
   ```bash
   ssh -i ~/ejofficial.pem ubuntu@evanjamesofficial.com
   mkdir -p /home/ubuntu/evan-james/{frontend,backend}
   ```

2. Upload the deployment script:
   ```bash
   scp -i ~/ejofficial.pem scripts/simplified-deploy.sh ubuntu@evanjamesofficial.com:/home/ubuntu/
   chmod +x /home/ubuntu/simplified-deploy.sh
   ```

### Step 3: Deploy Using New Scripts

From your local machine:
```bash
# Make scripts executable
chmod +x scripts/remote-deploy.sh

# Deploy
./scripts/remote-deploy.sh
```

Or to force update the deployment script:
```bash
./scripts/remote-deploy.sh --force
```

### Step 4: Update Nginx Configuration (If Needed)

If you're changing from the old directory structure (`/home/ubuntu/evan-james-full`) to the new structure (`/home/ubuntu/evan-james`), you'll need to update your Nginx configuration:

1. Upload the Nginx configuration update script:
   ```bash
   scp -i ~/ejofficial.pem scripts/update-nginx-config.sh ubuntu@evanjamesofficial.com:/home/ubuntu/
   ```

2. SSH into your server and run the script with sudo:
   ```bash
   ssh -i ~/ejofficial.pem ubuntu@evanjamesofficial.com
   sudo chmod +x /home/ubuntu/update-nginx-config.sh
   sudo /home/ubuntu/update-nginx-config.sh
   ```

The script will:
- Scan for Nginx configuration files that reference the old path
- Create backups of existing configurations
- Update paths in all relevant files
- Test and reload the Nginx configuration

## Environment Management

### How Environment Variables Are Preserved

The deployment script includes special handling for your environment variables:

1. Before deployment, existing `.env` files are backed up
2. During file copying, `.env` files are excluded to prevent overwriting
3. After deployment, your original environment variables are restored
4. If no `.env` file exists, a basic template is created with default values

This ensures you never lose your production configuration during deployments.

### Best Practices

1. Use `.env` files for environment-specific configurations
2. Include `.env.example` files in your repository with commented documentation
3. Keep sensitive values out of version control
4. Use different environment files for development, staging, and production

### Example `.env.example` Files

**Frontend (.env.example)**
```
# API Configuration
NEXT_PUBLIC_API_URL=https://api.evanjamesofficial.com

# Feature Flags
NEXT_PUBLIC_FEATURE_NEW_PLAYER=false

# Analytics
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id_here
```

**Backend (.env.example)**
```
# Server Configuration
HOST=0.0.0.0
PORT=1337
APP_KEYS=your_app_key_here

# Database Configuration 
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=strapi
DATABASE_USERNAME=strapi_user
DATABASE_PASSWORD=your_password_here

# Admin Configuration
ADMIN_JWT_SECRET=your_jwt_secret_here
```

## Maintenance Guidelines

### Deployments

- Make changes locally and test thoroughly
- Push changes to GitHub
- Run `./scripts/remote-deploy.sh` to deploy to production
- If this is your first deployment with the new directory structure, run the Nginx update script
- Check logs to verify successful deployment

### Backups

- The deployment scripts automatically create backups before updating
- Backups are stored in the main application directory with timestamps
- For additional security, consider setting up periodic database backups

### Troubleshooting

- Check PM2 logs: `pm2 logs` on the EC2 server
- Verify services are running: `pm2 status`
- Review deployment logs for errors
- Check application logs in the respective directories
- For Nginx issues after path changes, check Nginx error logs: `sudo tail -f /var/log/nginx/error.log`
- To revert Nginx changes, restore from backups: `sudo cp /etc/nginx/sites-available/your-site.conf.bak /etc/nginx/sites-available/your-site.conf`
