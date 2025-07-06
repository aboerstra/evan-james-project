module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  url: process.env.PUBLIC_URL || (process.env.NODE_ENV === "production" ? "https://api.evanjamesofficial.com" : "http://localhost:1337"),
  app: {
    keys: env.array('APP_KEYS', ['myKeyA', 'myKeyB']),
  },
  admin: {
    auth: {
      secret: env('ADMIN_JWT_SECRET', 'myAdminJwtSecret'),
    },
    autoOpen: false,
    watchIgnoreFiles: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.git/**',
      '**/uploads/**',
    ],
  },
  bootstrap({ strapi }) {
    // Set timeout to 30 minutes for large uploads
    strapi.server.httpServer.requestTimeout = 30 * 60 * 1000;
  },
  cors: {
    enabled: true,
    origin: [
      'https://evanjamesofficial.com',
      'https://www.evanjamesofficial.com',
      'http://localhost:3000'
    ],
    headers: [
      'Content-Type',
      'Authorization',
      'Origin',
      'Accept',
      'User-Agent',
      'Cache-Control',
      'X-Requested-With',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
    keepHeaderOnError: true,
  },
  security: {
    xframe: {
      enabled: true,
      value: 'SAMEORIGIN',
    },
    hsts: {
      enabled: true,
      maxAge: 31536000,
      includeSubDomains: true,
    },
    xss: {
      enabled: true,
      mode: 'block',
    },
    csp: {
      enabled: true,
      policy: ["block-all-mixed-content"],
    },
  },
});
