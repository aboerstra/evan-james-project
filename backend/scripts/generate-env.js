const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const envType = process.argv[2];
if (!envType) {
  console.error('Usage: node generate-env.js <environment_type>');
  console.error('Example: node generate-env.js local');
  process.exit(1);
}

const sourceDir = path.join(__dirname, '..'); // Moves up to backend directory
const sourceFile = path.join(sourceDir, `backend-variables.${envType}.md`);
const targetEnvFile = path.join(sourceDir, '.env');

// Function to generate a random string
const generateRandomString = (length = 32) => {
  return crypto.randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
};

// Function to generate APP_KEYS (array of 4 random strings)
const generateAppKeys = () => {
  return new Array(4).fill(null).map(() => generateRandomString(16)).join(',');
};

// Keys that should always be regenerated for security
const secretsToRegenerate = [
  'APP_KEYS',
  'API_TOKEN_SALT',
  'ADMIN_JWT_SECRET',
  'JWT_SECRET',
  'TRANSFER_TOKEN_SALT',
];

fs.readFile(sourceFile, 'utf8', (err, data) => {
  if (err) {
    console.error(`Error reading source file ${sourceFile}:`, err);
    process.exit(1);
  }

  let envContent = '';
  const lines = data.split('\n');
  const parsedVariables = {};

  lines.forEach(line => {
    line = line.trim();
    if (line.startsWith('#') || line === '') {
      // Keep comments and empty lines as is for readability if they aren't variable definitions
      if (!line.includes('=')) { // Simple check to avoid adding comments that look like assignments
        // envContent += line + '\n';
      }
      return;
    }

    const parts = line.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const value = parts.slice(1).join('=').trim();
      parsedVariables[key] = value;
    }
  });

  // Add parsed variables to envContent, regenerating secrets
  for (const key in parsedVariables) {
    if (secretsToRegenerate.includes(key)) {
      if (key === 'APP_KEYS') {
        envContent += `${key}=${generateAppKeys()}\n`;
      } else {
        envContent += `${key}=${generateRandomString(64)}\n`; // Generate longer secrets
      }
    } else {
      envContent += `${key}=${parsedVariables[key]}\n`;
    }
  }
  
  // Ensure all secrets are present, even if not in source .md file
  secretsToRegenerate.forEach(key => {
    if (!envContent.includes(`${key}=`)) {
       if (key === 'APP_KEYS') {
        envContent += `${key}=${generateAppKeys()}\n`;
      } else {
        envContent += `${key}=${generateRandomString(64)}\n`;
      }
    }
  });

  fs.writeFile(targetEnvFile, envContent.trim(), 'utf8', (writeErr) => {
    if (writeErr) {
      console.error(`Error writing to .env file ${targetEnvFile}:`, writeErr);
      process.exit(1);
    }
    console.log(`.env file generated successfully at ${targetEnvFile} from ${sourceFile}`);
    console.log('Important: New random secrets have been generated.');
    console.log('You will need to rebuild Strapi (npm run build) and recreate the admin user if it already existed.');
  });
}); 