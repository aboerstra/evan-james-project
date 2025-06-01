# Environment Variable Transfer Guide

This guide outlines the steps to transfer your production environment variables to the EC2 server after deployment.

## Prerequisites

- SSH access to your EC2 server
- The SSH key file (~/ejofficial.pem)
- Local .env.production files for both frontend and backend

## Steps to Transfer Environment Variables

### 1. Transfer Frontend Environment Variables

```bash
# Copy the frontend .env.production file to the server
scp -i ~/ejofficial.pem frontend/.env.production ubuntu@evanjamesofficial.com:/home/ubuntu/evan-james/frontend/.env
```

### 2. Transfer Backend Environment Variables

```bash
# Copy the backend .env.production file to the server
scp -i ~/ejofficial.pem backend/.env.production ubuntu@evanjamesofficial.com:/home/ubuntu/evan-james/backend/.env
```

### 3. Restart PM2 Services to Apply Changes

After transferring the environment files, connect to the server and restart the services:

```bash
# SSH into your server
ssh -i ~/ejofficial.pem ubuntu@evanjamesofficial.com

# Restart frontend service
pm2 restart evan-james-frontend

# Restart backend service
pm2 restart evan-james-backend

# Save the PM2 configuration
pm2 save
```

## Verifying the Transfer

To verify that the environment variables have been properly applied:

```bash
# Check frontend environment file
ssh -i ~/ejofficial.pem ubuntu@evanjamesofficial.com "cat /home/ubuntu/evan-james/frontend/.env | grep NEXT_PUBLIC_API_URL"

# Check backend environment file
ssh -i ~/ejofficial.pem ubuntu@evanjamesofficial.com "cat /home/ubuntu/evan-james/backend/.env | grep PUBLIC_URL"
```

The frontend should show `NEXT_PUBLIC_API_URL=https://api.evanjamesofficial.com` and the backend should show `PUBLIC_URL=https://api.evanjamesofficial.com`.

## Troubleshooting

If you encounter any issues with the environment variables:

1. **Check file permissions**: Ensure the .env files have appropriate read permissions
   ```bash
   ssh -i ~/ejofficial.pem ubuntu@evanjamesofficial.com "chmod 644 /home/ubuntu/evan-james/frontend/.env /home/ubuntu/evan-james/backend/.env"
   ```

2. **Verify file contents**: Use `cat` to view the entire file content
   ```bash
   ssh -i ~/ejofficial.pem ubuntu@evanjamesofficial.com "cat /home/ubuntu/evan-james/frontend/.env"
   ssh -i ~/ejofficial.pem ubuntu@evanjamesofficial.com "cat /home/ubuntu/evan-james/backend/.env"
   ```

3. **Check PM2 logs**: If services aren't starting properly, check the logs
   ```bash
   ssh -i ~/ejofficial.pem ubuntu@evanjamesofficial.com "pm2 logs"
   ```

## Important Notes

- The environment variables will not be overwritten during future deployments as the deployment scripts are configured to preserve .env files.
- If you need to update environment variables in the future, you can repeat these steps or edit the files directly on the server.
- For security reasons, consider storing sensitive environment variables in a secure location and not in version control.
