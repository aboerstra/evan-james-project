# [ARCHIVED] Setting Up Bio Images in Strapi

> **Note**: This document has been archived. Please refer to the new consolidated [Image Management Guide](../IMAGE_MANAGEMENT.md) for the most up-to-date information.

## Quick Setup Guide

### 1. Access Strapi Admin
- Go to `http://localhost:1337/admin`
- Log in with your admin credentials

### 2. Set Up Permissions (if needed)
If you see "No permissions" errors:
1. Go to **Settings** → **Users & Permissions Plugin** → **Roles**
2. Click on **Public**
3. Scroll down to find **Bio** in the permissions list
4. Check the **find** permission for Bio
5. Click **Save**

### 3. Access Biography Content
1. Go to **Content Manager** → **Single Types** → **Biography**
2. You should see these fields:
   - **Short Bio** - Brief description for homepage
   - **Full Bio** - Complete biography for About page
   - **Headshot** - Main portrait image (800x800px recommended)
   - **Header Image** - Hero banner for About page (1920x600px recommended)
   - **Gallery Images** - Multiple images for visual portfolio section
   - **Image Notes** - Guidelines for image dimensions
   - **Social Links** - Social media links
   - **Press Kit File** - Downloadable press kit
   - **Meta Title** - SEO title
   - **Meta Description** - SEO description

### 4. Upload Images
1. **Headshot**: Click the upload area and select your main portrait image
2. **Header Image**: Upload the hero banner image for the About page
3. **Gallery Images**: Click "Add an entry" to upload multiple portfolio images
   - For each image, you can set:
     - Alternative text (for accessibility)
     - Caption (displayed under the image)

### 5. Image Specifications
- **Headshot**: 800x800px (square) or 600x800px (portrait)
- **Header Image**: 1920x600px landscape format
- **Gallery Images**: Various sizes, minimum 1200x400px
- **Format**: JPG or PNG, high-resolution

### 6. Save and Publish
1. Fill in all required fields (Short Bio and Full Bio are required)
2. Click **Save** to save as draft
3. Click **Publish** to make the content live

### 7. Verify on Website
- Visit `http://localhost:3000/about` to see your changes
- Visit `http://localhost:3000/admin/biography` to manage from the frontend admin

## Troubleshooting

### If you don't see the new image fields:
1. Make sure Strapi has been restarted after the schema changes
2. Clear your browser cache
3. Check that you're looking at the correct Biography single type

### If images don't appear on the website:
1. Make sure the content is **Published** (not just saved)
2. Check that the images uploaded successfully
3. Verify the frontend is running on `http://localhost:3000`

### If you get permission errors:
1. Follow step 2 above to set up public permissions
2. Make sure you're logged in as an admin user
3. Check that the Bio content type exists in Content Manager

## Direct Links
- **Strapi Admin**: `http://localhost:1337/admin`
- **Bio Content Manager**: `http://localhost:1337/admin/content-manager/singleType/api::bio.bio`
- **About Page**: `http://localhost:3000/about`
- **Frontend Admin**: `http://localhost:3000/admin/biography`
