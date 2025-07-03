import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../components/AdminLayout';
import { getSiteSettings, updateSiteSettings, updateSiteStatus } from '../../services/siteSettingsService';
import { uploadFile } from '../../services/api';
import { FaCalendarAlt, FaImage, FaLock, FaCheck, FaEdit, FaEye, FaSave } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from 'react-datepicker';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import moment from 'moment';

// Dynamic import for rich text editor
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const SiteStatusToggle = ({ currentStatus, onStatusChange }) => {
  const statusOptions = [
    { value: 'live', label: 'Live', icon: <FaCheck className="text-green-500" /> },
    { value: 'coming-soon', label: 'Coming Soon', icon: <FaLock className="text-blue-500" /> },
    { value: 'maintenance', label: 'Maintenance', icon: <FaEdit className="text-red-500" /> }
  ];
  
  return (
    <div className="flex flex-col mb-8 p-4 bg-navy/80 backdrop-blur-md rounded-lg shadow-md border border-electric-blue/30">
      <h2 className="text-lg font-mulish font-light mb-4 text-ice-blue">site status</h2>
      <div className="flex gap-4">
        {statusOptions.map((option) => (
          <button
            key={option.value}
            className={`flex items-center gap-2 px-4 py-2 rounded-md ${
              currentStatus === option.value
                ? 'bg-electric-blue text-white'
                : 'bg-navy/50 text-white hover:bg-navy/70'
            }`}
            onClick={() => onStatusChange(option.value)}
          >
            {option.icon}
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default function AdminComingSoon() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState(null);
  const [siteStatus, setSiteStatus] = useState('live');
  const [scheduledGoLiveDate, setScheduledGoLiveDate] = useState('');
  const [formData, setFormData] = useState({
    // Flattened structure for coming soon
    comingSoonTitle: '',
    comingSoonSubtitle: '',
    comingSoonDescription: '',
    comingSoonShowCountdown: true,
    comingSoonCountdownDate: '',
    comingSoonShowEmailSignup: true,
    comingSoonEmailSignupText: '',
    comingSoonShowSocialMedia: true,
    comingSoonShowImage: true,
    comingSoonSelectedImage: 'default', // 'default', 'custom', or 'none'
    // Site-wide settings
    contactEmail: '',
    contactPhone: '',
    metaTitle: '',
    metaDescription: ''
  });
  const [activeTab, setActiveTab] = useState('coming-soon');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [preview, setPreview] = useState(false);

  // Fetch settings on page load
  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await getSiteSettings();
        if (response && response.data) {
          const data = response.data.attributes;
          
          console.log('=== LOADING SETTINGS DEBUG ===');
          console.log('Image settings from API:', {
            showImage: data.comingSoonShowImage,
            selectedImage: data.comingSoonSelectedImage
          });
          
          // Store the full response data including ID
          setSettings({
            id: response.data.id,
            ...data
          });
          setSiteStatus(data.siteStatus || 'live');
          
          if (data.scheduledGoLiveDate) {
            setScheduledGoLiveDate(moment(data.scheduledGoLiveDate).format('YYYY-MM-DDTHH:mm'));
          }
          
          // Initialize form data with flattened structure
          const selectedImage = data.comingSoonSelectedImage === 'none' ? 'none' : 
                               (data.comingSoonSelectedImage === 'custom' ? 'custom' : 'default');
          
          console.log('Setting selectedImage to:', selectedImage);
          console.log('Show image value from API:', data.comingSoonShowImage, 'type:', typeof data.comingSoonShowImage);
          
          // Explicitly handle boolean values
          const showImage = data.comingSoonShowImage === true;
          const showCountdown = data.comingSoonShowCountdown === true;
          const showEmailSignup = data.comingSoonShowEmailSignup === true;
          const showSocialMedia = data.comingSoonShowSocialMedia === true;
          
          console.log('Processed show image value:', showImage);
          
          setFormData({
            comingSoonTitle: data.comingSoonTitle || '',
            comingSoonSubtitle: data.comingSoonSubtitle || '',
            comingSoonDescription: data.comingSoonDescription || '',
            comingSoonShowCountdown: showCountdown,
            comingSoonCountdownDate: data.comingSoonCountdownDate 
              ? moment(data.comingSoonCountdownDate).format('YYYY-MM-DDTHH:mm')
              : '',
            comingSoonShowEmailSignup: showEmailSignup,
            comingSoonEmailSignupText: data.comingSoonEmailSignupText || '',
            comingSoonShowSocialMedia: showSocialMedia,
            comingSoonShowImage: showImage,
            comingSoonSelectedImage: selectedImage,
            contactEmail: data.contactEmail || '',
            contactPhone: data.contactPhone || '',
            metaTitle: data.metaTitle || '',
            metaDescription: data.metaDescription || ''
          });
        }
      } catch (error) {
        console.error('Error fetching site settings:', error);
        setErrorMessage('Failed to load site settings. Please try again.');
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

  // Handle checkbox changes
  const handleCheckboxChange = (field) => {
    setFormData({
      ...formData,
      [field]: !formData[field]
    });
  };

  // Handle site status toggle
  const handleSiteStatusChange = async (status) => {
    setSiteStatus(status);

    try {
      await updateSiteStatus(status,
        status === 'live' && scheduledGoLiveDate ? new Date(scheduledGoLiveDate) : null);

      setSuccessMessage(`Site status updated to "${status}"`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating site status:', error);
      setErrorMessage('Failed to update site status. Please try again.');
      setTimeout(() => setErrorMessage(''), 5000);
    }
  };

  // Handle image upload
  const handleImageUpload = async (field, file) => {
    if (!file) return;
    
    try {
      const formData = new FormData();
      formData.append('files', file);
      
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
      console.log('=== SAVE SETTINGS DEBUG ===');
      console.log('IMPORTANT: Current selectedImage value:', formData.comingSoonSelectedImage);
      
      // Check authentication in detail
      const token = localStorage.getItem('adminToken');
      const adminUser = localStorage.getItem('adminUser');
      
      console.log('Admin token exists:', !!token);
      console.log('Token length:', token ? token.length : 0);
      console.log('Token preview:', token ? token.substring(0, 50) + '...' : 'No token');
      console.log('Admin user exists:', !!adminUser);
      console.log('Admin user raw value:', adminUser);
      
      // Safely parse adminUser
      let parsedAdminUser = null;
      try {
        if (adminUser && adminUser !== 'undefined' && adminUser !== 'null') {
          parsedAdminUser = JSON.parse(adminUser);
        }
      } catch (e) {
        console.log('Failed to parse adminUser:', e.message);
      }
      console.log('Admin user parsed:', parsedAdminUser || 'No valid user data');
      
      // Check if we're in the right domain/origin
      console.log('Current origin:', window.location.origin);
      console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
      
      console.log('formData:', formData);
      console.log('Image settings:', {
        showImage: formData.comingSoonShowImage,
        selectedImage: formData.comingSoonSelectedImage
      });
      console.log('siteStatus:', siteStatus);
      console.log('scheduledGoLiveDate:', scheduledGoLiveDate);
      
      // Create a separate object for the image settings to ensure they're properly saved
      const imageSettings = {
        comingSoonShowImage: formData.comingSoonShowImage,
        comingSoonSelectedImage: formData.comingSoonSelectedImage
      };
      
      console.log('Image settings being saved:', imageSettings);
      
      // Prepare update data with flattened structure
      const updateData = {
        ...formData,
        siteStatus,
        scheduledGoLiveDate: scheduledGoLiveDate ? new Date(scheduledGoLiveDate).toISOString() : null,
        comingSoonCountdownDate: formData.comingSoonCountdownDate ? new Date(formData.comingSoonCountdownDate).toISOString() : null,
        // Explicitly include these values to ensure they're saved
        ...imageSettings
      };
      
      console.log('updateData prepared:', updateData);
      console.log('About to call updateSiteSettings...');
      
      // The updateSiteSettings function doesn't actually need the ID for single type content
      const response = await updateSiteSettings(null, updateData);
      
      console.log('updateSiteSettings response:', response);
      console.log('=== SAVE SUCCESS ===');
      
      // Verify the saved data by fetching it again
      const verifyResponse = await getSiteSettings();
      if (verifyResponse && verifyResponse.data) {
        const savedData = verifyResponse.data.attributes;
        console.log('VERIFICATION - Image settings after save:', {
          showImage: savedData.comingSoonShowImage,
          selectedImage: savedData.comingSoonSelectedImage
        });
      }
      
      setSuccessMessage('Settings saved successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      
    } catch (error) {
      console.error('=== SAVE ERROR ===');
      console.error('Error details:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      // Check if it's an authentication error
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        console.error('AUTHENTICATION ERROR: Token might be invalid or expired');
        console.error('Try logging out and logging back in');
        setErrorMessage('Authentication required. Please log out and log back in to the admin panel.');
      } else {
        setErrorMessage('Failed to save settings. Please try again.');
      }
      
      console.error('=== END ERROR ===');
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setSaving(false);
    }
  };

  // Set a default countdown date (7 days from now)
  const setDefaultCountdownDate = () => {
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 7); // 7 days from now
    
    // Format as YYYY-MM-DDTHH:MM
    const formattedDate = defaultDate.toISOString().slice(0, 16);
    
    handleInputChange('comingSoonCountdownDate', formattedDate);
    setSuccessMessage('Default countdown date set to 7 days from now');
    setTimeout(() => setSuccessMessage(''), 3000);
  };
  
  // Handle preview
  const handlePreview = () => {
    window.open('/coming-soon', '_blank');
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
            <h1 className="text-3xl font-mulish font-light text-ice-blue">coming soon page settings</h1>
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

          {/* Site Status Toggle */}
          <SiteStatusToggle 
            currentStatus={siteStatus} 
            onStatusChange={handleSiteStatusChange} 
          />

          {/* Coming Soon Settings Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-navy/80 backdrop-blur-md rounded-lg shadow-md border border-electric-blue/30 p-6">
              <h2 className="text-xl font-mulish font-light mb-6 text-ice-blue">coming soon page content</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-ice-blue mb-2">
                    Page Title
                  </label>
                  <input
                    type="text"
                    value={formData.comingSoonTitle}
                    onChange={(e) => handleInputChange('comingSoonTitle', e.target.value)}
                    className="w-full p-3 bg-navy/50 border border-electric-blue/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-electric-blue"
                    placeholder="Coming Soon"
                  />
                </div>

                {/* Subtitle */}
                <div>
                  <label className="block text-sm font-medium text-ice-blue mb-2">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={formData.comingSoonSubtitle}
                    onChange={(e) => handleInputChange('comingSoonSubtitle', e.target.value)}
                    className="w-full p-3 bg-navy/50 border border-electric-blue/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-electric-blue"
                    placeholder="We're launching soon"
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-ice-blue mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.comingSoonDescription}
                    onChange={(e) => handleInputChange('comingSoonDescription', e.target.value)}
                    rows={4}
                    className="w-full p-3 bg-navy/50 border border-electric-blue/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-electric-blue"
                    placeholder="Our new website is on its way. Stay tuned for something amazing."
                  />
                </div>

                {/* Email Signup Text */}
                <div>
                  <label className="block text-sm font-medium text-ice-blue mb-2">
                    Email Signup Text
                  </label>
                  <input
                    type="text"
                    value={formData.comingSoonEmailSignupText}
                    onChange={(e) => handleInputChange('comingSoonEmailSignupText', e.target.value)}
                    className="w-full p-3 bg-navy/50 border border-electric-blue/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-electric-blue"
                    placeholder="Get notified when we launch"
                  />
                </div>

                {/* Countdown Date */}
                <div>
                  <label className="block text-sm font-medium text-ice-blue mb-2">
                    Countdown Target Date
                    <span className="block text-xs text-electric-blue/70 font-normal mt-1">
                      Set the date and time for your release
                    </span>
                  </label>
                  <div className="relative">
                    <div className="flex flex-col space-y-3">
                      <div>
                        <label className="block text-xs text-ice-blue mb-1">Date:</label>
                        <input
                          type="date"
                          value={formData.comingSoonCountdownDate ? formData.comingSoonCountdownDate.split('T')[0] : ''}
                          onChange={(e) => {
                            const currentTime = formData.comingSoonCountdownDate 
                              ? formData.comingSoonCountdownDate.split('T')[1] 
                              : '00:00';
                            const newDate = `${e.target.value}T${currentTime}`;
                            handleInputChange('comingSoonCountdownDate', newDate);
                          }}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full p-3 bg-navy/50 border border-electric-blue/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-electric-blue"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-ice-blue mb-1">Time:</label>
                        <input
                          type="time"
                          value={formData.comingSoonCountdownDate ? formData.comingSoonCountdownDate.split('T')[1] : ''}
                          onChange={(e) => {
                            const currentDate = formData.comingSoonCountdownDate 
                              ? formData.comingSoonCountdownDate.split('T')[0] 
                              : new Date().toISOString().split('T')[0];
                            const newDate = `${currentDate}T${e.target.value}`;
                            handleInputChange('comingSoonCountdownDate', newDate);
                          }}
                          className="w-full p-3 bg-navy/50 border border-electric-blue/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-electric-blue"
                        />
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-ice-blue/70">
                      Current countdown date: {formData.comingSoonCountdownDate ? 
                        new Date(formData.comingSoonCountdownDate).toLocaleString() : 
                        'Not set'}
                    </div>
                    {!formData.comingSoonCountdownDate && (
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-xs text-red-400">
                          Please set a future date and time for the countdown
                        </span>
                        <button
                          type="button"
                          onClick={setDefaultCountdownDate}
                          className="text-xs bg-electric-blue text-white px-2 py-1 rounded hover:bg-electric-blue/80 transition-colors"
                        >
                          Set Default (7 days)
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact Email */}
                <div>
                  <label className="block text-sm font-medium text-ice-blue mb-2">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                    className="w-full p-3 bg-navy/50 border border-electric-blue/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-electric-blue"
                    placeholder="contact@evanjamesmusic.com"
                  />
                </div>

                {/* Contact Phone */}
                <div>
                  <label className="block text-sm font-medium text-ice-blue mb-2">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                    className="w-full p-3 bg-navy/50 border border-electric-blue/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-electric-blue"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              {/* Checkboxes */}
              <div className="mt-6 space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showCountdown"
                    checked={formData.comingSoonShowCountdown}
                    onChange={() => handleCheckboxChange('comingSoonShowCountdown')}
                    className="mr-3 h-4 w-4 text-electric-blue focus:ring-electric-blue border-gray-300 rounded"
                  />
                  <label htmlFor="showCountdown" className="text-ice-blue">
                    Show countdown timer
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showEmailSignup"
                    checked={formData.comingSoonShowEmailSignup}
                    onChange={() => handleCheckboxChange('comingSoonShowEmailSignup')}
                    className="mr-3 h-4 w-4 text-electric-blue focus:ring-electric-blue border-gray-300 rounded"
                  />
                  <label htmlFor="showEmailSignup" className="text-ice-blue">
                    Show email signup form
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showSocialMedia"
                    checked={formData.comingSoonShowSocialMedia}
                    onChange={() => handleCheckboxChange('comingSoonShowSocialMedia')}
                    className="mr-3 h-4 w-4 text-electric-blue focus:ring-electric-blue border-gray-300 rounded"
                  />
                  <label htmlFor="showSocialMedia" className="text-ice-blue">
                    Show social media links
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showImage"
                    checked={formData.comingSoonShowImage}
                    onChange={() => {
                      handleCheckboxChange('comingSoonShowImage');
                      console.log('Show image checkbox changed to:', !formData.comingSoonShowImage);
                    }}
                    className="mr-3 h-4 w-4 text-electric-blue focus:ring-electric-blue border-gray-300 rounded"
                  />
                  <label htmlFor="showImage" className="text-ice-blue">
                    Show image on coming soon page
                  </label>
                </div>

                {formData.comingSoonShowImage && (
                  <div className="ml-7 mt-2">
                    <label className="block text-sm font-medium text-ice-blue mb-2">
                      Select Image to Display
                    </label>
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="defaultImage"
                          name="selectedImage"
                          value="default"
                          checked={formData.comingSoonSelectedImage === 'default'}
                          onChange={() => handleInputChange('comingSoonSelectedImage', 'default')}
                          className="mr-3 h-4 w-4 text-electric-blue focus:ring-electric-blue border-gray-300"
                        />
                        <label htmlFor="defaultImage" className="text-ice-blue">
                          Default image (tinted blue portrait)
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="customImage"
                          name="selectedImage"
                          value="custom"
                          checked={formData.comingSoonSelectedImage === 'custom'}
                          onChange={() => handleInputChange('comingSoonSelectedImage', 'custom')}
                          className="mr-3 h-4 w-4 text-electric-blue focus:ring-electric-blue border-gray-300"
                        />
                        <label htmlFor="customImage" className="text-ice-blue">
                          Custom uploaded image
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="noImage"
                          name="selectedImage"
                          value="none"
                          checked={formData.comingSoonSelectedImage === 'none'}
                          onChange={() => {
                            // Force the value to be 'none' string
                            const noneValue = 'none';
                            handleInputChange('comingSoonSelectedImage', noneValue);
                            console.log('Selected "No image", value set to:', noneValue, 'type:', typeof noneValue);
                            
                            // Update the form data directly to ensure it's set
                            setFormData(prevData => ({
                              ...prevData,
                              comingSoonSelectedImage: noneValue
                            }));
                          }}
                          className="mr-3 h-4 w-4 text-electric-blue focus:ring-electric-blue border-gray-300"
                        />
                        <label htmlFor="noImage" className="text-ice-blue">
                          No image (solid background)
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* SEO Settings */}
            <div className="bg-navy/80 backdrop-blur-md rounded-lg shadow-md border border-electric-blue/30 p-6">
              <h2 className="text-xl font-mulish font-light mb-6 text-ice-blue">seo settings</h2>
              
              <div className="grid grid-cols-1 gap-6">
                {/* Meta Title */}
                <div>
                  <label className="block text-sm font-medium text-ice-blue mb-2">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    value={formData.metaTitle}
                    onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                    className="w-full p-3 bg-navy/50 border border-electric-blue/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-electric-blue"
                    placeholder="Coming Soon - Evan James Official"
                  />
                </div>

                {/* Meta Description */}
                <div>
                  <label className="block text-sm font-medium text-ice-blue mb-2">
                    Meta Description
                  </label>
                  <textarea
                    value={formData.metaDescription}
                    onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                    rows={3}
                    className="w-full p-3 bg-navy/50 border border-electric-blue/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-electric-blue"
                    placeholder="Evan James official website coming soon. Stay tuned for updates and new releases."
                  />
                </div>
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="bg-navy/80 backdrop-blur-md rounded-lg shadow-md border border-electric-blue/30 p-6">
              <h2 className="text-xl font-mulish font-light mb-6 text-ice-blue">images</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Logo Upload */}
                <div>
                  <label className="block text-sm font-medium text-ice-blue mb-2">
                    Coming Soon Logo
                    <span className="block text-xs text-electric-blue/70 font-normal mt-1">
                      Recommended: 400×120px (transparent PNG)
                    </span>
                  </label>
                  <div className="border-2 border-dashed border-electric-blue/30 rounded-lg p-4 text-center">
                    {settings?.comingSoonLogo?.data ? (
                      <div className="space-y-2">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_API_URL}${settings.comingSoonLogo.data.attributes.url}`}
                          alt="Coming Soon Logo"
                          width={200}
                          height={60}
                          className="mx-auto"
                        />
                        <p className="text-sm text-ice-blue">Current logo</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <FaImage className="mx-auto text-4xl text-electric-blue/50" />
                        <p className="text-sm text-ice-blue">No logo uploaded</p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload('comingSoonLogo', e.target.files[0])}
                      className="mt-2 block w-full text-sm text-ice-blue file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-electric-blue file:text-white hover:file:bg-electric-blue/80"
                    />
                  </div>
                </div>

                {/* Portrait Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-ice-blue mb-2">
                    Portrait Image
                    <span className="block text-xs text-electric-blue/70 font-normal mt-1">
                      Recommended: 600×800px (3:4 portrait ratio)
                    </span>
                  </label>
                  <div className="border-2 border-dashed border-electric-blue/30 rounded-lg p-4 text-center">
                    {settings?.comingSoonBackgroundImage?.data ? (
                      <div className="space-y-2">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_API_URL}${settings.comingSoonBackgroundImage.data.attributes.url}`}
                          alt="Portrait Image"
                          width={120}
                          height={160}
                          className="mx-auto object-cover rounded"
                        />
                        <p className="text-sm text-ice-blue">Current portrait</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <FaImage className="mx-auto text-4xl text-electric-blue/50" />
                        <p className="text-sm text-ice-blue">No portrait uploaded</p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload('comingSoonBackgroundImage', e.target.files[0])}
                      className="mt-2 block w-full text-sm text-ice-blue file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-electric-blue file:text-white hover:file:bg-electric-blue/80"
                    />
                  </div>
                </div>

                {/* Background Pattern Upload */}
                <div>
                  <label className="block text-sm font-medium text-ice-blue mb-2">
                    Background Pattern
                    <span className="block text-xs text-electric-blue/70 font-normal mt-1">
                      Recommended: 1920×1080px (seamless pattern)
                    </span>
                  </label>
                  <div className="border-2 border-dashed border-electric-blue/30 rounded-lg p-4 text-center">
                    {settings?.comingSoonBackgroundPattern?.data ? (
                      <div className="space-y-2">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_API_URL}${settings.comingSoonBackgroundPattern.data.attributes.url}`}
                          alt="Background Pattern"
                          width={120}
                          height={160}
                          className="mx-auto object-cover rounded"
                        />
                        <p className="text-sm text-ice-blue">Current pattern</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <FaImage className="mx-auto text-4xl text-electric-blue/50" />
                        <p className="text-sm text-ice-blue">No pattern uploaded</p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload('comingSoonBackgroundPattern', e.target.files[0])}
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
