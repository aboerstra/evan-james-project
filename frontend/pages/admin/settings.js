import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../components/AdminLayout';

export default function SettingsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  
  // Settings state
  const [settings, setSettings] = useState({
    general: {
      siteName: 'Evan James',
      tagline: 'Official Website',
      logoUrl: '/images/evanjames_logo_250_new.png',
      footerText: '© 2025 Evan James. All rights reserved.',
      siteVisible: false
    },
    social: {
      instagram: 'https://instagram.com/evanjames',
      spotify: 'https://open.spotify.com/artist/4PzYKhC14sTJNIHW4OTbxu',
      youtube: 'https://youtube.com/@evanjamesb',
      tiktok: 'https://tiktok.com/@evanjamesmusic',
      appleMusic: 'https://music.apple.com/us/artist/evan-james/id123456789'
    },
    emails: {
      notificationEmail: 'admin@evanjamesmusic.com',
      subscriberEmails: ['fan1@example.com', 'fan2@example.com', 'fan3@example.com']
    },
    password: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });
  
  // Load settings
  useEffect(() => {
    const fetchSettings = async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In a real app, we'd fetch the settings from an API
      // For now, we're using localStorage to simulate persistence
      if (typeof window !== 'undefined') {
        // Check localStorage first
        let siteVisible = localStorage.getItem('siteVisible') === 'true';
        
        // Check for cookie as well (higher priority)
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          if (cookie.startsWith('site-visible=')) {
            siteVisible = cookie.substring('site-visible='.length) === 'true';
            break;
          }
        }
        
        setSettings(prevSettings => ({
          ...prevSettings,
          general: {
            ...prevSettings.general,
            siteVisible
          }
        }));
      }
      
      setIsLoading(false);
    };
    
    fetchSettings();
  }, []);
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  const handleInputChange = (section, field, value) => {
    setSettings({
      ...settings,
      [section]: {
        ...settings[section],
        [field]: value
      }
    });
  };
  
  const handleToggleChange = (section, field) => {
    setSettings({
      ...settings,
      [section]: {
        ...settings[section],
        [field]: !settings[section][field]
      }
    });
  };
  
  const exportSubscribers = () => {
    // In a real app, this would generate a CSV file for download
    alert('In a real implementation, this would download a CSV of subscriber emails.');
  };
  
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, we'd save the settings to an API
      // Set both localStorage and cookie for site visibility
      if (typeof window !== 'undefined') {
        // For client-side checking
        localStorage.setItem('siteVisible', settings.general.siteVisible);
        
        // For middleware (server-side) checking - set cookie
        document.cookie = `site-visible=${settings.general.siteVisible}; path=/; max-age=${60 * 60 * 24 * 365}`; // 1 year expiry
      }
      
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('An error occurred while saving settings');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    const { currentPassword, newPassword, confirmPassword } = settings.password;
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('All password fields are required');
      setIsSaving(false);
      return;
    }
    
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match');
      setIsSaving(false);
      return;
    }
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, we'd change the password via API
      
      // Clear password fields
      setSettings({
        ...settings,
        password: {
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }
      });
      
      alert('Password changed successfully!');
    } catch (error) {
      console.error('Error changing password:', error);
      alert('An error occurred while changing password');
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <AdminLayout title="Settings">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-electric-blue"></div>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout title="Settings">
      <div className="mb-6">
        <h1 className="text-3xl font-mulish lowercase text-ice-blue mb-2">settings</h1>
        <p className="text-white/70">configure your website settings</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Tabs - Left Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-navy/80 backdrop-blur-md rounded-lg border border-electric-blue/30 overflow-hidden">
            <ul className="divide-y divide-electric-blue/10">
              <li>
                <button
                  onClick={() => handleTabChange('general')}
                  className={`w-full px-4 py-3 text-left transition-colors ${
                    activeTab === 'general' 
                      ? 'bg-electric-blue/20 text-ice-blue' 
                      : 'text-white hover:bg-sapphire/20'
                  }`}
                >
                  General
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleTabChange('social')}
                  className={`w-full px-4 py-3 text-left transition-colors ${
                    activeTab === 'social' 
                      ? 'bg-electric-blue/20 text-ice-blue' 
                      : 'text-white hover:bg-sapphire/20'
                  }`}
                >
                  Social Media
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleTabChange('emails')}
                  className={`w-full px-4 py-3 text-left transition-colors ${
                    activeTab === 'emails' 
                      ? 'bg-electric-blue/20 text-ice-blue' 
                      : 'text-white hover:bg-sapphire/20'
                  }`}
                >
                  Email Management
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleTabChange('security')}
                  className={`w-full px-4 py-3 text-left transition-colors ${
                    activeTab === 'security' 
                      ? 'bg-electric-blue/20 text-ice-blue' 
                      : 'text-white hover:bg-sapphire/20'
                  }`}
                >
                  Security
                </button>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Main Content - Settings Forms */}
        <div className="md:col-span-3">
          <div className="bg-navy/80 backdrop-blur-md rounded-lg border border-electric-blue/30 p-6">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div>
                <h2 className="text-xl font-mulish lowercase text-ice-blue mb-6">general settings</h2>
                
                <form onSubmit={handleSaveSettings} className="space-y-6">
                  <div>
                    <label htmlFor="siteName" className="block text-sm mb-1">Site Name</label>
                    <input
                      id="siteName"
                      type="text"
                      value={settings.general.siteName}
                      onChange={(e) => handleInputChange('general', 'siteName', e.target.value)}
                      className="w-full px-3 py-2 bg-sapphire/30 border border-electric-blue/30 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-blue text-white"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="tagline" className="block text-sm mb-1">Tagline</label>
                    <input
                      id="tagline"
                      type="text"
                      value={settings.general.tagline}
                      onChange={(e) => handleInputChange('general', 'tagline', e.target.value)}
                      className="w-full px-3 py-2 bg-sapphire/30 border border-electric-blue/30 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-blue text-white"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="footerText" className="block text-sm mb-1">Footer Text</label>
                    <input
                      id="footerText"
                      type="text"
                      value={settings.general.footerText}
                      onChange={(e) => handleInputChange('general', 'footerText', e.target.value)}
                      className="w-full px-3 py-2 bg-sapphire/30 border border-electric-blue/30 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-blue text-white"
                    />
                  </div>

                  {/* Website Visibility Toggle */}
                  <div className="border border-electric-blue/20 rounded-md p-4 bg-sapphire/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-mulish text-lg text-ice-blue">Website Visibility</h3>
                        <p className="text-sm text-white/70 mt-1">
                          Toggle between coming soon mode and full site visibility
                        </p>
                      </div>
                      <div className="relative inline-block w-14 h-7 transition duration-200 ease-in-out">
                        <input
                          type="checkbox"
                          id="siteVisible"
                          className="opacity-0 w-0 h-0"
                          checked={settings.general.siteVisible}
                          onChange={() => handleToggleChange('general', 'siteVisible')}
                        />
                        <label
                          htmlFor="siteVisible"
                          className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-colors duration-200 ${
                            settings.general.siteVisible ? 'bg-electric-blue' : 'bg-navy'
                          } border border-electric-blue/30`}
                        >
                          <span
                            className={`absolute left-1 bottom-1 bg-white w-5 h-5 rounded-full transition-transform duration-200 ${
                              settings.general.siteVisible ? 'transform translate-x-7' : ''
                            }`}
                          ></span>
                        </label>
                      </div>
                    </div>
                    <div className="mt-3 text-sm">
                      <p className="text-white/80">
                        {settings.general.siteVisible
                          ? 'Full website is currently visible to the public'
                          : 'Coming soon page is currently active. Only admin pages are accessible.'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-4 py-2 bg-electric-blue text-white rounded-md hover:bg-electric-blue/80 transition-colors disabled:opacity-50 flex items-center"
                    >
                      {isSaving ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </>
                      ) : 'Save Settings'}
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {/* Social Media Settings */}
            {activeTab === 'social' && (
              <div>
                <h2 className="text-xl font-mulish lowercase text-ice-blue mb-6">social media links</h2>
                
                <form onSubmit={handleSaveSettings} className="space-y-6">
                  <div>
                    <label htmlFor="instagram" className="block text-sm mb-1">Instagram</label>
                    <input
                      id="instagram"
                      type="url"
                      value={settings.social.instagram}
                      onChange={(e) => handleInputChange('social', 'instagram', e.target.value)}
                      placeholder="https://instagram.com/yourusername"
                      className="w-full px-3 py-2 bg-sapphire/30 border border-electric-blue/30 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-blue text-white"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="spotify" className="block text-sm mb-1">Spotify</label>
                    <input
                      id="spotify"
                      type="url"
                      value={settings.social.spotify}
                      onChange={(e) => handleInputChange('social', 'spotify', e.target.value)}
                      placeholder="https://open.spotify.com/artist/yourid"
                      className="w-full px-3 py-2 bg-sapphire/30 border border-electric-blue/30 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-blue text-white"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="youtube" className="block text-sm mb-1">YouTube</label>
                    <input
                      id="youtube"
                      type="url"
                      value={settings.social.youtube}
                      onChange={(e) => handleInputChange('social', 'youtube', e.target.value)}
                      placeholder="https://youtube.com/@yourchannel"
                      className="w-full px-3 py-2 bg-sapphire/30 border border-electric-blue/30 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-blue text-white"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="tiktok" className="block text-sm mb-1">TikTok</label>
                    <input
                      id="tiktok"
                      type="url"
                      value={settings.social.tiktok}
                      onChange={(e) => handleInputChange('social', 'tiktok', e.target.value)}
                      placeholder="https://tiktok.com/@yourusername"
                      className="w-full px-3 py-2 bg-sapphire/30 border border-electric-blue/30 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-blue text-white"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="appleMusic" className="block text-sm mb-1">Apple Music</label>
                    <input
                      id="appleMusic"
                      type="url"
                      value={settings.social.appleMusic}
                      onChange={(e) => handleInputChange('social', 'appleMusic', e.target.value)}
                      placeholder="https://music.apple.com/artist/yourid"
                      className="w-full px-3 py-2 bg-sapphire/30 border border-electric-blue/30 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-blue text-white"
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-4 py-2 bg-electric-blue text-white rounded-md hover:bg-electric-blue/80 transition-colors disabled:opacity-50 flex items-center"
                    >
                      {isSaving ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </>
                      ) : 'Save Settings'}
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {/* Email Management */}
            {activeTab === 'emails' && (
              <div>
                <h2 className="text-xl font-mulish lowercase text-ice-blue mb-6">email management</h2>
                
                <form onSubmit={handleSaveSettings} className="space-y-6">
                  <div>
                    <label htmlFor="notificationEmail" className="block text-sm mb-1">Notification Email</label>
                    <input
                      id="notificationEmail"
                      type="email"
                      value={settings.emails.notificationEmail}
                      onChange={(e) => handleInputChange('emails', 'notificationEmail', e.target.value)}
                      className="w-full px-3 py-2 bg-sapphire/30 border border-electric-blue/30 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-blue text-white"
                    />
                    <p className="mt-1 text-xs text-white/60">
                      Email where you'll receive notifications about new subscribers
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-md font-medium mb-2">Subscriber Management</h3>
                    <div className="bg-sapphire/20 p-4 rounded-md">
                      <p className="text-sm text-white mb-3">
                        You have {settings.emails.subscriberEmails.length} email subscribers
                      </p>
                      <button
                        type="button"
                        onClick={exportSubscribers}
                        className="text-ice-blue hover:text-electric-blue transition-colors text-sm"
                      >
                        Export subscriber list (CSV)
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-4 py-2 bg-electric-blue text-white rounded-md hover:bg-electric-blue/80 transition-colors disabled:opacity-50 flex items-center"
                    >
                      {isSaving ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </>
                      ) : 'Save Settings'}
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {/* Security Settings */}
            {activeTab === 'security' && (
              <div>
                <h2 className="text-xl font-mulish lowercase text-ice-blue mb-6">security settings</h2>
                
                <form onSubmit={handleChangePassword} className="space-y-6">
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm mb-1">Current Password</label>
                    <input
                      id="currentPassword"
                      type="password"
                      value={settings.password.currentPassword}
                      onChange={(e) => handleInputChange('password', 'currentPassword', e.target.value)}
                      className="w-full px-3 py-2 bg-sapphire/30 border border-electric-blue/30 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-blue text-white"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="newPassword" className="block text-sm mb-1">New Password</label>
                    <input
                      id="newPassword"
                      type="password"
                      value={settings.password.newPassword}
                      onChange={(e) => handleInputChange('password', 'newPassword', e.target.value)}
                      className="w-full px-3 py-2 bg-sapphire/30 border border-electric-blue/30 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-blue text-white"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm mb-1">Confirm New Password</label>
                    <input
                      id="confirmPassword"
                      type="password"
                      value={settings.password.confirmPassword}
                      onChange={(e) => handleInputChange('password', 'confirmPassword', e.target.value)}
                      className="w-full px-3 py-2 bg-sapphire/30 border border-electric-blue/30 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-blue text-white"
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-4 py-2 bg-electric-blue text-white rounded-md hover:bg-electric-blue/80 transition-colors disabled:opacity-50 flex items-center"
                    >
                      {isSaving ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Changing...
                        </>
                      ) : 'Change Password'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
