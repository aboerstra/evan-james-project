import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import AdminLayout from '../../../../components/AdminLayout';

export default function AlbumDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  
  const [isLoading, setIsLoading] = useState(true);
  const [album, setAlbum] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Fetch album data
  useEffect(() => {
    if (id) {
      // In a real implementation, this would fetch data from an API
      // For now, simulate an API call with mock data
      const fetchData = async () => {
        try {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 600));
          
          // Mock album data
          const albumData = {
            id: parseInt(id),
            title: 'Press Photos',
            description: 'Official press photos for media use',
            coverImage: '/images/gallery/press_1.jpg',
            photoCount: 5,
            featured: true,
          };
          
          // Mock photos data
          const photosData = Array.from({ length: 5 }, (_, index) => ({
            id: index + 1,
            src: '/images/gallery/press_1.jpg',
            title: `Press Photo ${index + 1}`,
            description: 'Official press photo',
            dateAdded: new Date(2023, 5, 15).toISOString(),
            width: 1200,
            height: 800,
          }));
          
          setAlbum(albumData);
          setPhotos(photosData);
          setIsLoading(false);
        } catch (error) {
          console.error('Error loading album data:', error);
          setIsLoading(false);
        }
      };
      
      fetchData();
    }
  }, [id]);
  
  const togglePhotoSelection = (photoId) => {
    setSelectedPhotos(prev => {
      if (prev.includes(photoId)) {
        return prev.filter(id => id !== photoId);
      } else {
        return [...prev, photoId];
      }
    });
  };
  
  const handleSelectAll = () => {
    if (selectedPhotos.length === photos.length) {
      setSelectedPhotos([]);
    } else {
      setSelectedPhotos(photos.map(photo => photo.id));
    }
  };
  
  const confirmDelete = () => {
    if (selectedPhotos.length > 0) {
      setIsDeleting(true);
    }
  };
  
  const cancelDelete = () => {
    setIsDeleting(false);
  };
  
  const deleteSelectedPhotos = () => {
    // In a real implementation, this would call an API
    setPhotos(photos.filter(photo => !selectedPhotos.includes(photo.id)));
    setSelectedPhotos([]);
    setIsDeleting(false);
  };
  
  if (isLoading) {
    return (
      <AdminLayout title="Album Details">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-electric-blue"></div>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout title={`Album: ${album.title}`}>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center">
            <button
              onClick={() => router.push('/admin/photos')}
              className="mr-4 text-ice-blue hover:text-electric-blue transition-colors"
            >
              &larr; Back to Albums
            </button>
          </div>
          <h1 className="text-3xl font-mulish lowercase text-ice-blue mt-2">{album.title}</h1>
          <p className="text-white/70 mt-1">{album.description}</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
          <Link 
            href={`/admin/photos/edit-album/${album.id}`} 
            className="border border-electric-blue/50 hover:bg-electric-blue/10 text-white px-4 py-2 rounded-md text-center transition-colors"
          >
            edit album
          </Link>
          
          <Link 
            href={`/admin/photos/upload?album=${album.id}`} 
            className="bg-electric-blue hover:bg-electric-blue/80 text-white px-4 py-2 rounded-md text-center transition-colors"
          >
            upload photos
          </Link>
        </div>
      </div>
      
      {/* Album Cover and Info */}
      <div className="bg-navy/50 backdrop-blur-sm rounded-lg border border-electric-blue/20 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="relative aspect-video md:aspect-square">
            <Image
              src={album.coverImage}
              alt={album.title}
              fill
              className="object-cover rounded-md"
            />
          </div>
          
          <div className="md:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm uppercase tracking-wider text-white/70 mb-1">Album Info</h3>
                <div className="bg-sapphire/20 rounded-md p-4">
                  <div className="mb-3">
                    <p className="text-xs text-white/60">Title</p>
                    <p className="text-white">{album.title}</p>
                  </div>
                  <div className="mb-3">
                    <p className="text-xs text-white/60">Photos</p>
                    <p className="text-white">{photos.length}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/60">Featured</p>
                    <p className="text-white">{album.featured ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm uppercase tracking-wider text-white/70 mb-1">Options</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => router.push(`/admin/photos/edit-album/${album.id}`)}
                    className="w-full bg-sapphire/20 hover:bg-sapphire/30 text-white px-4 py-3 rounded-md text-left transition-colors flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-electric-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Album Details
                  </button>
                  
                  <button
                    onClick={() => router.push(`/admin/photos/upload?album=${album.id}`)}
                    className="w-full bg-sapphire/20 hover:bg-sapphire/30 text-white px-4 py-3 rounded-md text-left transition-colors flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-electric-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
                    </svg>
                    Upload More Photos
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Photos Management */}
      <div className="bg-navy/50 backdrop-blur-sm rounded-lg border border-electric-blue/20 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <h2 className="text-xl font-mulish lowercase text-ice-blue">photos</h2>
          
          <div className="mt-3 sm:mt-0 flex flex-wrap gap-2">
            <button
              onClick={handleSelectAll}
              className="border border-electric-blue/50 hover:bg-electric-blue/10 text-white px-3 py-1 rounded-md text-sm transition-colors"
            >
              {selectedPhotos.length === photos.length ? 'Deselect All' : 'Select All'}
            </button>
            
            {selectedPhotos.length > 0 && (
              <button
                onClick={confirmDelete}
                className="border border-red-500/50 hover:bg-red-500/10 text-red-400 px-3 py-1 rounded-md text-sm transition-colors"
              >
                Delete Selected ({selectedPhotos.length})
              </button>
            )}
          </div>
        </div>
        
        {photos.length === 0 ? (
          <div className="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-white/30 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-white/70 mb-2">No photos in this album yet</p>
            <Link 
              href={`/admin/photos/upload?album=${album.id}`} 
              className="text-electric-blue hover:text-ice-blue transition-colors"
            >
              Upload your first photo
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {photos.map((photo) => (
              <div 
                key={photo.id} 
                className={`group relative ${
                  selectedPhotos.includes(photo.id) ? 'ring-2 ring-electric-blue' : ''
                }`}
              >
                <div className="aspect-square relative rounded-md overflow-hidden">
                  <Image
                    src={photo.src}
                    alt={photo.title}
                    fill
                    className="object-cover"
                  />
                  
                  {/* Selection overlay */}
                  <div 
                    className={`absolute inset-0 flex items-center justify-center transition-colors ${
                      selectedPhotos.includes(photo.id) 
                        ? 'bg-electric-blue/20' 
                        : 'bg-black/40 opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    <button
                      onClick={() => togglePhotoSelection(photo.id)}
                      className={`rounded-full p-2 transition-colors ${
                        selectedPhotos.includes(photo.id)
                          ? 'bg-electric-blue text-white'
                          : 'bg-black/50 text-white hover:bg-electric-blue/80'
                      }`}
                    >
                      {selectedPhotos.includes(photo.id) ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="mt-1">
                  <p className="text-xs text-white truncate" title={photo.title}>
                    {photo.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Delete Confirmation Modal */}
      {isDeleting && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-navy border border-electric-blue/30 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-mulish text-ice-blue mb-4">Confirm Deletion</h3>
            <p className="mb-6 text-white">
              Are you sure you want to delete {selectedPhotos.length} {selectedPhotos.length === 1 ? 'photo' : 'photos'} from this album? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 border border-electric-blue/50 text-white rounded-md hover:bg-electric-blue/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={deleteSelectedPhotos}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                Delete {selectedPhotos.length} {selectedPhotos.length === 1 ? 'Photo' : 'Photos'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
} 