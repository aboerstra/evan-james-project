#!/bin/bash

# This script initializes the MySQL database for the Evan James website
# Run it on the server to set up the database

# Set the database connection details
DB_NAME="evan_james_site"
DB_USER="strapi"
DB_PASSWORD="strapi"

echo "Setting up MySQL for Evan James Website..."

# Check if MySQL is installed, if not install it
if ! command -v mysql &> /dev/null; then
    echo "MySQL not found, installing..."
    sudo apt-get update
    sudo apt-get install -y mysql-server
fi

# Check if MySQL is running, if not start it
if ! systemctl is-active --quiet mysql; then
    echo "Starting MySQL service..."
    sudo systemctl start mysql
    sudo systemctl enable mysql
fi

# Create the database and user
mysql -u root -p"${MYSQL_ROOT_PASSWORD:-rootpassword}" <<MYSQL_SCRIPT
CREATE DATABASE IF NOT EXISTS \\\

# Create the database user
echo "Creating database user ${DB_USER}..."
sudo -u postgres psql -c "CREATE USER ${DB_USER} WITH ENCRYPTED PASSWORD '${DB_PASSWORD}';"

# Create the database
echo "Creating database ${DB_NAME}..."
sudo -u postgres psql -c "CREATE DATABASE ${DB_NAME} WITH OWNER ${DB_USER};"

# Set privileges
echo "Setting privileges..."
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};"

echo "Database setup complete!"
echo "Configuration details:"
echo "  Database Name: ${DB_NAME}"
echo "  Username: ${DB_USER}"
echo "  Password: ${DB_PASSWORD}"
echo ""
echo "Make sure to update your .env file with these details."

# Update the .env file
if [ -f "./backend/.env" ]; then
    echo "Updating .env file..."
    # Create a backup
    cp ./backend/.env ./backend/.env.backup
    
    # Update the database connection details
    sed -i "s/DATABASE_NAME=.*/DATABASE_NAME=${DB_NAME}/" ./backend/.env
    sed -i "s/DATABASE_USERNAME=.*/DATABASE_USERNAME=${DB_USER}/" ./backend/.env
    sed -i "s/DATABASE_PASSWORD=.*/DATABASE_PASSWORD=${DB_PASSWORD}/" ./backend/.env
    
    echo ".env file updated."
else
    echo "No .env file found. Please create one with the database connection details."
fi 