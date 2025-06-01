// https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
import * as Sentry from '@sentry/nextjs';

export function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

    Sentry.init({
      dsn: SENTRY_DSN,

      // Adjust this value in production, or use tracesSampler for greater control
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.2 : 1.0,

      // Setting this option to true will print useful information to the console while you're setting up Sentry.
      debug: process.env.NODE_ENV === 'development',

      enabled: true, // Assuming we want it enabled for dev and prod now
    });
  } else if (process.env.NEXT_RUNTIME === 'edge') {
    const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

    Sentry.init({
      dsn: SENTRY_DSN,
      // Adjust this value in production, or use tracesSampler for greater control
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.2 : 1.0,
      // Setting this option to true will print useful information to the console while you're setting up Sentry.
      debug: process.env.NODE_ENV === 'development',
      enabled: true, // Assuming we want it enabled for dev and prod now
    });
  }

  // Note: Client-side Sentry initialization (from sentry.client.config.js)
  // is still handled in sentry.client.config.js.
  // Sentry's latest recommendations might involve moving client init here too or to a
  // dedicated instrumentation.client.js for App Router, but for Pages Router,
  // keeping sentry.client.config.js is common.
}
