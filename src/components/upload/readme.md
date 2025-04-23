# Image Upload Feature

This feature allows users to upload images to ImageKit and save the image information in MongoDB using Prisma ORM.

## Status

✅ **Working Successfully** - Images can now be uploaded to ImageKit and metadata is saved in MongoDB.

## Quick Start: Reusable Image Upload

Follow these steps to add image upload to your application:

### Step 1: Import the ImageUploader Component

```tsx
import ImageUploader from '@/components/upload/ImageUploader';
```

### Step 2: Add the Component to Your Form

```tsx
<form onSubmit={handleSubmit}>
  {/* Other form fields */}
  
  <div className="mb-4">
    <label>Profile Picture:</label>
    <ImageUploader 
      onUploadComplete={(imageData) => {
        console.log('Image uploaded:', imageData);
        // Save image data to your form state
      }}
      onError={(error) => console.error(error)}
    />
  </div>
  
  <button type="submit">Submit</button>
</form>
```

### Step 3: Use Uploaded Image Data

The `onUploadComplete` callback receives the complete image data:

```tsx
{
  id: "64f9a7d12fba5678c2a9b123", // MongoDB ID
  url: "https://ik.imagekit.io/youraccount/image.jpg", // Direct image URL
  fileId: "64f9a7d12fba5678c2a9b456", // ImageKit file ID
  fileName: "profile-picture.jpg",
  // ... other metadata
}
```

## Supported File Types

By default, the uploader supports these file types:
- JPEG (image/jpeg)
- PNG (image/png)
- GIF (image/gif)
- WebP (image/webp)
- SVG (image/svg+xml)

To support additional file types like AVIF, you need to:

1. Add AVIF to the allowed types in the ImageUploader component:

```tsx
<ImageUploader 
  allowedTypes={['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/avif']}
  onUploadComplete={handleImageUpload}
  onError={handleError}
/>
```

2. Update the validation in the server action (src/components/upload/action.ts):

```typescript
// Valid image MIME types
const VALID_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'image/avif'  // Add AVIF support
];
```

## Advanced Usage: Custom Hook

For more control over the upload process, use the `useImageUpload` hook:

```tsx
import { useImageUpload } from '@/hooks/useImageUpload';

function MyCustomUploader() {
  const { 
    file, 
    preview, 
    error, 
    isUploading, 
    handleFileChange, 
    upload, 
    reset 
  } = useImageUpload();

  // Create your own UI
  return (
    <div>
      {preview && <img src={preview} alt="Preview" />}
      <input type="file" onChange={handleFileChange} />
      {error && <p className="error">{error}</p>}
      <button 
        onClick={async () => {
          const imageData = await upload({ userId: 'user123' });
          if (imageData) {
            // Handle successful upload
          }
        }} 
        disabled={isUploading || !file}
      >
        {isUploading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
}
```

## Complete Implementation Guide

### 1. Dependencies

Ensure you have the required environment variables:

```
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_endpoint
MONGODB_URI=your_mongodb_uri
```

Install necessary packages:

```bash
pnpm add imagekit formidable@v3
```

### 2. The ImageUploader Component

The reusable component accepts these props:

```tsx
type ImageUploaderProps = {
  onUploadComplete?: (imageData: any) => void; // Called with uploaded image data
  onError?: (error: string) => void;           // Called when upload fails
  className?: string;                          // Additional CSS classes
  maxWidth?: string;                           // Max width of the uploader (default: '400px')
  buttonText?: string;                         // Custom upload button text
  allowedTypes?: string[];                     // Allowed MIME types (default: jpeg, png, gif, webp)
};
```

### 3. Integration Examples

#### Basic Usage

```tsx
<ImageUploader 
  onUploadComplete={(image) => console.log(image.url)} 
/>
```

#### With Custom Styling

```tsx
<ImageUploader 
  className="my-custom-uploader"
  maxWidth="300px"
  buttonText="Upload Profile Picture"
  allowedTypes={['image/jpeg', 'image/png']}
  onUploadComplete={handleImageUpload}
  onError={handleImageError}
/>
```

#### Supporting AVIF Images

```tsx
<ImageUploader 
  allowedTypes={[
    'image/jpeg', 
    'image/png', 
    'image/gif', 
    'image/webp', 
    'image/svg+xml',
    'image/avif'
  ]}
  onUploadComplete={handleImageUpload}
  onError={handleImageError}
/>
```

#### With React Hook Form

```tsx
import { useForm } from 'react-hook-form';

function ProfileForm() {
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      name: '',
      profileImage: null
    }
  });
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} />
      
      <ImageUploader 
        onUploadComplete={(imageData) => {
          setValue('profileImage', imageData);
        }}
      />
      
      {watch('profileImage') && (
        <p>Image uploaded successfully!</p>
      )}
      
      <button type="submit">Submit</button>
    </form>
  );
}
```

### 4. Sample Form

We've included a complete sample form implementation at:
- `/upload/sample-form` - Visit this route to see the sample form in action
- `src/components/upload/SampleForm.tsx` - Reference implementation

## Implementation Details

### Database Schema

The `Image` model in the Prisma schema includes:
- `id`: Unique identifier
- `url`: URL of the uploaded image
- `fileId`: ImageKit file ID
- `fileName`: Original file name
- `filePath`: File path in ImageKit
- `thumbnailUrl`: Thumbnail URL (if available)
- `size`: File size in bytes
- `width`: Image width
- `height`: Image height
- `format`: Image format/type
- `tags`: Array of tags for the image
- `userId`: Optional relation to the user who uploaded the image
- `createdAt`: When the record was created
- `updatedAt`: When the record was last updated

### Server Actions

- `uploadToImageKit`: Uploads an image to ImageKit
- `saveImageToDatabase`: Saves image information to MongoDB
- `handleImageUpload`: Combines both operations for a complete upload flow

### API Endpoints

- `POST /api/upload`: Handles image uploads via API

### UI Components

- `UploadContent`: Client-side React component for image upload with preview and validation
- `UploadPage`: Page component that renders the upload UI
- `ImageUploader`: Reusable component that can be embedded in any form
- `useImageUpload`: Custom React hook for managing image upload state

### Validation

- File type validation (only specific image types allowed: jpeg, png, gif, webp, svg+xml)
- File size validation (max 10MB)
- Required fields validation for database storage

## Troubleshooting

### Common Issues

1. **Upload fails with "ImageKit is not properly initialized"**
   - Check your environment variables in `.env.local`
   - Make sure they use the correct names: `NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY`, `IMAGEKIT_PRIVATE_KEY`, and `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT`

2. **File type not supported (e.g., "Invalid file type: image/avif")**
   - By default, the uploader accepts only jpeg, png, gif, webp, and svg+xml
   - To support additional types like AVIF, modify both:
     - Client-side: Pass custom `allowedTypes` to the ImageUploader component
     - Server-side: Update the `VALID_IMAGE_TYPES` array in `src/components/upload/action.ts`

3. **File size too large**
   - Maximum file size is 10MB by default
   - Check server logs for detailed error information

### Debugging Tips

- The ImageUploader component shows error messages for common issues
- Check browser console for detailed logs
- On the server, logs provide information about ImageKit operations and database storage
- Test with a small jpeg file if you're having issues with other formats
