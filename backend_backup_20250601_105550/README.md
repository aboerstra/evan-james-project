# Evan James Official Website - Backend

This is the Strapi backend for the Evan James official website. It provides a headless CMS for managing the website's content.

## Development Setup

### Prerequisites
- Node.js (v18.19.1)
- MySQL
- PM2 (for process management)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/aboerstra/evanjamesofficial.git
   cd evanjamesofficial/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   # Copy the template
   cp backend-variables.local.md .env
   # Edit the .env file with your local settings
   ```

4. Start the development server:
   ```bash
   # Install PM2 globally if not already installed
   npm install -g pm2
   
   # Start Strapi through PM2
   pm2 start npm --name "strapi" -- run develop
   ```

5. Access the admin panel:
   - URL: http://localhost:1337/admin
   - Default admin: admin@example.com (change in production)

### Content Types
- **Albums**: Music releases
  - Title
  - Release Date
  - Artwork
  - Streaming Links
  - Featured/Upcoming flags
  - Description

More content types to be added...

## Production Deployment
See `docs/strapi-wsl-setup.md` for detailed deployment instructions.

## Contributing
1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License
All rights reserved - Evan James Official 2024 