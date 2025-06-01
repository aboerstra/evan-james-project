import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import AdminLayout from '../../../../components/AdminLayout';

export default function EditAlbumPage() {
  const router = useRouter();
  const { id } = router.query;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    featured: false,
    coverImage: null
  });
  const [originalCoverImage, setOriginalCoverImage] = useState('/images/gallery/press_1.jpg');
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  
  // Fetch album data
  useEffect(() => {
    if (id) {
      // In a real implementation, this would fetch data from an API
      // For now, simulate an API call with mock data
      const fetchData = async () => {
        try {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 600));
          
          // Mock data for demonstration
          const albumData = {
            id: parseInt(id),
            title: 'Press Photos',
            description: 'Official press photos for media use',
            coverImage: '/images/gallery/press_1.jpg',
            photoCount: 5,
            featured: true,
          };
          
          setFormData({
            title: albumData.title,
            description: albumData.description,
            featured: albumData.featured,
            coverImage: null // We don't actually load the file object from the server
          });
          
          setOriginalCoverImage(albumData.coverImage);
          setIsLoading(false);
        } catch (error) {
          console.error('Error loading album data:', error);
          setIsLoading(false);
        }
      };
      
      fetchData();
    }
  }, [id]);
  
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
      setFormData({
        ...formData,
        coverImage: file
      });
      
      // Create a preview URL for the image
      const previewUrl = URL.createObjectURL(file);
      setCoverImagePreview(previewUrl);
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Album title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Album description is required';
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real implementation, this would be an API call to update the album
      
      // Redirect to photos page after successful update
      router.push('/admin/photos');
    } catch (error) {
      console.error('Error updating album:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <AdminLayout title="Edit Album">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-electric-blue"></div>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout title="Edit Album">
      <div className="mb-6 flex items-center">
        <button
          onClick={() => router.back()}
          className="mr-4 text-ice-blue hover:text-electric-blue transition-colors"
        >
          &larr; Back
        </button>
        <h1 className="text-3xl font-mulish lowercase text-ice-blue">edit album</h1>
      </div>
      
      <div className="bg-navy/50 backdrop-blur-sm rounded-lg border border-electric-blue/20 p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Form fields */}
            <div className="md:col-span-2 space-y-6">
              {/* Album Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-white mb-1">
                  Album Title
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
              
              {/* Album Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-white mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className={`w-full px-3 py-2 bg-sapphire/30 border ${
                    errors.description ? 'border-red-500' : 'border-electric-blue/30'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-electric-blue text-white`}
                ></textarea>
                {errors.description && (
                  <p className="mt-1 text-sm text-red-400">{errors.description}</p>
                )}
              </div>
              
              {/* Featured Toggle */}
              <div className="flex items-center">
                <input
                  id="featured"
                  name="featured"
                  type="checkbox"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="h-4 w-4 rounded border-electric-blue/50 focus:ring-electric-blue"
                />
                <label htmlFor="featured" className="ml-2 block text-sm">
                  Featured album (shows prominently on website)
                </label>
              </div>
            </div>
            
            {/* Right column - Cover Image */}
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-white mb-1">
                  Cover Image
                </label>
                <div 
                  className="border-2 border-dashed rounded-lg p-4 mb-2 text-center border-electric-blue/30 hover:border-electric-blue/60 transition-colors cursor-pointer"
                  onClick={() => document.getElementById('cover-image').click()}
                >
                  {coverImagePreview ? (
                    <div className="relative aspect-video mb-2">
                      <Image
                        src={coverImagePreview}
                        alt="Cover preview"
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                  ) : (
                    <div className="relative aspect-video mb-2">
                      <Image
                        src={originalCoverImage}
                        alt="Current cover image"
                        fill
                        className="object-cover rounded-md"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                        <p className="text-white text-sm font-medium">Click to change</p>
                      </div>
                    </div>
                  )}
                  
                  <input
                    type="file"
                    id="cover-image"
                    name="coverImage"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
                <p className="text-xs text-white/60">Recommended size: 1280 x 720px (16:9)</p>
              </div>
            </div>
          </div>
          
          {/* Form Actions */}
          <div className="mt-8 flex justify-between">
            <button
              type="button"
              onClick={() => router.push(`/admin/photos/albums/${id}`)}
              className="px-4 py-2 bg-navy/50 text-white rounded-md hover:bg-navy/70 transition-colors"
            >
              View Album Photos
            </button>
            
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => router.push('/admin/photos')}
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
                ) : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
} 