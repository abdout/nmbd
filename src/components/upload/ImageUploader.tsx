'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useImageUpload } from '@/hooks/useImageUpload';

export type ImageUploaderProps = {
  onUploadComplete?: (imageData: any) => void;
  onError?: (error: string) => void;
  className?: string;
  maxWidth?: string;
  buttonText?: string;
  allowedTypes?: string[];
};

export default function ImageUploader({ 
  onUploadComplete, 
  onError,
  className = '',
  maxWidth = '400px',
  buttonText = 'Upload Image',
  allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
}: ImageUploaderProps) {
  console.log("[ImageUploader] Component initialized");
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { 
    preview, 
    error, 
    status, 
    handleFileChange, 
    upload, 
    reset,
    isUploading
  } = useImageUpload();

  console.log("[ImageUploader] Current state:", { preview, error, status, isUploading });

  const handleUpload = async () => {
    console.log("[ImageUploader] Starting upload process");
    try {
      const result = await upload();
      console.log("[ImageUploader] Upload result:", result);
      
      if (result && onUploadComplete) {
        console.log("[ImageUploader] Calling onUploadComplete with result:", result);
        onUploadComplete(result);
      } else if (!result && onError && error) {
        console.error("[ImageUploader] Upload failed, calling onError with:", error);
        onError(error);
      }
    } catch (err) {
      console.error("[ImageUploader] Exception during upload:", err);
      if (onError) {
        onError(err instanceof Error ? err.message : "Unknown upload error");
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("[ImageUploader] File selected");
    handleFileChange(e);
  };

  return (
    <div className={`image-uploader ${className}`} style={{ maxWidth }}>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
        {preview ? (
          <div className="mb-4">
            <Image 
              src={preview} 
              alt="Preview" 
              width={300} 
              height={300}
              className="mx-auto rounded-md object-contain"
              onLoad={() => console.log("[ImageUploader] Preview image loaded successfully")}
              onError={(e) => console.error("[ImageUploader] Preview image failed to load:", e)}
            />
          </div>
        ) : (
          <div className="py-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="mt-2 text-sm text-gray-600">Click to select or drag and drop an image</p>
          </div>
        )}
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept={allowedTypes.join(',')}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="mt-2 inline-block cursor-pointer rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
        >
          {preview ? 'Change Image' : 'Select Image'}
        </label>
      </div>
      
      {preview && (
        <div className="mt-4 flex justify-between">
          <button
            type="button"
            onClick={() => {
              console.log("[ImageUploader] Reset clicked");
              reset();
            }}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleUpload}
            disabled={isUploading}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              isUploading
                ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isUploading ? 'Uploading...' : buttonText}
          </button>
        </div>
      )}
    </div>
  );
} 