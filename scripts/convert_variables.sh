#!/bin/bash

# Script to convert variables.md files to .env files during deployment
# Usage: ./convert_variables.sh [environment] [target]
# Where environment is either 'development' or 'production' (defaults to 'production')
# And target is either 'local' or 'ec2' (defaults to match environment)

ENVIRONMENT=${1:-production}
TARGET=${2:-${ENVIRONMENT}}

if [ "$TARGET" != "local" ] && [ "$TARGET" != "ec2" ]; then
  echo "Invalid target: $TARGET. Must be either 'local' or 'ec2'"
  exit 1
fi

# Set NODE_ENV for validation
export NODE_ENV=$ENVIRONMENT

# Get script directory
SCRIPT_DIR="$(dirname "$(readlink -f "$0")")"
FRONTEND_DIR="$SCRIPT_DIR/../frontend"
BACKEND_DIR="$SCRIPT_DIR/../backend"

echo "Converting variables files for $ENVIRONMENT environment ($TARGET target)..."

# Convert frontend variables
FRONTEND_VARS_FILE="$FRONTEND_DIR/frontend-variables.$TARGET.md"
if [ -f "$FRONTEND_VARS_FILE" ]; then
  echo "Converting frontend variables from $FRONTEND_VARS_FILE to .env..."
  
  # Remove any existing .env file
  if [ -f "$FRONTEND_DIR/.env" ]; then
    rm "$FRONTEND_DIR/.env"
  fi
  
  # Extract variable lines from variables.md and write to .env
  # Format in variables.md should be: `VARIABLE_NAME=value`
  cat "$FRONTEND_VARS_FILE" | grep -E "^[A-Z_]+=.+" | grep -v "^#" > "$FRONTEND_DIR/.env"
  
  echo "Frontend .env file created successfully."
else
  echo "WARNING: Frontend variables file $FRONTEND_VARS_FILE not found!"
fi

# Convert backend variables
BACKEND_VARS_FILE="$BACKEND_DIR/backend-variables.$TARGET.md"
if [ -f "$BACKEND_VARS_FILE" ]; then
  echo "Converting backend variables from $BACKEND_VARS_FILE to .env..."
  
  # Remove any existing .env file
  if [ -f "$BACKEND_DIR/.env" ]; then
    rm "$BACKEND_DIR/.env"
  fi
  
  # Extract variable lines from variables.md and write to .env
  cat "$BACKEND_VARS_FILE" | grep -E "^[A-Z_]+=.+" | grep -v "^#" > "$BACKEND_DIR/.env"
  
  echo "Backend .env file created successfully."
else
  echo "WARNING: Backend variables file $BACKEND_VARS_FILE not found!"
fi

# Validate environment files
echo "Validating environment variables..."

# Validate frontend .env
if [ -f "$FRONTEND_DIR/.env" ]; then
  FRONTEND_VARS=$(cat "$FRONTEND_DIR/.env" | wc -l)
  echo "Frontend .env contains $FRONTEND_VARS variables."
  
  echo "Validating frontend environment variables..."
  node "$SCRIPT_DIR/validate-env.js" frontend "$FRONTEND_DIR/.env"
  FRONTEND_VALIDATION_RESULT=$?
  
  if [ $FRONTEND_VALIDATION_RESULT -ne 0 ]; then
    echo "ERROR: Frontend environment validation failed!"
    if [ "$ENVIRONMENT" = "production" ]; then
      echo "Aborting deployment due to validation errors in production environment."
      exit 1
    else
      echo "WARNING: Proceeding despite validation errors in development environment."
    fi
  else
    echo "Frontend environment validation passed."
  fi
else
  echo "ERROR: Frontend .env file was not created!"
  exit 1
fi

# Validate backend .env
if [ -f "$BACKEND_DIR/.env" ]; then
  BACKEND_VARS=$(cat "$BACKEND_DIR/.env" | wc -l)
  echo "Backend .env contains $BACKEND_VARS variables."
  
  echo "Validating backend environment variables..."
  node "$SCRIPT_DIR/validate-env.js" backend "$BACKEND_DIR/.env"
  BACKEND_VALIDATION_RESULT=$?
  
  if [ $BACKEND_VALIDATION_RESULT -ne 0 ]; then
    echo "ERROR: Backend environment validation failed!"
    if [ "$ENVIRONMENT" = "production" ]; then
      echo "Aborting deployment due to validation errors in production environment."
      exit 1
    else
      echo "WARNING: Proceeding despite validation errors in development environment."
    fi
  else
    echo "Backend environment validation passed."
  fi
else
  echo "ERROR: Backend .env file was not created!"
  exit 1
fi

echo "Conversion and validation complete."
echo "IMPORTANT: Do not commit .env files to version control."

# Reminder for production deployment
if [ "$ENVIRONMENT" = "production" ]; then
  echo ""
  echo "===== PRODUCTION DEPLOYMENT REMINDERS ====="
  echo "1. Verify all required variables are present in .env files"
  echo "2. Ensure sensitive values are properly secured"
  echo "3. Store a backup of the production .env files securely"
  echo "4. Consider setting up environment variable rotation schedule"
  echo "5. Verify SSL is enabled for database connections"
  echo "6. Ensure all URLs use HTTPS in production"
  echo "=========================================="
fi

exit 0
