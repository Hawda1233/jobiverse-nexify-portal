
import { createRoot } from 'react-dom/client';
import React, { Suspense, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { ErrorBoundary } from 'react-error-boundary';
import App from './App.tsx';
import SimpleFallbackPage from './components/SimpleFallbackPage.tsx';
import './index.css';
import { app, db, auth } from './lib/firebase';

// Verify Firebase initialization status - immediately check at module load time
const firebaseInitialized = !!app && !!db && !!auth;
console.log("Firebase initialization status:", firebaseInitialized);

// Create the query client with robust error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 2,
      retryDelay: 1000,
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

// Error fallback component with more detailed information and offline detection
const ErrorFallback = ({ error, resetErrorBoundary }) => {
  const [isOffline, setIsOffline] = React.useState(!navigator.onLine);
  
  React.useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background text-foreground">
      <div className="max-w-md w-full p-6 rounded-xl shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold mb-4 text-red-600 dark:text-red-400">Something went wrong</h1>
        {isOffline && (
          <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 rounded text-yellow-800">
            You appear to be offline. Some features may not work correctly.
          </div>
        )}
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

// Firebase initialization check component
const FirebaseInitializationCheck = ({ children }) => {
  const [isInitialized, setIsInitialized] = React.useState(firebaseInitialized);
  
  useEffect(() => {
    if (app && db && auth) {
      console.log("Firebase is initialized correctly");
      setIsInitialized(true);
    } else {
      console.error("Firebase initialization failed!");
    }
  }, []);
  
  if (!isInitialized) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="p-4 bg-yellow-100 rounded-md">
        <h2 className="font-bold">Initializing Firebase...</h2>
        <p>Please wait while we connect to our services.</p>
      </div>
    </div>;
  }
  
  return <>{children}</>;
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

// Find root element and initialize app with better error handling
const rootElement = document.getElementById("root");

// Check if we've already created a root for this element
// to avoid the "container that has already been passed to createRoot()" warning
let root;

if (!rootElement) {
  console.error("Root element not found!");
  // Create a fallback element if root is not found
  const fallbackElement = document.createElement("div");
  fallbackElement.id = "root";
  document.body.appendChild(fallbackElement);
  
  root = createRoot(fallbackElement);
  root.render(<SimpleFallbackPage />);
} else {
  // Check if we already have a root instance on the window object
  if (!(window as any).__REACT_ROOT__) {
    // Create root component and store the reference
    root = createRoot(rootElement);
    (window as any).__REACT_ROOT__ = root;
  } else {
    // Use the existing root
    root = (window as any).__REACT_ROOT__;
  }

  // Render app with all required providers and error boundary
  root.render(
    <React.StrictMode>
      <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => {
        // Clear any cached state that might be causing problems
        queryClient.clear();
        window.location.reload();
      }}>
        <HelmetProvider context={helmetContext}>
          <QueryClientProvider client={queryClient}>
            <Suspense fallback={<SimpleFallbackPage />}>
              <FirebaseInitializationCheck>
                <App />
              </FirebaseInitializationCheck>
            </Suspense>
          </QueryClientProvider>
        </HelmetProvider>
      </ErrorBoundary>
    </React.StrictMode>
  );
}
