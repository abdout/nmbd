'use client';

import { ImageKitProvider } from '@imagekit/next';
import { ReactNode } from 'react';

// Your ImageKit URL endpoint from your ImageKit dashboard
export const imageKitConfig = {
  urlEndpoint: "https://ik.imagekit.io/abdout"
};

// Function to check if a URL is from ImageKit
export function isImageKitUrl(url: string): boolean {
  if (!url) return false;
  return url.includes('ik.imagekit.io') || url.includes('imagekit.io');
}

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