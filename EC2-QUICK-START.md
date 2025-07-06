# Quick Start Guide for EC2 Deployment

## Simplified Deployment (Recommended)

We've created a script with your EC2 connection details already baked in:

```bash
./scripts/deploy-to-ec2.sh /path/to/ejofficial.pem
```

For example:
```bash
./scripts/deploy-to-ec2.sh ~/.ssh/ejofficial.pem
```

The script will:
1. Try to find your PEM file automatically if not provided (checks in scripts/, ~/, and ~/.ssh/)
2. Fix permissions on the PEM file (chmod 600) to ensure SSH works correctly
3. Upload all necessary files to your EC2 server
4. Make the setup script executable
5. Offer to SSH into the server for you

## Alternative Method (Manual Configuration)

If you need to customize the deployment for a different server:

### Step 1: Prepare Your EC2 Server Information

You'll need:
- The path to your EC2 private key (.pem file)
- Your EC2 server address (usually in the format `ubuntu@ec2-xx-xx-xx-xx.compute-1.amazonaws.com`)

### Step 2: Upload the Setup Script

Run the following command, replacing the placeholders with your actual information:

```bash
./scripts/upload-setup-script.sh /path/to/your-key.pem ubuntu@your-ec2-server-address
```

For example:
```bash
./scripts/upload-setup-script.sh ~/keys/evan-james.pem ubuntu@ec2-12-34-56-78.compute-1.amazonaws.com
```

## Step 3: SSH Into Your EC2 Server

```bash
ssh -i /path/to/your-key.pem ubuntu@your-ec2-server-address
```

## Step 4: Run the Setup Script

Once you're logged into your EC2 server:

```bash
# Without SSL
./ec2-setup-complete.sh

# Or with SSL (recommended for production)
./ec2-setup-complete.sh --with-ssl
```

## Step 5: Verify Your Deployment

After the script completes, verify that everything is working:

- Backend API: `https://api.evanjamesofficial.com`
- Backend Admin: `https://api.evanjamesofficial.com/admin`
- Frontend: `https://evanjamesofficial.com`

Use the checklist in `EC2-DEPLOYMENT-CHECKLIST.md` for a comprehensive verification.
