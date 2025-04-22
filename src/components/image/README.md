# Image Optimization with Next.js and ImageKit

This document outlines our image optimization strategy using Next.js and ImageKit integration. It serves as a comprehensive reference and implementation guide for best practices in image delivery.

## Table of Contents

1. [Implementation Status](#implementation-status)
2. [Setup Process](#setup-process)
3. [OptimizedImage Component](#optimizedimage-component)
4. [Debug Mode](#debug-mode)
5. [Usage Examples](#usage-examples)
6. [Optimization Strategies](#optimization-strategies)
7. [Best Practices](#best-practices)
8. [Performance Comparison](#performance-comparison)
9. [Troubleshooting](#troubleshooting)

## Implementation Status

- [x] Install ImageKit Next.js SDK
- [x] Create ImageKit configuration
- [x] Integrate with Site Layout
- [x] Create optimized image components
- [x] Create usage examples
- [x] Document implementation
- [x] Implement debug mode for development
- [ ] Migrate existing image assets to ImageKit
- [ ] Set up image upload procedures
- [ ] Create CI/CD image optimization workflows
- [ ] Implement responsive image patterns for all templates

## Setup Process

### 1. Installation

```bash
# Using npm
npm install @imagekit/next

# Using yarn
yarn add @imagekit/next

# Using pnpm
pnpm add @imagekit/next
```

### 2. Configuration

Created an ImageKit configuration wrapper in `src/lib/imagekit.tsx`:

```tsx
'use client';

import { ImageKitProvider } from '@imagekit/next';
import { ReactNode } from 'react';

export const imageKitConfig = {
  urlEndpoint: "https://ik.imagekit.io/abdout"
};

export function ImageKitWrapper({ children }: { children: ReactNode }) {
  return (
    <ImageKitProvider 
      urlEndpoint={imageKitConfig.urlEndpoint}
      transformationPosition="query"
    >
      {children}
    </ImageKitProvider>
  );
}
```

### 3. App Integration

Integrated ImageKit with the site layout component in `src/app/(site)/layout.tsx`:

```tsx
import type { Metadata } from "next";
import Footer from "@/components/template/footer/footer"
import TaxonomyHeader from "@/components/template/header-taxonomy/taxonomy-header"
import { ImageKitWrapper } from "@/lib/imagekit";

export const metadata: Metadata = {
  title: "الحركة الوطنية للبناء والتنمية",
  description: "حركة إصلاح اجتماعي وسياسي شامل",
};

interface AppLayoutProps {
  children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div data-wrapper="" className="px-2 md:px-8 lg:px-16 xl:px-32 2xl:px-48 border-grid flex flex-1 flex-col">
      <TaxonomyHeader />
      <ImageKitWrapper>
        <main className="flex flex-1 flex-col">{children}</main>
      </ImageKitWrapper>
      <Footer />
    </div>
  )
}
```

## OptimizedImage Component

We have created a custom `OptimizedImage` component that wraps the ImageKit Image component with sensible defaults and additional features. The component is located at `src/components/OptimizedImage.tsx`:

```tsx
'use client';

import { Image, type Transformation } from '@imagekit/next';
import { cn } from '@/lib/utils';
import { convertToImageKitPath } from '@/lib/image-utils';

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
  debug?: boolean;
}

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
  debug = false,
}: OptimizedImageProps) {
  // Common transformations for optimization
  const defaultTransformations: Transformation[] = [
    // Convert numeric quality to string as required by ImageKit
    { quality: String(quality) },
    { format: 'auto' }
  ];

  // Combine default transformations with any custom ones
  const allTransformations = [...defaultTransformations, ...transformations];

  // Process the image src path if needed
  const processedSrc = convertPath ? convertToImageKitPath(src) : src;

  return (
    <Image
      src={processedSrc}
      alt={alt}
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
    />
  );
}
```

### Image Utilities

We have implemented various utility functions in `src/lib/image-utils.ts` to support our image optimization strategy:

```tsx
import { buildSrc, type Transformation, type SrcOptions } from '@imagekit/next';
import { imageKitConfig } from './imagekit';

/**
 * Generate an optimized image URL with ImageKit transformations
 */
export function getOptimizedImageUrl(src: string, options: {...}): string {
  // Implementation details
}

/**
 * Get placeholder blur data URL for an image
 */
export function getBlurDataUrl(src: string, width = 10, quality = 40): string {
  // Implementation details
}

/**
 * Format image sources for local or remote paths
 */
export function formatImageSrc(src: string): string {
  // Implementation details
}

/**
 * Generate srcSet for responsive images
 */
export function generateSrcSet(src: string, widths: number[] = [640, 750, 828, 1080, 1200, 1920, 2048, 3840], quality = 80): string {
  // Implementation details
}

/**
 * Convert public paths to ImageKit paths
 * Replace numeric characters with letters (1=a, 2=b, etc.)
 */
export function convertToImageKitPath(imagePath: string): string {
  // For external URLs
  if (imagePath.startsWith('http')) {
    return `/${imagePath}`;
  }
  
  // For local paths, convert numeric filenames to letter equivalents
  // e.g., /123.jpg becomes /abc.jpg
  // Implementation handles jpg, png, and avif formats
}
```

## Debug Mode

We've implemented a debug mode feature in the `OptimizedImage` component to facilitate testing and development before all images are migrated to ImageKit. 

### How Debug Mode Works

When debug mode is enabled, the component replaces all image sources with a single placeholder image from your ImageKit account, while preserving all other image properties like dimensions, transformations, and styles.

This approach allows developers to:

1. Test the ImageKit integration without having to upload all images
2. Verify transformations and optimizations are working correctly
3. Preview layouts and avoid layout shifts during development
4. Quickly identify missing images or incorrect paths

### Enabling Debug Mode

Debug mode can be enabled in two ways:

1. **Globally**: Set the `GLOBAL_DEBUG_MODE` constant to `true` in the OptimizedImage component:

   ```tsx
   // In src/components/OptimizedImage.tsx
   const GLOBAL_DEBUG_MODE = true; // Set to false in production!
   ```

2. **Per Component**: Pass the `debug` prop to individual OptimizedImage components:

   ```tsx
   <OptimizedImage
     src="/path/to/image.jpg"
     alt="Image description"
     width={400}
     height={300}
     debug={true} // Enable debug mode for just this image
   />
   ```

### Placeholder Image

Before using debug mode, you must upload a test image to your ImageKit account at the path `/article/c.jpg`. This is the image that will be used as a placeholder for all images when debug mode is active.

### Debug Information

When debug mode is active, the component adds debugging information to the image's alt text to show the original source path, which helps with debugging during development.

### Example Usage

To see debug mode in action, visit `/imagekit-demo` route in your development environment.

## Usage Examples

### 1. Basic Image Optimization

```tsx
import { Image } from '@imagekit/next';

<Image
  src="/your-image.jpg"
  alt="Description"
  width={500}
  height={300}
  transformation={[
    { quality: '80' },
    { format: 'auto' }
  ]}
/>
```

### 2. Using the OptimizedImage Component

```tsx
import OptimizedImage from '@/components/OptimizedImage';

<OptimizedImage
  src="/your-image.jpg"
  alt="Description"
  width={500}
  height={300}
  quality={85}
  priority={true}
/>
```

### 3. Using Debug Mode During Development

```tsx
import OptimizedImage from '@/components/OptimizedImage';

<OptimizedImage
  src="/path/to/not-yet-uploaded-image.jpg"
  alt="Example image"
  width={500}
  height={300}
  debug={true} // Use placeholder image
/>
```

### 4. Responsive Background Images

```tsx
<div className="relative h-[300px] w-full">
  <Image
    src="/background.jpg"
    alt="Background"
    fill
    sizes="100vw"
    responsive={true}
    transformation={[
      { quality: '80' },
      { format: 'auto' }
    ]}
    style={{ objectFit: 'cover' }}
  />
</div>
```

### 5. Advanced Transformations

```tsx
<Image
  src="/image.jpg"
  alt="Transformed image"
  width={400}
  height={300}
  transformation={[
    { width: 400 },
    { height: 300 },
    { crop: 'force' },
    { quality: '80' },
    { format: 'webp' },
    { effectGray: true },
    { radius: '15' }
  ]}
/>
```

### 6. Web Proxy for External Images

```tsx
<Image
  src="/https://example.com/external-image.jpg"
  alt="External image"
  width={400}
  height={300}
  transformation={[
    { quality: '80' },
    { format: 'auto' }
  ]}
/>
```

### 7. Using Query Parameters

```tsx
<Image
  src="/image.jpg"
  alt="Image with query parameters"
  width={400}
  height={300}
  queryParameters={{ v: "1", customParam: "value" }}
  transformation={[
    { quality: '80' },
    { format: 'auto' }
  ]}
/>
```

## Optimization Strategies

### 1. Format Optimization

We use `format: 'auto'` to automatically serve WebP or AVIF to browsers that support them while falling back to JPG/PNG for older browsers.

### 2. Quality Optimization

We use `quality: '80'` as a default which provides a good balance between visual quality and file size. For less important images, this can be lowered to 70-75.

### 3. Responsive Design

We implement responsive images using:
- The `sizes` attribute to inform the browser about image display size
- The `responsive` prop (default: true) which automatically generates srcset attributes
- A range of transformation widths for different viewport sizes
- The `fill` property for background-style images

### 4. Lazy Loading

All non-priority images use the built-in lazy loading of the Next.js Image component, which is preserved by ImageKit's implementation.

### 5. Content-Aware Cropping

For images that need cropping, we use the `crop: 'maintain_ratio'` transformation to preserve the aspect ratio while keeping the most important parts of the image.

### 6. Path Transformation

For security and optimization purposes, we convert numeric filenames to letter equivalents (e.g., `/123.jpg` becomes `/abc.jpg`). This is handled by the `convertToImageKitPath` utility function.

## Best Practices

1. **Always specify dimensions**: Provide `width` and `height` to avoid layout shifts.

2. **Use `fill` for background images**: Combined with proper container sizing.

3. **Set appropriate `sizes`**: This helps the browser choose the right image size.

4. **Use the `priority` flag**: For above-the-fold images that should preload.

5. **Use WebP/AVIF formats**: Enable automatic format conversion with `format: 'auto'`.

6. **Apply appropriate quality settings**: Lower quality for decorative images, higher for important content.

7. **Use placeholder strategies**: Implement blur or color placeholders for better UX during loading.

8. **Avoid static imports**: Do not use statically imported images with the ImageKit Image component.

9. **Use proper URL formats**: 
   - Relative paths: `/path/to/image.jpg`
   - Web proxy for external images: `/https://example.com/image.jpg`
   - Absolute URLs: Used as-is, but URL endpoint is ignored

10. **Use the OptimizedImage component**: Leverage our custom component with sensible defaults for most use cases.

11. **Use debug mode during development**: Enable debug mode when working on layouts before all images are uploaded to ImageKit.

## Performance Comparison

| Metric | Before Optimization | After ImageKit | Improvement |
|--------|---------------------|----------------|-------------|
| Total Image Size | TBD | TBD | TBD |
| Avg Load Time | TBD | TBD | TBD |
| LCP | TBD | TBD | TBD |
| CLS | TBD | TBD | TBD |

*Note: Metrics will be filled in after implementation and testing.*

## Troubleshooting

### Common Issues

1. **Images Not Displaying**
   - Verify your ImageKit URL endpoint (current: `https://ik.imagekit.io/abdout`)
   - Check if the image path is correct
   - Ensure the image exists in the specified location
   - Try enabling debug mode to see if the issue is with ImageKit configuration

2. **Poor Performance**
   - Verify transformations are being applied
   - Check network tab to confirm optimized formats are being served
   - Ensure proper sizing and responsive attributes are set

3. **Layout Shifts (CLS)**
   - Always specify width and height for images
   - Use aspect ratio boxes for responsive images
   - Implement appropriate placeholder strategies

4. **Web Proxy Issues**
   - Ensure external URLs have the proper format with a leading slash
   - Check CORS settings if accessing external images

### Debugging

Enable ImageKit debugging by setting the environment variable:

```
NEXT_PUBLIC_IMAGEKIT_DEBUG=true
```

You can also use our built-in debug mode to help with development:

```tsx
// Enable debug mode globally in src/components/OptimizedImage.tsx
const GLOBAL_DEBUG_MODE = true;

// Or enable per component
<OptimizedImage
  src="/image.jpg"
  alt="Test image"
  width={400}
  height={300}
  debug={true}
/>
```

### Error Handling for Uploads

For implementing upload functionality, use these error classes from the SDK:

```tsx
import { 
  ImageKitInvalidRequestError,
  ImageKitAbortError,
  ImageKitUploadNetworkError,
  ImageKitServerError
} from '@imagekit/next';

try {
  const result = await upload({
    file: fileToUpload,
    fileName: "my-image.jpg",
    // other options
  });
} catch (error) {
  if (error instanceof ImageKitInvalidRequestError) {
    // Handle invalid request
  } else if (error instanceof ImageKitAbortError) {
    // Handle aborted upload
  } else if (error instanceof ImageKitUploadNetworkError) {
    // Handle network error
  } else if (error instanceof ImageKitServerError) {
    // Handle server error
  }
}
```

---

## References

- [ImageKit Next.js Documentation](https://imagekit.io/docs/integration/nextjs)
- [Next.js Image Component Documentation](https://nextjs.org/docs/pages/api-reference/components/image)
- [Web Vitals Optimization Guide](https://web.dev/vitals/) 