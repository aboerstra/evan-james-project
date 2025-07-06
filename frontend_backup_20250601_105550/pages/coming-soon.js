import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { getSiteSettings } from '../services/siteSettingsService';

export default function ComingSoon() {
  const [settings, setSettings] = useState(null);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await getSiteSettings();
        if (response && response.data) {
          setSettings(response.data.attributes);
        }
      } catch (error) {
        console.error('Error fetching site settings:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchSettings();
  }, []);
  
  // Set up countdown timer
  useEffect(() => {
    if (!settings || !settings.comingSoonCountdownDate) return;
    
    const targetDate = new Date(settings.comingSoonCountdownDate);
    
    const updateCountdown = () => {
      const now = new Date();
      const diff = targetDate - now;
      
      // If countdown is complete, don't update further
      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setCountdown({ days, hours, minutes, seconds });
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(interval);
  }, [settings]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // In production, this would call an actual API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitSuccess(true);
      setEmail('');
    } catch (error) {
      console.error('Error submitting email:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-electric-blue"></div>
      </div>
    );
  }
  
  // Use the flattened structure from site-settings
  const comingSoonContent = {
    title: settings?.comingSoonTitle || 'Coming Soon',
    subtitle: settings?.comingSoonSubtitle || 'We\'re launching soon',
    description: settings?.comingSoonDescription || 'Our new website is on its way. Stay tuned for something amazing.',
    showCountdown: settings?.comingSoonShowCountdown !== false,
    countdownDate: settings?.comingSoonCountdownDate,
    showEmailSignup: settings?.comingSoonShowEmailSignup !== false,
    emailSignupText: settings?.comingSoonEmailSignupText || 'Get notified when we launch',
    showSocialMedia: settings?.comingSoonShowSocialMedia !== false,
    backgroundImage: settings?.comingSoonBackgroundImage,
    backgroundPattern: settings?.comingSoonBackgroundPattern,
    logo: settings?.comingSoonLogo,
    contactEmail: settings?.contactEmail,
    metaTitle: settings?.metaTitle || 'Coming Soon - Evan James Official',
    metaDescription: settings?.metaDescription || 'Evan James official website coming soon. Stay tuned for updates and new releases.'
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-navy to-slate-900 overflow-hidden relative">
      <Head>
        <title>{comingSoonContent.metaTitle}</title>
        <meta 
          name="description" 
          content={comingSoonContent.metaDescription} 
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      {/* Close button */}
      <button className="absolute top-6 right-6 z-50 text-white/60 hover:text-white transition-colors">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
      
      <div className="flex min-h-screen">
        {/* Left side - Portrait Image */}
        <div className="w-1/2 relative bg-gradient-to-br from-navy via-navy to-slate-900">
          {/* Wavy background pattern */}
          <div className={`absolute inset-0 opacity-20 bg-repeat bg-center ${
            comingSoonContent.backgroundPattern && comingSoonContent.backgroundPattern.data 
              ? '' 
              : "bg-[url('/images/backgrounds/offline_page_background_1.png')]"
          }`}
          style={
            comingSoonContent.backgroundPattern && comingSoonContent.backgroundPattern.data 
              ? {
                  backgroundImage: `url(${process.env.NEXT_PUBLIC_API_URL}${comingSoonContent.backgroundPattern.data.attributes.url})`
                }
              : {}
          }></div>
          
          {/* Animated gradients for depth */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute -inset-[100%] animate-spin-slow bg-gradient-radial from-electric-blue/10 via-transparent to-transparent blur-xl"></div>
            <div className="absolute -inset-[100%] animate-spin-slow-reverse bg-gradient-radial from-ice-blue/5 via-transparent to-transparent blur-xl"></div>
          </div>
          
          {/* Portrait image in a contained box */}
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <div className="relative w-full max-w-md aspect-[3/4] rounded-lg overflow-hidden bg-navy/50 backdrop-blur-sm border border-electric-blue/20">
              {comingSoonContent.backgroundImage && comingSoonContent.backgroundImage.data ? (
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${process.env.NEXT_PUBLIC_API_URL}${comingSoonContent.backgroundImage.data.attributes.url})`
                  }}
                >
                  {/* Blue overlay to match the tinted effect */}
                  <div className="absolute inset-0 bg-gradient-to-b from-navy/20 via-sapphire/30 to-navy/40"></div>
                </div>
              ) : (
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url('/images/evan_taintedblue.jpg')`
                  }}
                >
                  {/* Blue overlay to match the tinted effect */}
                  <div className="absolute inset-0 bg-gradient-to-b from-navy/20 via-sapphire/30 to-navy/40"></div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Right side - Content */}
        <div className="w-1/2 flex flex-col justify-center px-12 lg:px-16 relative z-10">
          {/* Logo */}
          <div className="mb-8">
            {comingSoonContent.logo && comingSoonContent.logo.data ? (
              <Image
                src={process.env.NEXT_PUBLIC_API_URL + comingSoonContent.logo.data.attributes.url}
                alt="Evan James"
                width={280}
                height={85}
                priority
                className="mb-4"
              />
            ) : (
              <Image
                src="/images/evanjames_logo_gradient_tight_trans.png"
                alt="Evan James"
                width={280}
                height={85}
                priority
                className="mb-4"
              />
            )}
          </div>
          
          {/* Main Title */}
          <h1 className="text-5xl lg:text-6xl font-mulish font-light text-white mb-4 leading-tight">
            {comingSoonContent.title}
          </h1>
          
          {/* Subtitle */}
          <p className="text-electric-blue text-lg mb-8 font-light">
            {comingSoonContent.subtitle}
          </p>
          
          {/* Description */}
          <p className="text-white/80 text-lg mb-12 leading-relaxed max-w-lg">
            {comingSoonContent.description}
          </p>
          
          {/* Countdown Timer */}
          {comingSoonContent.showCountdown && comingSoonContent.countdownDate && (
            <div className="grid grid-cols-4 gap-4 mb-12">
              {[
                { label: 'DAYS', value: countdown.days },
                { label: 'HOURS', value: countdown.hours },
                { label: 'MINUTES', value: countdown.minutes },
                { label: 'SECONDS', value: countdown.seconds }
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <div className="text-4xl lg:text-5xl font-light text-white mb-2">
                    {item.value}
                  </div>
                  <div className="text-xs uppercase tracking-wider text-white/60">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Email signup */}
          {comingSoonContent.showEmailSignup && (
            <div className="mb-12">
              <h3 className="text-white/80 text-lg mb-6 font-light">
                {comingSoonContent.emailSignupText}
              </h3>
              
              {submitSuccess ? (
                <div className="text-electric-blue">
                  Thank you for subscribing! You'll be notified when we launch.
                </div>
              ) : (
                <div className="flex gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your email address"
                    className="flex-grow px-4 py-3 bg-transparent border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-electric-blue transition-colors"
                    required
                    disabled={isSubmitting}
                  />
                  <button
                    onClick={handleEmailSubmit}
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-electric-blue text-white hover:bg-electric-blue/80 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'subscribing...' : 'notify me'}
                  </button>
                </div>
              )}
              
              <p className="text-white/40 text-sm mt-3">
                no spam, ever. unsubscribe at any time.
              </p>
            </div>
          )}
          
          {/* Social links */}
          {comingSoonContent.showSocialMedia && (
            <div className="flex gap-6">
              <a href="https://instagram.com/evanjames" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="https://twitter.com/evanjames" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="https://youtube.com/@evanjamesb" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a href="https://open.spotify.com/artist/4PzYKhC14sTJNIHW4OTbxu" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.8-.179-.92-.6-.12-.421.18-.8.6-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.48.659.262 1.08zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
              </a>
            </div>
          )}
          
          {/* Footer */}
          <div className="absolute bottom-6 left-12 lg:left-16 right-12 lg:right-16">
            <p className="text-white/40 text-sm">
              © {new Date().getFullYear()} Evan James | All Rights Reserved
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
