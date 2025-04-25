'use client';

import { ForwardedRef, forwardRef, ReactEventHandler } from 'react';
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
const MigratedImage = forwardRef(function MigratedImage(
  props: ImageProps & { transformations?: any[] },
  ref: ForwardedRef<HTMLImageElement>
) {
  const {
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
    // Extract other props that might not be compatible with OptimizedImage
    onLoadingComplete,
    onLoad,
    onError,
    loader,
    lazyBoundary,
    lazyRoot,
    ...safeRest
  } = props;

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

  // Adapt Next.js event handlers to OptimizedImage event handlers
  const handleLoad = onLoad ? () => {
    if (onLoad) {
      // Call without passing event since OptimizedImage's onLoad doesn't accept parameters
      (onLoad as Function)();
    }
  } : undefined;

  const handleError = onError ? (error: Error | unknown) => {
    if (onError) {
      // Call with error object
      (onError as Function)(error);
    }
  } : undefined;

  return (
    <OptimizedImage
      ref={ref}
      src={typeof src === 'string' ? src : ''}
      alt={alt}
      width={typeof width === 'number' ? width : undefined}
      height={typeof height === 'number' ? height : undefined}
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
      onLoad={handleLoad}
      onError={handleError}
    />
  );
});

export default MigratedImage; 