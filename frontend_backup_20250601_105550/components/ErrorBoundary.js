// File: frontend/components/ErrorBoundary.js
import React from 'react';
import { captureException } from '../services/errorTracking';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Send to Sentry via our error tracking service
    captureException(error, {
      extras: {
        componentStack: errorInfo.componentStack,
        ...errorInfo
      },
      tags: {
        errorBoundary: true,
        component: this.props.componentName || 'UnknownComponent'
      }
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
            <p className="text-gray-600 mb-4">
              We apologize for the inconvenience. Our team has been notified and is working on fixing the issue.
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
