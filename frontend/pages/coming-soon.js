import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { getSiteSettings } from '../services/siteSettingsService';
import { subscribeToNewsletter } from '../services/api';

export default function ComingSoon() {
  const [settings, setSettings] = useState(null);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
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
      
      // Calculate total hours remaining for progress indicator
      const totalHoursRemaining = days * 24 + hours + minutes / 60 + seconds / 3600;
      const maxHours = 7 * 24; // 7 days in hours
      
      // Calculate progress percentage (inverse - starts at 100%, goes to 0%)
      const progressPercentage = Math.min(100, Math.max(0, (totalHoursRemaining / maxHours) * 100));
      
      setCountdown({ 
        days, 
        hours, 
        minutes, 
        seconds,
        isNearlyComplete: totalHoursRemaining < 24, // Less than 24 hours remaining
        progressPercentage
      });
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(interval);
  }, [settings]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Format the timestamp to match the expected format in the backend
      // Ensure it has milliseconds and ends with Z
      const now = new Date();
      const formattedTimestamp = now.toISOString();
      
      console.log('Submitting newsletter subscription with data:', {
        email,
        source: 'coming-soon',
        consentGiven,
        consentTimestamp: formattedTimestamp
      });
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/newsletter-subscriptions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            email,
            name: '',
            source: 'coming-soon',
            preferences: ['new-releases'],
            consentGiven: true,
            consentTimestamp: formattedTimestamp,
            consentSource: 'coming-soon',
            subscribedAt: new Date().toISOString() // Set subscribedAt to the current date in ISO format
          }
        }),
      });
      
      // Even if we get a 400 response, it might be because the email is already subscribed
      // or other non-critical reasons, so we'll try to parse the response in all cases
      const responseData = await response.json();
      console.log('Newsletter subscription response:', responseData);
      
      if (!response.ok && 
          !responseData.message?.includes('Already subscribed') && 
          !responseData.message?.includes('check your email')) {
        throw new Error(responseData.error?.message || 'Failed to subscribe');
      }
      
      // If we get here, either the request was successful or it was a "soft" error
      // like "Already subscribed" that we want to treat as success
      
      setSubmitSuccess(true);
      setEmail('');
      setConsentGiven(false); // Reset consent for next submission
    } catch (error) {
      console.error('Error submitting email:', error);
      alert(`There was an error subscribing to the newsletter: ${error.message || 'Please try again later.'}`);
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
  console.log('=== COMING SOON PAGE DEBUG ===');
  console.log('Image settings from API:', {
    showImage: settings?.comingSoonShowImage,
    selectedImage: settings?.comingSoonSelectedImage
  });
  
  // Explicitly handle boolean values
  const showImage = settings?.comingSoonShowImage === true;
  const showCountdown = settings?.comingSoonShowCountdown === true;
  const showEmailSignup = settings?.comingSoonShowEmailSignup === true;
  const showSocialMedia = settings?.comingSoonShowSocialMedia === true;
  
  console.log('Processed show image value:', showImage);
  
  const comingSoonContent = {
    title: settings?.comingSoonTitle || 'Coming Soon',
    subtitle: settings?.comingSoonSubtitle || 'We\'re launching soon',
    description: settings?.comingSoonDescription || 'Our new website is on its way. Stay tuned for something amazing.',
    showCountdown: showCountdown,
    countdownDate: settings?.comingSoonCountdownDate,
    showEmailSignup: showEmailSignup,
    emailSignupText: settings?.comingSoonEmailSignupText || 'Get notified when we launch',
    showSocialMedia: showSocialMedia,
    showImage: showImage,
    selectedImage: settings?.comingSoonSelectedImage || 'default',
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
      
      {/* Conditional layout based on whether image is shown */}
      {comingSoonContent.showImage && comingSoonContent.selectedImage !== 'none' ? (
        // Split layout with image on left, content on right
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
                {comingSoonContent.selectedImage === 'custom' && comingSoonContent.backgroundImage && comingSoonContent.backgroundImage.data ? (
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
            <p className="text-electric-blue text-3xl mb-8 font-mulish font-semibold">
              {comingSoonContent.subtitle}
            </p>
            
            {/* Description */}
            <p className="text-white/80 text-lg mb-12 leading-relaxed max-w-lg font-mulish">
              {comingSoonContent.description}
            </p>
          
          {/* Countdown Timer */}
          {comingSoonContent.showCountdown && comingSoonContent.countdownDate && (
            <div className="mb-12">
              <h3 className="text-electric-blue text-3xl mb-4 font-mulish font-semibold">
                Countdown to Release:
              </h3>
              <div className="relative mb-4">
                <div className="h-2 bg-navy/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-pink-500 via-yellow-400 to-blue-500 rounded-full"
                    style={{ width: `${countdown.progressPercentage}%` }}
                  ></div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: 'DAYS', value: countdown.days },
                  { label: 'HOURS', value: countdown.hours },
                  { label: 'MINUTES', value: countdown.minutes },
                  { label: 'SECONDS', value: countdown.seconds }
                ].map((item) => (
                  <div 
                    key={item.label} 
                    className={`text-center bg-navy/50 backdrop-blur-sm border ${
                      countdown.isNearlyComplete 
                        ? 'border-red-500/70 shadow-lg shadow-red-500/20' 
                        : 'border-electric-blue/30'
                    } rounded-lg p-4 transform hover:scale-105 transition-transform`}
                  >
                    <div 
                      className={`text-4xl lg:text-5xl font-light mb-2 ${
                        countdown.isNearlyComplete 
                          ? 'text-red-400 animate-pulse' 
                          : 'text-white'
                      }`}
                    >
                      {String(item.value).padStart(2, '0')}
                    </div>
                    <div className={`text-xs uppercase tracking-wider ${
                      countdown.isNearlyComplete 
                        ? 'text-red-400' 
                        : 'text-electric-blue'
                    }`}>
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Email signup */}
          {comingSoonContent.showEmailSignup && (
            <div className="mb-12">
              <h3 className="text-white/80 text-lg mb-6 font-mulish font-light">
                {comingSoonContent.emailSignupText}
              </h3>
              
              {submitSuccess ? (
                <div className="text-electric-blue">
                  <p className="mb-2">Thank you for your interest!</p>
                  <p>Please check your email to confirm your subscription.</p>
                  <p className="text-sm mt-2 text-white/60">If you don't see the email, please check your spam folder.</p>
                </div>
              ) : (
                <>
                <div className="flex gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your email address"
                    className="flex-grow px-4 py-3 bg-transparent border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-electric-blue transition-colors font-mulish"
                    required
                    disabled={isSubmitting}
                  />
                  <button
                    onClick={handleEmailSubmit}
                    disabled={isSubmitting || !consentGiven}
                    className={`px-8 py-3 font-mulish transition-colors disabled:opacity-50 ${
                      isSubmitting || !consentGiven
                        ? 'bg-electric-blue/50 text-white cursor-not-allowed'
                        : 'bg-electric-blue text-white hover:bg-electric-blue/80'
                    }`}
                  >
                    {isSubmitting ? 'subscribing...' : 'notify me'}
                  </button>
                </div>

                <div className="mt-4 text-left text-sm text-white/80">
                  <label className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      checked={consentGiven}
                      onChange={(e) => setConsentGiven(e.target.checked)}
                      className="mt-1 h-4 w-4 text-electric-blue focus:ring-electric-blue border-gray-300 rounded"
                      required
                    />
                    <span>
                      I agree to receive email updates from Evan James. I understand I can unsubscribe at any time.
                    </span>
                  </label>
                </div>
                </>
              )}
              
              <p className="text-white/40 text-sm mt-3 font-mulish">
                no spam, ever. <Link href="/unsubscribe" className="text-electric-blue hover:underline">unsubscribe</Link> at any time.
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
            <p className="text-white/40 text-sm font-mulish">
              © {new Date().getFullYear()} Evan James | All Rights Reserved
            </p>
            </div>
          </div>
        </div>
      ) : (
        // Centered layout when no image is shown
        <div className="min-h-screen flex flex-col justify-center items-center px-6 relative bg-[#0047AB]">
          {/* Wavy background pattern */}
          <div className={`absolute inset-0 opacity-15 bg-repeat bg-center ${
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
          <div className="absolute inset-0 opacity-25">
            <div className="absolute -inset-[100%] animate-spin-slow bg-gradient-radial from-white/10 via-transparent to-transparent blur-xl"></div>
            <div className="absolute -inset-[100%] animate-spin-slow-reverse bg-gradient-radial from-white/10 via-transparent to-transparent blur-xl"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-[#0039A6]/80 via-transparent to-[#0039A6]/80"></div>
          </div>
          
          <div className="max-w-2xl w-full mx-auto text-center relative z-10">
            {/* Logo */}
            <div className="mb-8 flex justify-center">
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
            <p className="text-[#AAAAAA] text-3xl mb-8 font-mulish font-semibold">
              {comingSoonContent.subtitle}
            </p>
            
            {/* Description */}
            <p className="text-white/80 text-lg mb-12 leading-relaxed mx-auto font-mulish">
              {comingSoonContent.description}
            </p>
            
            {/* Countdown Timer */}
            {comingSoonContent.showCountdown && comingSoonContent.countdownDate && (
              <div className="mb-12">
                <h3 className="text-[#AAAAAA] text-3xl mb-4 font-mulish font-semibold">
                  Countdown to Release:
                </h3>
                <div className="relative mb-4">
                  <div className="h-2 bg-navy/50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-pink-500 via-yellow-400 to-blue-500 rounded-full"
                      style={{ width: `${countdown.progressPercentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { label: 'DAYS', value: countdown.days },
                    { label: 'HOURS', value: countdown.hours },
                    { label: 'MINUTES', value: countdown.minutes },
                    { label: 'SECONDS', value: countdown.seconds }
                  ].map((item) => (
                    <div 
                      key={item.label} 
                      className={`text-center bg-[#4D7EDC]/60 backdrop-blur-sm border ${
                        countdown.isNearlyComplete 
                          ? 'border-red-500/70 shadow-lg shadow-red-500/20' 
                          : 'border-electric-blue/30'
                      } rounded-lg p-4 transform hover:scale-105 transition-transform`}
                    >
                      <div 
                        className={`text-4xl lg:text-5xl font-light mb-2 ${
                          countdown.isNearlyComplete 
                            ? 'text-red-400 animate-pulse' 
                            : 'text-white'
                        }`}
                      >
                        {String(item.value).padStart(2, '0')}
                      </div>
                      <div className={`text-xs uppercase tracking-wider ${
                        countdown.isNearlyComplete 
                          ? 'text-red-400' 
                          : 'text-[#AAAAAA]'
                      }`}>
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Email signup */}
            {comingSoonContent.showEmailSignup && (
              <div className="mb-12">
                <h3 className="text-white/80 text-lg mb-6 font-mulish font-light">
                  {comingSoonContent.emailSignupText}
                </h3>
                
              {submitSuccess ? (
                <div className="text-[#AAAAAA]">
                  <p className="mb-2">Thank you for your interest!</p>
                  <p>Please check your email to confirm your subscription.</p>
                  <p className="text-sm mt-2 text-white/60">If you don't see the email, please check your spam folder.</p>
                </div>
                ) : (
                  <div className="flex flex-col gap-4 max-w-md mx-auto">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your email address"
                        className="flex-grow px-4 py-3 bg-transparent border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-[#AAAAAA] transition-colors"
                        required
                        disabled={isSubmitting}
                      />
                      <button
                        onClick={handleEmailSubmit}
                        disabled={isSubmitting || !consentGiven}
                        className={`px-8 py-3 transition-colors disabled:opacity-50 ${
                          isSubmitting || !consentGiven
                            ? 'bg-[#AAAAAA]/50 text-[#0047AB] cursor-not-allowed'
                            : 'bg-[#AAAAAA] text-[#0047AB] font-medium hover:bg-[#AAAAAA]/90'
                        }`}
                      >
                        {isSubmitting ? 'subscribing...' : 'notify me'}
                      </button>
                    </div>
                    
                    <div className="text-left text-sm text-white/80">
                      <label className="flex items-start gap-2">
                        <input
                          type="checkbox"
                          checked={consentGiven}
                          onChange={(e) => setConsentGiven(e.target.checked)}
                          className="mt-1 h-4 w-4 text-[#AAAAAA] focus:ring-[#AAAAAA] border-gray-300 rounded"
                          required
                        />
                        <span>
                          I agree to receive email updates from Evan James. I understand I can unsubscribe at any time.
                        </span>
                      </label>
                    </div>
                  </div>
                )}
                
                <p className="text-white/40 text-sm mt-3 font-mulish">
                  no spam, ever. <Link href="/unsubscribe" className="text-[#AAAAAA] hover:underline">unsubscribe</Link> at any time.
                </p>
              </div>
            )}
            
            {/* Social links */}
            {comingSoonContent.showSocialMedia && (
              <div className="flex gap-6 justify-center">
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
            <div className="absolute bottom-6 left-0 right-0 text-center">
              <p className="text-white/40 text-sm font-mulish">
                © {new Date().getFullYear()} Evan James | All Rights Reserved
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
