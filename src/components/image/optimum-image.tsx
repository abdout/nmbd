'use client';

import { Image, type Transformation } from '@imagekit/next';
import { cn } from '@/lib/utils';
import { convertToImageKitPath } from '@/components/image/image-utils';
import { isImageKitUrl } from '@/components/image/image-kit';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  fill?: boolean;
  sizes?: string;
  loading?: 'lazy' | 'eager';
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  objectPosition?: string;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  transformations?: Transformation[];
  convertPath?: boolean;
  debug?: boolean; // Debug mode flag - uses a placeholder image
  onLoad?: () => void;
  onError?: (error: Error | unknown) => void;
}

/**
 * DEBUG MODE CONFIGURATION
 * 
 * When GLOBAL_DEBUG_MODE is enabled, all images will use a placeholder image from ImageKit.
 * This is useful during development and testing of the ImageKit integration when:
 * 
 * 1. Not all images have been uploaded to ImageKit yet
 * 2. You want to verify that ImageKit transformations work properly
 * 3. You want to detect layout issues without waiting for actual images to load
 * 
 * The placeholder image should be uploaded to your ImageKit account at: /article/c.jpg
 * 
 * Set this to false in production!
 */
const GLOBAL_DEBUG_MODE = false;

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  quality = 80,
  fill = false,
  sizes,
  loading,
  objectFit = 'cover',
  objectPosition,
  placeholder,
  blurDataURL,
  transformations = [],
  convertPath = true,
  debug = false, // Individual component debug mode
  onLoad,
  onError,
}: OptimizedImageProps) {
  // Common transformations for optimization
  const defaultTransformations: Transformation[] = [
    // Use number type for quality as required by ImageKit
    { quality },
    { format: 'auto' }
  ];

  // Combine default transformations with any custom ones
  const allTransformations = [...defaultTransformations, ...transformations];

  // If debug mode is enabled (either globally or for this component),
  // use the placeholder image instead of the real source
  const isDebugMode = GLOBAL_DEBUG_MODE || debug;
  
  // The path to the placeholder image on ImageKit
  // This should be uploaded to your ImageKit account: /article/c.jpg
  const debugImageSrc = '/article/c.jpg';
  
  // Use the placeholder in debug mode, otherwise use the original source
  const finalSrc = isDebugMode ? debugImageSrc : src;
  
  // Special handling for ImageKit URLs - don't try to convert them
  // This helps prevent double-processing of URLs that already contain the correct format
  const imageKitUrlDetected = isImageKitUrl(finalSrc);
  
  // In debug mode, we don't need to convert the path since we're using a known ImageKit path
  // Also skip conversion for URLs that are already ImageKit URLs
  const shouldConvertPath = isDebugMode || imageKitUrlDetected ? false : convertPath;
  
  // Process the image src path if needed
  const processedSrc = shouldConvertPath ? convertToImageKitPath(finalSrc) : finalSrc;
  
  // Modify alt text in debug mode to show the original source for debugging
  const finalAlt = isDebugMode ? `[DEBUG] ${alt} (Original: ${src})` : alt;

  return (
    <Image
      src={processedSrc}
      alt={finalAlt}
      width={width}
      height={height}
      className={cn(className)}
      priority={priority}
      fill={fill}
      sizes={sizes || (fill ? '100vw' : undefined)}
      loading={loading}
      style={{
        objectFit,
        objectPosition,
      }}
      placeholder={placeholder}
      blurDataURL={blurDataURL}
      transformation={allTransformations}
      onLoad={() => {
        if (onLoad) onLoad();
      }}
      onError={(e) => {
        if (onError) onError(e);
      }}
    />
  );
} 