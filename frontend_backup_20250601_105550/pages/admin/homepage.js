import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../components/AdminLayout';
import { getSiteSettings, updateSiteSettings } from '../../services/siteSettingsService';
import { uploadFile } from '../../services/api';
import { FaImage, FaSave, FaEye } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';
import Link from 'next/link';

export default function AdminHomepage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState(null);
  const [formData, setFormData] = useState({
    // Hero Section
    heroTitle: '',
    heroSubtitle: '',
    heroDescription: '',
    heroButtonText: '',
    heroSecondaryButtonText: '',
    
    // About Section
    aboutTitle: '',
    aboutShortDescription: '',
    aboutFullDescription: '',
    aboutButtonText: '',
    
    // Music Video Section
    videoSectionTitle: '',
    videoSectionDescription: '',
    
    // Newsletter Section
    newsletterTitle: '',
    newsletterDescription: '',
    newsletterButtonText: '',
    
    // SEO
    metaTitle: '',
    metaDescription: ''
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch settings on page load
  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await getSiteSettings();
        if (response && response.data) {
          const data = response.data.attributes;
          setSettings({
            id: response.data.id,
            ...data
          });
          
          // Initialize form data
          setFormData({
            heroTitle: data.heroTitle || 'evan james',
            heroSubtitle: data.heroSubtitle || 'independent pop artist',
            heroDescription: data.heroDescription || 'creating cinematic soundscapes with introspective lyrics',
            heroButtonText: data.heroButtonText || 'listen now',
            heroSecondaryButtonText: data.heroSecondaryButtonText || 'learn more',
            
            aboutTitle: data.aboutTitle || 'about evan james',
            aboutShortDescription: data.aboutShortDescription || 'evan james is an independent pop artist based in new york city, creating cinematic soundscapes with introspective lyrics that explore themes of identity, expectation, and transformation.',
            aboutFullDescription: data.aboutFullDescription || 'his debut ep "tainted blue" represents his artistic vision that balances commercial accessibility with artistic integrity, drawing inspiration from artists like troye sivan, lorde, and frank ocean.',
            aboutButtonText: data.aboutButtonText || 'read more',
            
            videoSectionTitle: data.videoSectionTitle || 'cool skin — official visual',
            videoSectionDescription: data.videoSectionDescription || 'directed by sarah winters. shot on location in new york city, winter 2025.',
            
            newsletterTitle: data.newsletterTitle || 'stay connected',
            newsletterDescription: data.newsletterDescription || 'get the latest updates on new releases, tour dates, and exclusive content.',
            newsletterButtonText: data.newsletterButtonText || 'subscribe',
            
            metaTitle: data.metaTitle || 'evan james | official website',
            metaDescription: data.metaDescription || 'independent pop artist creating cinematic soundscapes. listen to the latest releases and stay updated on tour dates.'
          });
        }
      } catch (error) {
        console.error('Error fetching site settings:', error);
        setErrorMessage('Failed to load homepage settings. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchSettings();
  }, []);

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  // Handle image upload
  const handleImageUpload = async (field, file) => {
    if (!file) return;
    
    try {
      const uploadResponse = await uploadFile(file);
      if (uploadResponse && uploadResponse[0]) {
        const fileId = uploadResponse[0].id;
        
        // Update the settings with the new image ID
        const updateData = {
          [field]: fileId
        };
        
        await updateSiteSettings(null, updateData);
        
        setSuccessMessage('Image uploaded successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
        
        // Refresh settings
        const response = await getSiteSettings();
        if (response && response.data) {
          setSettings({
            id: response.data.id,
            ...response.data.attributes
          });
        }
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setErrorMessage('Failed to upload image. Please try again.');
      setTimeout(() => setErrorMessage(''), 5000);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const updateData = {
        ...formData
      };
      
      await updateSiteSettings(null, updateData);
      
      setSuccessMessage('Homepage settings saved successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      
    } catch (error) {
      console.error('Error saving homepage settings:', error);
      
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        setErrorMessage('Authentication required. Please log out and log back in to the admin panel.');
      } else {
        setErrorMessage('Failed to save homepage settings. Please try again.');
      }
      
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setSaving(false);
    }
  };

  // Handle preview
  const handlePreview = () => {
    window.open('/', '_blank');
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-electric-blue"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-navy via-sapphire/30 to-navy p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-mulish font-light text-ice-blue">homepage settings</h1>
            <div className="flex gap-4">
              <button
                onClick={handleSubmit}
                disabled={saving}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold ${
                  saving
                    ? 'bg-electric-blue/50 cursor-not-allowed'
                    : 'bg-electric-blue hover:bg-electric-blue/80'
                } text-white transition-colors`}
              >
                <FaSave />
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
              <button
                onClick={handlePreview}
                className="flex items-center gap-2 px-4 py-2 bg-sapphire hover:bg-sapphire/80 text-white rounded-md transition-colors"
              >
                <FaEye />
                Preview
              </button>
              <Link href="/admin" className="px-4 py-2 bg-navy/50 hover:bg-navy/70 text-white rounded-md transition-colors">
                Back to Admin
              </Link>
            </div>
          </div>

          {/* Success/Error Messages */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-md text-green-100">
              {successMessage}
            </div>
          )}
          
          {errorMessage && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-md text-red-100">
              {errorMessage}
            </div>
          )}

          {/* Homepage Settings Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Hero Section */}
            <div className="bg-navy/80 backdrop-blur-md rounded-lg shadow-md border border-electric-blue/30 p-6">
              <h2 className="text-xl font-mulish font-light mb-6 text-ice-blue">hero section</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-ice-blue mb-2">
                    Main Title
                  </label>
                  <input
                    type="text"
                    value={formData.heroTitle}
                    onChange={(e) => handleInputChange('heroTitle', e.target.value)}
                    className="w-full p-3 bg-navy/50 border border-electric-blue/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-electric-blue"
                    placeholder="evan james"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ice-blue mb-2">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={formData.heroSubtitle}
                    onChange={(e) => handleInputChange('heroSubtitle', e.target.value)}
                    className="w-full p-3 bg-navy/50 border border-electric-blue/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-electric-blue"
                    placeholder="independent pop artist"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-ice-blue mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.heroDescription}
                    onChange={(e) => handleInputChange('heroDescription', e.target.value)}
                    rows={3}
                    className="w-full p-3 bg-navy/50 border border-electric-blue/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-electric-blue"
                    placeholder="creating cinematic soundscapes with introspective lyrics"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ice-blue mb-2">
                    Primary Button Text
                  </label>
                  <input
                    type="text"
                    value={formData.heroButtonText}
                    onChange={(e) => handleInputChange('heroButtonText', e.target.value)}
                    className="w-full p-3 bg-navy/50 border border-electric-blue/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-electric-blue"
                    placeholder="listen now"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ice-blue mb-2">
                    Secondary Button Text
                  </label>
                  <input
                    type="text"
                    value={formData.heroSecondaryButtonText}
                    onChange={(e) => handleInputChange('heroSecondaryButtonText', e.target.value)}
                    className="w-full p-3 bg-navy/50 border border-electric-blue/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-electric-blue"
                    placeholder="learn more"
                  />
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="bg-navy/80 backdrop-blur-md rounded-lg shadow-md border border-electric-blue/30 p-6">
              <h2 className="text-xl font-mulish font-light mb-6 text-ice-blue">about section</h2>
              
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-ice-blue mb-2">
                    Section Title
                  </label>
                  <input
                    type="text"
                    value={formData.aboutTitle}
                    onChange={(e) => handleInputChange('aboutTitle', e.target.value)}
                    className="w-full p-3 bg-navy/50 border border-electric-blue/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-electric-blue"
                    placeholder="about evan james"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ice-blue mb-2">
                    Short Description
                  </label>
                  <textarea
                    value={formData.aboutShortDescription}
                    onChange={(e) => handleInputChange('aboutShortDescription', e.target.value)}
                    rows={4}
                    className="w-full p-3 bg-navy/50 border border-electric-blue/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-electric-blue"
                    placeholder="Brief description that appears prominently..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ice-blue mb-2">
                    Full Description
                  </label>
                  <textarea
                    value={formData.aboutFullDescription}
                    onChange={(e) => handleInputChange('aboutFullDescription', e.target.value)}
                    rows={4}
                    className="w-full p-3 bg-navy/50 border border-electric-blue/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-electric-blue"
                    placeholder="Longer description with more details..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ice-blue mb-2">
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={formData.aboutButtonText}
                    onChange={(e) => handleInputChange('aboutButtonText', e.target.value)}
                    className="w-full p-3 bg-navy/50 border border-electric-blue/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-electric-blue"
                    placeholder="read more"
                  />
                </div>
              </div>
            </div>

            {/* Music Video Section */}
            <div className="bg-navy/80 backdrop-blur-md rounded-lg shadow-md border border-electric-blue/30 p-6">
              <h2 className="text-xl font-mulish font-light mb-6 text-ice-blue">music video section</h2>
              
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-ice-blue mb-2">
                    Video Title
                  </label>
                  <input
                    type="text"
                    value={formData.videoSectionTitle}
                    onChange={(e) => handleInputChange('videoSectionTitle', e.target.value)}
                    className="w-full p-3 bg-navy/50 border border-electric-blue/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-electric-blue"
                    placeholder="cool skin — official visual"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ice-blue mb-2">
                    Video Description
                  </label>
                  <textarea
                    value={formData.videoSectionDescription}
                    onChange={(e) => handleInputChange('videoSectionDescription', e.target.value)}
                    rows={3}
                    className="w-full p-3 bg-navy/50 border border-electric-blue/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-electric-blue"
                    placeholder="directed by sarah winters. shot on location in new york city, winter 2025."
                  />
                </div>
              </div>
            </div>

            {/* Newsletter Section */}
            <div className="bg-navy/80 backdrop-blur-md rounded-lg shadow-md border border-electric-blue/30 p-6">
              <h2 className="text-xl font-mulish font-light mb-6 text-ice-blue">newsletter section</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-ice-blue mb-2">
                    Section Title
                  </label>
                  <input
                    type="text"
                    value={formData.newsletterTitle}
                    onChange={(e) => handleInputChange('newsletterTitle', e.target.value)}
                    className="w-full p-3 bg-navy/50 border border-electric-blue/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-electric-blue"
                    placeholder="stay connected"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ice-blue mb-2">
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={formData.newsletterButtonText}
                    onChange={(e) => handleInputChange('newsletterButtonText', e.target.value)}
                    className="w-full p-3 bg-navy/50 border border-electric-blue/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-electric-blue"
                    placeholder="subscribe"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-ice-blue mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.newsletterDescription}
                    onChange={(e) => handleInputChange('newsletterDescription', e.target.value)}
                    rows={3}
                    className="w-full p-3 bg-navy/50 border border-electric-blue/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-electric-blue"
                    placeholder="get the latest updates on new releases, tour dates, and exclusive content."
                  />
                </div>
              </div>
            </div>

            {/* SEO Settings */}
            <div className="bg-navy/80 backdrop-blur-md rounded-lg shadow-md border border-electric-blue/30 p-6">
              <h2 className="text-xl font-mulish font-light mb-6 text-ice-blue">seo settings</h2>
              
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-ice-blue mb-2">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    value={formData.metaTitle}
                    onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                    className="w-full p-3 bg-navy/50 border border-electric-blue/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-electric-blue"
                    placeholder="evan james | official website"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ice-blue mb-2">
                    Meta Description
                  </label>
                  <textarea
                    value={formData.metaDescription}
                    onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                    rows={3}
                    className="w-full p-3 bg-navy/50 border border-electric-blue/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-electric-blue"
                    placeholder="independent pop artist creating cinematic soundscapes. listen to the latest releases and stay updated on tour dates."
                  />
                </div>
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="bg-navy/80 backdrop-blur-md rounded-lg shadow-md border border-electric-blue/30 p-6">
              <h2 className="text-xl font-mulish font-light mb-6 text-ice-blue">homepage images</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Hero Background */}
                <div>
                  <label className="block text-sm font-medium text-ice-blue mb-2">
                    Hero Background Image
                    <span className="block text-xs text-electric-blue/70 font-normal mt-1">
                      Recommended: 1920×1080px (16:9 ratio)
                    </span>
                  </label>
                  <div className="border-2 border-dashed border-electric-blue/30 rounded-lg p-4 text-center">
                    {settings?.heroBackgroundImage?.data ? (
                      <div className="space-y-2">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_API_URL}${settings.heroBackgroundImage.data.attributes.url}`}
                          alt="Hero Background"
                          width={200}
                          height={120}
                          className="mx-auto object-cover rounded"
                        />
                        <p className="text-sm text-ice-blue">Current background</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <FaImage className="mx-auto text-4xl text-electric-blue/50" />
                        <p className="text-sm text-ice-blue">No background uploaded</p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload('heroBackgroundImage', e.target.files[0])}
                      className="mt-2 block w-full text-sm text-ice-blue file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-electric-blue file:text-white hover:file:bg-electric-blue/80"
                    />
                  </div>
                </div>

                {/* About Background */}
                <div>
                  <label className="block text-sm font-medium text-ice-blue mb-2">
                    About Section Background
                    <span className="block text-xs text-electric-blue/70 font-normal mt-1">
                      Recommended: 800×1200px (2:3 portrait ratio)
                    </span>
                  </label>
                  <div className="border-2 border-dashed border-electric-blue/30 rounded-lg p-4 text-center">
                    {settings?.aboutBackgroundImage?.data ? (
                      <div className="space-y-2">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_API_URL}${settings.aboutBackgroundImage.data.attributes.url}`}
                          alt="About Background"
                          width={200}
                          height={120}
                          className="mx-auto object-cover rounded"
                        />
                        <p className="text-sm text-ice-blue">Current background</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <FaImage className="mx-auto text-4xl text-electric-blue/50" />
                        <p className="text-sm text-ice-blue">No background uploaded</p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload('aboutBackgroundImage', e.target.files[0])}
                      className="mt-2 block w-full text-sm text-ice-blue file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-electric-blue file:text-white hover:file:bg-electric-blue/80"
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </AdminLayout>
  );
}
