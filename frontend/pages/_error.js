import React from 'react';
import Error from 'next/error';

// This custom error component will handle any errors that occur during rendering
function CustomError({ statusCode, hasGetInitialPropsRun, err }) {
  if (!hasGetInitialPropsRun && err) {
    // getInitialProps is not called for top-level errors - See https://github.com/vercel/next.js/issues/8592
    console.error('Error from custom _error.js:', err);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-navy text-white p-4">
      <h1 className="text-3xl font-bold mb-4">
        {statusCode
          ? `An error ${statusCode} occurred on server`
          : 'An error occurred on client'}
      </h1>
      <p className="text-xl mb-6">
        We apologize for the inconvenience. Our team has been notified.
      </p>
      <button
        onClick={() => window.location.href = '/'}
        className="px-6 py-3 bg-electric-blue text-white rounded-md hover:bg-electric-blue/80 transition-colors"
      >
        Return to Homepage
      </button>
    </div>
  );
}

CustomError.getInitialProps = async ({ res, err, asPath }) => {
  const errorInitialProps = {
    hasGetInitialPropsRun: true,
    statusCode: 500,
  };

  if (res?.statusCode) {
    errorInitialProps.statusCode = res.statusCode;
  } else if (err?.statusCode) {
    errorInitialProps.statusCode = err.statusCode;
  }

  // Workaround for https://github.com/vercel/next.js/issues/8592
  if (err) {
    console.error('Error caught in _error.js:', {
      message: err.message,
      stack: err.stack,
      path: asPath,
    });
  }

  return errorInitialProps;
};

export default CustomError;
