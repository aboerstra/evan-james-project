import React, { useState, useEffect } from 'react';
import PlausibleProvider from 'next-plausible';
import { useRouter } from 'next/router';
import * as Sentry from '@sentry/nextjs';
import { setUser } from '../services/errorTracking';
import ErrorBoundary from '../components/ErrorBoundary';
import performanceMonitoring from '../services/performanceMonitoring';
import '../styles/globals.css';

// Removed custom response handler that was causing 500 errors

function EvanJamesApp({ Component, pageProps }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Simple page transition system
  useEffect(() => {
    const handleStart = (url) => {
      setIsLoading(true);
      // Track page navigation start with Sentry
      const transaction = Sentry.startTransaction({
        name: `Navigation to ${url}`,
        op: 'navigation'
      });
      // Store the transaction on the window object so we can finish it later
      if (typeof window !== 'undefined') {
        window.__sentry_transaction = transaction;
      }
    };
    
    const handleComplete = (url) => {
      setIsLoading(false);
      // Finish the Sentry transaction for page navigation
      if (typeof window !== 'undefined' && window.__sentry_transaction) {
        window.__sentry_transaction.finish();
      }
      
      // Track page view
      Sentry.addBreadcrumb({
        category: 'navigation',
        message: `Navigated to ${url}`,
        level: 'info'
      });
    };
    
    const handleError = (error, url) => {
      setIsLoading(false);
      // Capture navigation errors with Sentry
      Sentry.captureException(error, {
        tags: {
          url,
          navigation: true
        }
      });
      
      // Finish the Sentry transaction with error status
      if (typeof window !== 'undefined' && window.__sentry_transaction) {
        window.__sentry_transaction.setStatus('internal_error');
        window.__sentry_transaction.finish();
      }
    };

    // For Next.js router events
    if (typeof window !== 'undefined') {
      const router = require('next/router').default;
      router.events.on('routeChangeStart', handleStart);
      router.events.on('routeChangeComplete', handleComplete);
      router.events.on('routeChangeError', handleError);

      return () => {
        router.events.off('routeChangeStart', handleStart);
        router.events.off('routeChangeComplete', handleComplete);
        router.events.off('routeChangeError', handleError);
      };
    }
  }, []);
  
  // Set user information for Sentry if available
  useEffect(() => {
    if (pageProps.session?.user) {
      setUser({
        id: pageProps.session.user.id,
        email: pageProps.session.user.email,
        username: pageProps.session.user.name
      });
    }
  }, [pageProps.session]);
  
  // Initialize performance monitoring
  useEffect(() => {
    if (typeof window !== 'undefined') {
      performanceMonitoring.init();
      
      // Removed fetch API patch that was causing 500 errors
    }
  }, []);

  return (
    <ErrorBoundary>
      <PlausibleProvider domain="evanjamesofficial.com" trackOutboundLinks>
        {/* Page transition loading indicator */}
        {isLoading && (
          <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-navy via-electric-blue to-ice-blue animate-pulse-slow z-50" />
        )}
        
        {/* Main app component */}
        <Component {...pageProps} />
      </PlausibleProvider>
    </ErrorBoundary>
  );
}

export default EvanJamesApp;
