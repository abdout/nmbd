'use client';

import { useState } from 'react';
import { handleImageUpload } from '@/components/upload/action';

export type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

export function useImageUpload() {
  console.log("[useImageUpload] Hook initialized");
  
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<any>(null);
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("[useImageUpload] File input change event");
    
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) {
      console.log("[useImageUpload] No file selected");
      return;
    }
    
    console.log("[useImageUpload] File selected:", {
      name: selectedFile.name,
      type: selectedFile.type,
      size: selectedFile.size
    });
    
    if (!selectedFile.type.startsWith('image/')) {
      console.error("[useImageUpload] Invalid file type:", selectedFile.type);
      setError('Please select an image file');
      return;
    }
    
    setError(null);
    setFile(selectedFile);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      console.log("[useImageUpload] Preview created");
      setPreview(reader.result as string);
    };
    reader.onerror = (err) => {
      console.error("[useImageUpload] Error creating preview:", err);
      setError('Failed to create image preview');
    };
    reader.readAsDataURL(selectedFile);
  };

  const upload = async (additionalData?: Record<string, string>) => {
    console.log("[useImageUpload] Upload started", { additionalData });
    
    if (!file) {
      console.error("[useImageUpload] No file to upload");
      setError('Please select a file');
      return null;
    }
    
    try {
      setStatus('uploading');
      console.log("[useImageUpload] Status set to uploading");
      
      const formData = new FormData();
      formData.append('file', file);
      
      // Add any additional form data
      if (additionalData) {
        Object.entries(additionalData).forEach(([key, value]) => {
          formData.append(key, value);
        });
      }
      
      console.log("[useImageUpload] Calling handleImageUpload server action");
      const result = await handleImageUpload(formData);
      console.log("[useImageUpload] Server action result:", result);
      
      if (result.success && result.image) {
        console.log("[useImageUpload] Upload successful, image data:", result.image);
        setUploadedImage(result.image);
        setStatus('success');
        return result.image;
      } else {
        console.error("[useImageUpload] Upload failed:", result.error);
        setError(result.error || 'Upload failed');
        setStatus('error');
        return null;
      }
    } catch (err) {
      console.error("[useImageUpload] Exception during upload:", err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      setStatus('error');
      return null;
    }
  };

  const reset = () => {
    console.log("[useImageUpload] Resetting state");
    setFile(null);
    setPreview(null);
    setUploadedImage(null);
    setStatus('idle');
    setError(null);
  };

  const isUploading = status === 'uploading';

  console.log("[useImageUpload] Current state:", {
    hasFile: !!file,
    hasPreview: !!preview,
    hasUploadedImage: !!uploadedImage,
    status,
    error
  });

  return {
    file,
    preview,
    uploadedImage,
    status,
    error,
    isUploading,
    handleFileChange,
    upload,
    reset
  };
} 