import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import AdminLayout from '../../../components/AdminLayout';
import { getStrapiImageUrl } from '../../../services/api';

export default function PhotosPage({ serverPhotos }) {
  const router = useRouter();
  
  // Use server data or fallback to empty array
  const [photos, setPhotos] = useState(serverPhotos || []);
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState(null);
  
  const confirmDelete = (photo) => {
    setPhotoToDelete(photo);
    setIsDeleting(true);
  };
  
  const cancelDelete = () => {
    setIsDeleting(false);
    setPhotoToDelete(null);
  };
  
  const deletePhoto = async () => {
    try {
      // TODO: Implement actual delete API call
      console.log('Delete photo:', photoToDelete.id);
      
      // For now, just remove from local state
      setPhotos(photos.filter(photo => photo.id !== photoToDelete.id));
      setIsDeleting(false);
      setPhotoToDelete(null);
    } catch (error) {
      console.error('Error deleting photo:', error);
    }
  };
  
  const toggleFeatured = async (id) => {
    try {
      // TODO: Implement actual update API call
      console.log('Toggle featured for photo:', id);
      
      // For now, just update local state
      setPhotos(photos.map(photo => 
        photo.id === id 
          ? { ...photo, featured: !photo.featured } 
          : photo
      ));
    } catch (error) {
      console.error('Error updating photo:', error);
    }
  };
  
  return (
    <AdminLayout title="Photo Gallery">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-mulish lowercase text-ice-blue mb-2">photo gallery</h1>
          <p className="text-white/70">manage photo collection</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
          <Link 
            href="/admin/photos/upload" 
            className="bg-electric-blue hover:bg-electric-blue/80 text-white px-4 py-2 rounded-md text-center transition-colors inline-block"
          >
            upload photos
          </Link>
          
          <Link 
            href="/admin/photos/new" 
            className="border border-electric-blue/50 hover:bg-electric-blue/10 text-white px-4 py-2 rounded-md text-center transition-colors inline-block"
          >
            add new photo
          </Link>
        </div>
      </div>
      
      {/* Photos Grid */}
      <div className="bg-navy/50 backdrop-blur-sm rounded-lg border border-electric-blue/20 p-6">
        <h2 className="text-xl font-mulish lowercase text-ice-blue mb-4">photos</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {photos.map((photo) => (
            <div 
              key={photo.id} 
              className="bg-sapphire/20 border border-electric-blue/20 rounded-lg overflow-hidden"
            >
              <div className="aspect-square relative">
                {photo.image?.data?.attributes?.url ? (
                  <Image
                    src={getStrapiImageUrl(photo.image)}
                    alt={photo.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-navy/50 text-white/40">
                    No Image
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
                  <Link 
                    href={`/admin/photos/edit/${photo.id}`}
                    className="bg-electric-blue hover:bg-electric-blue/80 text-white p-3 rounded-full transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </Link>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-mulish lowercase text-ice-blue text-sm">{photo.title}</h3>
                  <span className="text-xs px-2 py-1 bg-sapphire/30 rounded-full">{photo.category}</span>
                </div>
                
                <p className="text-sm text-white/70 mb-4 line-clamp-2">{photo.description}</p>
                
                <div className="flex items-center justify-between">
                  <div>
                    <button
                      onClick={() => toggleFeatured(photo.id)}
                      className={`px-3 py-1 rounded text-xs font-medium ${
                        photo.featured 
                          ? 'bg-electric-blue/20 text-ice-blue' 
                          : 'bg-navy/50 text-white/60'
                      }`}
                    >
                      {photo.featured ? 'Featured' : 'Not Featured'}
                    </button>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Link 
                      href={`/admin/photos/edit/${photo.id}`}
                      className="text-ice-blue hover:text-electric-blue transition-colors text-sm"
                    >
                      Edit
                    </Link>
                    <button 
                      onClick={() => confirmDelete(photo)}
                      className="text-red-400 hover:text-red-300 transition-colors text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {photos.length === 0 && (
            <div className="col-span-full p-8 text-center text-white/70">
              No photos found. Upload your first photo to get started.
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
              Are you sure you want to delete "{photoToDelete?.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 border border-electric-blue/50 text-white rounded-md hover:bg-electric-blue/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={deletePhoto}
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

// Fetch photos data on the server side
export async function getServerSideProps() {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';
    
    console.log('Photos SSR: Fetching data from:', API_URL);
    
    // Fetch photos with images
    const response = await fetch(`${API_URL}/api/photos?populate=image&sort=createdAt:desc`);
    
    if (!response.ok) {
      console.error('Photos SSR: Failed to fetch photos:', response.status);
      return {
        props: {
          serverPhotos: []
        }
      };
    }
    
    const data = await response.json();
    
    // Transform Strapi data to match our component structure
    const serverPhotos = data.data?.map(photo => ({
      id: photo.id,
      title: photo.attributes.title || '',
      description: photo.attributes.description || '',
      category: photo.attributes.category || 'General',
      featured: photo.attributes.featured || false,
      image: photo.attributes.image || null,
      altText: photo.attributes.altText || '',
      caption: photo.attributes.caption || ''
    })) || [];
    
    console.log('Photos SSR: Found', serverPhotos.length, 'photos');
    
    return {
      props: {
        serverPhotos
      }
    };
  } catch (error) {
    console.error('Photos SSR: Error fetching data:', error);
    
    return {
      props: {
        serverPhotos: []
      }
    };
  }
}
