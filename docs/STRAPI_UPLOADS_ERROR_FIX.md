# Strapi Uploads Folder Error Fix

This document explains how to fix the Strapi uploads folder error that may occur during deployment of the Evan James website.

## The Error

During the startup of the Strapi backend, you might encounter an error like this:

```
[ERROR]  There seems to be an unexpected error, try again with --debug for more information

┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                                                      │
│   Error: The upload folder (/home/ubuntu/evan-james/backend/public/uploads) doesn't exist or is not accessible.      │
│   Please make sure it exists.                                                                                        │
│   at Object.init (/home/ubuntu/evan-james/backend/node_modules/@strapi/provider-upload-local/dist/index.js:42:13)    │
│   at createProvider (/home/ubuntu/evan-james/backend/node_modules/@strapi/plugin-upload/server/register.js:60:37)    │
│   at module.exports [as register]                                                                                    │
│   (/home/ubuntu/evan-james/backend/node_modules/@strapi/plugin-upload/server/register.js:16:38)                      │
│   at Object.register                                                                                                 │
│   (/home/ubuntu/evan-james/backend/node_modules/@strapi/strapi/dist/core/domain/module/index.js:46:46)               │
│   at Object.register                                                                                                 │
│   (/home/ubuntu/evan-james/backend/node_modules/@strapi/strapi/dist/core/registries/modules.js:28:19)                │
│   at async Strapi.runLifecyclesFunctions                                                                             │
│   (/home/ubuntu/evan-james/backend/node_modules/@strapi/strapi/dist/Strapi.js:443:5)                                 │
│   at async Strapi.register (/home/ubuntu/evan-james/backend/node_modules/@strapi/strapi/dist/Strapi.js:361:5)        │
│   at async Strapi.load (/home/ubuntu/evan-james/backend/node_modules/@strapi/strapi/dist/Strapi.js:428:5)            │
│   at async Object.develop (/home/ubuntu/evan-james/backend/node_modules/@strapi/strapi/node_modules/@strapi/admin/   │
│   dist/_chunks/index-jOX8WAPL.js:839:28)                                                                             │
│   at async develop (/home/ubuntu/evan-james/backend/node_modules/@strapi/strapi/node_modules/@strapi/admin/dist/_c   │
│   hunks/develop-dfA-WCq6.js:61:5)                                                                                    │
│                                                                                                                      │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

## The Cause

This error occurs because Strapi's upload plugin requires a specific folder structure to store uploaded files. The error is specifically related to the missing uploads folder at `/home/ubuntu/evan-james/backend/public/uploads`.

## The Solution

We've created a script (`fix-strapi-uploads.sh`) that creates the required uploads folder and sets the proper permissions. The script:

1. Navigates to the backend directory
2. Creates the uploads directory if it doesn't exist
3. Sets the proper permissions (755) on the directory
4. Creates a .gitkeep file to ensure the directory is tracked by git

## How to Use the Fix Script

If you encounter the Strapi uploads folder error during deployment, follow these steps:

1. SSH into your EC2 server:
   ```bash
   ssh -i /path/to/ejofficial.pem ubuntu@evanjamesofficial.com
   ```

2. Run the fix script:
   ```bash
   ./fix-strapi-uploads.sh
   ```

3. After the script completes successfully, restart the backend service:
   ```bash
   pm2 restart backend
   ```

4. Verify that the Strapi admin panel is now working correctly by visiting:
   ```
   https://api.evanjamesofficial.com/admin
   ```

## Technical Details

The fix works by creating the required directory structure for Strapi's upload plugin. The upload plugin is configured to use the local filesystem provider, which requires a specific directory to store uploaded files.

Here's what the script does:

```bash
# Navigate to the backend directory
cd ~/evan-james/backend

# Create the uploads directory if it doesn't exist
mkdir -p public/uploads

# Set proper permissions
chmod -R 755 public/uploads

# Create a .gitkeep file to ensure the directory is tracked by git
touch public/uploads/.gitkeep
```

## Impact on Functionality

After applying this fix, the Strapi backend will be able to handle file uploads correctly. This is essential for:

1. Uploading images for the website
2. Managing media files through the Strapi admin panel
3. Storing any other files that are uploaded through the CMS

## Permanent Solution

For a more permanent solution, you could consider:

1. Modifying the deployment process to ensure the uploads directory is always created
2. Using a different storage provider (like AWS S3) for file uploads
3. Adding the directory creation to the initialization script

However, the current fix is sufficient for most use cases and doesn't require significant code changes.
