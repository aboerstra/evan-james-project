# Strapi WSL2 Setup and Troubleshooting Guide

## Current Working Configuration (May 29, 2024)

### 1. Server Configuration
```javascript
// config/server.js
module.exports = () => ({
  host: '0.0.0.0',
  port: 1337,
  url: 'http://172.28.50.46:1337',
  app: {
    keys: ['myKeyA', 'myKeyB']
  },
  admin: {
    auth: {
      secret: 'myAdminJwtSecret'
    },
  },
});
```

### 2. Environment Variables
```bash
# .env
HOST=0.0.0.0
PORT=1337
PUBLIC_URL=http://172.28.50.46:1337
APP_KEYS=key1,key2,key3,key4
API_TOKEN_SALT=your_salt_here
ADMIN_JWT_SECRET=your_jwt_secret
JWT_SECRET=your_api_secret
TRANSFER_TOKEN_SALT=your_transfer_salt

# Database Configuration
DATABASE_CLIENT=mysql2
DATABASE_HOST=127.0.0.1
DATABASE_PORT=3306
DATABASE_NAME=evan_james_site
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=strapi
DATABASE_SSL=false
```

### 3. Security Configuration
```javascript
// config/security.js
module.exports = {
  cors: {
    enabled: true,
    origin: ['http://localhost:3000', 'https://your-production-domain.com'],
    headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
    keepHeaderOnError: true,
  },
  xframe: {
    enabled: true,
    value: 'SAMEORIGIN',
  },
  hsts: {
    enabled: true,
    maxAge: 31536000,
    includeSubDomains: true,
  },
  xss: {
    enabled: true,
    mode: 'block',
  },
  csp: {
    enabled: true,
    policy: ["default-src 'self'", "img-src 'self' data: blob:", "media-src 'self'"],
  },
};
```

## Setup Process

### 1. Initial Setup
1. Clone repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create environment files:
   ```bash
   cp .env.example .env
   ```
4. Update environment variables with your values

### 2. Network Configuration
1. Get WSL2 IP address:
   ```bash
   ip addr show eth0 | grep -oP 'inet \K[\d.]+'
   ```
2. Update IP in .env:
   ```
   PUBLIC_URL=http://<WSL2_IP>:1337
   ```
3. Configure Windows Firewall:
   - Open Windows Defender Firewall with Advanced Security
   - Add Inbound Rule for port 1337
   - Allow TCP
   - Allow for all profiles (Domain, Private, Public)

### 3. Starting Strapi
1. Stop existing processes:
   ```bash
   pkill -f strapi && pkill -f node && sleep 2
   ```
2. Verify port is free:
   ```bash
   netstat -tulpn | grep :1337
   ```
3. Start Strapi:
   ```bash
   npm run develop
   ```

## Security Best Practices

### 1. Environment Variables
- Never commit .env files
- Use strong, unique values for secrets
- Rotate secrets regularly
- Use different values for development and production

### 2. Network Security
- Restrict CORS to specific origins
- Enable HTTPS in production
- Use secure headers (HSTS, CSP, XSS)
- Implement rate limiting

### 3. Authentication
- Use strong password policies
- Implement 2FA for admin users
- Regular token rotation
- Secure session management

## Monitoring & Maintenance

### 1. Error Tracking
- Sentry integration for error monitoring
- Error boundaries in React components
- Structured logging strategy

### 2. Performance Monitoring
- API response time tracking
- Database query optimization
- Cache hit/miss monitoring
- Resource usage tracking

### 3. Health Checks
- API endpoint health monitoring
- Database connection checks
- Cache system verification
- Regular backup verification

## Troubleshooting

### 1. Connection Issues
1. Verify Strapi is running:
   ```bash
   ps aux | grep node
   ```
2. Check port binding:
   ```bash
   netstat -tulpn | grep :1337
   ```
3. Verify WSL2 IP:
   ```bash
   ip addr show eth0
   ```
4. Test local connection:
   ```bash
   curl -v http://localhost:1337
   ```

### 2. Environment Issues
1. Verify .env exists:
   ```bash
   ls -l .env
   ```
2. Check variable count:
   ```bash
   cat .env | grep -v '^#' | grep -v '^$' | wc -l
   ```

### 3. Process Management
1. Clean shutdown:
   ```bash
   pkill -f strapi && pkill -f node
   ```
2. Verify no lingering processes:
   ```bash
   ps aux | grep -E 'strapi|node'
   ```
3. Check port availability:
   ```bash
   netstat -tulpn | grep :1337
   ```

## Quick Reference

### Start Fresh
```bash
pkill -f strapi && pkill -f node && sleep 2
npm run develop
```

### Verify Setup
```bash
netstat -tulpn | grep :1337
cat .env | wc -l
curl -v http://localhost:1337
```

### Security Check
```bash
# Check for open ports
netstat -tulpn

# Verify file permissions
ls -la .env config/server.js

# Check process security
ps aux | grep node
``` 