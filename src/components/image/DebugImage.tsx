'use client';

import { type Transformation } from '@imagekit/next';
import OptimizedImage from './optimum-image';

/**
 * DebugImage - A component for testing ImageKit integration
 * 
 * This component always uses a placeholder image from ImageKit
 * while preserving all the image dimensions and props from the original image.
 * Useful for testing ImageKit integration without having to upload all images.
 */
interface DebugImageProps {
  src?: string; // Original source (ignored in debug mode)
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
  showOriginalSource?: boolean; // Set to true to show the real source (disabled by default)
}

export default function DebugImage(props: DebugImageProps) {
  const {
    src,
    alt,
    showOriginalSource = false,
    convertPath = false, // We don't need path conversion for the debug image
    ...otherProps
  } = props;

  // Use the placeholder image from ImageKit
  // This is the image you uploaded to the 'article' folder
  const debugImageSrc = '/article/c.jpg';
  
  // Show original info in the alt text for debugging
  const debugAlt = `[DEBUG] ${alt} (Original: ${src})`;
  
  return (
    <OptimizedImage
      src={showOriginalSource ? (src || debugImageSrc) : debugImageSrc}
      alt={debugAlt}
      convertPath={convertPath}
      {...otherProps}
    />
  );
} 