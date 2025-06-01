module.exports = ({ env }) => {
  const adminJwtSecret = env('ADMIN_JWT_SECRET') || 'taintedBlueJwtSecret';
  const apiTokenSalt = env('API_TOKEN_SALT') || 'taintedBlueTokenSalt';
  const transferTokenSalt = env('TRANSFER_TOKEN_SALT') || 'taintedBlueTransferSalt';

  return {
    auth: {
      secret: adminJwtSecret,
      // Custom auth logo
      logo: '/admin-logo.png',
    },
    apiToken: {
      salt: apiTokenSalt,
    },
    transfer: {
      token: {
        salt: transferTokenSalt,
      },
    },
    // Custom logo and favicon
    head: {
      favicon: '/favicon.png', // Using PNG due to Strapi ICO middleware bug
    },
    // Menu logo
    menu: {
      logo: '/admin-logo.png',
    },
    // Custom admin panel theming
    theme: {
      light: {
        colors: {
          primary100: '#1e3a8a', // Navy blue
          primary200: '#1e40af',
          primary500: '#3b82f6', // Electric blue
          primary600: '#2563eb',
          primary700: '#1d4ed8',
          danger700: '#dc2626',
          neutral0: '#ffffff',
          neutral100: '#f8fafc',
          neutral150: '#f1f5f9',
          neutral200: '#e2e8f0',
          neutral300: '#cbd5e1',
          neutral400: '#94a3b8',
          neutral500: '#64748b',
          neutral600: '#475569',
          neutral700: '#334155',
          neutral800: '#1e293b',
          neutral900: '#0f172a', // Dark navy
        },
      },
      dark: {
        colors: {
          primary100: '#1e3a8a',
          primary200: '#1e40af', 
          primary500: '#3b82f6',
          primary600: '#2563eb',
          primary700: '#1d4ed8',
          danger700: '#dc2626',
          neutral0: '#0f172a', // Dark navy background
          neutral100: '#1e293b',
          neutral150: '#334155',
          neutral200: '#475569',
          neutral300: '#64748b',
          neutral400: '#94a3b8',
          neutral500: '#cbd5e1',
          neutral600: '#e2e8f0',
          neutral700: '#f1f5f9',
          neutral800: '#f8fafc',
          neutral900: '#ffffff',
        },
      },
    },
  };
}; 