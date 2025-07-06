# Simplified Deployment for Evan James Website

This document provides an overview of the simplified deployment approach for the Evan James website on an EC2 server.

## Files and Scripts

### Main Deployment Script

- **`scripts/ec2-setup-complete.sh`**: A comprehensive script that handles the complete setup of the Evan James website on an EC2 server. This script:
  - Sets up the backend with proper environment variables
  - Installs all dependencies
  - Builds the Strapi backend
  - Seeds the database with content types and sample data
  - Sets up the frontend with proper configuration
  - Configures Nginx for both services
  - Sets up SSL certificates (optional)
  - Starts both services with PM2

### Helper Scripts

- **`scripts/deploy-to-ec2.sh`**: A ready-to-use script with your EC2 connection details already baked in. Simply run:
  ```bash
  ./scripts/deploy-to-ec2.sh
  ```
  This script will:
  - Automatically find your PEM file in common locations (or accept a path as an argument)
  - Fix permissions on the PEM file (chmod 600) to ensure SSH works correctly
  - Upload all necessary files to your EC2 server
  - Make the setup script executable
  - Offer to SSH into the server for you

- **`scripts/upload-setup-script.sh`**: A utility script to upload the main deployment script to your EC2 server. Usage:
  ```bash
  ./scripts/upload-setup-script.sh <path-to-pem-file> <ec2-server-address>
  ```

### Documentation

- **`README-EC2-SETUP.md`**: Detailed instructions for setting up the Evan James website on an EC2 server using the simplified setup script.
- **`EC2-DEPLOYMENT-CHECKLIST.md`**: A checklist to verify that your deployment is working correctly.

## Deployment Process

1. **Prepare Your EC2 Server**:
   - Ensure you have an EC2 instance running Ubuntu
   - Make sure Node.js v18.19.1 is installed
   - Configure your domain names to point to your EC2 instance

2. **Upload the Setup Script**:
   ```bash
   ./scripts/upload-setup-script.sh ~/path/to/your-key.pem ubuntu@your-ec2-server.com
   ```

3. **Run the Setup Script on Your EC2 Server**:
   ```bash
   # SSH into your EC2 server
   ssh -i ~/path/to/your-key.pem ubuntu@your-ec2-server.com
   
   # Run the setup script
   ./ec2-setup-complete.sh
   
   # Or with SSL setup
   ./ec2-setup-complete.sh --with-ssl
   ```

4. **Verify Your Deployment**:
   - Use the `EC2-DEPLOYMENT-CHECKLIST.md` to verify that everything is working correctly
   - Check that both frontend and backend are accessible
   - Verify that content types and sample data are present in Strapi

## Benefits of This Approach

- **Simplified Process**: One script handles the entire deployment process
- **Reproducible**: The same script can be used for multiple deployments
- **Comprehensive**: Handles all aspects of deployment, from environment setup to SSL configuration
- **Error Handling**: Includes robust error handling and logging
- **Content Types and Data**: Automatically sets up content types and seeds sample data

## Troubleshooting

If you encounter any issues during deployment:

1. Check the log file (path will be displayed at the end of the script output)
2. Verify that all prerequisites are met
3. Check the specific error message and consult the troubleshooting section in `README-EC2-SETUP.md`
4. If needed, you can run individual steps manually as described in `README-EC2-SETUP.md`

## Next Steps

After successful deployment:

1. Set up regular database backups
2. Configure monitoring
3. Update content through the Strapi admin panel
4. Make any necessary customizations to the frontend
