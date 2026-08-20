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
    <div className="w-full overflow-hidden rounded-xl">
      {failed ? (
        <div className="px-6 py-8 text-center text-xs font-medium text-gray-400">Image could not be loaded</div>
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
          className={`block h-auto w-full transition-opacity duration-200 md:cursor-pointer ${loaded ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
    </div>
  );
}
