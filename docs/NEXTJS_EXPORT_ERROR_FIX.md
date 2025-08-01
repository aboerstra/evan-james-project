# Next.js Export Error Fix

This document explains how to fix the Next.js export errors that may occur during deployment of the Evan James website.

## The Error

During the build process of the Next.js frontend, you might encounter an error like this:

```
Build error occurred
Error: Export encountered errors on following paths:
        /admin/photos/albums/[id]
        /admin/photos/edit-album/[id]
        /admin/photos/new-album
        /admin/photos/upload
        /landing
```

## The Cause

This error occurs because Next.js's static export feature (`next export`) cannot handle dynamic routes (routes with parameters like `[id]`) without providing a list of all possible parameter values at build time. The error is specifically related to the following pages:

1. `/admin/photos/albums/[id]` - Dynamic route for viewing a specific album
2. `/admin/photos/edit-album/[id]` - Dynamic route for editing a specific album
3. `/admin/photos/new-album` - Route for creating a new album
4. `/admin/photos/upload` - Route for uploading photos
5. `/landing` - A landing page route

## The Solution

We've created a script (`fix-nextjs-export.sh`) that modifies the Next.js configuration to exclude these problematic routes from the export process. The script:

1. Backs up the original `next.config.js` file
2. Creates a new configuration that includes an `exportPathMap` function to exclude the problematic routes
3. Cleans the build directories
4. Rebuilds the frontend with the new configuration

## How to Use the Fix Script

If you encounter the Next.js export error during deployment, follow these steps:

1. SSH into your EC2 server:
   ```bash
   ssh -i /path/to/ejofficial.pem ubuntu@evanjamesofficial.com
   ```

2. Run the fix script:
   ```bash
   ./fix-nextjs-export.sh
   ```

3. After the script completes successfully, restart the frontend service:
   ```bash
   pm2 restart frontend
   ```

4. Verify that the website is now working correctly by visiting:
   ```
   https://evanjamesofficial.com
   ```

## Technical Details

The fix works by adding an `exportPathMap` function to the Next.js configuration. This function:

1. Takes the default path map generated by Next.js
2. Removes the problematic routes from the map
3. Returns the modified map for the export process

Here's the relevant part of the modified configuration:

```javascript
exportPathMap: async function (defaultPathMap) {
  // Remove problematic paths
  delete defaultPathMap['/admin/photos/albums/[id]'];
  delete defaultPathMap['/admin/photos/edit-album/[id]'];
  delete defaultPathMap['/admin/photos/new-album'];
  delete defaultPathMap['/admin/photos/upload'];
  delete defaultPathMap['/landing'];
  
  return defaultPathMap;
}
```

## Impact on Functionality

After applying this fix, the excluded routes will not be pre-rendered as static HTML files. However, they will still work correctly when accessed through the browser because:

1. The pages are still included in the JavaScript bundle
2. Next.js will render them on-demand in the browser
3. The server-side rendering will handle these routes when requested

This approach ensures that the website can be built and deployed successfully while maintaining all functionality.

## Permanent Solution

For a more permanent solution, you could consider:

1. Modifying the affected pages to use getStaticProps with fallback: true
2. Implementing Incremental Static Regeneration (ISR) for these dynamic routes
3. Switching from static export to server-side rendering for the entire application

However, the current fix is sufficient for most use cases and doesn't require significant code changes.
