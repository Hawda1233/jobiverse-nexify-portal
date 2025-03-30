
import React, { useState, useEffect } from 'react';
import { AlertTriangle, WifiOff, RefreshCw } from 'lucide-react';

const OfflineWarning = () => {
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setLastCheck(new Date());
    };
    
    const handleOffline = () => {
      setIsOffline(true);
      setLastCheck(new Date());
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Check connection status every 30 seconds when offline
    let interval: number | null = null;
    if (isOffline) {
      interval = window.setInterval(() => {
        // Try to fetch a small resource to check real connectivity
        fetch('/favicon.ico', { 
          method: 'HEAD',
          cache: 'no-store',
          mode: 'no-cors'
        })
        .then(() => {
          if (!navigator.onLine) {
            // Browser thinks we're offline but we got a response
            window.dispatchEvent(new Event('online'));
          }
          setLastCheck(new Date());
        })
        .catch(() => {
          if (navigator.onLine) {
            // Browser thinks we're online but request failed
            window.dispatchEvent(new Event('offline'));
          }
          setLastCheck(new Date());
        });
      }, 30000); // Check every 30 seconds
    }
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isOffline]);

  const handleRetry = () => {
    // Force reload the page
    window.location.reload();
  };

  if (!isOffline) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 max-w-md p-4 bg-yellow-100 border border-yellow-300 rounded-lg shadow-md z-50">
      <div className="flex items-center">
        {showDetails ? <WifiOff className="text-yellow-600 mr-2" size={20} /> : <AlertTriangle className="text-yellow-600 mr-2" size={20} />}
        <div className="flex-1">
          <p className="font-medium text-yellow-800">You are currently offline</p>
          <p className="text-sm text-yellow-700">Some features may not work correctly until connection is restored.</p>
          
          {showDetails && lastCheck && (
            <p className="text-xs text-yellow-700 mt-1">
              Last connection check: {lastCheck.toLocaleTimeString()}
            </p>
          )}
        </div>
        
        <div className="flex flex-col gap-2 ml-2">
          <button 
            onClick={handleRetry}
            className="p-2 bg-yellow-200 hover:bg-yellow-300 rounded-full"
            title="Retry connection"
          >
            <RefreshCw size={16} className="text-yellow-700" />
          </button>
          
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs underline text-yellow-700"
          >
            {showDetails ? 'Hide details' : 'Show details'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfflineWarning;
