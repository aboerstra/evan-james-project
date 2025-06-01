import React, { useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../components/AdminLayout';

export default function NewTourDatePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    date: '',
    venue: '',
    city: '',
    ticketUrl: '',
    description: '',
    soldOut: false
  });
  
  const [errors, setErrors] = useState({});
  
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
  
  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.date.trim()) {
      newErrors.date = 'Date is required';
    }
    
    if (!formData.venue.trim()) {
      newErrors.venue = 'Venue is required';
    }
    
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    
    if (formData.ticketUrl && !isValidUrl(formData.ticketUrl)) {
      newErrors.ticketUrl = 'Please enter a valid URL';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // URL validation helper
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
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
      
      // Create the tour date record
      const tourDateData = {
        date: formData.date,
        venue: formData.venue,
        city: formData.city,
        ticketUrl: formData.ticketUrl || null,
        description: formData.description || null,
        soldOut: formData.soldOut
      };
      
      const response = await fetch(`${API_URL}/api/tour-dates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: tourDateData
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create tour date');
      }
      
      // Navigate back to the tour dates list
      router.push('/admin/tour');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error creating tour date. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <AdminLayout title="Add New Tour Date">
      <div className="mb-6 flex items-center">
        <button
          onClick={() => router.back()}
          className="mr-4 text-ice-blue hover:text-electric-blue transition-colors"
        >
          &larr; Back
        </button>
        <h1 className="text-3xl font-mulish lowercase text-ice-blue">add new tour date</h1>
      </div>
      
      <div className="bg-navy/80 backdrop-blur-md rounded-lg border border-electric-blue/30 p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column */}
            <div className="space-y-6">
              {/* Date */}
              <div>
                <label htmlFor="date" className="block text-sm mb-1">Date</label>
                <input
                  id="date"
                  name="date"
                  type="date"
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
              
              {/* Venue */}
              <div>
                <label htmlFor="venue" className="block text-sm mb-1">Venue</label>
                <input
                  id="venue"
                  name="venue"
                  type="text"
                  required
                  value={formData.venue}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 bg-sapphire/30 border ${
                    errors.venue ? 'border-red-500' : 'border-electric-blue/30'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-electric-blue text-white`}
                  placeholder="Venue name"
                />
                {errors.venue && (
                  <p className="mt-1 text-sm text-red-400">{errors.venue}</p>
                )}
              </div>
              
              {/* City */}
              <div>
                <label htmlFor="city" className="block text-sm mb-1">City</label>
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
            </div>
            
            {/* Right column */}
            <div className="space-y-6">
              {/* Ticket URL */}
              <div>
                <label htmlFor="ticketUrl" className="block text-sm mb-1">Ticket URL</label>
                <input
                  id="ticketUrl"
                  name="ticketUrl"
                  type="url"
                  value={formData.ticketUrl}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 bg-sapphire/30 border ${
                    errors.ticketUrl ? 'border-red-500' : 'border-electric-blue/30'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-electric-blue text-white`}
                  placeholder="https://tickets.example.com/event"
                />
                {errors.ticketUrl && (
                  <p className="mt-1 text-sm text-red-400">{errors.ticketUrl}</p>
                )}
                <p className="mt-1 text-xs text-white/60">
                  Optional: Link to ticket sales page
                </p>
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
                  id="soldOut"
                  name="soldOut"
                  type="checkbox"
                  checked={formData.soldOut}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-electric-blue/50 focus:ring-electric-blue"
                />
                <label htmlFor="soldOut" className="ml-2 block text-sm">
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
                'Save Tour Date'
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
