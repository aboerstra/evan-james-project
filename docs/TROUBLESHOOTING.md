# Troubleshooting Guide for Evan James Project

This guide provides resources and tools for diagnosing and fixing issues in the Evan James project, particularly focusing on 500 errors in the frontend.

## Available Troubleshooting Resources

### 1. Comprehensive Troubleshooting Plan

The [500 Error Troubleshooting Plan](500_ERROR_TROUBLESHOOTING_PLAN.md) provides a systematic approach to diagnosing and resolving 500 errors. It includes:

- Step-by-step diagnostic procedures
- Code snippets for testing and debugging
- Detailed explanations of common issues
- Resolution strategies

### 2. Automated Troubleshooting Script

The `scripts/troubleshoot-500-error.sh` script automates many common troubleshooting tasks:

```bash
# Make the script executable (if not already)
chmod +x scripts/troubleshoot-500-error.sh

# Run the script
./scripts/troubleshoot-500-error.sh
```

The script provides an interactive menu with options to:

- Test basic connectivity
- Verify environment variables
- Check database connections
- Test API endpoints
- Monitor server resources
- Create test pages
- Enable verbose logging

## Common Issues and Quick Fixes

### API Connection Issues

If the frontend can't connect to the backend API:

1. Verify the backend is running: `cd backend && npm run develop`
2. Check that `NEXT_PUBLIC_API_URL` in `frontend/.env` is set correctly
3. Ensure CORS is properly configured in `backend/config/server.js`

### Database Connection Issues

If the backend can't connect to the database:

1. Verify MySQL is running: `sudo systemctl status mysql`
2. Check database credentials in `backend/.env`
3. Test connection: `mysql -u username -p -h hostname database_name`

### 500 Error Debugging

When encountering a 500 error:

1. Check browser console for detailed error messages
2. Examine backend logs: `cd backend && npm run develop -- --debug`
3. Use the test API page to isolate the problematic endpoint
4. Enable verbose logging in the backend

## Getting Help

If you're still experiencing issues after following the troubleshooting steps:

1. Document the exact steps that reproduce the error
2. Capture all relevant error messages from both frontend and backend
3. Note any recent changes to the codebase that might have introduced the issue
4. Check the project's issue tracker for similar problems and solutions

## Preventative Measures

To prevent 500 errors in the future:

1. Implement comprehensive error handling in API requests
2. Add proper validation for all user inputs
3. Set up monitoring and alerting for API failures
4. Maintain thorough test coverage for critical paths
5. Document API contracts and data structures
