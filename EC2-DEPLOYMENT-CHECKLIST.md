# EC2 Deployment Checklist

Use this checklist to verify that your Evan James website deployment is working correctly.

## Backend Verification

- [ ] Backend is running: `pm2 status` shows `evan-james-backend` as online
- [ ] Backend API is accessible: `curl https://api.evanjamesofficial.com/api/site-settings` returns data
- [ ] Strapi admin panel is accessible: Visit `https://api.evanjamesofficial.com/admin` in a browser
- [ ] Content types are created: Check in Strapi admin panel under "Content-Type Builder"
- [ ] Sample data is present: Check in Strapi admin panel under "Content Manager"

## Frontend Verification

- [ ] Frontend is running: `pm2 status` shows `evan-james-frontend` as online
- [ ] Website is accessible: Visit `https://evanjamesofficial.com` in a browser
- [ ] Navigation works: Test all main navigation links
- [ ] Content is displayed: Check that content from Strapi is properly displayed
- [ ] Responsive design: Test the website on different screen sizes

## Server Configuration Verification

- [ ] Nginx is running: `sudo systemctl status nginx` shows active
- [ ] SSL certificates are valid: Visit both domains with HTTPS and check for valid certificates
- [ ] PM2 startup is configured: `pm2 startup` has been run
- [ ] PM2 processes are saved: `pm2 save` has been run
- [ ] Server resources are sufficient: Check CPU, memory, and disk usage with `htop` and `df -h`

## Security Verification

- [ ] Firewall is configured: Only necessary ports (22, 80, 443) are open
- [ ] Strapi admin has a secure password: Default credentials have been changed
- [ ] Environment variables are properly set: No sensitive data is exposed
- [ ] CORS is properly configured: Only allowed domains can access the API
- [ ] Rate limiting is working: API endpoints are protected from abuse

## Backup Verification

- [ ] Database backup is working: Test the backup script if available
- [ ] Media backup is working: Test the media backup script if available
- [ ] Backup storage is sufficient: Check available space for backups

## Performance Verification

- [ ] Page load times are acceptable: Use browser dev tools to check load times
- [ ] API response times are acceptable: Test API endpoints for response times
- [ ] Static assets are cached: Check cache headers for static files
- [ ] Images are optimized: Check image sizes and formats

## Troubleshooting Resources

If you encounter issues, check the following logs:

- PM2 logs: `pm2 logs`
- Nginx error logs: `sudo tail -f /var/log/nginx/error.log`
- Strapi logs: `pm2 logs evan-james-backend`
- Next.js logs: `pm2 logs evan-james-frontend`
- System logs: `sudo journalctl -xe`

## Next Steps After Successful Deployment

- [ ] Set up regular database backups
- [ ] Set up monitoring (e.g., UptimeRobot, New Relic, or Sentry)
- [ ] Document any custom configurations or changes
- [ ] Share access credentials with team members as needed
- [ ] Test the site with real users and gather feedback
