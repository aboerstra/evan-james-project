module.exports = ({ env }) => [
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      enabled: env.bool('CORS_ENABLED', true), // Use env var or default to true
      origin: env.array('CORS_ORIGIN', ['http://localhost:3000', 'http://localhost:1337']), // Use env var or default
      headers: [
        'Content-Type',
        'Authorization',
        'Origin',
        'Accept',
        'sentry-trace', // Add sentry-trace here
        'baggage', // Add baggage here as Sentry might also use it
      ],
    },
  },
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
