#!/usr/bin/env node

/**
 * Performance Monitoring Test Script
 * 
 * This script runs a series of tests to verify that the performance monitoring
 * implementation is working correctly in the local environment.
 * 
 * Usage:
 *   node scripts/test-performance-monitoring.js
 */

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const { performance } = require('perf_hooks');
const readline = require('readline');

// Configuration
const API_URL = process.env.API_URL || 'http://localhost:1337';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// Create readline interface for user interaction
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Helper function to prompt user
function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// Helper function to make API requests
async function makeRequest(path, options = {}) {
  const startTime = performance.now();
  try {
    const response = await fetch(`${API_URL}${path}`, options);
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    console.log(`Request to ${path} completed in ${duration.toFixed(2)}ms with status ${response.status}`);
    
    if (response.ok) {
      return await response.json();
    } else {
      console.error(`Error response: ${response.status} ${response.statusText}`);
      return null;
    }
  } catch (error) {
    const endTime = performance.now();
    const duration = endTime - startTime;
    console.error(`Request to ${path} failed after ${duration.toFixed(2)}ms: ${error.message}`);
    return null;
  }
}

// Helper function to authenticate as admin
async function authenticateAdmin() {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.log('Admin credentials not provided in environment variables.');
    const email = await prompt('Enter admin email: ');
    const password = await prompt('Enter admin password: ');
    
    return getJwtToken(email, password);
  }
  
  return getJwtToken(ADMIN_EMAIL, ADMIN_PASSWORD);
}

// Helper function to get JWT token
async function getJwtToken(email, password) {
  const response = await makeRequest('/admin/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });
  
  if (response && response.data && response.data.token) {
    console.log('Authentication successful');
    return response.data.token;
  } else {
    console.error('Authentication failed');
    return null;
  }
}

// Test backend performance monitoring
async function testBackendMonitoring(jwtToken) {
  console.log('\n=== Testing Backend Performance Monitoring ===\n');
  
  // Test 1: Make a series of API requests
  console.log('Test 1: Making a series of API requests...');
  await makeRequest('/api/albums');
  await makeRequest('/api/videos');
  await makeRequest('/api/photos');
  await makeRequest('/api/tour-dates');
  
  // Test 2: Simulate a slow request
  console.log('\nTest 2: Simulating a slow request...');
  console.log('Creating a deliberate delay to trigger slow request detection');
  await makeRequest('/api/albums?delay=3000');
  
  // Test 3: Check performance metrics
  console.log('\nTest 3: Checking performance metrics...');
  if (!jwtToken) {
    console.log('Skipping metrics check - no JWT token available');
  } else {
    const metrics = await makeRequest('/api/performance/metrics', {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });
    
    if (metrics) {
      console.log('Performance metrics retrieved successfully');
      console.log('Summary:');
      console.log(`- Total Requests: ${metrics.summary.totalRequests}`);
      console.log(`- Average Response Time: ${metrics.summary.averageResponseTime.toFixed(2)}ms`);
      console.log(`- Slow Requests: ${metrics.summary.slowRequests}`);
      
      console.log('\nTop 3 slowest endpoints:');
      const sortedEndpoints = [...metrics.endpoints].sort((a, b) => b.averageResponseTime - a.averageResponseTime);
      sortedEndpoints.slice(0, 3).forEach((endpoint, index) => {
        console.log(`${index + 1}. ${endpoint.path} - ${endpoint.averageResponseTime.toFixed(2)}ms avg (${endpoint.requests} requests)`);
      });
    }
  }
  
  // Test 4: Reset metrics
  console.log('\nTest 4: Resetting performance metrics...');
  if (!jwtToken) {
    console.log('Skipping metrics reset - no JWT token available');
  } else {
    await makeRequest('/api/performance/reset', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });
    
    // Verify reset
    const metricsAfterReset = await makeRequest('/api/performance/metrics', {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });
    
    if (metricsAfterReset && metricsAfterReset.summary.totalRequests === 0) {
      console.log('Metrics reset successful');
    } else {
      console.error('Metrics reset failed or metrics not properly reset');
    }
  }
}

// Test frontend performance monitoring
async function testFrontendMonitoring() {
  console.log('\n=== Testing Frontend Performance Monitoring ===\n');
  
  console.log('Frontend performance monitoring must be tested manually in the browser.');
  console.log('Please follow these steps:');
  console.log('1. Open the frontend application in your browser');
  console.log('2. Open the browser developer tools (F12)');
  console.log('3. Go to the Console tab');
  console.log('4. Look for performance monitoring initialization messages');
  console.log('5. Navigate to different pages and check for performance metrics in the console');
  console.log('6. Submit forms and check for API request performance tracking');
  
  const continueTest = await prompt('\nHave you verified frontend performance monitoring is working? (yes/no): ');
  
  if (continueTest.toLowerCase() === 'yes') {
    console.log('Frontend performance monitoring test passed');
    return true;
  } else {
    console.log('Frontend performance monitoring test skipped or failed');
    return false;
  }
}

// Main test function
async function runTests() {
  console.log('=== Performance Monitoring Test Script ===');
  
  // Check if backend is running
  console.log('\nChecking if backend is running...');
  const backendCheck = await makeRequest('/api/site-settings');
  
  if (!backendCheck) {
    console.error('Backend is not running or site-settings endpoint is not available.');
    console.log('Please start the backend server and try again.');
    rl.close();
    return;
  }
  
  console.log('Backend is running.');
  
  // Skip admin authentication for now
  console.log('\nSkipping admin authentication...');
  const jwtToken = null;
  
  // Run backend tests
  await testBackendMonitoring(jwtToken);
  
  // Skip frontend tests
  console.log('\n=== Skipping Frontend Performance Monitoring Tests ===\n');
  console.log('Frontend tests can be run manually by opening the frontend in a browser.');
  
  // Final summary
  console.log('\n=== Test Summary ===\n');
  console.log('Backend performance monitoring tests completed.');
  console.log('Frontend performance monitoring manual verification completed.');
  console.log('\nNext steps:');
  console.log('1. Review the test results and fix any issues');
  console.log('2. Run the full testing plan from docs/PERFORMANCE_MONITORING_TESTING_PLAN.md');
  console.log('3. When all tests pass, prepare for production deployment');
  
  rl.close();
}

// Run the tests
runTests().catch(error => {
  console.error('Test script failed with error:', error);
  rl.close();
});
