import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { getSiteSettings } from '../services/siteSettingsService';

export default function Maintenance() {
  const [settings, setSettings] = useState(null);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-electric-blue"></div>
      </div>
    );
  }
  
  const maintenanceContent = settings?.maintenance || {
    title: 'Site Under Maintenance',
    subtitle: 'We\'ll be back soon',
    message: 'We\'re currently performing some scheduled maintenance. We\'ll be back online shortly!',
    showSocialMedia: true,
    metaTitle: 'Under Maintenance - Evan James Official',
    metaDescription: 'Evan James Official website is currently under maintenance. We\'ll be back online shortly!'
  };
  
  return (
    <div className="min-h-screen bg-navy overflow-hidden relative flex flex-col justify-center items-center">
      <Head>
        <title>{maintenanceContent.metaTitle || 'Site Under Maintenance'}</title>
        <meta 
          name="description" 
          content={maintenanceContent.metaDescription || 'Our site is currently under maintenance. We\'ll be back online shortly!'} 
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy via-sapphire/30 to-navy bg-opacity-90 z-0">
        {maintenanceContent.backgroundImage && maintenanceContent.backgroundImage.data ? (
          <div 
            className="absolute inset-0 opacity-20 bg-center bg-cover mix-blend-overlay"
            style={{
              backgroundImage: `url(${process.env.NEXT_PUBLIC_API_URL}${maintenanceContent.backgroundImage.data.attributes.url})`
            }}
          ></div>
        ) : (
          <div className="absolute inset-0 opacity-20 bg-[url('/images/backgrounds/maintenance_background.png')] bg-repeat bg-center mix-blend-overlay"></div>
        )}
        
        {/* Animated gradients */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -inset-[100%] animate-spin-slow bg-gradient-radial from-electric-blue/10 via-transparent to-transparent blur-xl"></div>
          <div className="absolute -inset-[100%] animate-spin-slow-reverse bg-gradient-radial from-ice-blue/5 via-transparent to-transparent blur-xl"></div>
        </div>
      </div>
      
      {/* Main content container */}
      <div className="container mx-auto px-6 z-10 flex flex-col items-center justify-center gap-12 text-center max-w-3xl">
        {/* Logo */}
        {maintenanceContent.logo && maintenanceContent.logo.data ? (
          <div className="mt-4 mb-6 inline-block animate-fade-in">
            <Image
              src={process.env.NEXT_PUBLIC_API_URL + maintenanceContent.logo.data.attributes.url}
              alt="Evan James"
              width={300}
              height={90}
              priority
              className="h-auto"
            />
          </div>
        ) : (
          <div className="mt-4 mb-6 inline-block animate-fade-in">
            <Image
              src="/images/evanjames_logo_gradient_tight_trans.png"
              alt="Evan James"
              width={300}
              height={90}
              priority
              className="h-auto"
            />
          </div>
        )}
        
        {/* Maintenance Message */}
        <div className="bg-navy/50 backdrop-blur-sm rounded-lg border border-electric-blue/20 p-8 w-full animate-fade-in" style={{ animationDelay: '200ms' }}>
          <div className="mx-auto w-16 h-16 mb-6 flex items-center justify-center rounded-full bg-electric-blue/20">
            <svg className="w-8 h-8 text-electric-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-mulish font-light mb-4 text-ice-blue leading-tight">
            {maintenanceContent.title}
          </h1>
          
          {maintenanceContent.subtitle && (
            <h2 className="text-xl md:text-2xl text-electric-blue mb-6 font-mulish">
              {maintenanceContent.subtitle}
            </h2>
          )}
          
          <div className="prose prose-invert mx-auto text-lg text-white/80 mb-6">
            {maintenanceContent.message ? (
              <div dangerouslySetInnerHTML={{ __html: maintenanceContent.message }} />
            ) : (
              <p>We're currently performing some scheduled maintenance. We'll be back online shortly!</p>
            )}
          </div>
          
          {maintenanceContent.estimatedCompletionTime && (
            <div className="my-6 p-4 bg-navy/40 backdrop-blur-sm rounded-lg border border-electric-blue/30">
              <p className="text-white">
                <span className="text-ice-blue">Estimated completion:</span> {new Date(maintenanceContent.estimatedCompletionTime).toLocaleString()}
              </p>
            </div>
          )}
          
          {maintenanceContent.contactEmail && (
            <p className="text-ice-blue/70 mt-6">
              Questions? Contact us at <a href={`mailto:${maintenanceContent.contactEmail}`} className="text-electric-blue hover:text-white">{maintenanceContent.contactEmail}</a>
            </p>
          )}
        </div>
        
        {/* Social links */}
        {maintenanceContent.showSocialMedia && (
          <div className="flex gap-4 justify-center animate-fade-in" style={{ animationDelay: '400ms' }}>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-navy/50 backdrop-blur-sm border border-electric-blue/30 flex items-center justify-center text-ice-blue hover:bg-electric-blue/20 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-navy/50 backdrop-blur-sm border border-electric-blue/30 flex items-center justify-center text-ice-blue hover:bg-electric-blue/20 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>
            <a href="https://spotify.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-navy/50 backdrop-blur-sm border border-electric-blue/30 flex items-center justify-center text-ice-blue hover:bg-electric-blue/20 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.8-.179-.92-.6-.12-.421.18-.8.6-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.48.659.262 1.08zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
            </a>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <footer className="w-full py-6 text-center z-10 mt-auto">
        <p className="text-white/60 text-sm">
          &copy; {new Date().getFullYear()} Evan James | All Rights Reserved
        </p>
      </footer>
    </div>
  );
}
