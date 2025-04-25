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

  if (width) defaultTransformations.push({ width });
  if (height) defaultTransformations.push({ height });
  if (quality) defaultTransformations.push({ quality });
  if (format) defaultTransformations.push({ format });
  if (blur) defaultTransformations.push({ blur });
  if (grayscale) defaultTransformations.push({ grayscale: true });

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
    return src; // Return the URL unchanged for external URLs
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
  console.log("[convertToImageKitPath] Converting path:", imagePath);
  
  // If the path already starts with 'http', it's an external URL, return it as is
  if (imagePath.startsWith('http')) {
    console.log("[convertToImageKitPath] External URL detected, using as is:", imagePath);
    return imagePath; // Return the URL unchanged, without adding a leading slash
  }
  
  // For local paths, apply the digit-to-letter transformation
  let transformedPath = imagePath;
  
  // Handle JPG files
  transformedPath = transformedPath.replace(/\/(\d+)\.jpg/g, (match, number) => {
    const letters = number.split('').map((digit: string) => {
      const charCode = 'a'.charCodeAt(0) + parseInt(digit, 10) - 1;
      return String.fromCharCode(charCode);
    }).join('');
    
    return `/${letters}.jpg`;
  });
  
  // Handle PNG files
  transformedPath = transformedPath.replace(/\/(\d+)\.png/g, (match, number) => {
    const letters = number.split('').map((digit: string) => {
      const charCode = 'a'.charCodeAt(0) + parseInt(digit, 10) - 1;
      return String.fromCharCode(charCode);
    }).join('');
    
    return `/${letters}.png`;
  });
  
  // Handle AVIF files
  transformedPath = transformedPath.replace(/\/(\d+)\.avif/g, (match, number) => {
    const letters = number.split('').map((digit: string) => {
      const charCode = 'a'.charCodeAt(0) + parseInt(digit, 10) - 1;
      return String.fromCharCode(charCode);
    }).join('');
    
    return `/${letters}.avif`;
  });
  
  // Handle WEBP files
  transformedPath = transformedPath.replace(/\/(\d+)\.webp/g, (match, number) => {
    const letters = number.split('').map((digit: string) => {
      const charCode = 'a'.charCodeAt(0) + parseInt(digit, 10) - 1;
      return String.fromCharCode(charCode);
    }).join('');
    
    return `/${letters}.webp`;
  });
  
  console.log("[convertToImageKitPath] Final transformed path:", transformedPath);
  
  if (transformedPath === imagePath) {
    console.log("[convertToImageKitPath] Warning: Path was not transformed, might indicate an unexpected format");
  }
  
  return transformedPath;
} 