# GitHub Repository Configuration Guide

This guide provides instructions for managing your GitHub repository configuration for deployment purposes.

## Current Status

Your repository (https://github.com/aboerstra/evanjamesofficial) is currently set to **public** to facilitate deployment. This allows the deployment scripts to download code without requiring authentication.

## Options for Repository Privacy

### Option 1: Keep Repository Public (Current Configuration)

**Advantages:**
- Simplest deployment process
- No authentication required
- Works with the current deployment scripts

**Considerations:**
- Anyone can view your code
- Suitable for open-source projects or non-sensitive code

### Option 2: Make Repository Private with Authentication

If you want to secure your codebase, you can make the repository private and update the deployment process to use authentication.

#### Steps to Make Repository Private

1. Go to your repository on GitHub: https://github.com/aboerstra/evanjamesofficial
2. Click on "Settings" in the top navigation bar
3. Scroll down to the "Danger Zone"
4. Click on "Change repository visibility"
5. Select "Make private" and confirm

#### Setting Up Deployment with Private Repository

**Method A: Using Personal Access Token**

1. Generate a Personal Access Token (PAT) on GitHub:
   - Go to GitHub Settings > Developer settings > Personal access tokens
   - Click "Generate new token" 
   - Select the "repo" scope
   - Generate and copy the token

2. Set up the token on your EC2 server:
   ```bash
   ssh -i ~/ejofficial.pem ubuntu@evanjamesofficial.com
   echo "machine github.com login YOUR_GITHUB_USERNAME password YOUR_TOKEN" > ~/.netrc
   chmod 600 ~/.netrc
   ```

3. Update the repository URL in the deployment script:
   ```bash
   # In scripts/simplified-deploy.sh, change:
   GITHUB_REPO="https://github.com/aboerstra/evanjamesofficial"
   # To:
   GITHUB_REPO="https://YOUR_GITHUB_USERNAME:YOUR_TOKEN@github.com/aboerstra/evanjamesofficial"
   ```

**Method B: Using SSH Keys for GitHub**

1. Generate an SSH key on your EC2 server:
   ```bash
   ssh -i ~/ejofficial.pem ubuntu@evanjamesofficial.com
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```

2. Add the SSH key to your GitHub account:
   - Display the public key: `cat ~/.ssh/id_ed25519.pub`
   - Copy the output
   - Go to GitHub Settings > SSH and GPG keys > New SSH key
   - Paste the key and add it

3. Update the repository URL in the deployment script:
   ```bash
   # In scripts/simplified-deploy.sh, change:
   GITHUB_REPO="https://github.com/aboerstra/evanjamesofficial"
   # To:
   GITHUB_REPO="git@github.com:aboerstra/evanjamesofficial.git"
   ```

4. Test the SSH connection:
   ```bash
   ssh -T git@github.com
   ```

**Method C: GitHub Actions for Deployment**

For a more advanced setup, you can use GitHub Actions to handle deployment:

1. Create a new file in your repository at `.github/workflows/deploy.yml`
2. Add a workflow that SSH's into your server and runs the deployment
3. Store your SSH key as a GitHub secret

This approach allows you to trigger deployments automatically when you push to your repository.

## Recommended Approach

If your codebase contains sensitive information or proprietary code, we recommend:

1. Make the repository private
2. Set up Method B (SSH Keys) for deployment
3. Update the deployment script to use the SSH URL

This provides a good balance of security and convenience.

## Testing After Configuration Change

After changing your repository configuration, always test a deployment to ensure everything works correctly:

```bash
./scripts/remote-deploy.sh
```

If you encounter issues, refer to the troubleshooting guides provided.
