# [ARCHIVED] Setting Up Portfolio Photos for About Page

> **Note**: This document has been archived. Please refer to the new consolidated [Image Management Guide](../IMAGE_MANAGEMENT.md) for the most up-to-date information.

## Overview
The About page visual portfolio now loads from photos tagged as "portfolio" in the Photos collection, instead of using static mock data or bio gallery images.

## How It Works
1. **Photos Collection**: Photos are stored in the main Photos collection in Strapi
2. **Tagging System**: Each photo can have multiple tags including "portfolio"
3. **Automatic Loading**: Photos tagged with "portfolio" automatically appear in the About page visual portfolio
4. **Fallback**: If no portfolio photos exist, fallback images are shown

## Setting Up Portfolio Photos

### 1. Access Strapi Admin
- Go to `http://localhost:1337/admin`
- Log in with your admin credentials

### 2. Navigate to Photos
- Go to **Content Manager** → **Collection Types** → **Photos**

### 3. Add or Edit Photos
For each photo you want in the portfolio:

1. **Upload/Select Image**: Add the photo file
2. **Fill Required Fields**:
   - **Title**: Descriptive title for the photo
   - **Alt Text**: Accessibility description
   - **Caption**: Text that appears under the photo in the gallery
3. **Set Category**: Choose appropriate category (press, tour, promotional, etc.)
4. **Add Tags**: 
   - Select **"portfolio"** to include in About page visual portfolio
   - Add other relevant tags as needed:
     - `hero` - for hero/banner images
     - `gallery` - for general gallery use
     - `press-kit` - for press kit materials
     - `social-media` - for social media use
     - `website` - for website use
     - `live-performance` - for concert photos
     - `studio` - for studio session photos
     - `behind-the-scenes` - for BTS content

### 4. Save and Publish
- Click **Save** to save as draft
- Click **Publish** to make the photo live

## Available Tags
- **portfolio** - Appears in About page visual portfolio
- **hero** - For hero/banner images
- **gallery** - General gallery use
- **press-kit** - Press kit materials
- **social-media** - Social media content
- **website** - Website use
- **promotional** - Promotional materials
- **live-performance** - Concert/live photos
- **studio** - Studio session photos
- **behind-the-scenes** - Behind the scenes content

## API Endpoints
- **All Photos**: `GET /api/photos?populate=image`
- **Portfolio Photos**: `GET /api/photos?populate=image&filters[tags][$contains]=portfolio`
- **Photos by Tag**: `GET /api/photos?populate=image&filters[tags][$contains]=TAG_NAME`
- **Featured Photos**: `GET /api/photos?populate=image&filters[featured][$eq]=true`

## Testing the Setup

### 1. Add Portfolio Photos
1. Upload at least 3-6 photos to the Photos collection
2. Tag them with "portfolio"
3. Publish them

### 2. Check the About Page
- Visit `http://localhost:3000/about`
- Scroll to the "visual portfolio" section
- Your tagged photos should appear instead of mock data

### 3. Verify API Response
```bash
curl "http://localhost:1337/api/photos?populate=image&filters[tags][\$contains]=portfolio"
```

## Benefits of This Approach
1. **Centralized Management**: All photos in one place
2. **Flexible Tagging**: Photos can serve multiple purposes
3. **Automatic Updates**: About page updates when you add/remove portfolio tags
4. **Reusable Content**: Same photos can be used across different sections
5. **Easy Organization**: Filter and find photos by tags and categories

## Troubleshooting

### No Photos Appearing
1. Check that photos are **Published** (not just saved)
2. Verify photos have the "portfolio" tag
3. Check that images uploaded successfully
4. Refresh the About page

### API Errors
1. Ensure Strapi is running on port 1337
2. Check that the Photos collection exists
3. Verify permissions are set for public access to Photos

## Next Steps
- Upload your best photos and tag them as "portfolio"
- Consider adding other tags for future use
- Test the About page to see your photos in action
- Use the same tagging system for other sections of the website
