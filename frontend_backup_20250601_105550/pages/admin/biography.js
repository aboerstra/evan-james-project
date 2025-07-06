import React, { useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../components/AdminLayout';

export default function BiographyPage({ serverBio }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(!serverBio);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [biography, setBiography] = useState({
    shortBio: serverBio?.shortBio || '',
    fullBio: serverBio?.fullBio || '',
    highlights: serverBio?.highlights?.length > 0 ? serverBio.highlights : ['']
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBiography({
      ...biography,
      [name]: value
    });
  };

  const handleHighlightChange = (index, value) => {
    const updatedHighlights = [...biography.highlights];
    updatedHighlights[index] = value;
    setBiography({
      ...biography,
      highlights: updatedHighlights
    });
  };

  const addHighlight = () => {
    setBiography({
      ...biography,
      highlights: [...biography.highlights, '']
    });
  };

  const removeHighlight = (index) => {
    const updatedHighlights = [...biography.highlights];
    updatedHighlights.splice(index, 1);
    setBiography({
      ...biography,
      highlights: updatedHighlights
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';
      
      // Filter out empty highlights
      const filteredHighlights = biography.highlights.filter(highlight => highlight.trim());
      
      const bioData = {
        shortBio: biography.shortBio,
        fullBio: biography.fullBio,
        highlights: filteredHighlights
      };
      
      // Since Bio is a single type, we use PUT to update it
      const response = await fetch(`${API_URL}/api/bio`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: bioData
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update biography');
      }
      
      alert('Biography updated successfully!');
    } catch (error) {
      console.error('Error updating biography:', error);
      alert('An error occurred while updating the biography. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="Artist Biography">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-electric-blue"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Artist Biography">
      <div className="mb-6">
        <h1 className="text-3xl font-mulish lowercase text-ice-blue mb-2">artist biography</h1>
        <p className="text-white/70">manage your artist bio and career highlights</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Short Bio */}
          <div className="bg-navy/80 backdrop-blur-md p-6 rounded-lg border border-electric-blue/30">
            <h2 className="text-xl font-mulish lowercase text-ice-blue mb-4">short biography</h2>
            <p className="text-sm text-white/70 mb-4">
              A brief 1-2 sentence bio for press use and quick introductions. This will appear on your homepage.
            </p>
            <textarea
              name="shortBio"
              value={biography.shortBio}
              onChange={handleInputChange}
              rows="2"
              className="w-full px-3 py-2 bg-sapphire/30 border border-electric-blue/30 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-blue text-white"
            ></textarea>
          </div>
          
          {/* Full Bio */}
          <div className="bg-navy/80 backdrop-blur-md p-6 rounded-lg border border-electric-blue/30">
            <h2 className="text-xl font-mulish lowercase text-ice-blue mb-4">full biography</h2>
            <p className="text-sm text-white/70 mb-4">
              Your complete artist biography. This will appear on the About page.
            </p>
            <textarea
              name="fullBio"
              value={biography.fullBio}
              onChange={handleInputChange}
              rows="8"
              className="w-full px-3 py-2 bg-sapphire/30 border border-electric-blue/30 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-blue text-white"
            ></textarea>
          </div>
          
          {/* Career Highlights */}
          <div className="bg-navy/80 backdrop-blur-md p-6 rounded-lg border border-electric-blue/30">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-mulish lowercase text-ice-blue">career highlights</h2>
              <button
                type="button"
                onClick={addHighlight}
                className="text-ice-blue hover:text-electric-blue transition-colors"
              >
                + add highlight
              </button>
            </div>
            
            <p className="text-sm text-white/70 mb-4">
              Key achievements, releases, performances, or milestones. These will appear as bullet points on your About page.
            </p>
            
            <div className="space-y-3">
              {biography.highlights.map((highlight, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={highlight}
                    onChange={(e) => handleHighlightChange(index, e.target.value)}
                    placeholder="Add a career highlight"
                    className="flex-1 px-3 py-2 bg-sapphire/30 border border-electric-blue/30 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-blue text-white"
                  />
                  {biography.highlights.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeHighlight(index)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Image Management */}
          <div className="bg-navy/80 backdrop-blur-md p-6 rounded-lg border border-electric-blue/30">
            <h2 className="text-xl font-mulish lowercase text-ice-blue mb-4">image management</h2>
            <p className="text-sm text-white/70 mb-4">
              Manage all images for the About page through the Strapi admin interface. This includes:
            </p>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-electric-blue rounded-full mt-2"></div>
                <div>
                  <p className="text-white font-medium">Headshot</p>
                  <p className="text-sm text-white/70">Main portrait image for the bio section (800x800px recommended)</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-electric-blue rounded-full mt-2"></div>
                <div>
                  <p className="text-white font-medium">Header Image</p>
                  <p className="text-sm text-white/70">Hero banner image at the top of the About page (1920x600px recommended)</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-electric-blue rounded-full mt-2"></div>
                <div>
                  <p className="text-white font-medium">Gallery Images</p>
                  <p className="text-sm text-white/70">Multiple images for the visual portfolio section (various sizes)</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="http://localhost:1337/admin/content-manager/singleType/api::bio.bio"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-electric-blue text-white rounded-md hover:bg-electric-blue/80 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Manage Images in Strapi
              </a>
              
              <a
                href="/about"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-sapphire text-white rounded-md hover:bg-sapphire/80 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Preview About Page
              </a>
            </div>
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
    </AdminLayout>
  );
}

// Fetch biography data on the server side
export async function getServerSideProps() {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';
    
    console.log('Biography SSR: Fetching data from:', API_URL);
    
    // Fetch bio data (single type)
    const response = await fetch(`${API_URL}/api/bio`);
    
    if (!response.ok) {
      console.error('Biography SSR: Failed to fetch bio:', response.status);
      return {
        props: {
          serverBio: null
        }
      };
    }
    
    const data = await response.json();
    
    // Transform Strapi data to match our component structure
    const serverBio = {
      shortBio: data.data?.attributes?.shortBio || '',
      fullBio: data.data?.attributes?.fullBio || '',
      highlights: data.data?.attributes?.highlights || []
    };
    
    console.log('Biography SSR: Found bio data');
    
    return {
      props: {
        serverBio
      }
    };
  } catch (error) {
    console.error('Biography SSR: Error fetching data:', error);
    
    return {
      props: {
        serverBio: null
      }
    };
  }
}
