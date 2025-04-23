import { Metadata } from 'next';
import SampleForm from '@/components/upload/SampleForm';

export const metadata: Metadata = {
  title: 'Sample Form with Image Upload',
  description: 'Example form demonstrating the reusable image upload component',
};

export default function SampleFormPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Sample Form with Image Upload</h1>
      <p className="text-center text-gray-600 mb-8">
        This example demonstrates how to integrate the reusable ImageUploader component into a form.
      </p>
      <SampleForm />
    </div>
  );
} 