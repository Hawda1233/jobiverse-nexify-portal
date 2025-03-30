
import React from 'react';
import { Loader2, WifiOff, ServerCrash, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LoadingFallbackProps {
  message?: string;
  type?: 'loading' | 'offline' | 'error' | 'empty';
  error?: string;
  retry?: () => void;
  className?: string;
}

const LoadingFallback: React.FC<LoadingFallbackProps> = ({ 
  message = "Loading...", 
  type = "loading",
  error,
  retry,
  className = ""
}) => {
  return (
    <div className={`flex flex-col items-center justify-center min-h-[200px] p-4 ${className}`}>
      {type === 'loading' && (
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
      )}
      {type === 'offline' && (
        <WifiOff className="h-8 w-8 text-yellow-500 mb-4" />
      )}
      {type === 'error' && (
        <ServerCrash className="h-8 w-8 text-red-500 mb-4" />
      )}
      {type === 'empty' && (
        <AlertCircle className="h-8 w-8 text-muted-foreground mb-4" />
      )}
      
      <p className="text-muted-foreground text-center">{message}</p>
      
      {error && (
        <p className="text-sm text-red-500 mt-2 max-w-md text-center">{error}</p>
      )}
      
      {retry && (
        <Button 
          onClick={retry}
          className="mt-4 px-4 py-2"
        >
          Retry
        </Button>
      )}
      
      {type === 'offline' && (
        <Button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          Retry Connection
        </Button>
      )}
    </div>
  );
};

export default LoadingFallback;
