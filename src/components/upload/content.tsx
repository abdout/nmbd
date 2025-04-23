'use client';

import { useState, useRef } from 'react';
import { handleImageUpload } from './action';
import Image from 'next/image';

export default function UploadContent() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File selected');
    const selectedFile = e.target.files?.[0];
    
    if (!selectedFile) {
      console.log('No file selected');
      return;
    }
    
    // Validate file type
    if (!selectedFile.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }
    
    // Reset error state
    setError(null);
    setFile(selectedFile);
    
    // Create a preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
    
    console.log(`File selected: ${selectedFile.name}, size: ${selectedFile.size} bytes, type: ${selectedFile.type}`);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file');
      return;
    }
    
    try {
      setUploading(true);
      console.log('Starting upload...');
      
      const formData = new FormData();
      formData.append('file', file);
      
      // Add user ID if available
      // const userId = 'user-id-here'; // Replace with actual user ID
      // formData.append('userId', userId);
      
      const result = await handleImageUpload(formData);
      
      if (result.success && result.image) {
        console.log('Upload successful:', result.image);
        setUploadedImage(result.image);
      } else {
        console.error('Upload failed:', result.error);
        
        // Special error handling for environment variable issues
        if (result.error && result.error.includes('ImageKit is not properly initialized')) {
          setError('Server configuration error: Missing ImageKit credentials. Please check the .env.local file and ensure NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, and NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT are set.');
        } else {
          setError(result.error || 'Upload failed');
        }
      }
    } catch (err) {
      console.error('Error during upload:', err);
      
      // Handle initialization errors
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      if (errorMessage.includes('ImageKit') || errorMessage.includes('environment')) {
        setError('Error: ImageKit is not properly configured. Please check your environment variables in .env.local');
      } else {
        setError(errorMessage);
      }
    } finally {
      setUploading(false);
    }
  };

  // Reset the form
  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setError(null);
    setUploadedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Helper to render environment variable error
  const renderEnvHelp = () => {
    if (error && (error.includes('ImageKit') || error.includes('environment'))) {
      return (
        <div className="mt-4 p-4 bg-yellow-50 text-yellow-800 rounded-md text-sm">
          <h3 className="font-bold mb-2">Configuration Help:</h3>
          <p className="mb-2">Add the following variables to your <code className="bg-yellow-100 px-1 rounded">.env.local</code> file:</p>
          <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
{`NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_endpoint`}
          </pre>
          <p className="mt-2">Create an account at <a href="https://imagekit.io/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">ImageKit.io</a> to obtain these values.</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Upload Image</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
            {renderEnvHelp()}
          </div>
        )}
        
        {uploadedImage ? (
          <div className="mb-6 text-center">
            <div className="mb-4">
              <Image 
                src={uploadedImage.url} 
                alt="Uploaded image" 
                width={300} 
                height={300}
                className="mx-auto rounded-md object-contain"
              />
            </div>
            <div className="text-sm mb-4">
              <p><strong>URL:</strong> <a href={uploadedImage.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 break-all">{uploadedImage.url}</a></p>
              <p><strong>File ID:</strong> {uploadedImage.fileId}</p>
              <p><strong>File Name:</strong> {uploadedImage.fileName}</p>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Upload Another Image
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
              {preview ? (
                <div className="mb-4">
                  <Image 
                    src={preview} 
                    alt="Preview" 
                    width={300} 
                    height={300}
                    className="mx-auto rounded-md object-contain"
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
                onChange={handleFileChange}
                accept="image/*"
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
            
            <button
              type="submit"
              disabled={!file || uploading}
              className={`w-full py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                !file || uploading
                  ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {uploading ? 'Uploading...' : 'Upload Image'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
