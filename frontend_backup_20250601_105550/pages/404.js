import React from 'react';
import Link from 'next/link';

export default function Custom404() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-navy text-white p-4">
      <h1 className="text-3xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-xl mb-6">
        We couldn't find the page you were looking for.
      </p>
      <Link href="/">
        Return to Homepage
      </Link>
    </div>
  );
}
