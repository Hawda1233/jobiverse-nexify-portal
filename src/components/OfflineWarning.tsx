
import React, { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

const OfflineWarning = () => {
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 max-w-md p-4 bg-yellow-100 border border-yellow-300 rounded-lg shadow-md z-50">
      <div className="flex items-center">
        <AlertTriangle className="text-yellow-600 mr-2" size={20} />
        <div>
          <p className="font-medium text-yellow-800">You are currently offline</p>
          <p className="text-sm text-yellow-700">Some features may not work correctly until connection is restored.</p>
        </div>
      </div>
    </div>
  );
};

export default OfflineWarning;
