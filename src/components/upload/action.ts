'use server';

import { db } from '@/lib/db';
import ImageKit from 'imagekit';
import { revalidatePath } from 'next/cache';

// Check for required environment variables - Use the correct variable names
const IMAGEKIT_PUBLIC_KEY = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
const IMAGEKIT_PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY;
const IMAGEKIT_URL_ENDPOINT = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

if (!IMAGEKIT_PUBLIC_KEY || !IMAGEKIT_PRIVATE_KEY || !IMAGEKIT_URL_ENDPOINT) {
  console.error('Missing required ImageKit environment variables:',
    !IMAGEKIT_PUBLIC_KEY ? 'NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY' : '',
    !IMAGEKIT_PRIVATE_KEY ? 'IMAGEKIT_PRIVATE_KEY' : '',
    !IMAGEKIT_URL_ENDPOINT ? 'NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT' : ''
  );
}

// Initialize ImageKit with proper error handling
let imagekit: ImageKit;
try {
  imagekit = new ImageKit({
    publicKey: IMAGEKIT_PUBLIC_KEY || '',
    privateKey: IMAGEKIT_PRIVATE_KEY || '',
    urlEndpoint: IMAGEKIT_URL_ENDPOINT || ''
  });
} catch (error) {
  console.error('Failed to initialize ImageKit:', error);
}

// Type for the ImageKit upload response
export type ImageKitResponse = {
  url: string;
  fileId: string;
  name: string;
  filePath?: string;
  thumbnailUrl?: string;
  size?: number;
  width?: number;
  height?: number;
  fileType?: string;
  [key: string]: any;
};

// Valid image MIME types
const VALID_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'image/avif'
];

// Maximum file size (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

/**
 * Uploads an image to ImageKit
 * @param file - The file to upload
 * @returns Promise with the ImageKit response
 */
export async function uploadToImageKit(file: File): Promise<ImageKitResponse> {
  console.log(`Starting upload to ImageKit for file: ${file.name}`);
  
  try {
    // Check if ImageKit is properly initialized
    if (!imagekit) {
      throw new Error('ImageKit is not properly initialized. Please check your environment variables.');
    }
    
    // Validate file type
    if (!VALID_IMAGE_TYPES.includes(file.type)) {
      throw new Error(`Invalid file type: ${file.type}. Allowed types: ${VALID_IMAGE_TYPES.join(', ')}`);
    }
    
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File too large: ${file.size} bytes. Maximum allowed: ${MAX_FILE_SIZE} bytes`);
    }
    
    // Convert File to Buffer
    const buffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(buffer);
    
    console.log(`File converted to buffer, size: ${fileBuffer.length} bytes`);
    
    // Upload to ImageKit
    const uploadResult = await imagekit.upload({
      file: fileBuffer,
      fileName: file.name,
      useUniqueFileName: true
    });
    
    console.log(`Successfully uploaded to ImageKit, fileId: ${uploadResult.fileId}`);
    
    return uploadResult;
  } catch (error) {
    console.error('Error uploading to ImageKit:', error);
    throw new Error(`Failed to upload image to ImageKit: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Saves image information to the database
 * @param imageData - The ImageKit response data
 * @param userId - The ID of the user uploading the image (optional)
 * @returns Promise with the created database record
 */
export async function saveImageToDatabase(imageData: ImageKitResponse, userId?: string) {
  console.log(`Saving image to database for fileId: ${imageData.fileId}`);
  
  try {
    // Validate required fields
    if (!imageData.url || !imageData.fileId || !imageData.name) {
      throw new Error('Missing required image data (url, fileId, or name)');
    }
    
    const image = await db.image.create({
      data: {
        url: imageData.url,
        fileId: imageData.fileId,
        fileName: imageData.name,
        filePath: imageData.filePath,
        thumbnailUrl: imageData.thumbnailUrl,
        size: imageData.size,
        width: imageData.width,
        height: imageData.height,
        format: imageData.fileType,
        userId: userId || undefined
      }
    });
    
    console.log(`Image saved to database with id: ${image.id}`);
    return image;
  } catch (error) {
    console.error('Error saving image to database:', error);
    throw new Error(`Failed to save image to database: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Handles the complete image upload process
 * @param formData - The form data containing the file
 * @returns Promise with the saved image data
 */
export async function handleImageUpload(formData: FormData) {
  console.log('Starting handleImageUpload process');
  
  try {
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string || undefined;
    
    if (!file) {
      console.error('No file provided in form data');
      throw new Error('No file provided');
    }
    
    console.log(`Processing file: ${file.name}, size: ${file.size} bytes, type: ${file.type}`);
    
    if (!file.type.startsWith('image/')) {
      console.error(`Invalid file type: ${file.type}`);
      throw new Error('Only image files are allowed');
    }
    
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      console.error(`File too large: ${file.size} bytes`);
      throw new Error(`File size exceeds the ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`);
    }
    
    // Upload to ImageKit
    const imageKitResponse = await uploadToImageKit(file);
    
    // Save to database
    const savedImage = await saveImageToDatabase(imageKitResponse, userId);
    
    // Revalidate the path to refresh data
    revalidatePath('/upload');
    
    console.log('Image upload process completed successfully');
    return { success: true, image: savedImage };
  } catch (error) {
    console.error('Error in handleImageUpload:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred during upload' 
    };
  }
}
