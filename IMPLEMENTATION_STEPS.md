# Implementation Steps for New Deployment System

This guide provides a step-by-step implementation plan for setting up and using the enhanced deployment system.

## Step 1: Prepare Your Local Environment

1. Ensure all scripts are executable:
   ```bash
   chmod +x scripts/remote-deploy.sh scripts/simplified-deploy.sh scripts/update-nginx-config.sh
   ```

2. Verify SSH access to your EC2 server:
   ```bash
   # Using the primary key for this project:
   ssh -i ~/ejofficial.pem ubuntu@evanjamesofficial.com
   ```

**Note:** If you encounter SSH connectivity issues, refer to `SSH_TROUBLESHOOTING.md` for detailed troubleshooting steps.

## Step 2: Configure Environment Variables

1. Verify your production environment files:
   - Check that `frontend/.env.production` contains the correct production URLs
   - Verify that `backend/.env.production` has the right database configuration

2. If you need to make changes, update these files before proceeding:
   ```bash
   # Example - update frontend production API URL if needed
   nano frontend/.env.production
   
   # Example - update backend production database configuration if needed
   nano backend/.env.production
   ```

## Step 3: Initial Deployment

1. Make sure your GitHub repository is accessible:
   - The repository should be public for the deployment to work without authentication
   - If you prefer keeping it private, follow the instructions in `GITHUB_REPOSITORY_GUIDE.md`

2. Run the remote deployment script from your local machine:
   ```bash
   ./scripts/remote-deploy.sh
   ```

3. This will:
   - Establish SSH connection using ~/ejofficial.pem
   - Upload the deployment script if needed
   - Execute the deployment process on the server
   - Pull the latest code from GitHub using direct ZIP download
   - Create backups of existing files and environment variables
   - Install dependencies and build both applications

4. If the deployment fails with SSH errors:
   - Check the troubleshooting guide: `SSH_TROUBLESHOOTING.md`
   - Verify your EC2 instance is running and reachable
   - Confirm your SSH key permissions (should be 400)

## Step 4: Transfer Environment Variables

After successful deployment, transfer your environment variables:

1. Upload your production environment files to the server:
   ```bash
   # For frontend
   scp -i ~/ejofficial.pem frontend/.env.production ubuntu@evanjamesofficial.com:/home/ubuntu/evan-james/frontend/.env
   
   # For backend
   scp -i ~/ejofficial.pem backend/.env.production ubuntu@evanjamesofficial.com:/home/ubuntu/evan-james/backend/.env
   ```

2. Restart the services to apply the new environment variables:
   ```bash
   ssh -i ~/ejofficial.pem ubuntu@evanjamesofficial.com "cd /home/ubuntu/evan-james && pm2 restart all && pm2 save"
   ```

For more detailed instructions, refer to `ENV_TRANSFER_GUIDE.md`.

## Step 5: Update Nginx Configuration (If Needed)

If you're changing directory paths or domain settings:

1. Upload and run the Nginx configuration update script:
   ```bash
   scp -i ~/ejofficial.pem scripts/update-nginx-config.sh ubuntu@evanjamesofficial.com:/home/ubuntu/
   ssh -i ~/ejofficial.pem ubuntu@evanjamesofficial.com "sudo bash /home/ubuntu/update-nginx-config.sh"
   ```

2. Verify Nginx configuration:
   ```bash
   ssh -i ~/ejofficial.pem ubuntu@evanjamesofficial.com "sudo nginx -t"
   ```

For more detailed instructions, refer to `NGINX_CONFIGURATION_GUIDE.md`.

## Step 6: Verify Deployment

1. Use the provided checklist to verify all aspects of deployment:
   - Refer to `POST_DEPLOYMENT_CHECKLIST.md` for a comprehensive verification process

2. Check that both services are running:
   ```bash
   ssh -i ~/ejofficial.pem ubuntu@evanjamesofficial.com "pm2 status"
   ```

3. Verify that your website is accessible:
   - Frontend: https://evanjamesofficial.com
   - Backend: https://api.evanjamesofficial.com

4. Check logs if there are any issues:
   ```bash
   ssh -i ~/ejofficial.pem ubuntu@evanjamesofficial.com "pm2 logs"
   ```

## Future Deployments

For all future code updates, simply run:
```bash
./scripts/remote-deploy.sh
```

This will:
1. Pull the latest code from GitHub
2. Preserve your environment variables
3. Install any new dependencies
4. Rebuild the applications
5. Restart the services with PM2

## Troubleshooting & Maintenance

If you encounter issues during deployment:

1. **SSH Connection Issues**:
   - Refer to `SSH_TROUBLESHOOTING.md`
   - Verify your key permissions with `chmod 400 ~/ejofficial.pem`
   - Check that your EC2 security group allows SSH access

2. **GitHub Access Issues**:
   - Refer to `GITHUB_REPOSITORY_GUIDE.md`
   - Consider making the repository public temporarily for deployments
   - Set up proper authentication for private repositories

3. **Environment Variable Issues**:
   - Refer to `ENV_TRANSFER_GUIDE.md`
   - Check permissions on .env files on the server
   - Verify environment variables with `pm2 env <service-name>`

4. **Nginx Configuration Issues**:
   - Refer to `NGINX_CONFIGURATION_GUIDE.md`
   - Check Nginx error logs with `sudo tail -f /var/log/nginx/error.log`
   - Verify configuration with `sudo nginx -t`

## Additional Resources

- `DEPLOYMENT_SUMMARY.md` - Overview of the entire deployment system
- `README-DEPLOYMENT.md` - Quick reference deployment guide
- `docs/SIMPLIFIED_DEPLOYMENT_GUIDE.md` - Additional deployment documentation
