import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import AdminLayout from '../../../components/AdminLayout';

export default function NewPhotoPage() {
  const router = useRouter();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    altText: '',
    caption: '',
    category: 'general',
    featured: false,
  });
  const [errors, setErrors] = useState({});
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Photo title is required';
    }
    
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }
    
    if (!selectedFile) {
      newErrors.file = 'Please select an image file';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';
      
      // First, upload the image
      const imageFormData = new FormData();
      imageFormData.append('files', selectedFile);
      
      const imageResponse = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        body: imageFormData,
      });
      
      if (!imageResponse.ok) {
        throw new Error('Failed to upload image');
      }
      
      const imageData = await imageResponse.json();
      const uploadedImage = imageData[0];
      
      // Then, create the photo record
      const photoResponse = await fetch(`${API_URL}/api/photos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            title: formData.title,
            description: formData.description,
            altText: formData.altText,
            caption: formData.caption,
            category: formData.category,
            featured: formData.featured,
            image: uploadedImage.id,
          }
        }),
      });
      
      if (!photoResponse.ok) {
        throw new Error('Failed to create photo');
      }
      
      // Redirect back to photos page
      router.push('/admin/photos');
    } catch (error) {
      console.error('Error creating photo:', error);
      alert('Error creating photo. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <AdminLayout title="Add New Photo">
      <div className="mb-6 flex items-center">
        <button
          onClick={() => router.back()}
          className="mr-4 text-ice-blue hover:text-electric-blue transition-colors"
        >
          &larr; Back
        </button>
        <h1 className="text-3xl font-mulish lowercase text-ice-blue">add new photo</h1>
      </div>
      
      <div className="bg-navy/50 backdrop-blur-sm rounded-lg border border-electric-blue/20 p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column - File upload and preview */}
            <div>
              {/* File Upload */}
              <div className="mb-4">
                <label htmlFor="file" className="block text-sm font-medium text-white mb-2">
                  Select Image
                  <span className="block text-xs text-electric-blue/70 font-normal mt-1">
                    Recommended: 1200×1200px minimum (square ratio preferred)
                  </span>
                </label>
                <input
                  type="file"
                  id="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className={`w-full px-3 py-2 bg-sapphire/30 border ${
                    errors.file ? 'border-red-500' : 'border-electric-blue/30'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-electric-blue text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-electric-blue file:text-white hover:file:bg-electric-blue/80`}
                />
                {errors.file && (
                  <p className="mt-1 text-sm text-red-400">{errors.file}</p>
                )}
              </div>
              
              {/* Preview */}
              <div className="relative aspect-square mb-4">
                {previewUrl ? (
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    className="object-cover rounded-md"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-navy/50 text-white/40 rounded-md border-2 border-dashed border-electric-blue/30">
                    <div className="text-center">
                      <svg className="mx-auto h-12 w-12 text-white/40" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <p className="mt-2 text-sm">Select an image to preview</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Right column - Form fields */}
            <div className="space-y-6">
              {/* Photo Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-white mb-1">
                  Photo Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 bg-sapphire/30 border ${
                    errors.title ? 'border-red-500' : 'border-electric-blue/30'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-electric-blue text-white`}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-400">{errors.title}</p>
                )}
              </div>
              
              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-white mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 bg-sapphire/30 border border-electric-blue/30 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-blue text-white"
                />
              </div>
              
              {/* Alt Text */}
              <div>
                <label htmlFor="altText" className="block text-sm font-medium text-white mb-1">
                  Alt Text
                </label>
                <input
                  type="text"
                  id="altText"
                  name="altText"
                  value={formData.altText}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-sapphire/30 border border-electric-blue/30 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-blue text-white"
                  placeholder="Describe the image for accessibility"
                />
              </div>
              
              {/* Caption */}
              <div>
                <label htmlFor="caption" className="block text-sm font-medium text-white mb-1">
                  Caption
                </label>
                <input
                  type="text"
                  id="caption"
                  name="caption"
                  value={formData.caption}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-sapphire/30 border border-electric-blue/30 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-blue text-white"
                />
              </div>
              
              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-white mb-1">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 bg-sapphire/30 border ${
                    errors.category ? 'border-red-500' : 'border-electric-blue/30'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-electric-blue text-white`}
                >
                  <option value="general">General</option>
                  <option value="press">Press</option>
                  <option value="promotional">Promotional</option>
                  <option value="live">Live Performance</option>
                  <option value="behind-the-scenes">Behind the Scenes</option>
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-400">{errors.category}</p>
                )}
              </div>
              
              {/* Featured */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="mr-2 rounded border-electric-blue/30 bg-sapphire/30 text-electric-blue focus:ring-electric-blue"
                />
                <label htmlFor="featured" className="text-sm font-medium text-white">
                  Featured Photo
                </label>
              </div>
              
              {/* Submit Button */}
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-4 py-2 border border-electric-blue/50 text-white rounded-md hover:bg-electric-blue/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-electric-blue hover:bg-electric-blue/80 text-white rounded-md transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating...' : 'Create Photo'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
