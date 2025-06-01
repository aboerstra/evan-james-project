# Post-Deployment Checklist

Use this checklist to ensure all components of your deployment are properly configured and functioning.

## Environment Variables

- [ ] Transfer frontend environment variables using instructions in `ENV_TRANSFER_GUIDE.md`
- [ ] Transfer backend environment variables using instructions in `ENV_TRANSFER_GUIDE.md`
- [ ] Verify environment variables are correctly applied on the server

## Nginx Configuration

- [ ] Update Nginx configuration for the new directory structure
  - Either use the automated script: `./scripts/update-nginx-config.sh`
  - Or follow the manual instructions in `NGINX_CONFIGURATION_GUIDE.md`
- [ ] Verify Nginx configuration is correctly loading with `sudo nginx -t`
- [ ] Reload Nginx with `sudo systemctl reload nginx`

## Service Status

- [ ] Verify frontend service is running with `pm2 status`
- [ ] Verify backend service is running with `pm2 status`
- [ ] Check frontend logs for errors with `pm2 logs evan-james-frontend`
- [ ] Check backend logs for errors with `pm2 logs evan-james-backend`

## Database

- [ ] Verify MySQL database connection from the backend
- [ ] Check if existing data is accessible (if applicable)

## Website Accessibility

- [ ] Check if frontend is accessible at `https://evanjamesofficial.com`
- [ ] Check if backend is accessible at `https://api.evanjamesofficial.com`
- [ ] Verify that frontend can successfully communicate with backend

## Security

- [ ] Ensure sensitive environment variables are not exposed
- [ ] Verify that appropriate access controls are in place
- [ ] Check that SSL certificates are correctly applied

## Backup

- [ ] Verify that deployment backups were created
- [ ] Ensure that environment variable backups are in place
- [ ] Check that Nginx configuration backups are available

## Future Deployments

- [ ] Test a minor change using the deployment script
- [ ] Verify that environment variables are preserved during redeployment
- [ ] Document any specific issues or workarounds for future reference

## GitHub Repository

- [ ] Consider whether to keep the repository public or make it private again
- [ ] If making private, set up GitHub access tokens or SSH keys for deployment

## Final Verification

- [ ] Test critical website functionality
- [ ] Ensure all required services are configured to start on server reboot
- [ ] Update documentation with any additional steps discovered during this deployment

## Troubleshooting Resources

If you encounter issues, refer to these resources:

- `SSH_TROUBLESHOOTING.md` - For SSH connection issues
- `ENV_TRANSFER_GUIDE.md` - For environment variable configuration
- `NGINX_CONFIGURATION_GUIDE.md` - For web server configuration
- `DEPLOYMENT_SUMMARY.md` - For overview of the deployment system
- `IMPLEMENTATION_STEPS.md` - For step-by-step deployment instructions
