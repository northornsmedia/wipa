'use client';

import React, { useState } from 'react';
import { ImageIcon } from 'lucide-react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  aspectRatio?: string; // e.g. '1/1', '16/9', '3/1'
  containerClassName?: string;
}

export default function OptimizedImage({
  src,
  alt,
  fallbackSrc,
  aspectRatio,
  containerClassName = '',
  className = '',
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const finalSrc = hasError && fallbackSrc ? fallbackSrc : src;

  return (
    <div 
      className={`relative overflow-hidden ${containerClassName}`}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {/* 1. Animated Skeleton Shimmer (Active while loading) */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-white/5 dark:via-white/10 dark:to-white/5 animate-pulse" />
      )}

      {/* 2. Error Fallback State */}
      {hasError && !fallbackSrc ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-black/30 text-gray-400">
          <ImageIcon size={24} className="opacity-40" />
        </div>
      ) : (
        /* 3. High-Performance Image */
        <img
          src={finalSrc}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          {...props}
        />
      )}
    </div>
  );
}
