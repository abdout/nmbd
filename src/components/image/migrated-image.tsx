'use client';

import React from 'react';
import OptimizedImage from './optimum-image';
import { type ImageProps } from 'next/image';

/**
 * MigratedImage - A drop-in replacement for Next.js Image
 * 
 * This component is designed to make migration from Next.js Image to OptimizedImage easier.
 * It accepts all the props that Next.js Image accepts and passes them to OptimizedImage
 * with appropriate transformations and defaults.
 * 
 * This is a migration helper and should eventually be replaced with direct OptimizedImage usage.
 */
export default function MigratedImage({
  src,
  alt,
  width,
  height,
  quality = 80,
  priority = false,
  placeholder,
  blurDataURL,
  className,
  style,
  sizes,
  fill,
  loading,
  unoptimized,
  transformations = [],
  convertPath = true,
  debug = false,
  onLoadingComplete,
  onLoad,
  onError,
  // Do not destructure omitted props explicitly since they're not in the type
  ...rest
}: Omit<ImageProps, 'loader' | 'lazyBoundary' | 'lazyRoot'> & {
  transformations?: any[];
  convertPath?: boolean;
  debug?: boolean;
}) {
  // Convert style to individual props where possible
  const objectFit = style?.objectFit;
  const objectPosition = style?.objectPosition;
  
  // Determine loading strategy
  const loadingStrategy = loading || (priority ? 'eager' : 'lazy');
  
  // Set default transformations
  const defaultTransformations = [
    { quality: Number(quality) },
    { format: 'auto' }
  ];
  
  // If unoptimized is true, add orig-true transformation
  const allTransformations = unoptimized 
    ? [{ origImage: 'true' }]
    : [...defaultTransformations, ...transformations];

  // Safely get numeric width and height
  const safeWidth = typeof width === 'number' ? width : undefined;
  const safeHeight = typeof height === 'number' ? height : undefined;

  // Safely get string src
  const safeSrc = typeof src === 'string' ? src : '';

  // Handle event callbacks
  const handleLoad = onLoad ? () => {
    if (typeof onLoad === 'function') {
      onLoad({} as any);
    }
  } : undefined;

  const handleError = onError ? (error: unknown) => {
    if (typeof onError === 'function') {
      onError({} as any);
    }
  } : undefined;

  // Only include props that OptimizedImage accepts
  return (
    <OptimizedImage
      src={safeSrc}
      alt={alt}
      width={safeWidth}
      height={safeHeight}
      className={className}
      priority={priority}
      quality={Number(quality)}
      fill={fill}
      sizes={sizes}
      loading={loadingStrategy as 'lazy' | 'eager'}
      objectFit={objectFit as any}
      objectPosition={objectPosition as string}
      placeholder={placeholder as 'blur' | 'empty' | undefined}
      blurDataURL={blurDataURL}
      transformations={allTransformations}
      convertPath={convertPath}
      debug={debug}
      onLoad={handleLoad}
      onError={handleError}
    />
  );
} 