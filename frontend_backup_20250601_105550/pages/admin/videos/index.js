import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import AdminLayout from '../../../components/AdminLayout';
import { getStrapiImageUrl } from '../../../services/api';

export default function VideosPage({ serverVideos }) {
  // Use server data or fallback to empty array
  const [videos, setVideos] = useState(serverVideos || []);
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState(null);
  
  const confirmDelete = (video) => {
    setVideoToDelete(video);
    setIsDeleting(true);
  };
  
  const cancelDelete = () => {
    setIsDeleting(false);
    setVideoToDelete(null);
  };
  
  const deleteVideo = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';
      
      const response = await fetch(`${API_URL}/api/videos/${videoToDelete.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete video');
      }
      
      // Remove from local state
      setVideos(videos.filter(video => video.id !== videoToDelete.id));
      setIsDeleting(false);
      setVideoToDelete(null);
    } catch (error) {
      console.error('Error deleting video:', error);
      alert('Error deleting video. Please try again.');
    }
  };
  
  const toggleFeatured = async (id) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';
      
      // Find the current video to get its current featured status
      const currentVideo = videos.find(video => video.id === id);
      if (!currentVideo) return;
      
      const response = await fetch(`${API_URL}/api/videos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            featured: !currentVideo.featured
          }
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update video');
      }
      
      // Update local state
      setVideos(videos.map(video => 
        video.id === id 
          ? { ...video, featured: !video.featured } 
          : video
      ));
    } catch (error) {
      console.error('Error updating video:', error);
      alert('Error updating video. Please try again.');
    }
  };
  
  return (
    <AdminLayout title="Videos">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-mulish lowercase text-ice-blue mb-2">videos</h1>
          <p className="text-white/70">manage your video content</p>
        </div>
        <Link 
          href="/admin/videos/new" 
          className="mt-4 md:mt-0 bg-electric-blue hover:bg-electric-blue/80 text-white px-4 py-2 rounded-md text-center transition-colors inline-block"
        >
          add new video
        </Link>
      </div>
      
      {/* Videos Grid */}
      <div className="bg-navy/50 backdrop-blur-sm rounded-lg border border-electric-blue/20 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div 
              key={video.id} 
              className="bg-sapphire/20 border border-electric-blue/20 rounded-lg overflow-hidden"
            >
              <div className="aspect-video relative">
                {video.thumbnail?.data?.attributes?.url ? (
                  <Image
                    src={getStrapiImageUrl(video.thumbnail)}
                    alt={video.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-navy/50 text-white/40">
                    No Thumbnail
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
                  <a 
                    href={video.videoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-electric-blue hover:bg-electric-blue/80 text-white p-3 rounded-full transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </a>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-mulish lowercase text-ice-blue">{video.title}</h3>
                  <span className="text-xs px-2 py-1 bg-sapphire/30 rounded-full">{video.videoType || 'Video'}</span>
                </div>
                
                <p className="text-sm text-white/70 mb-4 line-clamp-2">{video.description}</p>
                
                <div className="flex items-center justify-between">
                  <div>
                    <button
                      onClick={() => toggleFeatured(video.id)}
                      className={`px-3 py-1 rounded text-xs font-medium ${
                        video.featured 
                          ? 'bg-electric-blue/20 text-ice-blue' 
                          : 'bg-navy/50 text-white/60'
                      }`}
                    >
                      {video.featured ? 'Featured' : 'Not Featured'}
                    </button>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Link 
                      href={`/admin/videos/edit/${video.id}`}
                      className="text-ice-blue hover:text-electric-blue transition-colors"
                    >
                      Edit
                    </Link>
                    <button 
                      onClick={() => confirmDelete(video)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {videos.length === 0 && (
            <div className="col-span-full p-8 text-center text-white/70">
              No videos found. Add your first video to get started.
            </div>
          )}
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {isDeleting && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-navy border border-electric-blue/30 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-mulish text-ice-blue mb-4">Confirm Deletion</h3>
            <p className="mb-6 text-white">
              Are you sure you want to delete "{videoToDelete?.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 border border-electric-blue/50 text-white rounded-md hover:bg-electric-blue/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={deleteVideo}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

// Fetch videos data on the server side
export async function getServerSideProps() {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';
    
    console.log('Videos SSR: Fetching data from:', API_URL);
    
    // Fetch videos with thumbnails
    const response = await fetch(`${API_URL}/api/videos?populate=thumbnail&sort=releaseDate:desc`);
    
    if (!response.ok) {
      console.error('Videos SSR: Failed to fetch videos:', response.status);
      return {
        props: {
          serverVideos: []
        }
      };
    }
    
    const data = await response.json();
    
    // Transform Strapi data to match our component structure
    const serverVideos = data.data?.map(video => ({
      id: video.id,
      title: video.attributes.title || '',
      description: video.attributes.description || '',
      videoUrl: video.attributes.videoUrl || '',
      embedCode: video.attributes.embedCode || '',
      releaseDate: video.attributes.releaseDate || '',
      featured: video.attributes.featured || false,
      videoType: video.attributes.videoType || '',
      slug: video.attributes.slug || '',
      thumbnail: video.attributes.thumbnail || null
    })) || [];
    
    console.log('Videos SSR: Found', serverVideos.length, 'videos');
    
    return {
      props: {
        serverVideos
      }
    };
  } catch (error) {
    console.error('Videos SSR: Error fetching data:', error);
    
    return {
      props: {
        serverVideos: []
      }
    };
  }
}
