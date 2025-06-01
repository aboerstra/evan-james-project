import React, { useState } from 'react';
import Layout from '../components/Layout';
import Image from 'next/image';
import { getSiteSettings } from '../services/api';

export default function TourPage({ siteSettings }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fallback image for failed loads
  const fallbackImage = '/images/tour/placeholder.jpg';

  // Handle image loading errors
  const handleImageError = (e) => {
    e.target.src = fallbackImage;
  };

  return (
    <Layout 
      title="tour | evan james official" 
      description="catch evan james live on the tainted blue tour"
    >
      <div className="min-h-screen pt-24 pb-16 px-6">
        {/* Tour Page Hero Banner */}
        <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden mb-12">
          <Image 
            src={siteSettings?.data?.attributes?.tourHeaderImage?.data?.attributes?.url 
              ? `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${siteSettings.data.attributes.tourHeaderImage.data.attributes.url}`
              : "/images/hero_banners/homepage_hero_1.png"
            }
            alt="evan james tour"
            fill
            sizes="100vw"
            quality={85}
            priority
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkMjU1LS0yMi4qLjgyPj4+Oj4+Oj4+Oj4+Oj4+Oj4+Oj4+Oj7/2wBDAR4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            className="object-cover"
            onError={handleImageError}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/60 to-navy/40 flex items-center">
            <div className="container mx-auto px-6">
              <h1 className="text-4xl md:text-5xl font-mulish text-white max-w-xl">tour dates</h1>
            </div>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto">
          {/* Tour Dates Section */}
          <div className="bg-navy/80 backdrop-blur-md p-6 rounded-lg border border-electric-blue/30 mb-12">
            <h2 className="text-2xl font-mulish mb-8 text-center">upcoming shows</h2>
            
            {error ? (
              <div className="text-center py-12">
                <p className="text-red-400 mb-2">Error loading tour dates</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="text-electric-blue hover:text-ice-blue"
                >
                  Try again
                </button>
              </div>
            ) : loading ? (
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-sapphire/10 rounded-lg p-6">
                      <div className="h-6 bg-navy/50 rounded mb-2 w-1/3"></div>
                      <div className="h-4 bg-navy/50 rounded mb-4 w-1/4"></div>
                      <div className="h-4 bg-navy/50 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {/* Tour dates will be mapped here */}
                <div className="bg-sapphire/10 rounded-lg p-6 hover:bg-sapphire/20 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-mulish mb-2">New York - Mercury Lounge</h3>
                      <p className="text-ice-blue/80">september 15, 2025</p>
                      <p className="text-ice-blue/60 mt-2">Tainted Blue EP Release Show</p>
                    </div>
                    <button className="px-6 py-2 bg-electric-blue hover:bg-electric-blue/80 text-white rounded transition font-mulish">
                      tickets
                    </button>
                  </div>
                </div>
                
                <div className="bg-sapphire/10 rounded-lg p-6 hover:bg-sapphire/20 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-mulish mb-2">Portland - Doug Fir Lounge</h3>
                      <p className="text-ice-blue/80">october 2, 2025</p>
                      <p className="text-ice-blue/60 mt-2">Pacific Northwest Showcase</p>
                    </div>
                    <button className="px-6 py-2 bg-electric-blue hover:bg-electric-blue/80 text-white rounded transition font-mulish">
                      tickets
                    </button>
                  </div>
                </div>
                
                <div className="bg-sapphire/10 rounded-lg p-6 hover:bg-sapphire/20 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-mulish mb-2">Vancouver - The Fox Cabaret</h3>
                      <p className="text-ice-blue/80">october 5, 2025</p>
                      <p className="text-ice-blue/60 mt-2">Vancouver Acoustic Sessions</p>
                    </div>
                    <button className="px-6 py-2 bg-electric-blue hover:bg-electric-blue/80 text-white rounded transition font-mulish">
                      tickets
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Newsletter Signup */}
          <div className="mt-16 pt-12 border-t border-electric-blue/20">
            <div className="max-w-xl mx-auto text-center bg-navy/80 backdrop-blur-md p-6 rounded-lg border border-electric-blue/30">
              <h2 className="text-2xl font-mulish mb-4">get tour updates</h2>
              <p className="mb-6">
                sign up to be the first to know when evan announces tour dates in your city.
              </p>
              <form className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="your email address"
                  className="flex-grow p-3 bg-navy/50 border border-electric-blue/30 rounded focus:outline-none focus:ring-2 focus:ring-electric-blue text-white"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-electric-blue hover:bg-electric-blue/80 text-white rounded transition font-mulish"
                >
                  subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  try {
    const siteSettings = await getSiteSettings('tourHeaderImage');
    return {
      props: {
        siteSettings: siteSettings || null,
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        siteSettings: null,
      },
    };
  }
}
