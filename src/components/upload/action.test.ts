// Mock the ImageKit SDK
jest.mock('imagekit', () => {
  return jest.fn().mockImplementation(() => {
    return {
      upload: jest.fn().mockResolvedValue({
        url: 'https://ik.imagekit.io/test/sample.jpg',
        fileId: 'test-file-id',
        name: 'test-file.jpg',
        filePath: '/test-path',
        thumbnailUrl: 'https://ik.imagekit.io/test/sample_thumbnail.jpg',
        size: 12345,
        width: 800,
        height: 600,
        fileType: 'image/jpeg'
      })
    };
  });
});

// Mock the database
jest.mock('../../lib/db', () => ({
  db: {
    image: {
      create: jest.fn().mockResolvedValue({
        id: 'test-image-id',
        url: 'https://ik.imagekit.io/test/sample.jpg',
        fileId: 'test-file-id',
        fileName: 'test-file.jpg'
      })
    }
  }
}));

import { uploadToImageKit, saveImageToDatabase } from './action';

describe('Image Upload Functionality', () => {
  let mockFile: File;
  
  beforeEach(() => {
    // Create a mock File object
    const blob = new Blob(['test file content'], { type: 'image/jpeg' });
    mockFile = new File([blob], 'test-image.jpg', { type: 'image/jpeg' });
    
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should upload an image to ImageKit', async () => {
    const result = await uploadToImageKit(mockFile);
    
    expect(result).toBeTruthy();
    expect(result.url).toBe('https://ik.imagekit.io/test/sample.jpg');
    expect(result.fileId).toBe('test-file-id');
    expect(result.name).toBe('test-file.jpg');
  });

  it('should save image information to the database', async () => {
    const imageKitResponse = {
      url: 'https://ik.imagekit.io/test/sample.jpg',
      fileId: 'test-file-id',
      name: 'test-file.jpg',
      filePath: '/test-path',
      thumbnailUrl: 'https://ik.imagekit.io/test/sample_thumbnail.jpg',
      size: 12345,
      width: 800,
      height: 600,
      fileType: 'image/jpeg'
    };
    
    const userId = 'test-user-id';
    
    const result = await saveImageToDatabase(imageKitResponse, userId);
    
    expect(result).toBeTruthy();
    expect(result.url).toBe('https://ik.imagekit.io/test/sample.jpg');
    expect(result.fileId).toBe('test-file-id');
    expect(result.fileName).toBe('test-file.jpg');
  });

  it('should handle upload and database operations together', async () => {
    const userId = 'test-user-id';
    
    // Test the full flow from upload to database save
    const uploadResult = await uploadToImageKit(mockFile);
    const dbResult = await saveImageToDatabase(uploadResult, userId);
    
    expect(uploadResult.url).toBe('https://ik.imagekit.io/test/sample.jpg');
    expect(dbResult.id).toBe('test-image-id');
    expect(dbResult.url).toBe(uploadResult.url);
    expect(dbResult.fileId).toBe(uploadResult.fileId);
  });
}); 