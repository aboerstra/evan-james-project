import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import AdminLayout from '../../../../components/AdminLayout';
import { getStrapiImageUrl } from '../../../../services/api';

export default function EditPhotoPage({ serverPhoto }) {
  const router = useRouter();
  const { id } = router.query;
  
  const [isLoading, setIsLoading] = useState(!serverPhoto);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photo, setPhoto] = useState(serverPhoto);
  const [formData, setFormData] = useState({
    title: serverPhoto?.title || '',
    description: serverPhoto?.description || '',
    altText: serverPhoto?.altText || '',
    caption: serverPhoto?.caption || '',
    category: serverPhoto?.category || 'general',
    featured: serverPhoto?.featured || false,
  });
  const [errors, setErrors] = useState({});
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Photo title is required';
    }
    
    if (!formData.category) {
      newErrors.category = 'Please select a category';
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
      
      const response = await fetch(`${API_URL}/api/photos/${id}`, {
        method: 'PUT',
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
          }
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update photo');
      }
      
      // Redirect back to photos page
      router.push('/admin/photos');
    } catch (error) {
      console.error('Error updating photo:', error);
      alert('Error updating photo. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <AdminLayout title="Edit Photo">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-electric-blue"></div>
        </div>
      </AdminLayout>
    );
  }
  
  if (!photo) {
    return (
      <AdminLayout title="Edit Photo">
        <div className="text-center py-12">
          <h2 className="text-xl text-white mb-4">Photo not found</h2>
          <button
            onClick={() => router.push('/admin/photos')}
            className="bg-electric-blue hover:bg-electric-blue/80 text-white px-4 py-2 rounded-md transition-colors"
          >
            Back to Photos
          </button>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout title="Edit Photo">
      <div className="mb-6 flex items-center">
        <button
          onClick={() => router.back()}
          className="mr-4 text-ice-blue hover:text-electric-blue transition-colors"
        >
          &larr; Back
        </button>
        <h1 className="text-3xl font-mulish lowercase text-ice-blue">edit photo</h1>
      </div>
      
      <div className="bg-navy/50 backdrop-blur-sm rounded-lg border border-electric-blue/20 p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column - Photo preview */}
            <div>
              <div className="relative aspect-square mb-4">
                {photo.image?.data?.attributes?.url ? (
                  <Image
                    src={getStrapiImageUrl(photo.image)}
                    alt={photo.title}
                    fill
                    className="object-cover rounded-md"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-navy/50 text-white/40 rounded-md">
                    No Image
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-sapphire/20 p-3 rounded-md">
                  <p className="text-white/60 mb-1">Upload Date</p>
                  <p className="text-white">{new Date(photo.createdAt).toLocaleDateString()}</p>
                </div>
                
                <div className="bg-sapphire/20 p-3 rounded-md">
                  <p className="text-white/60 mb-1">Category</p>
                  <p className="text-white capitalize">{photo.category}</p>
                </div>
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
                  {isSubmitting ? 'Updating...' : 'Update Photo'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

// Fetch photo data on the server side
export async function getServerSideProps({ params }) {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';
    const { id } = params;
    
    console.log('Photo Edit SSR: Fetching photo', id, 'from:', API_URL);
    
    // Fetch photo with image
    const response = await fetch(`${API_URL}/api/photos/${id}?populate=image`);
    
    if (!response.ok) {
      console.error('Photo Edit SSR: Failed to fetch photo:', response.status);
      return {
        props: {
          serverPhoto: null
        }
      };
    }
    
    const data = await response.json();
    
    // Transform Strapi data to match our component structure
    const serverPhoto = {
      id: data.data.id,
      title: data.data.attributes.title || '',
      description: data.data.attributes.description || '',
      category: data.data.attributes.category || 'general',
      featured: data.data.attributes.featured || false,
      image: data.data.attributes.image || null,
      altText: data.data.attributes.altText || '',
      caption: data.data.attributes.caption || '',
      createdAt: data.data.attributes.createdAt
    };
    
    console.log('Photo Edit SSR: Found photo:', serverPhoto.title);
    
    return {
      props: {
        serverPhoto
      }
    };
  } catch (error) {
    console.error('Photo Edit SSR: Error fetching data:', error);
    
    return {
      props: {
        serverPhoto: null
      }
    };
  }
}
