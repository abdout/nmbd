'use client';

import { ImageKitProvider } from '@imagekit/next';
import { ReactNode } from 'react';

// Your ImageKit URL endpoint from your ImageKit dashboard
// Replace this with your actual ImageKit URL endpoint
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