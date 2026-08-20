'use client';

import { useState } from 'react';

export default function ProgressiveFeedImage({
  src,
  alt,
  eager = false,
  onClick,
}: {
  src: string;
  alt: string;
  eager?: boolean;
  onClick?: () => void;
}) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <div className="relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-xl bg-gray-100 dark:bg-black/40 sm:aspect-video">
      {!loaded && !failed && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100 dark:from-white/5 dark:via-white/10 dark:to-white/5" />
      )}
      {failed ? (
        <div className="px-6 text-center text-xs font-medium text-gray-400">Image could not be loaded</div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          fetchPriority={eager ? 'high' : 'auto'}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          onClick={onClick}
          className={`h-full w-full object-contain transition-opacity duration-300 md:cursor-pointer ${loaded ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
    </div>
  );
}
