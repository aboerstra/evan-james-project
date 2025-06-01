import React from 'react';
import { render, screen, fireEvent } from '../../__tests__/utils/test-utils';
import ErrorBoundary from '../../components/ErrorBoundary';

// Mock console.error to prevent test output pollution
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});

describe('ErrorBoundary', () => {
  const ThrowError = () => {
    throw new Error('Test error');
  };

  beforeEach(() => {
    // Reset any mocks before each test
    jest.clearAllMocks();
  });

  it('renders children when there is no error', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <div>Test Child</div>
      </ErrorBoundary>
    );

    expect(getByText('Test Child')).toBeInTheDocument();
  });

  it('renders error UI when there is an error', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(getByText(/something went wrong/i)).toBeInTheDocument();
    expect(getByText(/try again/i)).toBeInTheDocument();
  });

  it('logs error to console when there is an error', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(console.error).toHaveBeenCalled();
  });

  it('resets error state when try again button is clicked', () => {
    const { getByText, rerender } = render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    // Verify error UI is shown
    expect(getByText(/something went wrong/i)).toBeInTheDocument();

    // Click try again
    fireEvent.click(getByText(/try again/i));

    // Rerender with non-error component
    rerender(
      <ErrorBoundary>
        <div>Test Child</div>
      </ErrorBoundary>
    );

    // Verify child is rendered
    expect(getByText('Test Child')).toBeInTheDocument();
  });

  it('handles component updates correctly', () => {
    const { getByText, rerender } = render(
      <ErrorBoundary>
        <div>Initial Child</div>
      </ErrorBoundary>
    );

    expect(getByText('Initial Child')).toBeInTheDocument();

    // Update to error component
    rerender(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(getByText(/something went wrong/i)).toBeInTheDocument();

    // Update back to normal component
    rerender(
      <ErrorBoundary>
        <div>Updated Child</div>
      </ErrorBoundary>
    );

    expect(getByText('Updated Child')).toBeInTheDocument();
  });
});