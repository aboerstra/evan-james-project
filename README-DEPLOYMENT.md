# Evan James Project - Simplified Deployment System

This repository contains a set of tools designed to simplify the deployment process for the Evan James project. The goal is to make deployments more consistent, less error-prone, and easier to maintain.

## Overview

Three key files have been created to support this deployment approach:

1. **`scripts/simplified-deploy.sh`**: A script designed to run on the EC2 server that handles the actual deployment process
2. **`scripts/remote-deploy.sh`**: A script you run locally to trigger deployment on the EC2 server
3. **`docs/SIMPLIFIED_DEPLOYMENT_GUIDE.md`**: Detailed documentation explaining the deployment strategy and implementation steps

## Quick Start

### To Deploy from Your Local Machine

```bash
# Make sure scripts are executable
chmod +x scripts/remote-deploy.sh

# Run the deployment script
./scripts/remote-deploy.sh
```

This will:
- Upload the deployment script to your EC2 server (if needed)
- Execute the deployment process remotely
- Show you real-time progress of the deployment

### Options

- Use `./scripts/remote-deploy.sh --force` to force update the deployment script on the server

## Benefits of This Approach

1. **Simplified Repository Structure**: Recommendations for flattening your GitHub repository structure to eliminate unnecessary nesting.

2. **Consistent Deployment Process**: Uses a standardized process regardless of who performs the deployment.

3. **Automatic Backups**: Creates timestamped backups before making changes to protect against deployment failures.

4. **Environment Variable Preservation**: Special handling to ensure your `.env` files and values are never lost during deployment.

5. **Nginx Configuration Support**: Includes a tool to update Nginx configuration when changing directory structures.

6. **Flexibility**: Works with both the current nested repository structure and a future flattened structure.

7. **Improved Feedback**: Provides clear status messages throughout the deployment process.

## Key Recommendations

1. **Flatten Repository Structure**: Consider reorganizing your GitHub repository to eliminate the nested `evan-james-project` directory.

2. **Standardize EC2 Directory Layout**: Use a simpler, more logical directory structure on your EC2 server.

3. **Environment File Management**: Follow the documented approach for managing environment variables securely.

4. **Update Nginx Configuration**: When changing directory structures, run the provided Nginx update script.

## Full Documentation

For complete details, refer to the [Simplified Deployment Guide](docs/SIMPLIFIED_DEPLOYMENT_GUIDE.md).

## Script Overview

- **`scripts/simplified-deploy.sh`**: The main deployment script (runs on EC2)
- **`scripts/remote-deploy.sh`**: Triggers deployment from your local machine
- **`scripts/update-nginx-config.sh`**: Updates Nginx configuration paths when needed
