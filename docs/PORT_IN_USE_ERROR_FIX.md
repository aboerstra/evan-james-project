# Port In Use Error Fix

This document explains how to fix the "port already in use" error that may occur during deployment of the Evan James website.

## The Error

When starting the Strapi backend or Next.js frontend, you might encounter an error like this:

```
[2025-06-01 18:48:33.868] debug: ⛔️ Server wasn't able to start properly.
[2025-06-01 18:48:33.869] error: The port 1337 is already used by another application.
```

Or for the frontend:

```
Error: listen EADDRINUSE: address already in use :::3000
```

## The Cause

This error occurs when another process is already using the port that your application is trying to use. Common causes include:

1. A previous instance of the application is still running
2. Another application is using the same port
3. The process was not properly terminated in a previous run
4. PM2 is managing a process that's using the port

## The Solution

We've created a script (`kill-port-process.sh`) that helps you identify and kill the process using a specific port. The script:

1. Finds the process ID (PID) of the process using the specified port
2. Shows you details about the process
3. Gives you the option to kill the process
4. If no process is found, checks PM2 processes and offers to restart them

## How to Use the Fix Script

If you encounter a "port already in use" error, follow these steps:

1. SSH into your EC2 server:
   ```bash
   ssh -i /path/to/ejofficial.pem ubuntu@evanjamesofficial.com
   ```

2. Run the port process killer script with the port number that's in use:
   ```bash
   ./kill-port-process.sh 1337
   ```
   (Replace 1337 with the port number that's in use, e.g., 3000 for the frontend)

3. The script will show you information about the process using the port and ask if you want to kill it. Type 'y' to kill the process.

4. If no process is found using the port directly, the script will check PM2 processes and offer to restart them.

5. After killing the process or restarting PM2, try running your application again.

## Technical Details

The script uses the `lsof` command to find processes using a specific port:

```bash
# Find the process ID using the port
PID=$(lsof -t -i:$PORT)
```

It then uses the `ps` command to show details about the process:

```bash
# Get process details
ps -p $PID -o pid,ppid,user,cmd
```

And finally, it uses the `kill` command to terminate the process:

```bash
# Kill the process
kill -9 $PID
```

## Common Port Numbers

Here are the common port numbers used in the Evan James website:

- **1337**: Strapi backend
- **3000**: Next.js frontend development server
- **80**: HTTP (production)
- **443**: HTTPS (production)

## PM2 Process Management

If the issue is related to PM2-managed processes, you can also try these commands:

1. List all PM2 processes:
   ```bash
   pm2 list
   ```

2. Restart a specific process:
   ```bash
   pm2 restart backend
   ```
   or
   ```bash
   pm2 restart frontend
   ```

3. Restart all processes:
   ```bash
   pm2 restart all
   ```

4. Stop a specific process:
   ```bash
   pm2 stop backend
   ```

5. Delete a process from PM2:
   ```bash
   pm2 delete backend
   ```

## Permanent Solution

For a more permanent solution, you could consider:

1. Configuring your applications to use different ports
2. Setting up proper process management to ensure clean shutdowns
3. Implementing health checks to detect and restart hung processes
