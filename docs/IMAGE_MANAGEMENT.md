# Image Management Guide

This document provides comprehensive guidance for managing images in the Evan James project, including specifications, optimization, and setup procedures.

## Image Specifications

### Album Covers

#### Full Albums & EPs
- **Dimensions**: 1000x1000px (square)
- **Minimum**: 800x800px
- **Format**: JPG or PNG
- **Quality**: High resolution for streaming platforms, vinyl, and digital distribution
- **Use Cases**: Spotify, Apple Music, physical releases, website display

#### Singles
- **Dimensions**: 1000x1000px (square)
- **Minimum**: 800x800px
- **Format**: JPG or PNG
- **Quality**: Should match streaming platform requirements and be eye-catching for social media sharing
- **Use Cases**: Streaming platforms, social media promotion

### Video Thumbnails

#### Music Videos
- **Dimensions**: 1280x720px (16:9 aspect ratio)
- **Minimum**: 640x360px
- **Format**: JPG or PNG
- **Quality**: Should be visually striking and represent the song's mood
- **Use Cases**: YouTube, website video gallery, social media

#### Live Performance Videos
- **Dimensions**: 1280x720px (16:9 aspect ratio)
- **Minimum**: 640x360px
- **Format**: JPG or PNG
- **Quality**: Should capture the energy of the performance, consider stage lighting and crowd if visible
- **Use Cases**: YouTube, website, promotional materials

#### Behind-the-Scenes Videos
- **Dimensions**: 1280x720px (16:9 aspect ratio)
- **Minimum**: 640x360px
- **Format**: JPG or PNG
- **Quality**: Should give viewers a glimpse into the creative process, candid shots work well
- **Use Cases**: YouTube, social media, fan engagement

### Artist Photos

#### Professional Headshots (Bio)
- **Dimensions**: 800x800px (square) preferred, or 600x800px (portrait)
- **Minimum**: 400x400px
- **Format**: JPG or PNG
- **Quality**: High-resolution, professional quality, suitable for press kits
- **Requirements**: Should work on both light and dark backgrounds for versatility
- **Use Cases**: Press kits, website bio, social media profiles, promotional materials

#### Gallery Photos

##### Press Photos
- **Dimensions**: 2400x1600px (3:2 aspect ratio)
- **Minimum**: 800px on shortest side
- **Format**: JPG or PNG
- **Quality**: High quality for print and web use
- **Use Cases**: Press releases, media kits, publications

##### Tour Photos
- **Dimensions**: 1920x1080px (16:9 aspect ratio)
- **Minimum**: 800px on shortest side
- **Format**: JPG or PNG
- **Quality**: Should capture live performance energy
- **Use Cases**: Website gallery, social media, tour promotion

##### Portrait Shots
- **Dimensions**: 1200x1600px (3:4 aspect ratio)
- **Minimum**: 800px on shortest side
- **Format**: JPG or PNG
- **Quality**: Professional quality for various promotional uses
- **Use Cases**: Website, social media, promotional materials

### General Guidelines

#### File Formats
- **Primary**: JPG for photographs, PNG for graphics with transparency
- **Avoid**: WebP (for compatibility), GIF (unless animated), BMP, TIFF

#### Color Profiles
- **Web**: sRGB color space
- **Print**: Consider CMYK for physical materials

#### Compression
- **Web**: Optimize for web delivery (aim for under 500KB for most images)
- **Print**: Maintain high quality (minimal compression)

#### Naming Conventions
- Use descriptive, lowercase filenames
- Separate words with hyphens
- Include content type: `album-cover-`, `video-thumb-`, `artist-photo-`
- Example: `album-cover-tainted-blue-ep.jpg`

## Image Optimization

### Strapi Configuration

#### Image Optimizer Plugin
- [ ] Install `strapi-plugin-image-optimizer`
- [ ] Configure plugin in `config/plugins.js`:
  ```javascript
  module.exports = ({ env }) => ({
    "image-optimizer": {
      enabled: true,
      config: {
        include: ["jpeg", "jpg", "png"],
        exclude: ["gif"],
        formats: ["original", "webp", "avif"],
        sizes: [
          { name: "xs", width: 300 },
          { name: "sm", width: 768 },
          { name: "md", width: 1280 },
          { name: "lg", width: 1920 }
        ],
        quality: 70,
      },
    },
  });
  ```

#### Responsive Upload Configuration
- [ ] Enable responsive friendly upload in Strapi admin
- [ ] Configure breakpoints in `config/plugins.js`:
  ```javascript
  module.exports = ({ env }) => ({
    upload: {
      config: {
        breakpoints: {
          xlarge: 1920,
          large: 1000,
          medium: 750,
          small: 500,
          xsmall: 64
        },
      },
    },
  });
  ```

#### Server Configuration
- [ ] Set appropriate upload timeout in `config/server.js`:
  ```javascript
  module.exports = {
    bootstrap({ strapi }) {
      strapi.server.httpServer.requestTimeout = 30 * 60 * 1000; // 30 minutes
    },
  };
  ```

### Frontend Implementation

#### Next.js Configuration
- [ ] Configure image domains in `next.config.js`:
  ```javascript
  module.exports = {
    images: {
      domains: [process.env.NEXT_PUBLIC_STRAPI_URL || 'localhost'],
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '**',
        },
      ],
    },
  }
  ```

#### Image Component Usage
- [ ] Use Next.js Image component for all images
- [ ] Set appropriate `quality` prop (recommended: 85)
- [ ] Configure proper `sizes` attribute based on viewport
- [ ] Implement blur placeholder
- [ ] Add error handling with fallback images
- [ ] Use `priority` prop for above-the-fold images

#### Loading States
- [ ] Implement loading skeletons for image containers
- [ ] Add proper error states
- [ ] Use blur placeholders during loading

### Image Processing

#### Pre-upload Optimization
- [ ] Compress images before upload
- [ ] Convert to modern formats (WebP/AVIF)
- [ ] Resize images to appropriate dimensions
- [ ] Strip unnecessary metadata

#### CDN Configuration
- [ ] Set up CDN for image delivery
- [ ] Configure proper caching headers
- [ ] Set up image transformation rules
- [ ] Configure fallback strategies

### Performance Monitoring

#### Testing
- [ ] Run Lighthouse audits
- [ ] Test on various devices and connections
- [ ] Monitor Core Web Vitals
- [ ] Check image loading performance

#### Maintenance
- [ ] Regularly audit image usage
- [ ] Monitor storage usage
- [ ] Update optimization settings as needed
- [ ] Review and update CDN configuration

### Best Practices

#### General
- [ ] Use appropriate image formats for content
- [ ] Implement lazy loading for below-fold images
- [ ] Set proper alt text for accessibility
- [ ] Use descriptive file names
- [ ] Implement proper error handling

#### Caching
- [ ] Set appropriate cache headers
- [ ] Implement cache busting strategy
- [ ] Configure CDN caching rules
- [ ] Set up proper cache invalidation

#### Security
- [ ] Validate image uploads
- [ ] Implement proper access controls
- [ ] Scan uploaded images for malware
- [ ] Set up proper CORS policies

## Setting Up Bio Images

### Quick Setup Guide

#### 1. Access Strapi Admin
- Go to `http://localhost:1337/admin`
- Log in with your admin credentials

#### 2. Set Up Permissions (if needed)
If you see "No permissions" errors:
1. Go to **Settings** → **Users & Permissions Plugin** → **Roles**
2. Click on **Public**
3. Scroll down to find **Bio** in the permissions list
4. Check the **find** permission for Bio
5. Click **Save**

#### 3. Access Biography Content
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

#### 4. Upload Images
1. **Headshot**: Click the upload area and select your main portrait image
2. **Header Image**: Upload the hero banner image for the About page
3. **Gallery Images**: Click "Add an entry" to upload multiple portfolio images
   - For each image, you can set:
     - Alternative text (for accessibility)
     - Caption (displayed under the image)

#### 5. Image Specifications
- **Headshot**: 800x800px (square) or 600x800px (portrait)
- **Header Image**: 1920x600px landscape format
- **Gallery Images**: Various sizes, minimum 1200x400px
- **Format**: JPG or PNG, high-resolution

#### 6. Save and Publish
1. Fill in all required fields (Short Bio and Full Bio are required)
2. Click **Save** to save as draft
3. Click **Publish** to make the content live

#### 7. Verify on Website
- Visit `http://localhost:3000/about` to see your changes
- Visit `http://localhost:3000/admin/biography` to manage from the frontend admin

### Troubleshooting

#### If you don't see the new image fields:
1. Make sure Strapi has been restarted after the schema changes
2. Clear your browser cache
3. Check that you're looking at the correct Biography single type

#### If images don't appear on the website:
1. Make sure the content is **Published** (not just saved)
2. Check that the images uploaded successfully
3. Verify the frontend is running on `http://localhost:3000`

#### If you get permission errors:
1. Follow step 2 above to set up public permissions
2. Make sure you're logged in as an admin user
3. Check that the Bio content type exists in Content Manager

## Setting Up Portfolio Photos

### Overview
The About page visual portfolio now loads from photos tagged as "portfolio" in the Photos collection, instead of using static mock data or bio gallery images.

### How It Works
1. **Photos Collection**: Photos are stored in the main Photos collection in Strapi
2. **Tagging System**: Each photo can have multiple tags including "portfolio"
3. **Automatic Loading**: Photos tagged with "portfolio" automatically appear in the About page visual portfolio
4. **Fallback**: If no portfolio photos exist, fallback images are shown

### Setting Up Portfolio Photos

#### 1. Access Strapi Admin
- Go to `http://localhost:1337/admin`
- Log in with your admin credentials

#### 2. Navigate to Photos
- Go to **Content Manager** → **Collection Types** → **Photos**

#### 3. Add or Edit Photos
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

#### 4. Save and Publish
- Click **Save** to save as draft
- Click **Publish** to make the photo live

### Available Tags
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

### API Endpoints
- **All Photos**: `GET /api/photos?populate=image`
- **Portfolio Photos**: `GET /api/photos?populate=image&filters[tags][$contains]=portfolio`
- **Photos by Tag**: `GET /api/photos?populate=image&filters[tags][$contains]=TAG_NAME`
- **Featured Photos**: `GET /api/photos?populate=image&filters[featured][$eq]=true`

### Testing the Setup

#### 1. Add Portfolio Photos
1. Upload at least 3-6 photos to the Photos collection
2. Tag them with "portfolio"
3. Publish them

#### 2. Check the About Page
- Visit `http://localhost:3000/about`
- Scroll to the "visual portfolio" section
- Your tagged photos should appear instead of mock data

#### 3. Verify API Response
```bash
curl "http://localhost:1337/api/photos?populate=image&filters[tags][\$contains]=portfolio"
```

### Benefits of This Approach
1. **Centralized Management**: All photos in one place
2. **Flexible Tagging**: Photos can serve multiple purposes
3. **Automatic Updates**: About page updates when you add/remove portfolio tags
4. **Reusable Content**: Same photos can be used across different sections
5. **Easy Organization**: Filter and find photos by tags and categories

## Documentation

### Technical
- [ ] Document image optimization settings
- [ ] Maintain list of supported formats
- [ ] Document CDN configuration
- [ ] Keep track of image dimensions and sizes

### User Guidelines
- [ ] Create image upload guidelines
- [ ] Document supported formats
- [ ] Provide size recommendations
- [ ] Include optimization tips

## Regular Review

### Monthly
- [ ] Review image loading performance
- [ ] Check storage usage
- [ ] Update optimization settings if needed
- [ ] Review CDN performance

### Quarterly
- [ ] Audit image optimization strategy
- [ ] Review and update documentation
- [ ] Check for new optimization tools
- [ ] Update best practices

## Emergency Procedures

### Backup
- [ ] Maintain backup of original images
- [ ] Document recovery procedures
- [ ] Test backup restoration
- [ ] Keep optimization settings backed up

### Fallback
- [ ] Implement fallback image strategy
- [ ] Document error handling procedures
- [ ] Test fallback mechanisms
- [ ] Maintain list of fallback images

---

*Last updated: May 31, 2025*
