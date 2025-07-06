import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../../components/AdminLayout';

const initialMediaState = (media) => {
  if (!media) return null;
  if (Array.isArray(media)) return media.map(m => ({ id: m.id, url: m.url, file: null, toRemove: false }));
  return { id: media.id, url: media.url, file: null, toRemove: false };
};

export default function EditTourDatePage({ serverTourDate }) {
  const router = useRouter();
  const { id } = router.query;
  
  const [isLoading, setIsLoading] = useState(!serverTourDate);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tourDate, setTourDate] = useState(serverTourDate);
  const [error, setError] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    eventName: serverTourDate?.eventName || '',
    date: serverTourDate?.date ? serverTourDate.date.slice(0, 16) : '', // datetime-local
    venueName: serverTourDate?.venueName || '',
    city: serverTourDate?.city || '',
    state: serverTourDate?.state || '',
    country: serverTourDate?.country || '',
    ticketLink: serverTourDate?.ticketLink || '',
    isSoldOut: serverTourDate?.isSoldOut || false,
    isAnnounced: serverTourDate?.isAnnounced ?? true,
    isCancelled: serverTourDate?.isCancelled || false,
    venueAddress: serverTourDate?.venueAddress || '',
    venueWebsite: serverTourDate?.venueWebsite || '',
    description: serverTourDate?.description || '',
    otherArtists: serverTourDate?.otherArtists || '',
  });
  
  // Media fields
  const [venueImage, setVenueImage] = useState(initialMediaState(serverTourDate?.venueImage));
  const [promotionalImage, setPromotionalImage] = useState(initialMediaState(serverTourDate?.promotionalImage));
  const [eventPoster, setEventPoster] = useState(initialMediaState(serverTourDate?.eventPoster));
  const [galleryImages, setGalleryImages] = useState(initialMediaState(serverTourDate?.galleryImages) || []);
  
  const [errors, setErrors] = useState({});
  
  // File input refs
  const venueImageInput = useRef();
  const promotionalImageInput = useRef();
  const eventPosterInput = useRef();
  const galleryImagesInput = useRef();
  
  // Fetch tour date data if not available from server
  useEffect(() => {
    const fetchTourDate = async () => {
      if (!serverTourDate && id) {
        try {
          const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';
          console.log('Tour Edit Client: Fetching tour date', id, 'from:', API_URL);
          
          const response = await fetch(`${API_URL}/api/tour-dates/${id}?populate=venueImage,promotionalImage,eventPoster,galleryImages`, {
            credentials: 'include'
          });
          
          if (!response.ok) {
            throw new Error(`Failed to fetch tour date: ${response.status}`);
          }
          
          const data = await response.json();
          const attr = data.data.attributes;
          
          // Map media fields to {id, url}
          const mapMedia = (media) => {
            if (!media || !media.data) return null;
            if (Array.isArray(media.data)) {
              return media.data.map(m => ({
                id: m.id,
                url: m.attributes.url
              }));
            }
            return {
              id: media.data.id,
              url: media.data.attributes.url
            };
          };
          
          const tourDateData = {
            id: data.data.id,
            eventName: attr.eventName || '',
            date: attr.date || '',
            venueName: attr.venueName || '',
            city: attr.city || '',
            state: attr.state || '',
            country: attr.country || '',
            ticketLink: attr.ticketLink || '',
            isSoldOut: attr.isSoldOut || false,
            isAnnounced: attr.isAnnounced ?? true,
            isCancelled: attr.isCancelled || false,
            venueAddress: attr.venueAddress || '',
            venueWebsite: attr.venueWebsite || '',
            description: attr.description || '',
            otherArtists: attr.otherArtists || '',
            venueImage: mapMedia(attr.venueImage),
            promotionalImage: mapMedia(attr.promotionalImage),
            eventPoster: mapMedia(attr.eventPoster),
            galleryImages: mapMedia(attr.galleryImages) || []
          };
          
          setTourDate(tourDateData);
          setFormData({
            eventName: tourDateData.eventName,
            date: tourDateData.date ? tourDateData.date.slice(0, 16) : '',
            venueName: tourDateData.venueName,
            city: tourDateData.city,
            state: tourDateData.state,
            country: tourDateData.country,
            ticketLink: tourDateData.ticketLink,
            isSoldOut: tourDateData.isSoldOut,
            isAnnounced: tourDateData.isAnnounced,
            isCancelled: tourDateData.isCancelled,
            venueAddress: tourDateData.venueAddress,
            venueWebsite: tourDateData.venueWebsite,
            description: tourDateData.description,
            otherArtists: tourDateData.otherArtists,
          });
          
          setVenueImage(initialMediaState(tourDateData.venueImage));
          setPromotionalImage(initialMediaState(tourDateData.promotionalImage));
          setEventPoster(initialMediaState(tourDateData.eventPoster));
          setGalleryImages(initialMediaState(tourDateData.galleryImages) || []);
        } catch (error) {
          console.error('Tour Edit Client: Error fetching tour date:', error);
          setError('Failed to load tour date. Please try again.');
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchTourDate();
  }, [id, serverTourDate]);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  // Handle single image change
  const handleSingleImageChange = (e, setImage) => {
    const file = e.target.files[0];
    if (file) {
      setImage({ id: null, url: URL.createObjectURL(file), file, toRemove: false });
    }
  };
  
  // Remove single image
  const handleRemoveSingleImage = (setImage) => {
    setImage({ id: null, url: '', file: null, toRemove: true });
  };
  
  // Handle gallery images change
  const handleGalleryImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setGalleryImages([
      ...galleryImages,
      ...files.map(file => ({ id: null, url: URL.createObjectURL(file), file, toRemove: false }))
    ]);
  };
  
  // Remove gallery image
  const handleRemoveGalleryImage = (idx) => {
    setGalleryImages(galleryImages.map((img, i) => i === idx ? { ...img, toRemove: true } : img));
  };
  
  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.eventName.trim()) {
      newErrors.eventName = 'Event name is required';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    if (!formData.venueName.trim()) {
      newErrors.venueName = 'Venue name is required';
    }
    
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    
    if (!formData.country.trim()) {
      newErrors.country = 'Country is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';
      const form = new FormData();
      
      // Add text fields
      Object.entries(formData).forEach(([key, value]) => form.append(`data[${key}]`, value));
      
      // Handle single images
      if (venueImage?.file) form.append('files.venueImage', venueImage.file);
      if (venueImage?.toRemove) form.append('data[venueImage]', '');
      if (promotionalImage?.file) form.append('files.promotionalImage', promotionalImage.file);
      if (promotionalImage?.toRemove) form.append('data[promotionalImage]', '');
      if (eventPoster?.file) form.append('files.eventPoster', eventPoster.file);
      if (eventPoster?.toRemove) form.append('data[eventPoster]', '');
      
      // Handle gallery images
      galleryImages.forEach((img, idx) => {
        if (img.file && !img.toRemove) form.append('files.galleryImages', img.file);
        if (img.id && img.toRemove) form.append('data[galleryImages][disconnect][]', img.id);
      });
      
      // PUT multipart update
      const response = await fetch(`${API_URL}/api/tour-dates/${id}`, {
        method: 'PUT',
        body: form,
        headers: {
          // 'Content-Type' intentionally omitted for FormData
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to update tour date');
      }
      
      // Navigate back to the tour dates list
      router.push('/admin/tour');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error updating tour date. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Render image preview or upload button
  const renderSingleImage = (label, image, setImage, inputRef) => (
    <div className="mb-4">
      <label className="block text-sm mb-1">{label}</label>
      {image && image.url && !image.toRemove ? (
        <div className="mb-2 flex items-center space-x-2">
          <img src={image.url} alt={label} className="h-20 rounded border border-electric-blue/30" />
          <button type="button" onClick={() => handleRemoveSingleImage(setImage)} className="text-red-400 hover:text-red-300">Remove</button>
        </div>
      ) : null}
      <input type="file" accept="image/*" ref={inputRef} onChange={e => handleSingleImageChange(e, setImage)} className="block" />
    </div>
  );
  
  // Render gallery images
  const renderGalleryImages = () => (
    <div className="mb-4">
      <label className="block text-sm mb-1">Gallery Images</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {galleryImages.map((img, idx) =>
          !img.toRemove ? (
            <div key={img.id || img.url || idx} className="relative group">
              <img src={img.url} alt="Gallery" className="h-20 rounded border border-electric-blue/30" />
              <button type="button" onClick={() => handleRemoveGalleryImage(idx)} className="absolute top-0 right-0 bg-black/60 text-red-400 px-1 rounded-bl group-hover:block">&times;</button>
            </div>
          ) : null
        )}
      </div>
      <input type="file" accept="image/*" multiple ref={galleryImagesInput} onChange={handleGalleryImagesChange} className="block" />
    </div>
  );
  
  if (isLoading) {
    return (
      <AdminLayout title="Edit Tour Date">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-electric-blue"></div>
        </div>
      </AdminLayout>
    );
  }
  
  if (error) {
    return (
      <AdminLayout title="Edit Tour Date">
        <div className="text-center py-12">
          <h1 className="text-2xl text-white mb-4">Error Loading Tour Date</h1>
          <p className="text-white/70 mb-6">{error}</p>
          <button
            onClick={() => router.push('/admin/tour')}
            className="bg-electric-blue hover:bg-electric-blue/80 text-white px-4 py-2 rounded-md transition-colors"
          >
            Back to Tour Dates
          </button>
        </div>
      </AdminLayout>
    );
  }
  
  if (!tourDate) {
    return (
      <AdminLayout title="Edit Tour Date">
        <div className="text-center py-12">
          <h1 className="text-2xl text-white mb-4">Tour Date Not Found</h1>
          <p className="text-white/70 mb-6">The tour date you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/admin/tour')}
            className="bg-electric-blue hover:bg-electric-blue/80 text-white px-4 py-2 rounded-md transition-colors"
          >
            Back to Tour Dates
          </button>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout title="Edit Tour Date">
      <div className="mb-6 flex items-center">
        <button
          onClick={() => router.back()}
          className="mr-4 text-ice-blue hover:text-electric-blue transition-colors"
        >
          &larr; Back
        </button>
        <h1 className="text-3xl font-mulish lowercase text-ice-blue">edit tour date</h1>
      </div>
      
      <div className="bg-navy/80 backdrop-blur-md rounded-lg border border-electric-blue/30 p-6">
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column */}
            <div className="space-y-6">
              {/* Event Name */}
              <div>
                <label htmlFor="eventName" className="block text-sm mb-1">Event Name *</label>
                <input
                  id="eventName"
                  name="eventName"
                  type="text"
                  required
                  value={formData.eventName}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 bg-sapphire/30 border ${
                    errors.eventName ? 'border-red-500' : 'border-electric-blue/30'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-electric-blue text-white`}
                />
                {errors.eventName && (
                  <p className="mt-1 text-sm text-red-400">{errors.eventName}</p>
                )}
              </div>
              
              {/* Date */}
              <div>
                <label htmlFor="date" className="block text-sm mb-1">Date & Time *</label>
                <input
                  id="date"
                  name="date"
                  type="datetime-local"
                  required
                  value={formData.date}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 bg-sapphire/30 border ${
                    errors.date ? 'border-red-500' : 'border-electric-blue/30'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-electric-blue text-white`}
                />
                {errors.date && (
                  <p className="mt-1 text-sm text-red-400">{errors.date}</p>
                )}
              </div>
              
              {/* Venue Name */}
              <div>
                <label htmlFor="venueName" className="block text-sm mb-1">Venue Name *</label>
                <input
                  id="venueName"
                  name="venueName"
                  type="text"
                  required
                  value={formData.venueName}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 bg-sapphire/30 border ${
                    errors.venueName ? 'border-red-500' : 'border-electric-blue/30'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-electric-blue text-white`}
                  placeholder="Venue name"
                />
                {errors.venueName && (
                  <p className="mt-1 text-sm text-red-400">{errors.venueName}</p>
                )}
              </div>
              
              {/* City */}
              <div>
                <label htmlFor="city" className="block text-sm mb-1">City *</label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 bg-sapphire/30 border ${
                    errors.city ? 'border-red-500' : 'border-electric-blue/30'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-electric-blue text-white`}
                  placeholder="City, State/Province"
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-400">{errors.city}</p>
                )}
              </div>
              
              {/* State */}
              <div>
                <label htmlFor="state" className="block text-sm mb-1">State</label>
                <input
                  id="state"
                  name="state"
                  type="text"
                  value={formData.state}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 bg-sapphire/30 border ${
                    errors.state ? 'border-red-500' : 'border-electric-blue/30'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-electric-blue text-white`}
                />
              </div>
              
              {/* Country */}
              <div>
                <label htmlFor="country" className="block text-sm mb-1">Country *</label>
                <input
                  id="country"
                  name="country"
                  type="text"
                  required
                  value={formData.country}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 bg-sapphire/30 border ${
                    errors.country ? 'border-red-500' : 'border-electric-blue/30'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-electric-blue text-white`}
                />
                {errors.country && (
                  <p className="mt-1 text-sm text-red-400">{errors.country}</p>
                )}
              </div>
            </div>
            
            {/* Right column */}
            <div className="space-y-6">
              {/* Ticket Link */}
              <div>
                <label htmlFor="ticketLink" className="block text-sm mb-1">Ticket Link</label>
                <input
                  id="ticketLink"
                  name="ticketLink"
                  type="url"
                  value={formData.ticketLink}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 bg-sapphire/30 border ${
                    errors.ticketLink ? 'border-red-500' : 'border-electric-blue/30'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-electric-blue text-white`}
                  placeholder="https://tickets.example.com/event"
                />
                {errors.ticketLink && (
                  <p className="mt-1 text-sm text-red-400">{errors.ticketLink}</p>
                )}
                <p className="mt-1 text-xs text-white/60">
                  Optional: Link to ticket sales page
                </p>
              </div>
              
              {/* Venue Address */}
              <div>
                <label htmlFor="venueAddress" className="block text-sm mb-1">Venue Address</label>
                <input
                  id="venueAddress"
                  name="venueAddress"
                  type="text"
                  value={formData.venueAddress}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 bg-sapphire/30 border ${
                    errors.venueAddress ? 'border-red-500' : 'border-electric-blue/30'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-electric-blue text-white`}
                  placeholder="Venue address"
                />
              </div>
              
              {/* Venue Website */}
              <div>
                <label htmlFor="venueWebsite" className="block text-sm mb-1">Venue Website</label>
                <input
                  id="venueWebsite"
                  name="venueWebsite"
                  type="url"
                  value={formData.venueWebsite}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 bg-sapphire/30 border ${
                    errors.venueWebsite ? 'border-red-500' : 'border-electric-blue/30'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-electric-blue text-white`}
                  placeholder="https://venue.example.com"
                />
              </div>
              
              {/* Other Artists */}
              <div>
                <label htmlFor="otherArtists" className="block text-sm mb-1">Other Artists</label>
                <input
                  id="otherArtists"
                  name="otherArtists"
                  type="text"
                  value={formData.otherArtists}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 bg-sapphire/30 border ${
                    errors.otherArtists ? 'border-red-500' : 'border-electric-blue/30'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-electric-blue text-white`}
                  placeholder="Additional artists"
                />
              </div>
              
              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm mb-1">Description</label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-sapphire/30 border border-electric-blue/30 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-blue text-white resize-none"
                  placeholder="Additional details about the show (optional)"
                />
              </div>
              
              {/* Sold Out */}
              <div className="flex items-center">
                <input
                  id="isSoldOut"
                  name="isSoldOut"
                  type="checkbox"
                  checked={formData.isSoldOut}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-electric-blue/50 focus:ring-electric-blue"
                />
                <label htmlFor="isSoldOut" className="ml-2 block text-sm">
                  Mark as sold out
                </label>
              </div>
            </div>
          </div>
          
          {/* Form Actions */}
          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push('/admin/tour')}
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

      {/* Image Upload Section */}
      <div className="mt-8 bg-navy/80 backdrop-blur-md rounded-lg border border-electric-blue/30 p-6">
        <h2 className="text-xl font-mulish lowercase text-ice-blue mb-6">Images</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left column */}
          <div className="space-y-6">
            {/* Venue Image */}
            {renderSingleImage('Venue Image', venueImage, setVenueImage, venueImageInput)}
            
            {/* Promotional Image */}
            {renderSingleImage('Promotional Image', promotionalImage, setPromotionalImage, promotionalImageInput)}
          </div>
          
          {/* Right column */}
          <div className="space-y-6">
            {/* Event Poster */}
            {renderSingleImage('Event Poster', eventPoster, setEventPoster, eventPosterInput)}
            
            {/* Gallery Images */}
            {renderGalleryImages()}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

// Fetch tour date data on the server side
export async function getServerSideProps({ params }) {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';
    
    console.log('Tour Edit SSR: Fetching tour date', params.id, 'from:', API_URL);
    
    // Fetch tour date with all relations
    const response = await fetch(`${API_URL}/api/tour-dates/${params.id}?populate=venueImage,promotionalImage,eventPoster,galleryImages`);
    
    if (!response.ok) {
      console.error('Tour Edit SSR: Failed to fetch tour date:', response.status);
      return {
        props: {
          serverTourDate: null
        }
      };
    }
    
    const data = await response.json();
    const attr = data.data.attributes;
    
    // Map media fields to {id, url}
    const mapMedia = (media) => {
      if (!media || !media.data) return null;
      if (Array.isArray(media.data)) {
        return media.data.map(m => ({
          id: m.id,
          url: m.attributes.url
        }));
      }
      return {
        id: media.data.id,
        url: media.data.attributes.url
      };
    };
    
    const serverTourDate = {
      id: data.data.id,
      eventName: attr.eventName || '',
      date: attr.date || '',
      venueName: attr.venueName || '',
      city: attr.city || '',
      state: attr.state || '',
      country: attr.country || '',
      ticketLink: attr.ticketLink || '',
      isSoldOut: attr.isSoldOut || false,
      isAnnounced: attr.isAnnounced ?? true,
      isCancelled: attr.isCancelled || false,
      venueAddress: attr.venueAddress || '',
      venueWebsite: attr.venueWebsite || '',
      description: attr.description || '',
      otherArtists: attr.otherArtists || '',
      venueImage: mapMedia(attr.venueImage),
      promotionalImage: mapMedia(attr.promotionalImage),
      eventPoster: mapMedia(attr.eventPoster),
      galleryImages: mapMedia(attr.galleryImages) || []
    };
    
    console.log('Tour Edit SSR: Found tour date:', serverTourDate.venueName);
    
    return {
      props: {
        serverTourDate
      }
    };
  } catch (error) {
    console.error('Tour Edit SSR: Error fetching data:', error);
    
    return {
      props: {
        serverTourDate: null
      }
    };
  }
}
