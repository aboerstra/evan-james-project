# SSH Connection Troubleshooting Guide

The deployment script is having trouble connecting to your EC2 server. This guide will help you resolve these SSH connection issues.

## Current SSH Connection Error

The script found an SSH key at `/home/aboerstra/ejofficial.pem`, but there seems to be an issue connecting to the server. Here are the possible causes and solutions:

### 1. Server Hostname Verification

First, let's verify the server hostname is correct:

```bash
ping evanjamesofficial.com
```

If this doesn't resolve to an IP address, there might be a DNS issue or the domain may not be properly configured.

### 2. Server Availability

Check if your EC2 instance is running:
- Log into the AWS Console
- Go to EC2 Dashboard
- Verify the instance state is "Running"
- Check security groups to ensure port 22 (SSH) is open

### 3. Key Authentication Issues

The SSH key may not be authorized for this server:

```bash
# Test connection with verbose output
ssh -v -i ~/ejofficial.pem ubuntu@evanjamesofficial.com
```

Look for errors in the output that might indicate what's wrong.

### 4. Key Permissions

Ensure your key has the correct permissions:

```bash
chmod 400 ~/ejofficial.pem
```

### 5. SSH Config Debugging

Try connecting with strict host key checking disabled (for testing only):

```bash
ssh -o StrictHostKeyChecking=no -i ~/ejofficial.pem ubuntu@evanjamesofficial.com
```

### 6. Check for IP Address Changes

If your EC2 instance was restarted, it might have a new public IP address:

```bash
# Try connecting directly to the IP if you know it
ssh -i ~/ejofficial.pem ubuntu@YOUR_EC2_IP_ADDRESS
```

## Alternative Deployment Options

If you can't resolve the SSH issues immediately, you have these options:

### 1. Manual Server Access

Use the AWS EC2 Console to connect to your instance:
- Open the AWS Console
- Navigate to EC2 instances
- Select your instance
- Click "Connect" and use the "EC2 Instance Connect" option

Once connected, you can manually run the deployment commands.

### 2. Manually Transfer and Run Scripts

If you can connect through alternate methods:

```bash
# After connecting to the server
curl -o /home/ubuntu/simplified-deploy.sh https://raw.githubusercontent.com/aboerstra/evanjamesofficial/main/scripts/simplified-deploy.sh
chmod +x /home/ubuntu/simplified-deploy.sh
./simplified-deploy.sh
```

### 3. GitHub Actions for Deployment

Consider setting up GitHub Actions for automated deployment:
1. Create a new GitHub Actions workflow file in `.github/workflows/deploy.yml`
2. Configure it to connect to your EC2 instance using SSH secrets
3. Define the deployment steps to run

## Next Steps After Resolving SSH Issues

Once your SSH connection is working:

1. Run the deployment script again:
   ```bash
   ./scripts/remote-deploy.sh
   ```

2. Follow the steps in `ENV_TRANSFER_GUIDE.md` to upload your environment variables

3. Use the `POST_DEPLOYMENT_CHECKLIST.md` to verify all aspects of your deployment

## Seeking Additional Help

If you continue to experience issues:
- Check AWS EC2 documentation for SSH troubleshooting
- Verify your network isn't blocking outbound SSH connections
- Consider recreating your key pair in AWS and updating your local key
