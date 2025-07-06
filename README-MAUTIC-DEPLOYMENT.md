# Mautic Deployment Guide for EC2

## Status: ✅ COMPLETED

Mautic has been successfully installed and configured on the EC2 server.

### Access Information
- **URL**: https://mautic.evanjamesofficial.com
- **Status**: Ready for setup wizard
- **SSL**: ✅ Enabled (Let's Encrypt)

### Database Credentials
- **Database Name**: mautic
- **Username**: mautic
- **Password**: mautic123
- **Host**: localhost

### Next Steps
1. Visit https://mautic.evanjamesofficial.com to complete the Mautic setup wizard
2. Use the database credentials above during setup
3. Create your admin account
4. Configure your marketing automation workflows

### Installed Plugins & Features
- **Custom Objects Plugin** (acquia/mc-cs-plugin-custom-objects) - ✅ Installed
  - Adds custom objects feature to Mautic
  - Located in: `/home/ubuntu/mautic/plugins/CustomObjectsBundle/`
  - Will be available in the Mautic admin interface after completing the setup wizard

- **SMS & Twilio Integration** - ✅ Ready
  - Twilio SDK installed and configured
  - Built-in SMS functionality available in Mautic
  - Ready for Twilio API configuration in admin panel

### Technical Details
- **Server**: 13.223.13.92
- **PHP Version**: 8.2.29 (compatible with Mautic)
- **PHP Memory Limit**: 512M (optimized for Mautic)
- **PHP Max Execution Time**: 300 seconds
- **PHP Max Input Vars**: 3000
- **PHP Upload Limits**: 100M
- **Web Server**: Nginx
- **Database**: MySQL 8.0
- **SSL Certificate**: Let's Encrypt (auto-renewal enabled)

### Important Notes
- Mautic files are located in `/home/ubuntu/mautic/`
- Nginx configuration: `/etc/nginx/sites-enabled/mautic.evanjamesofficial.com`
- Database credentials saved in: `/tmp/mautic-db-credentials.txt`
- SSL certificate auto-renews via certbot

---

This guide provides instructions for deploying Mautic marketing automation platform on your EC2 server alongside your existing Evan James website.

## Overview

Mautic is an open-source marketing automation platform that will be deployed at `mautic.evanjamesofficial.com` on your EC2 server. The deployment script handles:

- Complete Mautic installation (v5.1.1)
- PHP 8.1 and required extensions
- MySQL database setup
- Nginx configuration
- SSL certificates (optional)
- Proper security configurations
- Automated cron jobs for Mautic operations

## Prerequisites

- Your existing EC2 instance with the Evan James website already deployed
- SSH access to your EC2 server
- Domain DNS configured to point `mautic.evanjamesofficial.com` to your EC2 IP address

## Deployment Instructions

### Step 1: Upload Files to EC2 Server

First, you need to get the deployment files to your EC2 server. You have two options:

**Option A: Git Pull (Recommended)**
```bash
# Connect to your EC2 server
ssh -i ejofficial.pem ubuntu@13.223.13.92

# Navigate to your project directory
cd ~/evan-james-project

# Pull the latest changes (including the new Mautic deployment script)
git pull origin main
```

**Option B: Manual Upload**
```bash
# From your local machine, upload the script to EC2
scp -i ejofficial.pem scripts/deploy-mautic-ec2.sh ubuntu@13.223.13.92:~/evan-james-project/scripts/
scp -i ejofficial.pem README-MAUTIC-DEPLOYMENT.md ubuntu@13.223.13.92:~/evan-james-project/
```

### Step 2: Connect to Your EC2 Server

```bash
ssh -i ejofficial.pem ubuntu@13.223.13.92
```

### Step 3: Navigate to Your Project Directory

```bash
cd ~/evan-james-project
```

### Step 4: Make the Script Executable (if needed)

```bash
chmod +x scripts/deploy-mautic-ec2.sh
```

### Step 5: Run the Mautic Deployment Script ON THE EC2 SERVER

For HTTP deployment:
```bash
./scripts/deploy-mautic-ec2.sh
```

For HTTPS deployment with SSL certificates:
```bash
./scripts/deploy-mautic-ec2.sh --with-ssl
```

**Important**: The script must be run ON your EC2 server, not on your local machine. It installs software and configures services directly on the server.

### Step 4: Complete Web-Based Setup

1. Visit your Mautic URL:
   - HTTP: `http://mautic.evanjamesofficial.com`
   - HTTPS: `https://mautic.evanjamesofficial.com`

2. Follow the Mautic installation wizard:
   - **Database Configuration**: Use the credentials from `/tmp/mautic-db-credentials.txt`
   - **Admin User**: Create your admin account
   - **Email Configuration**: Configure your email settings

## What the Script Does

### System Setup
- Updates system packages
- Installs PHP 8.1 with required extensions
- Installs MySQL server (if not already present)
- Downloads and extracts Mautic v5.1.1

### Database Configuration
- Creates a dedicated MySQL database named `mautic`
- Creates a database user with secure random password
- Saves credentials to `/tmp/mautic-db-credentials.txt`

### Web Server Configuration
- Configures Nginx virtual host for Mautic
- Sets up proper PHP-FPM integration
- Configures security headers and file upload limits
- Enables SSL certificates (if requested)

### Security & Permissions
- Sets proper file permissions for Mautic directories
- Configures Nginx to deny access to sensitive files
- Sets up security headers

### Automation
- Configures cron jobs for:
  - Segment updates (every 5 minutes)
  - Campaign updates (every 5 minutes)
  - Campaign triggers (every 5 minutes)

## Post-Deployment Configuration

### DNS Configuration
Ensure your DNS is configured to point `mautic.evanjamesofficial.com` to your EC2 server's IP address:

```
Type: A
Name: mautic.evanjamesofficial.com
Value: 13.223.13.92
TTL: 300 (or your preferred value)
```

### Database Credentials
The script generates secure database credentials saved to `/tmp/mautic-db-credentials.txt`. You'll need these during the web-based setup:

```
Database Name: mautic
Username: mautic
Password: [randomly generated]
Host: localhost
```

### Email Configuration
During the Mautic setup wizard, configure your email settings:

- **SMTP Server**: Your email provider's SMTP server
- **Port**: Usually 587 for TLS or 465 for SSL
- **Authentication**: Username and password for your email account
- **Encryption**: TLS or SSL

## Integration with Existing Website

Mautic can be integrated with your existing Evan James website for:

### Tracking and Analytics
Add Mautic tracking code to your website to track visitor behavior:

```javascript
<script>
    (function(w,d,t,u,n,a,m){w['MauticTrackingObject']=n;
        w[n]=w[n]||function(){(w[n].q=w[n].q||[]).push(arguments)},a=d.createElement(t),
        m=d.getElementsByTagName(t)[0];a.async=1;a.src=u;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://mautic.evanjamesofficial.com/mtc.js','mt');

    mt('send', 'pageview');
</script>
```

### Contact Forms
Integrate your website's contact forms with Mautic to automatically add leads:

```html
<form action="https://mautic.evanjamesofficial.com/form/submit" method="post">
    <input type="hidden" name="mauticform[formId]" value="YOUR_FORM_ID">
    <input type="email" name="mauticform[email]" placeholder="Email">
    <input type="text" name="mauticform[first_name]" placeholder="First Name">
    <button type="submit">Subscribe</button>
</form>
```

## Monitoring and Maintenance

### Log Files
- **Mautic Logs**: `/home/ubuntu/mautic/var/logs/`
- **Nginx Logs**: `/var/log/nginx/`
- **PHP-FPM Logs**: `/var/log/php8.1-fpm.log`
- **Deployment Log**: `/tmp/mautic-setup-[timestamp].log`

### Cron Jobs
The script automatically sets up these cron jobs:
```bash
# View current cron jobs
sudo crontab -l

# Manually run Mautic commands if needed
php /home/ubuntu/mautic/bin/console mautic:segments:update
php /home/ubuntu/mautic/bin/console mautic:campaigns:update
php /home/ubuntu/mautic/bin/console mautic:campaigns:trigger
```

### Updates
To update Mautic in the future:
1. Download the new version
2. Extract to a temporary directory
3. Copy files to `/home/ubuntu/mautic/` (excluding `var/` directory)
4. Run database migrations if required

## Troubleshooting

### Common Issues

**1. Database Connection Error**
- Check MySQL service: `sudo systemctl status mysql`
- Verify credentials in `/tmp/mautic-db-credentials.txt`
- Test database connection: `mysql -u mautic -p mautic`

**2. PHP Errors**
- Check PHP-FPM status: `sudo systemctl status php8.1-fpm`
- Review PHP error logs: `sudo tail -f /var/log/php8.1-fpm.log`

**3. Nginx Configuration Issues**
- Test Nginx config: `sudo nginx -t`
- Check Nginx status: `sudo systemctl status nginx`
- Review error logs: `sudo tail -f /var/log/nginx/error.log`

**4. SSL Certificate Issues**
- Verify domain DNS is pointing to your server
- Check Certbot logs: `sudo tail -f /var/log/letsencrypt/letsencrypt.log`
- Manually renew certificates: `sudo certbot renew`

### Manual Commands

If you need to restart services:
```bash
# Restart all services
sudo systemctl restart nginx
sudo systemctl restart php8.1-fpm
sudo systemctl restart mysql

# Check service status
sudo systemctl status nginx php8.1-fpm mysql
```

## Security Considerations

- Database credentials are randomly generated and secure
- Nginx is configured to deny access to sensitive directories
- SSL certificates provide encrypted communication
- Security headers are configured to prevent common attacks
- File permissions are set according to Mautic best practices

## Support

For issues specific to:
- **Mautic**: Visit [Mautic Documentation](https://docs.mautic.org/)
- **Deployment Script**: Check the deployment log file
- **Server Issues**: Review system logs and service status

## Next Steps

After successful deployment:

1. Complete the Mautic web-based setup
2. Configure your email settings
3. Create your first campaign
4. Integrate tracking code with your website
5. Set up contact forms to capture leads
6. Configure email templates and automation workflows

Your Mautic installation will be accessible at:
- **HTTP**: `http://mautic.evanjamesofficial.com`
- **HTTPS**: `https://mautic.evanjamesofficial.com` (if SSL was configured)

## SMS and Twilio Integration Setup

### Prerequisites for SMS Setup
1. **Twilio Account**: Sign up at [twilio.com](https://www.twilio.com)
2. **Twilio Phone Number**: Purchase a phone number from Twilio console
3. **Messaging Service**: Create a messaging service in Twilio (recommended)

### Twilio Account Setup

1. **Create Twilio Account**:
   - Go to [twilio.com](https://www.twilio.com) and sign up
   - Verify your account and phone number

2. **Get Account Credentials**:
   - **Account SID**: Found in Twilio Console Dashboard
   - **Auth Token**: Found in Twilio Console Dashboard (click to reveal)

3. **Create Messaging Service** (Recommended):
   - Go to Messaging → Services in Twilio Console
   - Click "Create Messaging Service"
   - Choose "Send marketing messages and notifications"
   - Add your Twilio phone number to the service
   - Copy the **Messaging Service SID**

### Mautic SMS Configuration

After completing the Mautic setup wizard:

1. **Access SMS Configuration**:
   - Login to Mautic admin panel
   - Go to **Settings** → **Configuration** → **Text Messages**

2. **Configure Twilio Integration**:
   - **Service to send text messages**: Select "Twilio"
   - **Username**: Enter your Twilio **Account SID**
   - **Password**: Enter your Twilio **Auth Token**
   - **Messaging Service SID**: Enter your Twilio **Messaging Service SID**
   - **Sending phone number**: Your Twilio phone number (format: +1234567890)

3. **Test Configuration**:
   - Save the configuration
   - Send a test SMS to verify setup

### SMS Campaign Setup

1. **Create SMS Campaign**:
   - Go to **Campaigns** → **New Campaign**
   - Choose "Campaign Builder"
   - Add SMS action to your campaign flow

2. **Create SMS Messages**:
   - Go to **Channels** → **Text Messages** → **New**
   - Create your SMS content (160 characters recommended)
   - Use tokens like `{contactfield=firstname}` for personalization

3. **SMS in Forms**:
   - Add phone number field to your forms
   - Set up SMS follow-up actions

### Advanced SMS Features

1. **SMS Replies and Keywords**:
   - Configure webhook URL in Twilio: `https://mautic.evanjamesofficial.com/sms/twilio/callback`
   - Set up keyword responses in Mautic

2. **SMS Segments**:
   - Create segments based on SMS engagement
   - Filter contacts who have opted in for SMS

3. **Compliance**:
   - Always include opt-out instructions (e.g., "Reply STOP to unsubscribe")
   - Respect SMS marketing regulations in your region

### Webhook Configuration (Optional)

For SMS replies and delivery status:

1. **In Twilio Console**:
   - Go to Phone Numbers → Manage → Active numbers
   - Click on your SMS-enabled number
   - Set webhook URL: `https://mautic.evanjamesofficial.com/sms/twilio/callback`
   - Set HTTP method to POST

2. **For Messaging Service**:
   - Go to Messaging → Services → Your Service
   - Set Inbound Request URL: `https://mautic.evanjamesofficial.com/sms/twilio/callback`

### Troubleshooting SMS Issues

**Common Issues**:

1. **SMS not sending**:
   - Verify Twilio credentials are correct
   - Check Twilio account balance
   - Ensure phone number is verified in Twilio

2. **Invalid phone number format**:
   - Use international format: +1234567890
   - Ensure phone numbers in contacts are properly formatted

3. **Webhook not working**:
   - Verify webhook URL is accessible
   - Check Mautic logs: `/home/ubuntu/mautic/var/logs/`
   - Ensure SSL certificate is valid

### SMS Best Practices

1. **Content**:
   - Keep messages under 160 characters
   - Include clear call-to-action
   - Always provide opt-out instructions

2. **Timing**:
   - Respect time zones
   - Avoid sending during late hours
   - Consider frequency caps

3. **Compliance**:
   - Obtain explicit consent before sending SMS
   - Honor opt-out requests immediately
   - Keep records of consent

### Cost Considerations

- **Twilio Pricing**: Pay per SMS sent (varies by country)
- **Phone Number**: Monthly fee for Twilio phone number
- **Messaging Service**: No additional cost, but recommended for deliverability

### Integration Examples

**SMS Welcome Series**:
```
Campaign: New Contact → Wait 1 hour → Send Welcome SMS → Wait 1 day → Send Follow-up SMS
```

**Abandoned Cart SMS**:
```
Campaign: Form Submission → Wait 2 hours → Check if purchase made → If no, send SMS reminder
```

**Event Reminders**:
```
Campaign: Event Registration → Wait until 1 day before → Send SMS reminder
```

This SMS integration allows you to create powerful multi-channel marketing campaigns combining email, SMS, and web tracking for maximum engagement.
