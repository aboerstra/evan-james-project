/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://evanjamesofficial.com',
  generateRobotsTxt: true,
  // Optional: Exclude specific pages
  exclude: ['/admin/*', '/landing-test'],
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://evanjamesofficial.com/sitemap.xml',
    ],
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
      {
        userAgent: '*',
        disallow: ['/admin'],
      },
    ],
  },
} 