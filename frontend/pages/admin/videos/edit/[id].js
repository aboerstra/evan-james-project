import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import AdminLayout from '../../../../components/AdminLayout';
import { getStrapiImageUrl } from '../../../../services/api';

export default function EditVideoPage({ serverVideo }) {
  const router = useRouter();
  const { id } = router.query;
  
  const [isLoading, setIsLoading] = useState(!serverVideo);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [video, setVideo] = useState(serverVideo);
  const [formData, setFormData] = useState({
    title: serverVideo?.title || '',
    url: serverVideo?.videoUrl || '',
    description: serverVideo?.description || '',
    category: serverVideo?.videoType || 'music video',
    thumbnail: null,
    featured: serverVideo?.featured || false
  });
  const [previewImage, setPreviewImage] = useState(
    serverVideo?.thumbnail?.data?.attributes?.url 
      ? getStrapiImageUrl(serverVideo.thumbnail)
      : null
  );
  
  const videoCategories = [
    'music video',
    'live performance', 
    'behind the scenes',
    'interview',
    'acoustic',
    'lyric video'
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
      
      let thumbnailId = video.thumbnail?.data?.id;
      
      // Upload new thumbnail if one was selected
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
      
      // Update the video record
      const videoData = {
        title: formData.title,
        description: formData.description,
        videoUrl: formData.url,
        videoType: formData.category,
        featured: formData.featured,
      };
      
      if (thumbnailId) {
        videoData.thumbnail = thumbnailId;
      }
      
      const videoResponse = await fetch(`${API_URL}/api/videos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: videoData
        }),
      });
      
      if (!videoResponse.ok) {
        throw new Error('Failed to update video');
      }
      
      // Navigate back to the videos list
      router.push('/admin/videos');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error updating video. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Loading state
  if (isLoading) {
    return (
      <AdminLayout title="Edit Video">
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse text-ice-blue">Loading video data...</div>
        </div>
      </AdminLayout>
    );
  }
  
  if (!video) {
    return (
      <AdminLayout title="Edit Video">
        <div className="text-center py-12">
          <h2 className="text-xl text-white mb-4">Video not found</h2>
          <button
            onClick={() => router.push('/admin/videos')}
            className="bg-electric-blue hover:bg-electric-blue/80 text-white px-4 py-2 rounded-md transition-colors"
          >
            Back to Videos
          </button>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout title={`Edit Video: ${formData.title}`}>
      <div className="mb-6 flex items-center">
        <button
          onClick={() => router.back()}
          className="mr-4 text-ice-blue hover:text-electric-blue transition-colors"
        >
          &larr; Back
        </button>
        <h1 className="text-3xl font-mulish lowercase text-ice-blue">edit video</h1>
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
                        Change image...
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
          
          {/* Preview Video */}
          <div className="mt-8">
            <h3 className="text-sm uppercase tracking-wider text-white/70 mb-4">Video Preview</h3>
            <div className="aspect-video relative bg-sapphire/20 border border-electric-blue/30 rounded-md overflow-hidden">
              {formData.url && getVideoId(formData.url) ? (
                <iframe
                  src={`https://www.youtube.com/embed/${getVideoId(formData.url)}`}
                  className="absolute inset-0 w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <span className="text-white/40">Enter a valid YouTube URL to preview</span>
                </div>
              )}
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
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

// Fetch video data on the server side
export async function getServerSideProps({ params }) {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';
    const { id } = params;
    
    console.log('Video Edit SSR: Fetching video', id, 'from:', API_URL);
    
    // Fetch video with thumbnail
    const response = await fetch(`${API_URL}/api/videos/${id}?populate=thumbnail`);
    
    if (!response.ok) {
      console.error('Video Edit SSR: Failed to fetch video:', response.status);
      return {
        props: {
          serverVideo: null
        }
      };
    }
    
    const data = await response.json();
    
    // Transform Strapi data to match our component structure
    const serverVideo = {
      id: data.data.id,
      title: data.data.attributes.title || '',
      description: data.data.attributes.description || '',
      videoUrl: data.data.attributes.videoUrl || '',
      videoType: data.data.attributes.videoType || 'music video',
      featured: data.data.attributes.featured || false,
      thumbnail: data.data.attributes.thumbnail || null,
      releaseDate: data.data.attributes.releaseDate,
      createdAt: data.data.attributes.createdAt
    };
    
    console.log('Video Edit SSR: Found video:', serverVideo.title);
    
    return {
      props: {
        serverVideo
      }
    };
  } catch (error) {
    console.error('Video Edit SSR: Error fetching data:', error);
    
    return {
      props: {
        serverVideo: null
      }
    };
  }
}
