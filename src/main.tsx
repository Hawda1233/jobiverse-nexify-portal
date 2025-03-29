
import { createRoot } from 'react-dom/client';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { ErrorBoundary } from 'react-error-boundary';
import App from './App.tsx';
import './index.css';

// Create the query client with retry logic and error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      retryDelay: 1000,
      // Updated: Using meta.onError instead of onError at root level
      meta: {
        onError: (error: Error) => {
          console.error('Query error:', error);
        }
      }
    },
  },
});

// Create a helmet context
const helmetContext = {};

// Error fallback component
const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background text-foreground">
      <div className="max-w-md w-full p-6 rounded-xl shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold mb-4 text-red-600 dark:text-red-400">Something went wrong</h1>
        <p className="mb-4 text-gray-600 dark:text-gray-300">
          The application encountered an unexpected error.
        </p>
        <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded text-sm overflow-auto mb-4 max-h-[200px]">
          {error.message}
        </pre>
        <button
          onClick={resetErrorBoundary}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors w-full"
        >
          Try again
        </button>
      </div>
    </div>
  );
};

// Register service worker
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
  });
}

// Find root element
const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("Root element not found!");
} else {
  // Create root component
  const root = createRoot(rootElement);

  // Render app with all required providers and error boundary
  root.render(
    <React.StrictMode>
      <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
        <HelmetProvider context={helmetContext}>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </HelmetProvider>
      </ErrorBoundary>
    </React.StrictMode>
  );
}
