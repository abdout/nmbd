import { Metadata } from 'next';
import UploadContent from '@/components/upload/content';

export const metadata: Metadata = {
  title: 'Upload Image',
  description: 'Upload an image to ImageKit and store in MongoDB',
};

export default function UploadPage() {
  return <UploadContent />;
}
