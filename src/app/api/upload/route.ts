import { NextRequest, NextResponse } from 'next/server';
import { uploadToImageKit, saveImageToDatabase } from '@/components/upload/action';

export async function POST(req: NextRequest) {
  console.log('Received upload request');
  
  try {
    // Get the content type
    const contentType = req.headers.get('content-type') || '';
    console.log(`Content-Type: ${contentType}`);
    
    // If it's FormData, use the built-in formData() method
    if (contentType.includes('multipart/form-data')) {
      console.log('Processing as multipart form data');
      const formData = await req.formData();
      
      const file = formData.get('file') as File;
      // Extract userId but comment it out since it's not used yet
      // const userId = formData.get('userId') as string;
      
      if (!file) {
        console.error('No file in request');
        return NextResponse.json(
          { error: 'No file provided' },
          { status: 400 }
        );
      }
      
      console.log(`Processing file: ${file.name}, size: ${file.size} bytes`);
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        console.error(`Invalid file type: ${file.type}`);
        return NextResponse.json(
          { error: 'Only image files are allowed' },
          { status: 400 }
        );
      }
      
      // Validate file size (limit to 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        console.error(`File too large: ${file.size} bytes`);
        return NextResponse.json(
          { error: 'File size exceeds the 10MB limit' },
          { status: 400 }
        );
      }
      
      // Upload to ImageKit
      const imageKitResponse = await uploadToImageKit(file);
      
      // Save to database - Note: userId is needed here but commented out
      // const savedImage = await saveImageToDatabase(imageKitResponse, userId);
      const savedImage = await saveImageToDatabase(imageKitResponse);
      
      console.log('Upload completed successfully');
      return NextResponse.json({ 
        success: true, 
        image: savedImage 
      });
    } else if (contentType.includes('application/json')) {
      // Handle JSON payloads (e.g. for URL uploads from external sources)
      console.log('Processing as JSON payload');
      
      const body = await req.json();
      const { imageUrl } = body; // Removed unused userId
      
      if (!imageUrl) {
        console.error('No image URL provided');
        return NextResponse.json(
          { error: 'No image URL provided' },
          { status: 400 }
        );
      }
      
      // Here you would implement logic to download the image from the URL
      // and then upload it to ImageKit
      
      // For now, return an error
      return NextResponse.json(
        { error: 'URL uploads not implemented yet' },
        { status: 501 }
      );
    }
    
    // Not supported content type
    console.error('Unsupported content type');
    return NextResponse.json(
      { error: 'Unsupported content type' },
      { status: 415 }
    );
  } catch (error) {
    console.error('Error processing upload:', error);
    return NextResponse.json(
      { 
        error: 'Upload failed', 
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
