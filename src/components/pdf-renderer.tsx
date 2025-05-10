"use client";

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

// Create a client-only component with dynamic imports to prevent SSR issues
const PDFRenderer = ({ url, width = 300, height = 400 }: {
  url: string;
  width?: number;
  height?: number;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfjsLoaded, setPdfjsLoaded] = useState(false);
  const [pdfjsLib, setPdfjsLib] = useState<any>(null);

  // Load PDF.js library dynamically only on client-side
  useEffect(() => {
    const loadPdfjs = async () => {
      try {
        // Dynamically import pdfjs only on client side
        const pdfjs = await import('pdfjs-dist');
        
        // Set up the worker source directly from node_modules
        const workerSrc = await import('pdfjs-dist/build/pdf.worker.min.mjs?url');
        pdfjs.GlobalWorkerOptions.workerSrc = workerSrc.default;
        
        setPdfjsLib(pdfjs);
        setPdfjsLoaded(true);
        console.log("PDF.js library loaded successfully");
      } catch (err) {
        console.error("Error loading PDF.js:", err);
        setError(`Failed to load PDF.js library: ${err instanceof Error ? err.message : String(err)}`);
        setLoading(false);
      }
    };

    loadPdfjs();
  }, []);

  // Handle rendering the PDF once the library is loaded
  useEffect(() => {
    if (!pdfjsLoaded || !pdfjsLib || !url) return;

    console.log("PDF.js loaded, now loading PDF:", url);

    const fetchPdfAsArrayBuffer = async (): Promise<ArrayBuffer | null> => {
      try {
        console.log("Fetching PDF as ArrayBuffer:", url);
        const response = await fetch(url);
        if (!response.ok) {
          console.error(`PDF fetch failed with status: ${response.status}`);
          return null;
        }
        return await response.arrayBuffer();
      } catch (err) {
        console.error("Error fetching PDF as ArrayBuffer:", err);
        return null;
      }
    };

    const renderPDF = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get PDF data as ArrayBuffer for most reliable loading
        const pdfData = await fetchPdfAsArrayBuffer();
        if (!pdfData) {
          throw new Error("Failed to fetch PDF data");
        }
        
        // Load PDF from ArrayBuffer
        const loadingTask = pdfjsLib.getDocument({ data: pdfData });
        const pdf = await loadingTask.promise;
        console.log("PDF loaded, pages:", pdf.numPages);
        
        await renderPage(pdf, 1);
      } catch (err) {
        console.error("Error rendering PDF:", err);
        setError(`Failed to load PDF: ${err instanceof Error ? err.message : String(err)}`);
        setLoading(false);
      }
    };
    
    // Helper function to render a specific page
    const renderPage = async (pdf: any, pageNum: number) => {
      // Get the page
      const page = await pdf.getPage(pageNum);
      
      // Prepare canvas for rendering
      const canvas = canvasRef.current;
      if (!canvas) {
        throw new Error("Canvas element not found");
      }
      
      const context = canvas.getContext('2d');
      if (!context) {
        throw new Error("Unable to get canvas context");
      }
      
      // Calculate the scale needed to fit the page within the canvas
      const viewport = page.getViewport({ scale: 1.0 });
      const scale = Math.min(
        width / viewport.width,
        height / viewport.height
      );
      
      // Scale viewport to fit our canvas size
      const scaledViewport = page.getViewport({ scale });
      
      // Set canvas dimensions to match scaled viewport
      canvas.width = scaledViewport.width;
      canvas.height = scaledViewport.height;
      
      // Render the page
      const renderContext = {
        canvasContext: context,
        viewport: scaledViewport,
      };
      
      await page.render(renderContext).promise;
      console.log("PDF page rendered successfully");
      
      setLoading(false);
    };

    renderPDF();
  }, [pdfjsLoaded, pdfjsLib, url, width, height]);

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
    <div className="pdf-canvas-container flex items-center justify-center w-full h-full overflow-hidden bg-white">
      <canvas 
        ref={canvasRef} 
        className="max-w-full max-h-full object-contain"
      />
    </div>
  );
};

// Only import on client side to avoid SSR issues
export default dynamic(() => Promise.resolve(PDFRenderer), {
  ssr: false
}); 