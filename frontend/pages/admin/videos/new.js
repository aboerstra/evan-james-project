import React, { useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../components/AdminLayout';
import Image from 'next/image';

export default function NewVideoPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: '',
    category: 'Music Video',
    thumbnail: null,
    featured: false
  });
  
  // Available video categories
  const videoCategories = [
    'Music Video',
    'Live Performance',
    'Behind the Scenes',
    'Interview',
    'Vlog',
    'Lyric Video',
    'Other'
  ];
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Handle thumbnail upload
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        thumbnail: file
      });
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Extract video ID from URL
  const getVideoId = (url) => {
    try {
      // YouTube URL formats:
      // https://www.youtube.com/watch?v=VIDEO_ID
      // https://youtu.be/VIDEO_ID
      // https://www.youtube.com/embed/VIDEO_ID
      
      let videoId = '';
      
      if (url.includes('youtube.com/watch')) {
        const urlParams = new URLSearchParams(new URL(url).search);
        videoId = urlParams.get('v');
      } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1].split('?')[0];
      } else if (url.includes('youtube.com/embed/')) {
        videoId = url.split('youtube.com/embed/')[1].split('?')[0];
      }
      
      return videoId;
    } catch (error) {
      return '';
    }
  };
  
  // Auto-generate thumbnail from YouTube video
  const generateThumbnail = () => {
    if (!formData.url) return;
    
    const videoId = getVideoId(formData.url);
    if (videoId) {
      // Use the highest resolution thumbnail from YouTube
      const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      setPreviewImage(thumbnailUrl);
    }
  };
  
  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';
      
      let thumbnailId = null;
      
      // Upload thumbnail if one was selected
      if (formData.thumbnail) {
        const imageFormData = new FormData();
        imageFormData.append('files', formData.thumbnail);
        
        const imageResponse = await fetch(`${API_URL}/api/upload`, {
          method: 'POST',
          body: imageFormData,
        });
        
        if (!imageResponse.ok) {
          throw new Error('Failed to upload thumbnail');
        }
        
        const imageData = await imageResponse.json();
        thumbnailId = imageData[0].id;
      }
      
      // Create the video record
      const videoData = {
        title: formData.title,
        description: formData.description,
        videoUrl: formData.url,
        videoType: formData.category,
        featured: formData.featured,
        releaseDate: new Date().toISOString(),
      };
      
      if (thumbnailId) {
        videoData.thumbnail = thumbnailId;
      }
      
      const videoResponse = await fetch(`${API_URL}/api/videos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: videoData
        }),
      });
      
      if (!videoResponse.ok) {
        throw new Error('Failed to create video');
      }
      
      // Navigate back to the videos list
      router.push('/admin/videos');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error creating video. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <AdminLayout title="Add New Video">
      <div className="mb-6 flex items-center">
        <button
          onClick={() => router.back()}
          className="mr-4 text-ice-blue hover:text-electric-blue transition-colors"
        >
          &larr; Back
        </button>
        <h1 className="text-3xl font-mulish lowercase text-ice-blue">add new video</h1>
      </div>
      
      <div className="bg-navy/50 backdrop-blur-sm rounded-lg border border-electric-blue/20 p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column */}
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm mb-1">Title</label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-sapphire/30 border border-electric-blue/30 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-blue text-white"
                />
              </div>
              
              {/* Video URL */}
              <div>
                <label htmlFor="url" className="block text-sm mb-1">Video URL</label>
                <div className="flex">
                  <input
                    id="url"
                    name="url"
                    type="url"
                    required
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={formData.url}
                    onChange={handleChange}
                    className="flex-1 px-3 py-2 bg-sapphire/30 border border-electric-blue/30 rounded-l-md focus:outline-none focus:ring-2 focus:ring-electric-blue text-white"
                  />
                  <button
                    type="button"
                    onClick={generateThumbnail}
                    className="px-3 py-2 bg-electric-blue/80 text-white rounded-r-md hover:bg-electric-blue transition-colors"
                  >
                    Generate Thumbnail
                  </button>
                </div>
                <p className="mt-1 text-xs text-white/60">
                  YouTube, Vimeo, or other video platform URL
                </p>
              </div>
              
              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm mb-1">Category</label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-sapphire/30 border border-electric-blue/30 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-blue text-white"
                >
                  {videoCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Featured */}
              <div className="flex items-center">
                <input
                  id="featured"
                  name="featured"
                  type="checkbox"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-electric-blue/50 focus:ring-electric-blue"
                />
                <label htmlFor="featured" className="ml-2 block text-sm">
                  Featured on homepage
                </label>
              </div>
            </div>
            
            {/* Right column */}
            <div className="space-y-6">
              {/* Thumbnail */}
              <div>
                <label className="block text-sm mb-1">Thumbnail</label>
                <div className="flex flex-col space-y-4">
                  <div className="aspect-video relative bg-sapphire/20 border border-electric-blue/30 rounded-md overflow-hidden flex items-center justify-center">
                    {previewImage ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={previewImage}
                          alt="Thumbnail preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <span className="text-white/40 text-xs">No thumbnail selected</span>
                    )}
                  </div>
                  
                  <div className="flex space-x-4">
                    <div>
                      <input
                        id="thumbnail"
                        name="thumbnail"
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailChange}
                        className="sr-only"
                      />
                      <label
                        htmlFor="thumbnail"
                        className="inline-flex items-center px-3 py-2 border border-electric-blue/50 text-sm leading-4 font-medium rounded-md text-white bg-sapphire/20 hover:bg-electric-blue/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-electric-blue cursor-pointer"
                      >
                        Upload custom...
                      </label>
                    </div>
                    
                    <div>
                      <button
                        type="button"
                        onClick={generateThumbnail}
                        className="inline-flex items-center px-3 py-2 border border-electric-blue/50 text-sm leading-4 font-medium rounded-md text-white bg-sapphire/20 hover:bg-electric-blue/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-electric-blue"
                      >
                        Use video thumbnail
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-xs text-white/60">
                    Recommended: 16:9 aspect ratio, at least 1280x720 pixels
                  </p>
                </div>
              </div>
              
              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm mb-1">Description</label>
                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-sapphire/30 border border-electric-blue/30 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-blue text-white resize-none"
                />
              </div>
            </div>
          </div>
          
          {/* Form Actions */}
          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push('/admin/videos')}
              className="px-4 py-2 border border-electric-blue/50 text-white rounded-md hover:bg-electric-blue/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-electric-blue text-white rounded-md hover:bg-electric-blue/80 transition-colors disabled:opacity-50 flex items-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                'Save Video'
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
