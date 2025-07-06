#!/bin/bash

# Enhanced script to find and kill a process using a specific port
# Also checks for and manages PM2 processes
# Usage: ./kill-port-process.sh <port>

if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <port>"
    echo "Example: $0 1337"
    exit 1
fi

PORT=$1
echo "Finding process using port $PORT..."

# Find the process ID using the port
PID=$(lsof -t -i:$PORT)

# Check for PM2 processes that might be using this port
echo "Checking PM2 processes..."
PM2_PROCESSES=$(pm2 list)
echo "$PM2_PROCESSES"

# For Strapi backend (port 1337)
if [ "$PORT" -eq 1337 ]; then
    if echo "$PM2_PROCESSES" | grep -q "backend"; then
        echo ""
        echo "Found PM2 process 'backend' which might be using port $PORT"
        echo "Would you like to stop the PM2 backend process? (y/n)"
        read -r response
        if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
            echo "Stopping PM2 backend process..."
            pm2 stop backend
            echo "PM2 backend process stopped."
            
            # Check if the port is now free
            sleep 2
            if lsof -i:$PORT > /dev/null; then
                echo "Port $PORT is still in use. Trying to find the process again..."
                PID=$(lsof -t -i:$PORT)
            else
                echo "Port $PORT is now free. You can start your application."
                exit 0
            fi
        fi
    fi
fi

# For Next.js frontend (port 3000)
if [ "$PORT" -eq 3000 ]; then
    if echo "$PM2_PROCESSES" | grep -q "frontend"; then
        echo ""
        echo "Found PM2 process 'frontend' which might be using port $PORT"
        echo "Would you like to stop the PM2 frontend process? (y/n)"
        read -r response
        if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
            echo "Stopping PM2 frontend process..."
            pm2 stop frontend
            echo "PM2 frontend process stopped."
            
            # Check if the port is now free
            sleep 2
            if lsof -i:$PORT > /dev/null; then
                echo "Port $PORT is still in use. Trying to find the process again..."
                PID=$(lsof -t -i:$PORT)
            else
                echo "Port $PORT is now free. You can start your application."
                exit 0
            fi
        fi
    fi
fi

if [ -z "$PID" ]; then
    echo "No direct process found using port $PORT"
    
    echo ""
    echo "Would you like to restart all PM2 processes? (y/n)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        echo "Restarting all PM2 processes..."
        pm2 restart all
        echo "Done. Try running your application again."
    fi
    
    exit 0
fi

echo "Process ID: $PID is using port $PORT"

# Get process details
echo "Process details:"
ps -p $PID -o pid,ppid,user,cmd

echo ""
echo "Would you like to kill this process? (y/n)"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo "Killing process $PID..."
    kill -9 $PID
    echo "Process killed."
    
    # Check if the port is now free
    sleep 2
    if lsof -i:$PORT > /dev/null; then
        echo "Warning: Port $PORT is still in use by another process."
        echo "This might be due to a PM2 process automatically restarting."
        echo ""
        echo "Would you like to check PM2 processes again? (y/n)"
        read -r response
        if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
            echo "PM2 processes:"
            pm2 list
            
            echo ""
            echo "Would you like to stop all PM2 processes? (y/n)"
            read -r response
            if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
                echo "Stopping all PM2 processes..."
                pm2 stop all
                echo "All PM2 processes stopped. You can now use port $PORT."
            fi
        fi
    else
        echo "Port $PORT is now free. You can start your application."
    fi
else
    echo "Process not killed. Port $PORT is still in use."
fi
