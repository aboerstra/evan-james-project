# Strapi Uploads Fix Guide

This guide addresses the issue where the Strapi uploads directory exists but is empty, causing images to not appear on the website.

## Quick Start

If you're experiencing missing images on your Evan James website, follow these steps:

1. **Fix multiple service instances** (if you have multiple instances of the backend or frontend running):
   ```bash
   # Make the script executable
   chmod +x ec2-fix-multiple-instances.sh
   
   # Upload and run on EC2
   scp -i ejofficial.pem ec2-fix-multiple-instances.sh ubuntu@13.223.13.92:~/
   ssh -i ejofficial.pem ubuntu@13.223.13.92 "chmod +x ~/ec2-fix-multiple-instances.sh && sudo ~/ec2-fix-multiple-instances.sh"
   ```

2. **Restart the services** (alternative approach if the above doesn't work):
   ```bash
   # Make the script executable
   chmod +x ec2-restart-services.sh
   
   # Upload and run on EC2
   scp -i ejofficial.pem ec2-restart-services.sh ubuntu@13.223.13.92:~/
   ssh -i ejofficial.pem ubuntu@13.223.13.92 "chmod +x ~/ec2-restart-services.sh && sudo ~/ec2-restart-services.sh"
   ```

2. **Diagnose the issue**:
   ```bash
   # Make the script executable
   chmod +x ec2-check-images.sh
   
   # Upload and run on EC2
   scp -i ejofficial.pem ec2-check-images.sh ubuntu@13.223.13.92:~/
   ssh -i ejofficial.pem ubuntu@13.223.13.92 "chmod +x ~/ec2-check-images.sh && sudo ~/ec2-check-images.sh"
   ```

3. **Fix with improved script**:
   ```bash
   # Make the script executable
   chmod +x ec2-fix-strapi-uploads-improved.sh
   
   # Upload and run on EC2
   scp -i ejofficial.pem ec2-fix-strapi-uploads-improved.sh ubuntu@13.223.13.92:~/
   ssh -i ejofficial.pem ubuntu@13.223.13.92 "chmod +x ~/ec2-fix-strapi-uploads-improved.sh && sudo ~/ec2-fix-strapi-uploads-improved.sh"
   ```

4. **Upload local images** (if needed):
   ```bash
   # Make the script executable
   chmod +x upload-evan-james-images.sh
   
   # Run with your local images directory
   ./upload-evan-james-images.sh -d /path/to/your/images
   ```

## Available Scripts

### 1. ec2-fix-multiple-instances.sh

Completely resets PM2 and ensures only one instance of each service is running:
- Stops all PM2 processes
- Deletes all PM2 processes
- Starts a single instance of the backend
- Starts a single instance of the frontend
- Saves the PM2 process list

To use:
```bash
# Make the script executable
chmod +x ec2-fix-multiple-instances.sh

# Upload and run on EC2
scp -i ejofficial.pem ec2-fix-multiple-instances.sh ubuntu@13.223.13.92:~/
ssh -i ejofficial.pem ubuntu@13.223.13.92 "chmod +x ~/ec2-fix-multiple-instances.sh && sudo ~/ec2-fix-multiple-instances.sh"
```

### 2. ec2-restart-services.sh

Properly restarts the frontend and backend services:
- Stops all running instances of each service
- Starts a fresh instance of each service
- Saves the PM2 process list
- Displays the current status

To use:
```bash
# Make the script executable
chmod +x ec2-restart-services.sh

# Upload and run on EC2
scp -i ejofficial.pem ec2-restart-services.sh ubuntu@13.223.13.92:~/
ssh -i ejofficial.pem ubuntu@13.223.13.92 "chmod +x ~/ec2-restart-services.sh && sudo ~/ec2-restart-services.sh"
```

### 3. ec2-check-images.sh

Diagnoses the issue by checking:
- If the frontend images directory exists and contains files
- If the backend uploads directory exists and contains files
- Permissions on both directories

### 4. ec2-fix-strapi-uploads-improved.sh

An improved version of the original fix script that:
- Checks if the frontend images directory exists and has files
- Attempts to find images in alternative locations if the primary location is empty
- Uses rsync for more reliable file copying with detailed feedback
- Verifies that files were actually copied to the uploads directory
- Provides clear warnings and next steps if no files are copied

### 5. upload-images-to-strapi.sh

A general-purpose script to upload images from your local machine to the EC2 server:
- Requires specifying the PEM file, EC2 host, and local images directory
- Counts the number of image files to upload
- Creates the remote uploads directory if it doesn't exist
- Uploads images using rsync
- Sets correct permissions and restarts the Strapi backend

### 6. upload-evan-james-images.sh

A simplified version of the upload script specifically for the Evan James project:
- Uses the default PEM file (ejofficial.pem) and EC2 host (13.223.13.92)
- Only requires specifying the local images directory
- Automatically tries to find the PEM file in common locations
- Provides a confirmation prompt before uploading

## Detailed Documentation

For more detailed information about the issue and solutions, see:

- [STRAPI_UPLOADS_ERROR_FIX.md](docs/STRAPI_UPLOADS_ERROR_FIX.md) - Explains the original error and basic fix
- [STRAPI_UPLOADS_EMPTY_FIX.md](docs/STRAPI_UPLOADS_EMPTY_FIX.md) - Explains the empty uploads directory issue and solutions

## Troubleshooting

If you're still experiencing issues after running these scripts:

1. **Check if the backend uploads directory contains files**:
   ```bash
   ssh -i ejofficial.pem ubuntu@13.223.13.92 "ls -la /home/ubuntu/evan-james-project/backend/public/uploads"
   ```

2. **Check if the Strapi backend is running**:
   ```bash
   ssh -i ejofficial.pem ubuntu@13.223.13.92 "pm2 status"
   ```

3. **Check Strapi logs for errors**:
   ```bash
   ssh -i ejofficial.pem ubuntu@13.223.13.92 "pm2 logs evan-james-backend"
   ```

4. **Manually upload images through the Strapi admin panel**:
   - Access the Strapi admin panel at `https://api.evanjamesofficial.com/admin`
   - Navigate to Media Library
   - Click "Upload assets" and select your image files

## Next Steps

After fixing the uploads issue:

1. Verify that images appear correctly on the website
2. Consider implementing a more permanent solution like AWS S3 for media storage
3. Add regular checks to your deployment process to ensure the uploads directory is properly populated
