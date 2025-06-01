# [ARCHIVED] Image Specifications for Evan James Project

> **Note**: This document has been archived. Please refer to the new consolidated [Image Management Guide](../IMAGE_MANAGEMENT.md) for the most up-to-date information.

This document outlines the ideal image dimensions and requirements for all content types in the Evan James website and CMS.

## Album Covers

### Full Albums & EPs
- **Dimensions**: 1000x1000px (square)
- **Minimum**: 800x800px
- **Format**: JPG or PNG
- **Quality**: High resolution for streaming platforms, vinyl, and digital distribution
- **Use Cases**: Spotify, Apple Music, physical releases, website display

### Singles
- **Dimensions**: 1000x1000px (square)
- **Minimum**: 800x800px
- **Format**: JPG or PNG
- **Quality**: Should match streaming platform requirements and be eye-catching for social media sharing
- **Use Cases**: Streaming platforms, social media promotion

## Video Thumbnails

### Music Videos
- **Dimensions**: 1280x720px (16:9 aspect ratio)
- **Minimum**: 640x360px
- **Format**: JPG or PNG
- **Quality**: Should be visually striking and represent the song's mood
- **Use Cases**: YouTube, website video gallery, social media

### Live Performance Videos
- **Dimensions**: 1280x720px (16:9 aspect ratio)
- **Minimum**: 640x360px
- **Format**: JPG or PNG
- **Quality**: Should capture the energy of the performance, consider stage lighting and crowd if visible
- **Use Cases**: YouTube, website, promotional materials

### Behind-the-Scenes Videos
- **Dimensions**: 1280x720px (16:9 aspect ratio)
- **Minimum**: 640x360px
- **Format**: JPG or PNG
- **Quality**: Should give viewers a glimpse into the creative process, candid shots work well
- **Use Cases**: YouTube, social media, fan engagement

## Artist Photos

### Professional Headshots (Bio)
- **Dimensions**: 800x800px (square) preferred, or 600x800px (portrait)
- **Minimum**: 400x400px
- **Format**: JPG or PNG
- **Quality**: High-resolution, professional quality, suitable for press kits
- **Requirements**: Should work on both light and dark backgrounds for versatility
- **Use Cases**: Press kits, website bio, social media profiles, promotional materials

### Gallery Photos

#### Press Photos
- **Dimensions**: 2400x1600px (3:2 aspect ratio)
- **Minimum**: 800px on shortest side
- **Format**: JPG or PNG
- **Quality**: High quality for print and web use
- **Use Cases**: Press releases, media kits, publications

#### Tour Photos
- **Dimensions**: 1920x1080px (16:9 aspect ratio)
- **Minimum**: 800px on shortest side
- **Format**: JPG or PNG
- **Quality**: Should capture live performance energy
- **Use Cases**: Website gallery, social media, tour promotion

#### Portrait Shots
- **Dimensions**: 1200x1600px (3:4 aspect ratio)
- **Minimum**: 800px on shortest side
- **Format**: JPG or PNG
- **Quality**: Professional quality for various promotional uses
- **Use Cases**: Website, social media, promotional materials

## General Guidelines

### File Formats
- **Primary**: JPG for photographs, PNG for graphics with transparency
- **Avoid**: WebP (for compatibility), GIF (unless animated), BMP, TIFF

### Color Profiles
- **Web**: sRGB color space
- **Print**: Consider CMYK for physical materials

### Compression
- **Web**: Optimize for web delivery (aim for under 500KB for most images)
- **Print**: Maintain high quality (minimal compression)

### Naming Conventions
- Use descriptive, lowercase filenames
- Separate words with hyphens
- Include content type: `album-cover-`, `video-thumb-`, `artist-photo-`
- Example: `album-cover-tainted-blue-ep.jpg`

## Implementation Notes

- All content types in Strapi now include an `imageNotes` field with these specifications
- The notes are automatically populated when creating new content
- Existing content has been updated with appropriate image specifications
- These guidelines ensure consistency across all platforms and use cases

## Tools & Resources

### Recommended Image Editing Software
- **Professional**: Adobe Photoshop, Adobe Lightroom
- **Free**: GIMP, Canva (for basic editing)
- **Online**: Photopea, Canva

### Optimization Tools
- **Web**: TinyPNG, ImageOptim, Squoosh
- **Batch Processing**: ImageMagick, Adobe Bridge

---

*Last updated: May 25, 2025*
*For questions about image specifications, refer to the imageNotes field in each Strapi content type.*
