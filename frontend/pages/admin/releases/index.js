import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import AdminLayout from '../../../components/AdminLayout';
import { getStrapiImageUrl } from '../../../services/api';

export default function ReleasesPage({ serverReleases }) {
  // Use server data or fallback to empty array
  const [releases, setReleases] = useState(serverReleases || []);
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [releaseToDelete, setReleaseToDelete] = useState(null);
  
  const confirmDelete = (release) => {
    setReleaseToDelete(release);
    setIsDeleting(true);
  };
  
  const cancelDelete = () => {
    setIsDeleting(false);
    setReleaseToDelete(null);
  };
  
  const deleteRelease = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';
      
      const response = await fetch(`${API_URL}/api/albums/${releaseToDelete.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete release');
      }
      
      // Remove from local state
      setReleases(releases.filter(release => release.id !== releaseToDelete.id));
      setIsDeleting(false);
      setReleaseToDelete(null);
    } catch (error) {
      console.error('Error deleting release:', error);
      alert('Error deleting release. Please try again.');
    }
  };
  
  const toggleFeatured = async (id) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';
      
      // Find the current release to get its current featured status
      const currentRelease = releases.find(release => release.id === id);
      if (!currentRelease) return;
      
      const response = await fetch(`${API_URL}/api/albums/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            featured: !currentRelease.featured
          }
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update release');
      }
      
      // Update local state
      setReleases(releases.map(release => 
        release.id === id 
          ? { ...release, featured: !release.featured } 
          : release
      ));
    } catch (error) {
      console.error('Error updating release:', error);
      alert('Error updating release. Please try again.');
    }
  };
  
  return (
    <AdminLayout title="Music Releases">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-mulish lowercase text-ice-blue mb-2">music releases</h1>
          <p className="text-white/70">manage your music catalog</p>
        </div>
        <Link 
          href="/admin/releases/new" 
          className="mt-4 md:mt-0 bg-electric-blue hover:bg-electric-blue/80 text-white px-4 py-2 rounded-md text-center transition-colors inline-block"
        >
          add new release
        </Link>
      </div>
      
      {/* Releases List */}
      <div className="bg-navy/50 backdrop-blur-sm rounded-lg border border-electric-blue/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-white">
            <thead className="bg-sapphire/30">
              <tr>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">Cover</th>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">Release Date</th>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">Featured</th>
                <th className="px-6 py-3 text-right text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-electric-blue/10">
              {releases.map((release) => (
                <tr key={release.id} className="hover:bg-sapphire/10 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-12 h-12 relative rounded overflow-hidden bg-navy/50">
                      {release.cover?.data?.attributes?.url ? (
                        <Image
                          src={getStrapiImageUrl(release.cover)}
                          alt={release.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/40 text-xs">
                          No Image
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-mulish lowercase">
                    {release.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {release.isSingle ? 'Single' : release.releaseType || 'Album'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(release.releaseDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleFeatured(release.id)}
                      className={`px-3 py-1 rounded text-xs font-medium ${
                        release.featured 
                          ? 'bg-electric-blue/20 text-ice-blue' 
                          : 'bg-navy/50 text-white/60'
                      }`}
                    >
                      {release.featured ? 'Featured' : 'Not Featured'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div className="flex justify-end space-x-2">
                      <Link 
                        href={`/admin/releases/edit/${release.id}`}
                        className="text-ice-blue hover:text-electric-blue transition-colors"
                      >
                        Edit
                      </Link>
                      <button 
                        onClick={() => confirmDelete(release)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {releases.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-white/70">
                    No releases found. Add your first release to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {isDeleting && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-navy border border-electric-blue/30 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-mulish text-ice-blue mb-4">Confirm Deletion</h3>
            <p className="mb-6 text-white">
              Are you sure you want to delete "{releaseToDelete?.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 border border-electric-blue/50 text-white rounded-md hover:bg-electric-blue/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={deleteRelease}
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

// Fetch releases data on the server side
export async function getServerSideProps() {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';
    
    console.log('Releases SSR: Fetching data from:', API_URL);
    
    // Fetch releases with cover images
    const response = await fetch(`${API_URL}/api/albums?populate=cover,tracks,streamLinks&sort=releaseDate:desc`);
    
    if (!response.ok) {
      console.error('Releases SSR: Failed to fetch releases:', response.status);
      return {
        props: {
          serverReleases: []
        }
      };
    }
    
    const data = await response.json();
    
    // Transform Strapi data to match our component structure
    const serverReleases = data.data?.map(release => ({
      id: release.id,
      title: release.attributes.title || '',
      releaseDate: release.attributes.releaseDate || '',
      releaseType: release.attributes.releaseType || '',
      isSingle: release.attributes.isSingle || false,
      featured: release.attributes.featured || false,
      cover: release.attributes.cover || null,
      tracks: release.attributes.tracks || [],
      streamLinks: release.attributes.streamLinks || [],
      description: release.attributes.description || '',
      slug: release.attributes.slug || ''
    })) || [];
    
    console.log('Releases SSR: Found', serverReleases.length, 'releases');
    
    return {
      props: {
        serverReleases
      }
    };
  } catch (error) {
    console.error('Releases SSR: Error fetching data:', error);
    
    return {
      props: {
        serverReleases: []
      }
    };
  }
}
