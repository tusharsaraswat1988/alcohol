import React, { useState } from 'react';
import { Wine } from 'lucide-react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackTitle?: string;
  badgeText?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt = 'Alcohol Bottle',
  className = '',
  fallbackTitle,
  badgeText,
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (hasError || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-b from-[#1E202B] to-[#12131A] text-amber-200/90 p-4 border border-amber-500/20 rounded-xl relative overflow-hidden ${className}`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:16px_16px] opacity-15" />
        <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-400/30 flex items-center justify-center mb-2 z-10 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
          <Wine className="w-8 h-8 text-amber-400" />
        </div>
        <span className="font-serif text-sm font-semibold tracking-wider text-center z-10 text-amber-100 max-w-[140px] truncate">
          {fallbackTitle || alt}
        </span>
        {badgeText && (
          <span className="text-[10px] tracking-widest uppercase font-mono px-2 py-0.5 mt-1 bg-amber-400/10 text-amber-300 rounded border border-amber-400/20 z-10">
            {badgeText}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden flex items-center justify-center ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-neutral-100 animate-pulse flex items-center justify-center">
          <Wine className="w-6 h-6 text-neutral-300 animate-spin" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onError={() => setHasError(true)}
        onLoad={() => setIsLoading(false)}
        className={`w-full h-full object-contain transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        {...props}
      />
    </div>
  );
};
