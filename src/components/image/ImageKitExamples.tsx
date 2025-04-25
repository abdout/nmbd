'use client';

import OptimizedImage from './optimum-image';
import { Image } from '@imagekit/next';

export default function ImageKitExamples() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold mb-4">ImageKit Optimization Examples</h2>
      
      {/* Example 1: Basic Optimized Image */}
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Basic Optimized Image</h3>
        <p className="text-sm text-muted-foreground">Auto-format, quality 80, optimized delivery</p>
        <OptimizedImage 
          src="/path/to/your/image.jpg" 
          alt="Example image" 
          width={400} 
          height={300}
          className="rounded-md"
        />
      </div>
      
      {/* Example 2: Background Image with Fill */}
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Background Image (Fill)</h3>
        <p className="text-sm text-muted-foreground">Using fill property for responsive container</p>
        <div className="relative h-[300px] w-full">
          <OptimizedImage 
            src="/path/to/your/background.jpg" 
            alt="Background image" 
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="rounded-lg"
          />
        </div>
      </div>
      
      {/* Example 3: Advanced Transformations */}
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Advanced Transformations</h3>
        <p className="text-sm text-muted-foreground">Grayscale effect, crop, and rounded corners</p>
        <Image 
          src="/path/to/your/image.jpg" 
          alt="Transformed image" 
          width={400} 
          height={300}
          transformation={[
            { width: 400 },
            { height: 300 },
            { quality: 80 },
            { format: 'webp' },
            { grayscale: true },
            { radius: 15 }
          ]}
          className="border border-border"
        />
      </div>
      
      {/* Example 4: Web Proxy Example (for existing remote images) */}
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Web Proxy for Remote Images</h3>
        <p className="text-sm text-muted-foreground">Optimizing images hosted elsewhere</p>
        <Image 
          src="/https://example.com/remote-image.jpg" 
          alt="Remote image" 
          width={400} 
          height={300}
          transformation={[
            { quality: 80 },
            { format: 'auto' }
          ]}
          className="rounded-md"
        />
      </div>
      
      {/* Example 5: Responsive Image */}
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Fully Responsive Image</h3>
        <p className="text-sm text-muted-foreground">Different sizes at different breakpoints</p>
        <Image 
          src="/path/to/your/responsive-image.jpg" 
          alt="Responsive image" 
          width={1200} 
          height={800}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          transformation={[
            { quality: 80 },
            { format: 'auto' }
          ]}
          className="w-full h-auto rounded-md"
        />
      </div>
    </div>
  );
} 