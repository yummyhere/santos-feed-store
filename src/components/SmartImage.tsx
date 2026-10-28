import React, { useState } from 'react';
import { Wheat } from 'lucide-react';

interface SmartImageProps {
  src: string;
  alt: string;
  fallbackTitle?: string;
  className?: string;
  imgClassName?: string;
  loading?: 'eager' | 'lazy';
}

export function SmartImage({
  src,
  alt,
  fallbackTitle,
  className = '',
  imgClassName = '',
  loading = 'lazy',
}: SmartImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-[#E9DFC9]/60 text-[#263C2D] p-6 text-center select-none ${className}`}
        role="img"
        aria-label={alt}
      >
        <Wheat className="w-7 h-7 mb-2 text-[#697A45]" aria-hidden="true" />
        <span className="text-xs font-medium text-[#292B27] max-w-[20ch]">
          {fallbackTitle || alt}
        </span>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden bg-[#E9DFC9]/35 ${className}`}>
      <img
        src={src}
        alt={alt}
        loading={loading}
        referrerPolicy="no-referrer"
        onError={() => setHasError(true)}
        className={`w-full h-full object-cover ${imgClassName}`}
      />
    </div>
  );
}
