import React, { useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../components/AdminLayout';

export default function PressKitPage({ serverPressKit }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(!serverPressKit);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [pressKit, setPressKit] = useState({
    password: serverPressKit?.password || '',
    description: serverPressKit?.description || '',
    downloadInstructions: serverPressKit?.downloadInstructions || '',
    usageGuidelines: serverPressKit?.usageGuidelines || '',
    contactInfo: serverPressKit?.contactInfo || ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPressKit({
      ...pressKit,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';
      
      const pressKitData = {
        password: pressKit.password,
        description: pressKit.description,
        downloadInstructions: pressKit.downloadInstructions,
        usageGuidelines: pressKit.usageGuidelines,
        contactInfo: pressKit.contactInfo
      };
      
      // Since Press Kit is a single type, we use PUT to update it
      const response = await fetch(`${API_URL}/api/press-kit`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: pressKitData
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update press kit');
      }
      
      alert('Press kit updated successfully!');
    } catch (error) {
      console.error('Error updating press kit:', error);
      alert('An error occurred while updating the press kit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="Press Kit">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-electric-blue"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Press Kit">
      <div className="mb-6">
        <h1 className="text-3xl font-mulish lowercase text-ice-blue mb-2">press kit</h1>
        <p className="text-white/70">manage your press materials and access settings</p>
      </div>
      
      {/* Current Status */}
      <div className="bg-electric-blue/10 p-4 rounded-lg border border-electric-blue/30 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white">
              <span className="font-medium text-ice-blue">Press Kit Status:</span> 
              {pressKit.password ? ' Password Protected' : ' Open Access'}
            </p>
            <p className="text-white/70 text-sm mt-1">
              Public URL: <span className="text-ice-blue">https://evanjames.com/press</span>
            </p>
          </div>
          <a 
            href="/press" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-ice-blue hover:text-electric-blue transition-colors text-sm"
          >
            View Public Page →
          </a>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Access Control */}
          <div className="bg-navy/80 backdrop-blur-md p-6 rounded-lg border border-electric-blue/30">
            <h2 className="text-xl font-mulish lowercase text-ice-blue mb-4">access control</h2>
            
            <div>
              <label htmlFor="password" className="block text-sm mb-1">Access Password</label>
              <input
                id="password"
                name="password"
                type="text"
                value={pressKit.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-sapphire/30 border border-electric-blue/30 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-blue text-white"
                placeholder="Leave empty for open access"
              />
              <p className="mt-1 text-xs text-white/60">
                Set a password to restrict access to press materials. Leave empty for public access.
              </p>
            </div>
          </div>
          
          {/* Press Kit Description */}
          <div className="bg-navy/80 backdrop-blur-md p-6 rounded-lg border border-electric-blue/30">
            <h2 className="text-xl font-mulish lowercase text-ice-blue mb-4">press kit description</h2>
            <p className="text-sm text-white/70 mb-4">
              Brief description of what's included in your press kit. This appears at the top of the press page.
            </p>
            <textarea
              name="description"
              value={pressKit.description}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-3 py-2 bg-sapphire/30 border border-electric-blue/30 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-blue text-white"
              placeholder="Welcome to Evan James' press kit. Here you'll find high-resolution photos, bio, and press materials..."
            ></textarea>
          </div>
          
          {/* Download Instructions */}
          <div className="bg-navy/80 backdrop-blur-md p-6 rounded-lg border border-electric-blue/30">
            <h2 className="text-xl font-mulish lowercase text-ice-blue mb-4">download instructions</h2>
            <p className="text-sm text-white/70 mb-4">
              Instructions for media on how to download and use the press materials.
            </p>
            <textarea
              name="downloadInstructions"
              value={pressKit.downloadInstructions}
              onChange={handleInputChange}
              rows="4"
              className="w-full px-3 py-2 bg-sapphire/30 border border-electric-blue/30 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-blue text-white"
              placeholder="Click on any image to view full size. Right-click and 'Save As' to download..."
            ></textarea>
          </div>
          
          {/* Usage Guidelines */}
          <div className="bg-navy/80 backdrop-blur-md p-6 rounded-lg border border-electric-blue/30">
            <h2 className="text-xl font-mulish lowercase text-ice-blue mb-4">usage guidelines</h2>
            <p className="text-sm text-white/70 mb-4">
              Guidelines for how press materials can be used by media outlets.
            </p>
            <textarea
              name="usageGuidelines"
              value={pressKit.usageGuidelines}
              onChange={handleInputChange}
              rows="4"
              className="w-full px-3 py-2 bg-sapphire/30 border border-electric-blue/30 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-blue text-white"
              placeholder="All images are available for editorial use. Please credit photographer when possible..."
            ></textarea>
          </div>
          
          {/* Contact Information */}
          <div className="bg-navy/80 backdrop-blur-md p-6 rounded-lg border border-electric-blue/30">
            <h2 className="text-xl font-mulish lowercase text-ice-blue mb-4">press contact</h2>
            <p className="text-sm text-white/70 mb-4">
              Contact information for press inquiries and additional materials.
            </p>
            <textarea
              name="contactInfo"
              value={pressKit.contactInfo}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-3 py-2 bg-sapphire/30 border border-electric-blue/30 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-blue text-white"
              placeholder="For additional press materials or interview requests, contact: press@evanjames.com"
            ></textarea>
          </div>
          
          {/* Form Actions */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-electric-blue text-white rounded-md hover:bg-electric-blue/80 transition-colors disabled:opacity-50 flex items-center"
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
      
      {/* Press Materials Management */}
      <div className="mt-8 bg-navy/80 backdrop-blur-md p-6 rounded-lg border border-electric-blue/30">
        <h2 className="text-xl font-mulish lowercase text-ice-blue mb-4">press materials</h2>
        <p className="text-white/70 mb-4">
          Manage the photos and files that appear in your press kit. These are pulled from your Photos collection.
        </p>
        <div className="flex space-x-4">
          <a 
            href="/admin/photos" 
            className="bg-electric-blue/20 hover:bg-electric-blue/30 text-ice-blue px-4 py-2 rounded-md transition-colors"
          >
            Manage Photos
          </a>
          <a 
            href="http://localhost:1337/admin/content-manager/singleType/api::press-kit.press-kit" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-sapphire/30 hover:bg-sapphire/40 text-white px-4 py-2 rounded-md transition-colors"
          >
            Advanced Settings in Strapi
          </a>
        </div>
      </div>
    </AdminLayout>
  );
}

// Fetch press kit data on the server side
export async function getServerSideProps() {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';
    
    console.log('Press Kit SSR: Fetching data from:', API_URL);
    
    // Fetch press kit data (single type)
    const response = await fetch(`${API_URL}/api/press-kit`);
    
    if (!response.ok) {
      console.error('Press Kit SSR: Failed to fetch press kit:', response.status);
      return {
        props: {
          serverPressKit: null
        }
      };
    }
    
    const data = await response.json();
    
    // Transform Strapi data to match our component structure
    const serverPressKit = {
      password: data.data?.attributes?.password || '',
      description: data.data?.attributes?.description || '',
      downloadInstructions: data.data?.attributes?.downloadInstructions || '',
      usageGuidelines: data.data?.attributes?.usageGuidelines || '',
      contactInfo: data.data?.attributes?.contactInfo || ''
    };
    
    console.log('Press Kit SSR: Found press kit data');
    
    return {
      props: {
        serverPressKit
      }
    };
  } catch (error) {
    console.error('Press Kit SSR: Error fetching data:', error);
    
    return {
      props: {
        serverPressKit: null
      }
    };
  }
}
