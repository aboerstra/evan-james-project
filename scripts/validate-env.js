#!/usr/bin/env node

/**
 * Environment Variable Validation Script
 * 
 * This script validates environment variables for both frontend and backend
 * to ensure all required variables are present and properly formatted.
 * 
 * Usage:
 *   node validate-env.js [frontend|backend] [path/to/.env]
 * 
 * Examples:
 *   node validate-env.js frontend ../frontend/.env
 *   node validate-env.js backend ../backend/.env
 */

const fs = require('fs');
const path = require('path');

/**
 * Helper functions for validation
 */
const validatePassword = (value) => {
  // Check if password is strong enough
  if (value.length < 12) return false;
  
  // Check for complexity (at least 3 of 4 categories)
  let categories = 0;
  if (/[A-Z]/.test(value)) categories++; // Uppercase
  if (/[a-z]/.test(value)) categories++; // Lowercase
  if (/[0-9]/.test(value)) categories++; // Numbers
  if (/[^A-Za-z0-9]/.test(value)) categories++; // Special chars
  
  return categories >= 3 && value !== 'changeMe';
};

const validateSecret = (value) => {
  // Check if secret has sufficient entropy
  if (value.length < 32) return false;
  
  // Check for complexity (at least 3 of 4 categories)
  let categories = 0;
  if (/[A-Z]/.test(value)) categories++; // Uppercase
  if (/[a-z]/.test(value)) categories++; // Lowercase
  if (/[0-9]/.test(value)) categories++; // Numbers
  if (/[^A-Za-z0-9]/.test(value)) categories++; // Special chars
  
  return categories >= 3 && value !== 'changeMe';
};

const validateUrl = (value) => {
  try {
    new URL(value);
    return true;
  } catch (e) {
    return false;
  }
};

// Define required variables and validation rules
const requiredVariables = {
  frontend: {
    // API Configuration
    'NEXT_PUBLIC_API_URL': {
      required: true,
      validate: (value) => value.startsWith('http://') || value.startsWith('https://'),
      message: 'Must be a valid URL starting with http:// or https://'
    },
    'NEXT_PUBLIC_SITE_URL': {
      required: true,
      validate: (value) => value.startsWith('http://') || value.startsWith('https://'),
      message: 'Must be a valid URL starting with http:// or https://'
    },
    // Authentication
    'NEXTAUTH_URL': {
      required: true,
      validate: (value) => value.startsWith('http://') || value.startsWith('https://'),
      message: 'Must be a valid URL starting with http:// or https://'
    },
    'NEXTAUTH_SECRET': {
      required: true,
      validate: validateSecret,
      message: 'Must be at least 32 characters long with a mix of uppercase, lowercase, numbers, and special characters'
    },
    // External Services
    'STABILITY_API_KEY': {
      required: true,
      validate: (value) => value.startsWith('sk-') && value.length > 10 && value !== 'changeMe',
      message: 'Must be a valid Stability API key starting with sk- and not the default value'
    },
    // Error Tracking & Monitoring
    'NEXT_PUBLIC_SENTRY_DSN': {
      required: true,
      validate: (value) => value.startsWith('https://') && value.includes('@'),
      message: 'Must be a valid Sentry DSN URL starting with https:// and containing an @ symbol'
    },
    // Optional
    'NEXT_PUBLIC_GOOGLE_ANALYTICS_ID': {
      required: false,
      validate: (value) => !value || value.startsWith('G-'),
      message: 'If provided, must start with G-'
    }
  },
  backend: {
    // Core Application
    'HOST': {
      required: true,
      validate: (value) => true, // Any value is acceptable
      message: 'Must be provided'
    },
    'PORT': {
      required: true,
      validate: (value) => !isNaN(parseInt(value)),
      message: 'Must be a valid port number'
    },
    'APP_KEYS': {
      required: true,
      validate: (value) => value.includes(',') && value !== 'changeMe1,changeMe2',
      message: 'Must be comma-separated values and not the default value'
    },
    'API_TOKEN_SALT': {
      required: true,
      validate: validateSecret,
      message: 'Must be at least 32 characters long with a mix of uppercase, lowercase, numbers, and special characters'
    },
    'ADMIN_JWT_SECRET': {
      required: true,
      validate: validateSecret,
      message: 'Must be at least 32 characters long with a mix of uppercase, lowercase, numbers, and special characters'
    },
    'TRANSFER_TOKEN_SALT': {
      required: true,
      validate: validateSecret,
      message: 'Must be at least 32 characters long with a mix of uppercase, lowercase, numbers, and special characters'
    },
    'JWT_SECRET': {
      required: true,
      validate: validateSecret,
      message: 'Must be at least 32 characters long with a mix of uppercase, lowercase, numbers, and special characters'
    },
    'PUBLIC_URL': {
      required: true,
      validate: (value) => value.startsWith('http://') || value.startsWith('https://'),
      message: 'Must be a valid URL starting with http:// or https://'
    },
    // Database
    'DATABASE_CLIENT': {
      required: true,
      validate: (value) => ['mysql', 'mysql2', 'postgres', 'sqlite'].includes(value),
      message: 'Must be one of: mysql, mysql2, postgres, sqlite'
    },
    'DATABASE_HOST': {
      required: true,
      validate: (value) => true, // Any value is acceptable
      message: 'Must be provided'
    },
    'DATABASE_PORT': {
      required: true,
      validate: (value) => !isNaN(parseInt(value)),
      message: 'Must be a valid port number'
    },
    'DATABASE_NAME': {
      required: true,
      validate: (value) => value.length > 0,
      message: 'Must be provided'
    },
    'DATABASE_USERNAME': {
      required: true,
      validate: (value) => value.length > 0,
      message: 'Must be provided'
    },
    'DATABASE_PASSWORD': {
      required: true,
      validate: validatePassword,
      message: 'Must be at least 12 characters long with a mix of uppercase, lowercase, numbers, and special characters'
    },
    // CORS
    'CORS_ENABLED': {
      required: false,
      validate: (value) => !value || ['true', 'false'].includes(value.toLowerCase()),
      message: 'If provided, must be true or false'
    },
    'CORS_ORIGIN': {
      required: false,
      validate: (value) => !value || value.startsWith('http://') || value.startsWith('https://'),
      message: 'If provided, must be a valid URL starting with http:// or https://'
    },
    // Error Tracking & Monitoring
    'SENTRY_DSN': {
      required: false,
      validate: (value) => !value || value.startsWith('https://') && value.includes('@'),
      message: 'If provided, must be a valid Sentry DSN URL starting with https:// and containing an @ symbol'
    },
    'SENTRY_ENABLE_DEV': {
      required: false,
      validate: (value) => !value || ['true', 'false'].includes(value.toLowerCase()),
      message: 'If provided, must be true or false'
    }
  }
};

// Parse command line arguments
const args = process.argv.slice(2);
if (args.length !== 2) {
  console.error('Usage: node validate-env.js [frontend|backend] [path/to/.env]');
  process.exit(1);
}

const [type, envPath] = args;

if (!['frontend', 'backend'].includes(type)) {
  console.error('Type must be either "frontend" or "backend"');
  process.exit(1);
}

// Check if .env file exists
if (!fs.existsSync(envPath)) {
  console.error(`Error: .env file not found at ${envPath}`);
  process.exit(1);
}

// Read and parse .env file
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  // Skip comments and empty lines
  if (line.startsWith('#') || line.trim() === '') {
    return;
  }
  
  // Parse key-value pairs
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    const [, key, value] = match;
    envVars[key.trim()] = value.trim();
  }
});

// Validate environment variables
const errors = [];
const warnings = [];

const rules = requiredVariables[type];
for (const [key, rule] of Object.entries(rules)) {
  // Check if required variable is present
  if (rule.required && !envVars[key]) {
    errors.push(`Missing required variable: ${key}`);
    continue;
  }
  
  // Skip validation for optional variables that are not present
  if (!rule.required && !envVars[key]) {
    continue;
  }
  
  // Validate variable format
  if (envVars[key] && !rule.validate(envVars[key])) {
    errors.push(`Invalid value for ${key}: ${rule.message}`);
  }
  
  // Check for default values in production
  if (envVars[key] && 
      (envVars[key].includes('changeMe') || 
       envVars[key] === 'your-jwt-secret-here' || 
       envVars[key] === 'your-api-token-salt-here')) {
    if (process.env.NODE_ENV === 'production') {
      errors.push(`Default value detected for ${key} in production environment`);
    } else {
      warnings.push(`Default value detected for ${key}`);
    }
  }
}

// Add additional security checks
const performSecurityChecks = (envVars, type) => {
  // Check for hardcoded credentials
  for (const [key, value] of Object.entries(envVars)) {
    // Check for potential hardcoded credentials
    if ((key.includes('PASSWORD') || key.includes('SECRET') || key.includes('KEY') || key.includes('TOKEN')) && 
        value && value.length > 0) {
      
      // Check for common patterns that might indicate hardcoded credentials
      if (value.match(/^(pass|password|secret|key|token|credential)/i)) {
        warnings.push(`${key} may contain a hardcoded credential pattern`);
      }
      
      // Check for potential AWS keys
      if (value.match(/^AKIA[0-9A-Z]{16}$/)) {
        errors.push(`${key} appears to contain a hardcoded AWS access key ID`);
      }
      
      // Check for potential private keys
      if (value.includes('-----BEGIN PRIVATE KEY-----')) {
        errors.push(`${key} appears to contain a hardcoded private key`);
      }
      
      // Check for potential API keys in common formats
      if (value.match(/^[a-zA-Z0-9]{32,}$/) && !key.includes('SALT') && !key.includes('JWT')) {
        warnings.push(`${key} may contain a hardcoded API key`);
      }
    }
  }
  
  // Check for insecure protocols
  if (type === 'frontend' || type === 'backend') {
    for (const [key, value] of Object.entries(envVars)) {
      if (value && value.startsWith('http://') && !value.includes('localhost') && !value.includes('127.0.0.1')) {
        warnings.push(`${key} uses an insecure HTTP protocol for a non-localhost URL`);
      }
    }
  }
  
  // Check for overly permissive CORS settings
  if (type === 'backend' && envVars['CORS_ORIGIN'] === '*') {
    warnings.push('CORS_ORIGIN is set to "*", which allows requests from any origin');
  }
};

// Perform additional security checks
performSecurityChecks(envVars, type);

// Check for environment-specific validations
if (type === 'frontend') {
  // Check for consistency between API_URL and NEXTAUTH_URL
  if (envVars['NEXT_PUBLIC_SITE_URL'] && envVars['NEXTAUTH_URL'] && 
      envVars['NEXT_PUBLIC_SITE_URL'] !== envVars['NEXTAUTH_URL']) {
    warnings.push('NEXT_PUBLIC_SITE_URL and NEXTAUTH_URL should typically be the same');
  }
  
  // Check for production URLs in production environment
  if (process.env.NODE_ENV === 'production') {
    if (envVars['NEXT_PUBLIC_API_URL'] && envVars['NEXT_PUBLIC_API_URL'].includes('localhost')) {
      errors.push('NEXT_PUBLIC_API_URL contains localhost in production environment');
    }
    if (envVars['NEXT_PUBLIC_SITE_URL'] && envVars['NEXT_PUBLIC_SITE_URL'].includes('localhost')) {
      errors.push('NEXT_PUBLIC_SITE_URL contains localhost in production environment');
    }
    if (envVars['NEXTAUTH_URL'] && envVars['NEXTAUTH_URL'].includes('localhost')) {
      errors.push('NEXTAUTH_URL contains localhost in production environment');
    }
  }
} else if (type === 'backend') {
  // Check for production URLs in production environment
  if (process.env.NODE_ENV === 'production') {
    if (envVars['PUBLIC_URL'] && envVars['PUBLIC_URL'].includes('localhost')) {
      errors.push('PUBLIC_URL contains localhost in production environment');
    }
    if (envVars['CORS_ORIGIN'] && envVars['CORS_ORIGIN'].includes('localhost')) {
      errors.push('CORS_ORIGIN contains localhost in production environment');
    }
  }
  
  // Check for database SSL in production
  if (process.env.NODE_ENV === 'production' && 
      envVars['DATABASE_SSL'] && 
      envVars['DATABASE_SSL'].toLowerCase() === 'false') {
    warnings.push('DATABASE_SSL is set to false in production environment');
  }
}

// Output validation results
if (errors.length > 0) {
  console.error('\n❌ Environment validation failed with errors:');
  errors.forEach(error => console.error(`  - ${error}`));
}

if (warnings.length > 0) {
  console.warn('\n⚠️ Environment validation warnings:');
  warnings.forEach(warning => console.warn(`  - ${warning}`));
}

if (errors.length === 0 && warnings.length === 0) {
  console.log('\n✅ Environment validation passed successfully!');
} else if (errors.length === 0) {
  console.log('\n✅ Environment validation passed with warnings.');
}

// Exit with error code if there are errors
if (errors.length > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
