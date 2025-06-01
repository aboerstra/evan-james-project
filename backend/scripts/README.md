# Evan James Website Data Seeding Scripts

This directory contains scripts for seeding initial data into the Strapi backend for the Evan James website.

## Available Scripts

### seed-initial-data.js

This script populates the database with initial content for all collection types. It creates:

- Site Settings (Coming Soon mode)
- Biography
- Social Links
- Sample Album Release
- Sample Video
- Sample Tour Dates
- Sample Merchandise
- Sample Press Release

## Usage

1. Make sure your Strapi server is not running
2. Run the seed script:
   ```bash
   cd backend
   NODE_ENV=development node scripts/seed-initial-data.js
   ```

## Important Notes

- The script will create sample data with placeholder content that should be updated through the admin interface
- All created content will be in "published" state
- Media files (images, videos, etc.) need to be uploaded manually through the admin interface
- The script uses the Strapi entity service API to create content
- If you encounter any errors, check the error message and ensure all collection types and components are properly configured

## Customization

To customize the seed data:

1. Open `seed-initial-data.js`
2. Modify the data objects for each content type
3. Add or remove content types as needed
4. Update dates, titles, and other content to match your needs

## After Running the Script

After running the script, you should:

1. Start the Strapi server
2. Log in to the admin panel
3. Review all created content
4. Upload necessary media files
5. Update placeholder content with real content
6. Verify relationships between content types

## Troubleshooting

If you encounter errors:

1. Ensure all required plugins are installed
2. Check that your database is properly configured
3. Verify that all collection types and components match the expected schema
4. Clear the database if you need to run the script again 