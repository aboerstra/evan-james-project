module.exports = ({ env }) => ({
  'content-type-builder': {
    enabled: true,
    config: {
      // Add any specific configuration for content-type-builder here
    },
  },
  'users-permissions': {
    enabled: true,
    config: {
      jwt: {
        expiresIn: '7d',
      },
    },
  },
  i18n: {
    enabled: true,
  },
  'image-optimizer': {
    enabled: true,
    config: {
      include: ["jpeg", "jpg", "png", "webp", "avif"],
      exclude: ["gif", "svg"],
      formats: ["original", "webp", "avif"],
      sizes: [
        { name: "xs", width: 300, height: 300, fit: "cover" },
        { name: "sm", width: 768, height: 768, fit: "cover" },
        { name: "md", width: 1280, height: 1280, fit: "cover" },
        { name: "lg", width: 1920, height: 1920, fit: "cover" }
      ],
      quality: 80,
      progressive: true,
      stripMetadata: true,
      cache: {
        enabled: true,
        maxAge: 86400 // 24 hours
      }
    },
  },
  upload: {
    config: {
      breakpoints: {
        xlarge: 1920,
        large: 1000,
        medium: 750,
        small: 500,
        xsmall: 64
      },
      provider: 'local',
      providerOptions: {
        sizeLimit: 10 * 1024 * 1024, // 10MB
      },
      actionOptions: {
        upload: {},
        delete: {},
      },
    },
  },
});
