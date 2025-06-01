# Content Types Summary - Evan James Project

This document outlines all the content types that have been created in Strapi to match the website functionality and admin panel features.

## ✅ Existing Content Types (Previously Created)

### 1. **Albums** (Collection Type)
- **Purpose**: Music releases (albums, EPs, singles)
- **Key Fields**: title, releaseDate, cover, tracks, streamLinks, releaseType
- **Image Notes**: Album cover specifications included
- **Admin Features**: Create/edit releases, manage track listings

### 2. **Videos** (Collection Type)
- **Purpose**: Music videos, live performances, behind-the-scenes content
- **Key Fields**: title, videoUrl, thumbnail, videoType, description
- **Image Notes**: Video thumbnail specifications included
- **Admin Features**: Video management with thumbnails

### 3. **Tour Dates** (Collection Type)
- **Purpose**: Concert and tour date listings
- **Key Fields**: eventName, date, venueName, city, ticketLink, isSoldOut
- **Admin Features**: Tour date management, ticket links

### 4. **Photos** (Collection Type)
- **Purpose**: Gallery photos for press, tour, promotional use
- **Key Fields**: image, category, caption, featured
- **Image Notes**: Gallery photo specifications included
- **Admin Features**: Photo gallery management

### 5. **Bio** (Single Type)
- **Purpose**: Artist biography and information
- **Key Fields**: shortBio, fullBio, headshot, socialLinks
- **Image Notes**: Headshot specifications included
- **Admin Features**: Biography editing

### 6. **Contact Submissions** (Collection Type)
- **Purpose**: Contact form submissions
- **Key Fields**: name, email, subject, message, isRead
- **Admin Features**: View and manage contact form submissions

### 7. **Site Settings** (Single Type)
- **Purpose**: Site-wide settings, maintenance mode, coming soon page
- **Key Fields**: siteStatus, comingSoon, maintenance components
- **Admin Features**: Control site status and special pages

## 🆕 Newly Added Content Types

### 8. **Newsletter Subscriptions** (Collection Type)
- **Purpose**: Email signup management for mailing lists
- **Key Fields**: 
  - `email` (required, unique)
  - `name` (optional)
  - `source` (homepage, tour-page, merch-page, coming-soon, footer, other)
  - `isActive` (boolean)
  - `subscribedAt` (datetime)
  - `unsubscribedAt` (datetime)
  - `preferences` (JSON for email preferences)
  - `ipAddress` and `userAgent` (for tracking)
- **Website Integration**: All email signup forms throughout the site
- **Admin Features**: Manage subscribers, track signup sources

### 9. **Merchandise** (Collection Type)
- **Purpose**: Store products and merchandise management
- **Key Fields**:
  - `name`, `description`, `price` (basic product info)
  - `images` (multiple product images)
  - `imageNotes` (product image specifications)
  - `category` (apparel, vinyl, cd, accessories, digital, other)
  - `sizes` (JSON for size options)
  - `variants` (component for size/color variations)
  - `inStock`, `stockQuantity` (inventory management)
  - `featured` (featured products)
  - `sku`, `slug` (product identification)
  - `salePrice`, `isOnSale` (pricing)
  - `weight`, `dimensions` (shipping info)
- **Components**: Product Variant component for size/color variations
- **Website Integration**: Merch store page
- **Admin Features**: Full e-commerce product management

### 10. **Press Releases** (Collection Type)
- **Purpose**: Press announcements and news management
- **Key Fields**:
  - `title`, `subtitle`, `content`, `excerpt`
  - `releaseDate` (publication date)
  - `featuredImage` (press release image)
  - `imageNotes` (press image specifications)
  - `attachments` (files and additional images)
  - `category` (music-release, tour-announcement, award, collaboration, general, other)
  - `featured` (featured press releases)
  - `contactInfo` (press contact component)
  - `tags` (JSON for categorization)
  - `slug` (URL-friendly identifier)
- **Website Integration**: Press page, news sections
- **Admin Features**: Press release management with media attachments

### 11. **Press Kit** (Single Type)
- **Purpose**: Downloadable press materials and media kit
- **Key Fields**:
  - `title`, `description` (press kit info)
  - `isPasswordProtected`, `accessPassword` (access control)
  - `pressPhotos` (high-resolution press images)
  - `imageNotes` (press photo specifications)
  - `pressKitPdf` (downloadable PDF kit)
  - `bioText` (press-specific biography)
  - `factSheet` (key facts and figures)
  - `quotes` (testimonials and quotes)
  - `contactInfo` (multiple press contacts)
  - `socialMediaAssets` (social media ready images)
  - `logos` (official logos in various formats)
  - `lastUpdated` (timestamp)
- **Website Integration**: Press kit page with password protection
- **Admin Features**: Comprehensive press kit management

## 🧩 Components Created

### Contact Info Component
- **Purpose**: Reusable contact information for press releases and press kit
- **Fields**: name, email, phone, organization, position
- **Used In**: Press Releases, Press Kit

### Product Variant Component  
- **Purpose**: Product variations for merchandise (size, color, etc.)
- **Fields**: name, size, color, sku, price, stockQuantity, isAvailable, image
- **Used In**: Merchandise

## 📊 Content Type Mapping to Website Features

| Website Feature | Content Type | Status |
|----------------|--------------|--------|
| Homepage music releases | Albums | ✅ |
| Homepage video section | Videos | ✅ |
| Homepage email signup | Newsletter Subscriptions | ✅ |
| About page bio | Bio | ✅ |
| Tour dates page | Tour Dates | ✅ |
| Merchandise store | Merchandise | ✅ |
| Press page | Press Releases, Press Kit | ✅ |
| Photo gallery | Photos | ✅ |
| Contact form | Contact Submissions | ✅ |
| Site maintenance mode | Site Settings | ✅ |
| Coming soon page | Site Settings | ✅ |
| Admin dashboard | All content types | ✅ |

## 🎨 Image Specifications

All content types with images now include `imageNotes` fields with specific dimension requirements:

- **Album Covers**: 1000x1000px (square), minimum 800x800px
- **Video Thumbnails**: 1280x720px (16:9), minimum 640x360px  
- **Artist Photos**: 800x800px (square) or 600x800px (portrait)
- **Gallery Photos**: Varies by category (press: 2400x1600px, tour: 1920x1080px)
- **Product Images**: 1200x1200px (square) main image
- **Press Images**: 1200x630px (1.91:1) for social sharing
- **Press Photos**: 2400x1600px (3:2) for print use

## 🚀 Next Steps

1. **Restart Strapi** to apply all new content types
2. **Configure Permissions** in Strapi admin for public API access
3. **Populate Content** using the existing seeding scripts
4. **Update Frontend** to consume the new API endpoints
5. **Test Integration** between frontend and new content types

## 📝 API Endpoints Available

After restart, these endpoints should be available:

- `GET /api/albums` - Music releases
- `GET /api/videos` - Video content  
- `GET /api/tour-dates` - Tour information
- `GET /api/photos` - Photo gallery
- `GET /api/bio` - Artist biography
- `GET /api/contact-submissions` - Contact form data
- `GET /api/newsletter-subscriptions` - Email subscribers
- `GET /api/merchandise` - Store products
- `GET /api/press-releases` - Press announcements
- `GET /api/press-kit` - Press kit materials
- `GET /api/site-settings` - Site configuration

All content types support full CRUD operations through the Strapi API and admin interface.

---

*Last updated: May 25, 2025*
*All content types include proper image specifications and are ready for production use.* 