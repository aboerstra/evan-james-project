# Evan James Official Website

This monorepo contains both the frontend and backend code for the Evan James official website.

## Documentation

### Core Documentation
- [Environment Variables Guide](docs/ENVIRONMENT_VARIABLES.md) - Complete guide to environment variable management
- [Deployment Guide](docs/DEPLOYMENT_GUIDE.md) - Instructions for deploying in different environments
- [Integration Guide](docs/INTEGRATION_GUIDE.md) - Guide for Strapi and Next.js integration
- [Strapi Best Practices](docs/STRAPI_BEST_PRACTICES.md) - Best practices for Strapi development
- [Image Management Guide](docs/IMAGE_MANAGEMENT.md) - Comprehensive guide for image handling
- [Content Types](docs/CONTENT_TYPES.md) - Documentation of content types and their relationships
- [Content Security Policy Guide](docs/CONTENT_SECURITY_POLICY.md) - Guide for CSP implementation and maintenance
- [Input Validation Guide](docs/INPUT_VALIDATION.md) - Comprehensive guide for input validation rules
- [Rate Limiting Guide](docs/RATE_LIMITING.md) - Guide for API rate limiting implementation
- [Error Handling Guide](docs/ERROR_HANDLING.md) - Comprehensive guide for error handling and sanitization
- [Structured Logging Guide](docs/LOGGING.md) - Guide for structured logging implementation
- [Performance Monitoring Guide](docs/PERFORMANCE_MONITORING.md) - Guide for performance monitoring implementation
- [Performance Monitoring Testing Plan](docs/PERFORMANCE_MONITORING_TESTING_PLAN.md) - Testing plan for performance monitoring
- [Performance Monitoring Deployment Guide](docs/PERFORMANCE_MONITORING_DEPLOYMENT.md) - Deployment guide for performance monitoring

### Documentation Plan
- [Documentation Consolidation Plan](docs/DOCUMENTATION_CONSOLIDATION_PLAN.md) - Plan for organizing project documentation

## Project Structure

```
evan-james-project/
├── backend/           # Strapi CMS backend
│   ├── src/          # API definitions and business logic
│   ├── config/       # Strapi configuration
│   └── public/       # Public assets
│
├── frontend/         # Next.js frontend application
│   ├── src/         # Application source code
│   ├── public/      # Static assets
│   └── components/  # React components
│
└── docs/             # Project documentation
    └── archive/      # Archived documentation
```

## Quick Start

### Prerequisites
- Node.js v18.19.1
- MySQL
- PM2 (for process management)

### Backend Setup
```bash
cd backend
npm install
cp backend-variables.local.md .env  # Configure your environment variables
npm install -g pm2
pm2 start npm --name "strapi" -- run develop
```

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env.local  # Configure your environment variables
npm run dev
```

## Development

### Backend (Strapi)
- Admin URL: http://localhost:1337/admin
- API URL: http://localhost:1337/api
- Documentation: See `backend/README.md`

### Frontend (Next.js)
- Development URL: http://localhost:3000
- Documentation: See `frontend/README.md`

### Testing
- Performance Monitoring: Run `node scripts/test-performance-monitoring.js` to test the performance monitoring implementation
- See `docs/PERFORMANCE_MONITORING_TESTING_PLAN.md` for a comprehensive testing plan

## Contributing
1. Create a feature branch from main
2. Make your changes
3. Submit a pull request

## License
All rights reserved - Evan James Official 2024
