# Documentation Consolidation Plan

This document outlines the plan to consolidate and organize the project documentation to eliminate redundancy and ensure all information is up-to-date.

## Current Documentation Analysis

After reviewing all markdown documentation in the project, we've identified several areas with overlapping or redundant information:

### 1. Environment Variable Management
- `ENV_VARIABLE_MANAGEMENT_PLAN.md`
- `docs/ENVIRONMENT_VARIABLE_GUIDE.md`
- Environment variable sections in `frontend/deployment-guide.md`
- Referenced files: `backend/backend-variables.local.md`, `backend/backend-variables.ec2.md`, `frontend/frontend-variables.local.md`, `frontend/frontend-variables.ec2.md`

### 2. Deployment and Setup
- `frontend/deployment-guide.md`
- `backend/docs/strapi-wsl-setup.md`
- Referenced scripts: `scripts/ec2-setup.sh`, `scripts/wsl-setup.sh`

### 3. Strapi Best Practices
- `STRAPI_BEST_PRACTICES_CHECKLIST.md`
- `EVAN_JAMES_STRAPI_IMPROVEMENT_CHECKLIST.md`
- `frontend/docs/STRAPI_INTEGRATION_CHECKLIST.md`

### 4. Image Management
- `IMAGE_SPECIFICATIONS.md`
- `SETUP_BIO_IMAGES.md`
- `SETUP_PORTFOLIO_PHOTOS.md`
- `backend/docs/IMAGE_OPTIMIZATION_CHECKLIST.md`

### 5. Content Types
- `CONTENT_TYPES_SUMMARY.md`

### 6. Integration
- `INTEGRATION.md`
- Integration aspects of `frontend/docs/STRAPI_INTEGRATION_CHECKLIST.md`

## Consolidation Plan

### 1. Environment Variables (Consolidate to `docs/ENVIRONMENT_VARIABLES.md`)
- Combine the comprehensive guide from `docs/ENVIRONMENT_VARIABLE_GUIDE.md` with the structured approach from `ENV_VARIABLE_MANAGEMENT_PLAN.md`
- Include the security considerations from `frontend/deployment-guide.md`
- Reference the template files without duplicating their content
- Archive: `ENV_VARIABLE_MANAGEMENT_PLAN.md`

### 2. Deployment Guide (Consolidate to `docs/DEPLOYMENT_GUIDE.md`)
- Merge `frontend/deployment-guide.md` and relevant parts of `backend/docs/strapi-wsl-setup.md`
- Create separate sections for local, WSL, and EC2 deployment
- Include references to all relevant scripts
- Archive: `frontend/deployment-guide.md` (after copying content)

### 3. Strapi Best Practices (Consolidate to `docs/STRAPI_BEST_PRACTICES.md`)
- Combine the comprehensive checklist from `STRAPI_BEST_PRACTICES_CHECKLIST.md` with the project-specific improvements from `EVAN_JAMES_STRAPI_IMPROVEMENT_CHECKLIST.md`
- Incorporate the integration-specific items from `frontend/docs/STRAPI_INTEGRATION_CHECKLIST.md`
- Mark the status of each item (completed, in progress, not started)
- Archive: `STRAPI_BEST_PRACTICES_CHECKLIST.md`, `EVAN_JAMES_STRAPI_IMPROVEMENT_CHECKLIST.md`

### 4. Image Management (Consolidate to `docs/IMAGE_MANAGEMENT.md`)
- Combine the specifications from `IMAGE_SPECIFICATIONS.md` with the optimization checklist from `backend/docs/IMAGE_OPTIMIZATION_CHECKLIST.md`
- Include the practical setup guides from `SETUP_BIO_IMAGES.md` and `SETUP_PORTFOLIO_PHOTOS.md` as separate sections
- Archive: `SETUP_BIO_IMAGES.md`, `SETUP_PORTFOLIO_PHOTOS.md`, `backend/docs/IMAGE_OPTIMIZATION_CHECKLIST.md`

### 5. Content Types (Keep as `docs/CONTENT_TYPES.md`)
- Move `CONTENT_TYPES_SUMMARY.md` to `docs/CONTENT_TYPES.md`
- No consolidation needed as this is already comprehensive
- Archive: Original `CONTENT_TYPES_SUMMARY.md` after moving

### 6. Integration Guide (Consolidate to `docs/INTEGRATION_GUIDE.md`)
- Combine `INTEGRATION.md` with the relevant parts of `frontend/docs/STRAPI_INTEGRATION_CHECKLIST.md`
- Organize into clear sections for different aspects of integration
- Archive: `INTEGRATION.md`, `frontend/docs/STRAPI_INTEGRATION_CHECKLIST.md` (after copying content)

### 7. Error Handling, Logging, and Performance Monitoring (Consolidate to `docs/ERROR_HANDLING.md`, `docs/LOGGING.md`, and `docs/PERFORMANCE_MONITORING.md`)
- Create comprehensive error handling documentation in `docs/ERROR_HANDLING.md`
- Create structured logging documentation in `docs/LOGGING.md`
- Create performance monitoring documentation in `docs/PERFORMANCE_MONITORING.md`
- Include Sentry integration details
- Document best practices for error handling, logging, and performance monitoring

## Implementation Steps

1. **Create New Consolidated Documents**
   - Create each new document in the `docs/` directory
   - Follow the consolidation plan for each category
   - Ensure all information is up-to-date and accurate
   - Add a "Last Updated" date to each document

2. **Archive Old Documents**
   - Move old documents to `docs/archive/`
   - Add a note at the top of each archived document pointing to the new consolidated version
   - Keep the archive for historical reference

3. **Update References**
   - Update any references to the old documents in code or other documentation
   - Update the main README.md to point to the new consolidated documents

4. **Review and Validate**
   - Have team members review the consolidated documents
   - Ensure no important information was lost in the consolidation
   - Validate that all links and references work correctly

## Security Considerations

During consolidation, pay special attention to:

1. **Removing Sensitive Information**
   - Remove the exposed Stability API key from `frontend/deployment-guide.md`
   - Ensure no other API keys, passwords, or sensitive information is included
   - Use placeholders for all sensitive values

2. **Updating Security Guidance**
   - Ensure security best practices are clearly documented
   - Include guidance on handling sensitive information
   - Document security review procedures

## Timeline

- **Phase 1 (Immediate)**: Create consolidated environment variables document and deployment guide, addressing the security issue with the exposed API key
- **Phase 2 (Within 1 week)**: Complete the remaining consolidation
- **Phase 3 (Within 2 weeks)**: Review, validate, and update references

## Responsible Team Members

- Documentation Lead: [Assign]
- Technical Reviewer: [Assign]
- Security Reviewer: [Assign]
