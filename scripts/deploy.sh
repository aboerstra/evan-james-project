#!/bin/bash

echo "Deploying Evan James Website to EC2..."

# Pull latest changes
git pull

# Build and start containers
docker-compose down
docker-compose build
docker-compose up -d

# Show container status
docker-compose ps

echo "Deployment complete! The website should be running at:"
echo "Backend: http://localhost:1337"
echo "Frontend: http://localhost:3000" 