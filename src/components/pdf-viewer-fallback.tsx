"use client";

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

// Simple PDF Viewer using iframe for browser's built-in PDF viewer
const PDFViewerFallback = ({ 
  url, 
  width = 300, 
  height = 400 
}: { 
  url: string; 
  width?: number; 
  height?: number; 
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if the URL exists and is accessible
  useEffect(() => {
    if (!url) {
      setError("No PDF URL provided");
      setLoading(false);
      return;
    }

    const checkUrl = async () => {
      try {
        const response = await fetch(url, { method: 'HEAD' });
        if (!response.ok) {
          throw new Error(`PDF unavailable (${response.status}: ${response.statusText})`);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error checking PDF URL:", err);
        setError(`Cannot access PDF: ${err instanceof Error ? err.message : String(err)}`);
        setLoading(false);
      }
    };

    checkUrl();
  }, [url]);

  if (loading) {
    return (
      <div className="flex items-center justify-center bg-gray-100 w-full h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-xs mt-2">Loading PDF...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center bg-gray-100 w-full h-full">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p className="text-xs mt-2 text-center max-w-full px-2">Error: {error}</p>
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="mt-2 text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
        >
          View PDF
        </a>
      </div>
    );
  }

  return (
    <div className="pdf-iframe-container w-full h-full bg-white flex items-center justify-center relative overflow-hidden">
      <iframe
        src={url}
        width={width}
        height={height}
        className="w-full h-full"
        title="PDF Viewer"
        style={{ 
          border: 'none',
          overflow: 'hidden',
          backgroundColor: 'white'
        }}
      />
    </div>
  );
};

// Only import on client side to avoid SSR issues
export default dynamic(() => Promise.resolve(PDFViewerFallback), {
  ssr: false
}); 