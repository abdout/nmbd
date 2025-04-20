'use client';

import { useEffect, useState } from 'react';
import { getImagePath } from '@/lib/utils';

export const ImageDebugInfo = () => {
  const [envInfo, setEnvInfo] = useState<{
    basePath: string;
    nodeEnv: string;
    appUrl: string;
  }>({
    basePath: '',
    nodeEnv: '',
    appUrl: '',
  });

  useEffect(() => {
    setEnvInfo({
      basePath: process.env.NEXT_PUBLIC_BASE_PATH || '(not set)',
      nodeEnv: process.env.NODE_ENV || '(not set)',
      appUrl: process.env.NEXT_PUBLIC_APP_URL || '(not set)',
    });
  }, []);

  // Example image path
  const sampleImagePath = '/placeholder-profile.png';
  const resolvedPath = getImagePath(sampleImagePath);

  return (
    <div className="bg-gray-100 p-4 rounded-md text-sm my-4">
      <h3 className="font-bold mb-2">Image Debug Info</h3>
      <div className="space-y-1">
        <p><span className="font-semibold">Environment:</span> {envInfo.nodeEnv}</p>
        <p><span className="font-semibold">Base Path:</span> {envInfo.basePath}</p>
        <p><span className="font-semibold">App URL:</span> {envInfo.appUrl}</p>
        <p><span className="font-semibold">Sample Image:</span> {sampleImagePath}</p>
        <p><span className="font-semibold">Resolved Path:</span> {resolvedPath}</p>
      </div>
    </div>
  );
}; 