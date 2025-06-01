import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getStrapiImageUrl } from '../services/api';

export default function Hero({ featuredRelease, loading, siteSettings }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Only show content after loading is complete or if we have Strapi data
  const shouldShowContent = !loading || (siteSettings && featuredRelease);

  // Placeholder data for fallback (only used after loading is complete)
  const placeholder = {
    title: "cool skin",
    subtitle: "debut single from tainted blue — out now",
    releaseDate: "2025-06-15",
    coverImage: "/images/music_releases/latest_single_cover_1.png",
    streamLinks: [
      { platform: "Spotify", url: "https://open.spotify.com" },
      { platform: "Apple Music", url: "https://music.apple.com" },
      { platform: "YouTube", url: "https://youtube.com" }
    ]
  };

  // Format Strapi data or use placeholder (only after loading)
  const release = featuredRelease ? {
    title: featuredRelease.title,
    subtitle: featuredRelease.description || `${featuredRelease.releaseType} — out now`,
    releaseDate: featuredRelease.releaseDate,
    coverImage: getStrapiImageUrl(featuredRelease.cover) || placeholder.coverImage,
    streamLinks: featuredRelease.streamLinks || placeholder.streamLinks
  } : (!loading ? placeholder : null);
  
  const openModal = () => {
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };
  
  const closeModal = () => {
    setShowModal(false);
    document.body.style.overflow = 'auto';
  };

  // Helper function to get platform icon
  const getPlatformIcon = (platform) => {
    switch (platform.toLowerCase()) {
      case 'spotify':
        return (
          <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.8-.179-.92-.6-.12-.421.18-.8.6-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.48.659.262 1.08zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"></path>
          </svg>
        );
      case 'apple music':
        return (
          <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.997 6.124c0-.738-.065-1.47-.24-2.19-.317-1.31-1.062-2.31-2.18-3.043C21.003.517 20.373.285 19.7.164c-.517-.093-1.038-.135-1.564-.15-.04-.003-.083-.01-.124-.013H5.988c-.152.01-.303.017-.455.026C4.786.07 4.043.15 3.34.428 2.004.958 1.02 1.88.475 3.208c-.192.466-.34.943-.408 1.44-.087.625-.108 1.25-.108 1.878 0 .56.016 1.12.048 1.678.026.45.083.93.152 1.388.178 1.178.607 2.19 1.29 3.093.693.916 1.583 1.558 2.645 1.896.772.242 1.56.34 2.368.383.196.01.39.016.588.018 1.954.048 3.908.057 5.863.058 1.952-.001 3.902-.01 5.857-.058.2-.002.396-.008.592-.018.807-.044 1.595-.14 2.366-.383 1.062-.338 1.95-.98 2.643-1.896.683-.904 1.112-1.915 1.29-3.093.07-.458.124-.935.152-1.388.032-.56.048-1.12.048-1.678 0-.63-.02-1.254-.107-1.88-.07-.492-.216-.972-.407-1.436-.348-.99-.87-1.83-1.568-2.514-.653-.64-1.395-1.12-2.235-1.436-.937-.35-1.92-.468-2.92-.492-.496-.008-.995.005-1.49.03-.153.008-.306.013-.46.018z"></path>
            <path d="M12.142 5.025c-1.066 0-2.033.178-2.9.53-1.71.697-2.845 2.01-3.037 3.84-.08.766.033 1.5.338 2.196.63 1.437 1.713 2.34 3.283 2.64.5.096 1.018.144 1.53.144.698 0 1.398-.063 2.075-.19.703-.133 1.362-.37 1.94-.756 1.244-.833 1.935-2.03 1.93-3.573-.006-2.54-2.322-4.83-5.16-4.83z" fill="white"></path>
          </svg>
        );
      case 'youtube':
        return (
          <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"></path>
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path>
          </svg>
        );
    }
  };

  // Modal component with platform links
  const ListenModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-navy/95 backdrop-blur-sm animate-fade-in"
        onClick={closeModal}
      ></div>
      
      {/* Modal content */}
      <div className="relative z-10 bg-sapphire/30 rounded-lg max-w-md w-full p-8 animate-fade-in-up">
        {/* Close button */}
        <button 
          onClick={closeModal}
          className="absolute top-4 right-4 text-white/70 hover:text-white"
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        
        <h3 className="text-2xl font-mulish mb-2 text-ice-blue">listen to <span className="text-white">{release?.title}</span></h3>
        <p className="text-white/70 mb-6">{release?.subtitle}</p>
        
        <div className="space-y-3">
          {release?.streamLinks?.map((link, index) => (
            <a 
              key={index}
              href={link.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center w-full p-3 bg-black rounded-md hover:bg-black/80 transition-colors"
              onClick={() => {
                console.log(`${link.platform} link clicked`);
              }}
            >
              {getPlatformIcon(link.platform)}
              <span className="font-mulish">listen on {link.platform.toLowerCase()}</span>
            </a>
          ))}
        </div>
        
        {/* Subtle animation effect */}
        <div className="absolute inset-0 -z-10 rounded-lg opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-electric-blue via-sapphire to-navy animate-pulse"></div>
        </div>
      </div>
    </div>
  );

  // Get background image with proper loading handling
  const getBackgroundImage = () => {
    if (loading) return null; // Don't show any image while loading
    return getStrapiImageUrl(siteSettings?.heroBackgroundImage) || "/images/hero_banners/homepage_hero_1.png";
  };
  
  return (
    <>
      <section className="min-h-screen relative flex items-center overflow-hidden">
        {/* Hero background image */}
        <div className="absolute inset-0 z-0 bg-navy overflow-hidden">
          {!loading && (
            <>
              <Image
                src={getBackgroundImage()}
                alt="evan james"
                fill
                priority
                className={`object-cover opacity-70 transition-opacity duration-500 ${imageLoaded ? 'opacity-70' : 'opacity-0'}`}
                onLoad={() => setImageLoaded(true)}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-navy/50 via-navy/70 to-navy"></div>
            </>
          )}
        </div>
        
        <div className="container mx-auto px-6 z-10 py-20">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className={`transition-all duration-1000 ${isLoaded && shouldShowContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              {loading ? (
                <div className="animate-pulse">
                  <div className="h-16 bg-white/20 rounded mb-4"></div>
                  <div className="h-8 bg-white/20 rounded mb-8 w-3/4"></div>
                  <div className="flex gap-4">
                    <div className="h-12 bg-white/20 rounded w-32"></div>
                    <div className="h-12 bg-white/20 rounded w-32"></div>
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-5xl md:text-7xl font-mulish font-light mb-4 text-white leading-tight">
                    {siteSettings?.heroTitle || "evan james"} 
                    {release?.title && <span className="text-electric-blue"> | {release.title}</span>}
                  </h1>
                  <p className="text-xl md:text-2xl mb-2 text-gray-300 max-w-lg">
                    {siteSettings?.heroSubtitle || "independent pop artist"}
                  </p>
                  <p className="text-lg mb-8 text-gray-400 max-w-lg">
                    {siteSettings?.heroDescription || "creating cinematic soundscapes with introspective lyrics"}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <button 
                      onClick={openModal}
                      className="px-8 py-3 bg-electric-blue text-navy font-bold rounded-md hover:bg-ice-blue transition-colors text-lg"
                    >
                      {siteSettings?.heroButtonText || "listen now"}
                    </button>
                    <Link href="/about">
                      <button className="px-8 py-3 bg-transparent border border-electric-blue text-electric-blue font-bold rounded-md hover:bg-electric-blue/10 transition-colors text-lg">
                        {siteSettings?.heroSecondaryButtonText || "learn more"}
                      </button>
                    </Link>
                  </div>
                </>
              )}
            </div>
            
            {/* Album Art */}
            <div className={`transition-all duration-1000 delay-300 ${isLoaded && shouldShowContent ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
              <div className="relative aspect-square max-w-md mx-auto">
                {loading ? (
                  <div className="w-full h-full bg-white/20 rounded-lg animate-pulse"></div>
                ) : (
                  <Image
                    src={release?.coverImage || "/images/music_releases/latest_single_cover_1.png"}
                    alt={release?.title || "evan james"}
                    fill
                    className="object-cover rounded-lg shadow-2xl"
                    priority
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Listen Modal */}
      {showModal && release && <ListenModal />}
    </>
  );
}
