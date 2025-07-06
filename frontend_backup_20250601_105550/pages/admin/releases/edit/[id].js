import React, { useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../../components/AdminLayout';
import Image from 'next/image';
import { getStrapiImageUrl } from '../../../../services/api';

export default function EditReleasePage({ serverRelease }) {
  const router = useRouter();
  const { id } = router.query;
  
  const [isLoading, setIsLoading] = useState(!serverRelease);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [release, setRelease] = useState(serverRelease);
  const [previewImage, setPreviewImage] = useState(
    serverRelease?.cover?.data?.attributes?.url 
      ? getStrapiImageUrl(serverRelease.cover)
      : null
  );
  
  // Form state
  const [formData, setFormData] = useState({
    title: serverRelease?.title || '',
    type: serverRelease?.releaseType || 'Single',
    releaseDate: serverRelease?.releaseDate ? serverRelease.releaseDate.split('T')[0] : '',
    coverArt: null,
    spotify: serverRelease?.streamLinks?.find(link => link.platform === 'spotify')?.url || '',
    apple: serverRelease?.streamLinks?.find(link => link.platform === 'apple music')?.url || '',
    youtube: serverRelease?.streamLinks?.find(link => link.platform === 'youtube')?.url || '',
    featured: serverRelease?.featured || false,
    tracks: serverRelease?.tracks?.length > 0 ? serverRelease.tracks : [{ title: '', duration: '' }]
  });
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Handle cover art upload
  const handleCoverArtChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        coverArt: file
      });
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Add a new track to the tracks array
  const addTrack = () => {
    setFormData({
      ...formData,
      tracks: [...formData.tracks, { title: '', duration: '' }]
    });
  };
  
  // Remove a track from the tracks array
  const removeTrack = (index) => {
    const updatedTracks = [...formData.tracks];
    updatedTracks.splice(index, 1);
    setFormData({
      ...formData,
      tracks: updatedTracks
    });
  };
  
  // Handle track field changes
  const handleTrackChange = (index, field, value) => {
    const updatedTracks = [...formData.tracks];
    updatedTracks[index][field] = value;
    setFormData({
      ...formData,
      tracks: updatedTracks
    });
  };
  
  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';
      
      let coverId = release.cover?.data?.id;
      
      // Upload new cover art if one was selected
      if (formData.coverArt) {
        const imageFormData = new FormData();
        imageFormData.append('files', formData.coverArt);
        
        const imageResponse = await fetch(`${API_URL}/api/upload`, {
          method: 'POST',
          body: imageFormData,
        });
        
        if (!imageResponse.ok) {
          throw new Error('Failed to upload cover art');
        }
        
        const imageData = await imageResponse.json();
        coverId = imageData[0].id;
      }
      
      // Prepare tracks data
      const tracksData = formData.tracks
        .filter(track => track.title.trim()) // Only include tracks with titles
        .map(track => ({
          title: track.title,
          duration: track.duration || null
        }));
      
      // Prepare streaming links data
      const streamLinksData = [];
      if (formData.spotify) {
        streamLinksData.push({
          platform: 'spotify',
          url: formData.spotify
        });
      }
      if (formData.apple) {
        streamLinksData.push({
          platform: 'apple music',
          url: formData.apple
        });
      }
      if (formData.youtube) {
        streamLinksData.push({
          platform: 'youtube',
          url: formData.youtube
        });
      }
      
      // Update the release record
      const releaseData = {
        title: formData.title,
        releaseType: formData.type,
        releaseDate: formData.releaseDate,
        isSingle: formData.type === 'Single',
        featured: formData.featured,
        tracks: tracksData,
        streamLinks: streamLinksData,
        slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      };
      
      if (coverId) {
        releaseData.cover = coverId;
      }
      
      const releaseResponse = await fetch(`${API_URL}/api/albums/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: releaseData
        }),
      });
      
      if (!releaseResponse.ok) {
        throw new Error('Failed to update release');
      }
      
      // Navigate back to the releases list
      router.push('/admin/releases');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error updating release. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Loading state
  if (isLoading) {
    return (
      <AdminLayout title="Edit Release">
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse text-ice-blue">Loading release data...</div>
        </div>
      </AdminLayout>
    );
  }
  
  if (!release) {
    return (
      <AdminLayout title="Edit Release">
        <div className="text-center py-12">
          <h2 className="text-xl text-white mb-4">Release not found</h2>
          <button
            onClick={() => router.push('/admin/releases')}
            className="bg-electric-blue hover:bg-electric-blue/80 text-white px-4 py-2 rounded-md transition-colors"
          >
            Back to Releases
          </button>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout title={`Edit Release: ${formData.title}`}>
      <div className="mb-6 flex items-center">
        <button
          onClick={() => router.back()}
          className="mr-4 text-ice-blue hover:text-electric-blue transition-colors"
        >
          &larr; Back
        </button>
        <h1 className="text-3xl font-mulish lowercase text-ice-blue">edit release</h1>
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
              
              {/* Type */}
              <div>
                <label htmlFor="type" className="block text-sm mb-1">Release Type</label>
                <select
                  id="type"
                  name="type"
                  required
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-sapphire/30 border border-electric-blue/30 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-blue text-white"
                >
                  <option value="Single">Single</option>
                  <option value="EP">EP</option>
                  <option value="Album">Album</option>
                  <option value="Compilation">Compilation</option>
                </select>
              </div>
              
              {/* Release Date */}
              <div>
                <label htmlFor="releaseDate" className="block text-sm mb-1">Release Date</label>
                <input
                  id="releaseDate"
                  name="releaseDate"
                  type="date"
                  required
                  value={formData.releaseDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-sapphire/30 border border-electric-blue/30 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-blue text-white"
                />
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
              {/* Cover Art Upload */}
              <div>
                <label className="block text-sm mb-1">Cover Art</label>
                <div className="flex items-start space-x-4">
                  <div className="w-32 h-32 bg-sapphire/20 border border-electric-blue/30 rounded-md overflow-hidden flex items-center justify-center">
                    {previewImage ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={previewImage}
                          alt="Cover art preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <span className="text-white/40 text-xs">No image selected</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      id="coverArt"
                      name="coverArt"
                      type="file"
                      accept="image/*"
                      onChange={handleCoverArtChange}
                      className="w-full px-3 py-2 bg-sapphire/30 border border-electric-blue/30 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-blue text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-electric-blue file:text-white hover:file:bg-electric-blue/80"
                    />
                    <p className="mt-1 text-xs text-white/60">
                      Recommended: 1000x1000 pixels, JPG or PNG
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Streaming Links */}
              <div className="space-y-4">
                <h3 className="text-sm uppercase tracking-wider text-white/70">Streaming Links</h3>
                
                <div>
                  <label htmlFor="spotify" className="block text-sm mb-1">Spotify URL</label>
                  <input
                    id="spotify"
                    name="spotify"
                    type="url"
                    value={formData.spotify}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-sapphire/30 border border-electric-blue/30 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-blue text-white"
                    placeholder="https://open.spotify.com/..."
                  />
                </div>
                
                <div>
                  <label htmlFor="apple" className="block text-sm mb-1">Apple Music URL</label>
                  <input
                    id="apple"
                    name="apple"
                    type="url"
                    value={formData.apple}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-sapphire/30 border border-electric-blue/30 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-blue text-white"
                    placeholder="https://music.apple.com/..."
                  />
                </div>
                
                <div>
                  <label htmlFor="youtube" className="block text-sm mb-1">YouTube URL</label>
                  <input
                    id="youtube"
                    name="youtube"
                    type="url"
                    value={formData.youtube}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-sapphire/30 border border-electric-blue/30 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-blue text-white"
                    placeholder="https://youtube.com/..."
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Tracks Section */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm uppercase tracking-wider text-white/70">Tracks</h3>
              <button
                type="button"
                onClick={addTrack}
                className="text-electric-blue hover:text-ice-blue transition-colors text-sm"
              >
                + Add Track
              </button>
            </div>
            
            <div className="space-y-3">
              {formData.tracks.map((track, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Track title"
                      value={track.title}
                      onChange={(e) => handleTrackChange(index, 'title', e.target.value)}
                      className="w-full px-3 py-2 bg-sapphire/30 border border-electric-blue/30 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-blue text-white"
                    />
                  </div>
                  <div className="w-24">
                    <input
                      type="text"
                      placeholder="3:45"
                      value={track.duration}
                      onChange={(e) => handleTrackChange(index, 'duration', e.target.value)}
                      className="w-full px-3 py-2 bg-sapphire/30 border border-electric-blue/30 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-blue text-white"
                    />
                  </div>
                  {formData.tracks.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTrack(index)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Form Actions */}
          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push('/admin/releases')}
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

// Fetch release data on the server side
export async function getServerSideProps({ params }) {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';
    const { id } = params;
    
    console.log('Release Edit SSR: Fetching release', id, 'from:', API_URL);
    
    // Fetch release with cover, tracks, and stream links
    const response = await fetch(`${API_URL}/api/albums/${id}?populate=cover,tracks,streamLinks`);
    
    if (!response.ok) {
      console.error('Release Edit SSR: Failed to fetch release:', response.status);
      return {
        props: {
          serverRelease: null
        }
      };
    }
    
    const data = await response.json();
    
    // Transform Strapi data to match our component structure
    const serverRelease = {
      id: data.data.id,
      title: data.data.attributes.title || '',
      releaseType: data.data.attributes.releaseType || 'Single',
      releaseDate: data.data.attributes.releaseDate || '',
      isSingle: data.data.attributes.isSingle || false,
      featured: data.data.attributes.featured || false,
      cover: data.data.attributes.cover || null,
      tracks: data.data.attributes.tracks || [],
      streamLinks: data.data.attributes.streamLinks || [],
      description: data.data.attributes.description || '',
      slug: data.data.attributes.slug || '',
      createdAt: data.data.attributes.createdAt
    };
    
    console.log('Release Edit SSR: Found release:', serverRelease.title);
    
    return {
      props: {
        serverRelease
      }
    };
  } catch (error) {
    console.error('Release Edit SSR: Error fetching data:', error);
    
    return {
      props: {
        serverRelease: null
      }
    };
  }
}
