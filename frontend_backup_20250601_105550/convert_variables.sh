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

FRONTEND_DIR="$(dirname "$0")"
BACKEND_DIR="$(dirname "$0")/../backend"

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
if [ -f "$FRONTEND_DIR/.env" ]; then
  FRONTEND_VARS=$(cat "$FRONTEND_DIR/.env" | wc -l)
  echo "Frontend .env contains $FRONTEND_VARS variables."
else
  echo "ERROR: Frontend .env file was not created!"
  exit 1
fi

if [ -f "$BACKEND_DIR/.env" ]; then
  BACKEND_VARS=$(cat "$BACKEND_DIR/.env" | wc -l)
  echo "Backend .env contains $BACKEND_VARS variables."
else
  echo "ERROR: Backend .env file was not created!"
  exit 1
fi

echo "Conversion complete. Please verify .env files before deployment."
echo "IMPORTANT: Do not commit .env files to version control."

# Reminder for production deployment
if [ "$ENVIRONMENT" = "production" ]; then
  echo ""
  echo "===== PRODUCTION DEPLOYMENT REMINDERS ====="
  echo "1. Verify all required variables are present in .env files"
  echo "2. Ensure sensitive values are properly secured"
  echo "3. Store a backup of the production .env files securely"
  echo "4. Consider setting up environment variable rotation schedule"
  echo "=========================================="
fi

exit 0 