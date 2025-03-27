
import React, { useState } from 'react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string;
}

const ImageWithFallback = ({ 
  src, 
  alt, 
  fallback = '/placeholder.svg',
  className,
  ...rest 
}: ImageWithFallbackProps) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={`relative ${isLoading ? 'bg-muted animate-pulse' : ''}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-accent/30 border-t-accent rounded-full animate-spin"></div>
        </div>
      )}
      <img
        src={imgSrc || fallback}
        alt={alt}
        className={className}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setImgSrc(fallback);
          setIsLoading(false);
        }}
        loading="lazy"
        {...rest}
      />
    </div>
  );
};

export default ImageWithFallback;
