'use client';

import React from 'react';
import OptimizedImage from './optimum-image';

export default function ImageKitExample() {
  return (
    <div className="space-y-8 p-4">
      <h1>ImageKit Integration Example</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Example 1: Basic usage with debug mode enabled */}
        <div className="space-y-2">
          <h2>Debug Mode (Placeholder Image)</h2>
          <p className="muted">
            Using the c.jpg from ImageKit for all images during development
          </p>
          <div className="border p-4 rounded-lg">
            <OptimizedImage
              src="/path/to/nonexistent-image.jpg"
              alt="Debug mode example"
              width={400}
              height={300}
              className="rounded-md"
              debug={true}
            />
          </div>
        </div>
        
        {/* Example 2: Basic usage with real image */}
        <div className="space-y-2">
          <h2>Normal Mode (Actual Image)</h2>
          <p className="muted">
            Using the actual image path from ImageKit
          </p>
          <div className="border p-4 rounded-lg">
            <OptimizedImage
              src="/article/c.jpg"
              alt="Normal mode example"
              width={400}
              height={300}
              className="rounded-md"
              debug={false} /* Explicitly disable debug mode */
            />
          </div>
        </div>
        
        {/* Example 3: With transformations */}
        <div className="space-y-2">
          <h2>With Transformations</h2>
          <p className="muted">
            Applying gray effect and border radius
          </p>
          <div className="border p-4 rounded-lg">
            <OptimizedImage
              src="/article/c.jpg"
              alt="Transformed image example"
              width={400}
              height={300}
              className="rounded-md"
              transformations={[
                { grayscale: true },
                { radius: 20 }
              ]}
            />
          </div>
        </div>
        
        {/* Example 4: External image with web proxy */}
        <div className="space-y-2">
          <h2>External Image</h2>
          <p className="muted">
            Using ImageKit's web proxy for external images
          </p>
          <div className="border p-4 rounded-lg">
            <OptimizedImage
              src="https://picsum.photos/400/300"
              alt="External image example"
              width={400}
              height={300}
              className="rounded-md"
              convertPath={false} // No need to convert external URLs
            />
          </div>
        </div>
        
        {/* Example 5: Responsive image */}
        <div className="space-y-2">
          <h2>Responsive Image</h2>
          <p className="muted">
            Fill container with appropriate sizes attribute
          </p>
          <div className="border p-4 rounded-lg">
            <div className="relative h-[300px]">
              <OptimizedImage
                src="/article/c.jpg"
                alt="Responsive image example"
                fill={true}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="rounded-md"
                objectFit="cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 