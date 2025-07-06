# Fixing Empty Strapi Uploads Directory

This document explains how to fix the issue where the Strapi uploads directory exists but is empty, causing images to not appear on the website.

## The Problem

During deployment, the Strapi backend requires an `uploads` directory at `/home/ubuntu/evan-james-project/backend/public/uploads` to store media files. While the directory might be created successfully, it may remain empty if:

1. The source directory for copying images doesn't exist
2. The source directory exists but is empty
3. There are permission issues preventing the copy operation
4. The copy command fails for other reasons

When the uploads directory is empty, images uploaded through the Strapi admin panel or referenced in content types will not appear on the website.

## Diagnosis

To diagnose the issue, we've created a script that checks the status of both the frontend images directory and the backend uploads directory:

```bash
# Upload the script to your EC2 server
scp -i /path/to/ejofficial.pem ec2-check-images.sh ubuntu@your-ec2-host:~/

# SSH into your EC2 server
ssh -i /path/to/ejofficial.pem ubuntu@your-ec2-host

# Make the script executable and run it
chmod +x ec2-check-images.sh
sudo ./ec2-check-images.sh
```

This script will:
- Check if the frontend images directory exists
- Count the number of files in the frontend images directory
- Check if the backend uploads directory exists
- Count the number of files in the backend uploads directory
- Check permissions on both directories

## Solution 1: Fix Multiple Service Instances

If you have multiple instances of the backend or frontend services running (like the 4 backend instances you're experiencing), this can cause conflicts and issues. We've created a script to completely reset PM2 and ensure only one instance of each service is running:

```bash
# Upload the script to your EC2 server
scp -i /path/to/ejofficial.pem ec2-fix-multiple-instances.sh ubuntu@your-ec2-host:~/

# SSH into your EC2 server
ssh -i /path/to/ejofficial.pem ubuntu@your-ec2-host

# Make the script executable and run it
chmod +x ec2-fix-multiple-instances.sh
sudo ./ec2-fix-multiple-instances.sh
```

This script will:
- Stop all PM2 processes
- Delete all PM2 processes
- Start a single instance of the backend
- Start a single instance of the frontend
- Save the PM2 process list
- Display the current status

## Solution 2: Restart Services

If you have multiple instances of the backend or frontend services running, this can cause conflicts and issues. We've created a script to properly restart the services:

```bash
# Upload the script to your EC2 server
scp -i /path/to/ejofficial.pem ec2-restart-services.sh ubuntu@your-ec2-host:~/

# SSH into your EC2 server
ssh -i /path/to/ejofficial.pem ubuntu@your-ec2-host

# Make the script executable and run it
chmod +x ec2-restart-services.sh
sudo ./ec2-restart-services.sh
```

This script will:
- Stop all running instances of the backend service
- Stop all running instances of the frontend service
- Start a fresh instance of each service
- Save the PM2 process list
- Display the current status

## Solution 3: Improved Strapi Uploads Fix Script

We've created an improved version of the Strapi uploads fix script that:

1. Checks if the frontend images directory exists and has files
2. Attempts to find images in alternative locations if the primary location is empty
3. Uses rsync for more reliable file copying with detailed feedback
4. Verifies that files were actually copied to the uploads directory
5. Provides clear warnings and next steps if no files are copied

To use this script:

```bash
# Upload the script to your EC2 server
scp -i /path/to/ejofficial.pem ec2-fix-strapi-uploads-improved.sh ubuntu@your-ec2-host:~/

# SSH into your EC2 server
ssh -i /path/to/ejofficial.pem ubuntu@your-ec2-host

# Make the script executable and run it
chmod +x ec2-fix-strapi-uploads-improved.sh
sudo ./ec2-fix-strapi-uploads-improved.sh
```

## Solution 4: Upload Images from Your Local Machine

If the EC2 server doesn't have the necessary images or you want to upload specific images from your local machine, we've created a script to upload images directly to the Strapi uploads directory:

```bash
# Make the script executable
chmod +x upload-images-to-strapi.sh

# Run the script with your specific parameters
./upload-images-to-strapi.sh -i /path/to/ejofficial.pem -h your-ec2-host -d /path/to/local/images
```

This script will:
- Count the number of image files in your local directory
- Create the remote uploads directory if it doesn't exist
- Upload all images to the EC2 server using rsync
- Set the correct permissions on the uploaded files
- Restart the Strapi backend service

## Solution 5: Manual Upload through Strapi Admin

If the automated solutions don't work, you can manually upload images through the Strapi admin panel:

1. Access the Strapi admin panel at `https://api.evanjamesofficial.com/admin`
2. Navigate to Media Library
3. Click "Upload assets" and select your image files
4. Once uploaded, these images will be available for use in your content types

## Verifying the Fix

After applying any of these solutions, verify that:

1. The backend uploads directory contains the expected image files:
   ```bash
   ls -la /home/ubuntu/evan-james-project/backend/public/uploads
   ```

2. The Strapi admin panel shows the uploaded images in the Media Library.

3. The frontend website displays the images correctly.

## Preventing Future Issues

To prevent this issue in the future:

1. Include the creation and population of the uploads directory in your deployment process
2. Consider using a cloud storage solution like AWS S3 for more reliable media storage
3. Add regular checks to verify that the uploads directory contains the expected files
4. Document the image upload process for content editors

## Technical Details

Strapi uses the local filesystem provider by default to store uploaded files. The provider expects files to be in the `public/uploads` directory relative to the Strapi installation. When this directory is empty, Strapi can't serve the media files, resulting in missing images on the website.

The fix works by ensuring that:
1. The directory exists with the correct permissions
2. The directory contains the necessary image files
3. The Strapi backend is restarted to recognize the new files
