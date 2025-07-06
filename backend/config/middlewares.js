module.exports = ({ env }) => [
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      origin: ['https://evanjamesofficial.com', 'https://www.evanjamesofficial.com', 'http://localhost:3000', 'http://localhost:1337'],
      headers: [
        'Content-Type',
        'Authorization',
        'Origin',
        'Accept',
        'sentry-trace',
        'baggage',
      ],
      credentials: true,
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
