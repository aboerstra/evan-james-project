# Evan James Website Deployment Guide

This guide explains how to deploy the Evan James artist website, including handling environment variables with separate files for local development and production.

## Environment Variables Management

We use separate variable files for local development and production deployments:

- `frontend-variables.local.md` - Frontend variables for local development
- `frontend-variables.ec2.md` - Frontend variables for production (EC2) deployment
- `backend-variables.local.md` - Backend variables for local development
- `backend-variables.ec2.md` - Backend variables for production (EC2) deployment

### Why Separate Files Instead of .env?

We use these separate variable files for several reasons:
1. They can be safely committed to version control
2. They provide documentation about required environment variables
3. They allow for clear separation between development and production values
4. They simplify deployment to different environments

### Important API Keys

The project uses several API keys, including:

- **STABILITY_API_KEY**: Used for AI image generation with Stability AI
  - Current key: `sk-4B35QclvgMUnygri2zlowfc5Y7LodaOZwDCV72wuOXO9U9U8`
  - Included in both frontend and backend variables
  - **IMPORTANT**: This is a paid API service. Monitor usage to avoid unexpected charges.
  - Consider rotating this key periodically for security reasons

### Converting to .env Files

We've provided a script (`convert_variables.sh`) that automates the conversion from variable files to `.env` files:

```bash
# For local development
./convert_variables.sh development local

# For production deployment
./convert_variables.sh production ec2
```

This script will:
1. Extract environment variables from the appropriate variable files
2. Create `.env` files in the appropriate directories
3. Validate that the conversion was successful

## Development Workflow

1. During development, use:
   ```bash
   ./convert_variables.sh development local
   ```

2. This creates `.env` files from `frontend-variables.local.md` and `backend-variables.local.md`

3. Start your development servers as usual

## Deployment Process

### 1. Prepare Environment Variables

**Before deployment:**
- Ensure both `frontend-variables.ec2.md` and `backend-variables.ec2.md` have appropriate production values
- Double-check sensitive credentials like database passwords and API keys
- Store a secure copy of these production values offline
- Verify that API keys like STABILITY_API_KEY are valid and have sufficient quota

### 2. Deploy Backend (Strapi)

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/evan-james-project.git
   cd evan-james-project
   ```

2. Convert EC2 variables to .env files:
   ```bash
   ./frontend/convert_variables.sh production ec2
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

### 3. Deploy Frontend (Next.js)

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

### 4. Configure Nginx

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

### 5. Set Up SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d evanjamesofficial.com -d www.evanjamesofficial.com
sudo certbot --nginx -d api.evanjamesofficial.com
```

## Important Security Considerations

1. Never commit `.env` files to version control
2. Update production secrets in the `.ec2.md` files before deploying
3. Use strong, unique passwords and keys
4. Regularly rotate API keys and tokens
5. Keep a secure backup of production environment variables
6. Monitor API usage for services that charge based on consumption (like Stability AI)

## Environment Variable Rotation Schedule

It's recommended to rotate sensitive credentials regularly:

- JWT secrets: Every 90 days
- Admin passwords: Every 60 days
- API tokens: Every 30 days
- Stability API key: Every 60 days or after heavy usage

## Rollback Procedure

If you need to rollback to a previous version:

1. Revert to the previous code version
2. Ensure you're using the corresponding environment variables
3. Run the convert script with appropriate parameters
4. Rebuild and restart the services

Remember that both the variable files (`.local.md` and `.ec2.md`) are version controlled, making it easy to revert to previous configurations. 