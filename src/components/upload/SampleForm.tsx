'use client';

import { useState } from 'react';
import ImageUploader from './ImageUploader';

export default function SampleForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    profileImage: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState(false);

  const handleImageUpload = (imageData: any) => {
    console.log('Image uploaded successfully:', imageData);
    setFormData({
      ...formData,
      profileImage: imageData
    });
  };

  const handleImageError = (error: string) => {
    console.error('Image upload error:', error);
    setFormError(`Image upload failed: ${error}`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);
    
    // Validate form
    if (!formData.name.trim()) {
      setFormError('Name is required');
      setIsSubmitting(false);
      return;
    }
    
    if (!formData.email.trim() || !/^\S+@\S+$/i.test(formData.email)) {
      setFormError('Valid email is required');
      setIsSubmitting(false);
      return;
    }
    
    if (!formData.profileImage) {
      setFormError('Profile image is required');
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Form submitted with data:', formData);
      
      // Show success message
      setFormSuccess(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          profileImage: null
        });
        setFormSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error('Form submission error:', error);
      setFormError('An error occurred while submitting the form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Sample Form with Image Upload</h2>
      
      {formSuccess && (
        <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-md">
          Form submitted successfully! The page will reset in a moment.
        </div>
      )}
      
      {formError && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
          {formError}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSubmitting || formSuccess}
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSubmitting || formSuccess}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Profile Image
          </label>
          <ImageUploader
            onUploadComplete={handleImageUpload}
            onError={handleImageError}
            buttonText="Upload Profile Image"
            maxWidth="100%"
          />
          {formData.profileImage && (
            <div className="mt-2 text-sm text-green-600">
              ✓ Image uploaded successfully
            </div>
          )}
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting || formSuccess || !formData.profileImage}
          className={`w-full py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isSubmitting || formSuccess || !formData.profileImage
              ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Form'}
        </button>
      </form>
    </div>
  );
} 