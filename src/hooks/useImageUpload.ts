'use client';

import { useState } from 'react';
import { handleImageUpload } from '@/components/upload/action';

export type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

export function useImageUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<any>(null);
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    if (!selectedFile.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }
    
    setError(null);
    setFile(selectedFile);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const upload = async (additionalData?: Record<string, string>) => {
    if (!file) {
      setError('Please select a file');
      return null;
    }
    
    try {
      setStatus('uploading');
      
      const formData = new FormData();
      formData.append('file', file);
      
      // Add any additional form data
      if (additionalData) {
        Object.entries(additionalData).forEach(([key, value]) => {
          formData.append(key, value);
        });
      }
      
      const result = await handleImageUpload(formData);
      
      if (result.success && result.image) {
        setUploadedImage(result.image);
        setStatus('success');
        return result.image;
      } else {
        setError(result.error || 'Upload failed');
        setStatus('error');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      setStatus('error');
      return null;
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setUploadedImage(null);
    setStatus('idle');
    setError(null);
  };

  return {
    file,
    preview,
    uploadedImage,
    status,
    error,
    handleFileChange,
    upload,
    reset,
    isUploading: status === 'uploading',
    isSuccess: status === 'success',
    isError: status === 'error'
  };
} 