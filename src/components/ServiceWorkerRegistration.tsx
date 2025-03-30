
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const ServiceWorkerRegistration = () => {
  const { toast } = useToast();
  const [updateAvailable, setUpdateAvailable] = useState<boolean>(false);
  
  useEffect(() => {
    // Register service worker for production only
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
          .then(registration => {
            console.log('Service Worker registered with scope:', registration.scope);
            
            // Check for updates
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    // New content is available and will be used when the page is reloaded
                    setUpdateAvailable(true);
                    toast({
                      title: 'Update Available',
                      description: 'A new version is available. Reload the page to update.',
                      action: (
                        <button 
                          onClick={() => window.location.reload()}
                          className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded-md"
                        >
                          Reload
                        </button>
                      )
                    });
                  }
                });
              }
            });
          })
          .catch(error => {
            console.error('Service Worker registration failed:', error);
          });
          
        // Handle service worker communication
        navigator.serviceWorker.addEventListener('message', (event) => {
          if (event.data && event.data.type === 'OFFLINE_READY') {
            toast({
              title: 'Offline Ready',
              description: 'App is ready to work offline'
            });
          }
        });
      });
    }
    
    // Add connectivity listener to show toast notifications
    const handleOnlineStatus = () => {
      if (navigator.onLine) {
        toast({
          title: 'Back Online',
          description: 'Your connection has been restored'
        });
      } else {
        toast({
          title: 'Offline Mode',
          description: 'You are now in offline mode',
          variant: 'destructive'
        });
      }
    };
    
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, [toast]);
  
  return null; // This component doesn't render anything
};

export default ServiceWorkerRegistration;
