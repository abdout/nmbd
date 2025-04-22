'use client';

import { ForwardedRef, forwardRef } from 'react';
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
    ...rest
  } = props;

  // Convert style to individual props where possible
  const objectFit = style?.objectFit;
  const objectPosition = style?.objectPosition;
  
  // Determine loading strategy
  const loadingStrategy = loading || (priority ? 'eager' : 'lazy');
  
  // Set default transformations
  const defaultTransformations = [
    { quality: String(quality) },
    { format: 'auto' }
  ];
  
  // If unoptimized is true, add orig-true transformation
  const allTransformations = unoptimized 
    ? [{ origImage: 'true' }]
    : [...defaultTransformations, ...transformations];

  return (
    <OptimizedImage
      ref={ref}
      src={typeof src === 'string' ? src : ''}
      alt={alt}
      width={typeof width === 'number' ? width : undefined}
      height={typeof height === 'number' ? height : undefined}
      className={className}
      priority={priority}
      quality={quality}
      fill={fill}
      sizes={sizes}
      loading={loadingStrategy as 'lazy' | 'eager'}
      objectFit={objectFit as any}
      objectPosition={objectPosition as string}
      placeholder={placeholder as 'blur' | 'empty' | undefined}
      blurDataURL={blurDataURL}
      transformations={allTransformations}
      {...rest}
    />
  );
});

export default MigratedImage; 