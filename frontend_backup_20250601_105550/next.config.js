/** @type {import('next').NextConfig} */

// Import the Sentry Next.js plugin
const { withSentryConfig } = require('@sentry/nextjs');

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['api.evanjamesofficial.com', 'localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'evanjamesofficial.com',
      },
      {
        protocol: 'https',
        hostname: 'api.evanjamesofficial.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      }
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 3600,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Temporarily disable i18n to troubleshoot 500 error
  // i18n: {
  //   locales: ['en'],
  //   defaultLocale: 'en',
  // },
  async redirects() {
    return [
      {
        source: '/music',
        destination: '/#music-video',
        permanent: false,
      },
      {
        source: '/listen',
        destination: '/#music-video',
        permanent: false,
      },
      {
        source: '/subscribe',
        destination: '/#email-signup',
        permanent: false,
      },
      {
        source: '/shows',
        destination: '/tour',
        permanent: false,
      },
      {
        source: '/epk',
        destination: '/press',
        permanent: true,
      }
    ]
  },
  swcMinify: true,
  experimental: {
    instrumentationHook: true,
  // Temporarily disable experimental features to troubleshoot 500 error
  //   optimizeCss: true,
  //   scrollRestoration: true,
  //   optimizePackageImports: ['@mui/icons-material', '@mui/material'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  poweredByHeader: false,
  compress: true,
  // Temporarily disable custom headers to troubleshoot 500 error
  // async headers() {
  //   return [
  //     {
  //       source: '/:path*',
  //       headers: [
  //         { key: 'X-DNS-Prefetch-Control', value: 'on' },
  //         { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  //         { key: 'X-XSS-Protection', value: '1; mode=block' },
  //         { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  //         { key: 'X-Content-Type-Options', value: 'nosniff' },
  //         { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
  //         // Temporarily disable CSP to troubleshoot header issues
  //         // {
  //         //   key: 'Content-Security-Policy',
  //         //   value: "default-src 'self'; img-src 'self' data: blob: https://api.evanjamesofficial.com https://www.evanjamesofficial.com; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; font-src 'self' data:; connect-src 'self' https://api.evanjamesofficial.com https://www.evanjamesofficial.com https://*.sentry.io https://*.ingest.sentry.io; media-src 'self' data: blob: https://api.evanjamesofficial.com; frame-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; manifest-src 'self'; worker-src 'self' blob:; report-uri https://api.evanjamesofficial.com/api/csp-report; report-to csp-endpoint;"
  //         // }
  //       ],
  //     },
  //   ];
  // },
}

// Sentry webpack plugin configuration
const sentryWebpackPluginOptions = {
  // Additional options for the Sentry Webpack plugin
  silent: true, // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options
};

// Export the Next.js configuration wrapped with Sentry
module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions);

// Export the plain Next.js configuration for testing without Sentry
// module.exports = nextConfig;
