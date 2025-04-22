import { buildSrc, type Transformation, type SrcOptions } from '@imagekit/next';
import { imageKitConfig } from './image-kit';

/**
 * Generate an optimized image URL with ImageKit transformations
 */
export function getOptimizedImageUrl(
  src: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'auto' | 'webp' | 'jpg' | 'png' | 'avif';
    blur?: number;
    grayscale?: boolean;
    transformations?: Transformation[];
  } = {}
): string {
  const {
    width,
    height,
    quality = 80,
    format = 'auto',
    blur,
    grayscale,
    transformations = [],
  } = options;

  const defaultTransformations: Transformation[] = [];

  if (width) defaultTransformations.push({ width: width.toString() });
  if (height) defaultTransformations.push({ height: height.toString() });
  if (quality) defaultTransformations.push({ quality: quality.toString() });
  if (format) defaultTransformations.push({ format });
  if (blur) defaultTransformations.push({ blur: blur.toString() });
  if (grayscale) defaultTransformations.push({ effectGray: true });

  const allTransformations = [...defaultTransformations, ...transformations];

  const srcOptions: SrcOptions = {
    src,
    transformation: allTransformations,
    transformationPosition: 'query',
    urlEndpoint: imageKitConfig.urlEndpoint,
  };

  return buildSrc(srcOptions);
}

/**
 * Get placeholder blur data URL for an image
 */
export function getBlurDataUrl(
  src: string,
  width = 10,
  quality = 40
): string {
  return getOptimizedImageUrl(src, {
    width,
    quality,
    blur: 10,
  });
}

/**
 * Format image sources for local or remote paths
 */
export function formatImageSrc(src: string): string {
  // Handle absolute URLs (remote images)
  if (src.startsWith('http')) {
    return `/${src}`;
  }
  
  // Handle relative URLs without leading slash
  if (!src.startsWith('/')) {
    return `/${src}`;
  }
  
  return src;
}

/**
 * Generate srcSet for responsive images
 */
export function generateSrcSet(
  src: string,
  widths: number[] = [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  quality = 80
): string {
  return widths
    .map(
      (width) =>
        `${getOptimizedImageUrl(src, { width, quality })} ${width}w`
    )
    .join(', ');
}

/**
 * Convert public paths to ImageKit paths
 * Replace numeric characters with letters (1=a, 2=b, etc.)
 */
export function convertToImageKitPath(imagePath: string): string {
  // If the path already starts with 'http', it's an external URL, use web proxy format
  if (imagePath.startsWith('http')) {
    return `/${imagePath}`;
  }
  
  // For local paths, apply the digit-to-letter transformation
  let transformedPath = imagePath;
  
  // Handle JPG files
  transformedPath = transformedPath.replace(/\/(\d+)\.jpg/g, (match, number) => {
    const letters = number.split('').map(digit => {
      const charCode = 'a'.charCodeAt(0) + parseInt(digit, 10) - 1;
      return String.fromCharCode(charCode);
    }).join('');
    
    return `/${letters}.jpg`;
  });
  
  // Handle PNG files
  transformedPath = transformedPath.replace(/\/(\d+)\.png/g, (match, number) => {
    const letters = number.split('').map(digit => {
      const charCode = 'a'.charCodeAt(0) + parseInt(digit, 10) - 1;
      return String.fromCharCode(charCode);
    }).join('');
    
    return `/${letters}.png`;
  });
  
  // Handle AVIF files
  transformedPath = transformedPath.replace(/\/(\d+)\.avif/g, (match, number) => {
    const letters = number.split('').map(digit => {
      const charCode = 'a'.charCodeAt(0) + parseInt(digit, 10) - 1;
      return String.fromCharCode(charCode);
    }).join('');
    
    return `/${letters}.avif`;
  });
  
  return transformedPath;
} 