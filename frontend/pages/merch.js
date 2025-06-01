import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Image from 'next/image';
import { getMerchandise, getSiteSettings } from '../services/api';

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

// Cache object
const cache = {
  merchandise: {
    data: null,
    timestamp: null,
  },
  siteSettings: {
    data: null,
    timestamp: null,
  },
};

export default function MerchPage({ merchandise: initialMerchandise, siteSettings: initialSiteSettings }) {
  const [merchandise, setMerchandise] = useState(initialMerchandise || []);
  const [siteSettings, setSiteSettings] = useState(initialSiteSettings);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // Newsletter subscription handling
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [lastSubmitTime, setLastSubmitTime] = useState(0);
  const SUBMIT_COOLDOWN = 60000; // 1 minute cooldown

  // Fallback image for failed loads
  const fallbackImage = '/images/merch/placeholder.jpg';

  // Handle image loading errors
  const handleImageError = (e) => {
    e.target.src = fallbackImage;
  };

  // Check if cache is valid
  const isCacheValid = (cacheKey) => {
    const cached = cache[cacheKey];
    return cached?.data && cached?.timestamp && (Date.now() - cached.timestamp < CACHE_DURATION);
  };

  // Get data from cache or fetch new data
  const getData = async (cacheKey, fetchFn) => {
    if (isCacheValid(cacheKey)) {
      return cache[cacheKey].data;
    }

    const data = await fetchFn();
    cache[cacheKey] = {
      data,
      timestamp: Date.now(),
    };
    return data;
  };

  // Retry loading merchandise
  const retryLoading = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getData('merchandise', getMerchandise);
      setMerchandise(response?.data || []);
      setRetryCount(prev => prev + 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Effect to handle retries
  useEffect(() => {
    if (retryCount > 0 && retryCount <= 3) {
      const timer = setTimeout(retryLoading, 1000 * retryCount);
      return () => clearTimeout(timer);
    }
  }, [retryCount]);

  // Effect to prefetch next page of data
  useEffect(() => {
    const prefetchNextPage = async () => {
      try {
        await getData('merchandise', getMerchandise);
      } catch (error) {
        console.error('Error prefetching data:', error);
      }
    };

    // Prefetch after initial load
    if (merchandise.length > 0) {
      prefetchNextPage();
    }
  }, [merchandise.length]);

  // Effect to periodically refresh cache
  useEffect(() => {
    const refreshInterval = setInterval(async () => {
      try {
        const [merchandiseData, siteSettingsData] = await Promise.all([
          getData('merchandise', getMerchandise),
          getData('siteSettings', () => getSiteSettings('merchHeaderImage')),
        ]);
        
        setMerchandise(merchandiseData?.data || []);
        setSiteSettings(siteSettingsData);
      } catch (error) {
        console.error('Error refreshing cache:', error);
      }
    }, CACHE_DURATION);

    return () => clearInterval(refreshInterval);
  }, []);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset states
    setSubmitError(null);
    setSubmitSuccess(false);

    // Validate email
    if (!validateEmail(email)) {
      setSubmitError('Please enter a valid email address');
      return;
    }

    // Check rate limiting
    const now = Date.now();
    if (now - lastSubmitTime < SUBMIT_COOLDOWN) {
      setSubmitError('Please wait a moment before submitting again');
      return;
    }

    setIsSubmitting(true);
    try {
      await subscribeToNewsletter({ email });
      setSubmitSuccess(true);
      setEmail('');
      setLastSubmitTime(now);
    } catch (error) {
      setSubmitError(error.message || 'Failed to subscribe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout 
      title="merchandise | evan james official" 
      description="official evan james merchandise including t-shirts, vinyl, and more."
    >
      <div className="min-h-screen pt-24 pb-16 px-6">
        {/* Merch Page Hero Banner */}
        <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden mb-12">
          <Image 
            src={siteSettings?.data?.attributes?.merchHeaderImage?.data?.attributes?.url 
              ? `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${siteSettings.data.attributes.merchHeaderImage.data.attributes.url}`
              : "/images/hero_banners/homepage_hero_1.png"
            }
            alt="evan james merchandise"
            fill
            sizes="100vw"
            quality={85}
            priority
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkMjU1LS0yMi4qLjgyPj4+Oj4+Oj4+Oj4+Oj4+Oj4+Oj4+Oj7/2wBDAR4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            className="object-cover"
            onError={handleImageError}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/60 to-navy/40 flex items-center">
            <div className="container mx-auto px-6">
              <h1 className="text-4xl md:text-5xl font-mulish text-white max-w-xl">merchandise</h1>
            </div>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto">
          {/* Merchandise Collection */}
          <div className="bg-navy/80 backdrop-blur-md p-6 rounded-lg border border-electric-blue/30 mb-12">
            <h2 className="text-2xl font-mulish mb-8 text-center">official merchandise</h2>
            
            {error ? (
              <div className="text-center py-12">
                <p className="text-red-400 mb-2">Error loading merchandise</p>
                <button 
                  onClick={retryLoading}
                  className="text-electric-blue hover:text-ice-blue transition-colors"
                  disabled={loading}
                >
                  {loading ? 'Retrying...' : 'Try again'}
                </button>
              </div>
            ) : loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-sapphire/10 rounded-lg overflow-hidden">
                      <div className="aspect-square bg-navy/50"></div>
                      <div className="p-6">
                        <div className="h-6 bg-navy/50 rounded mb-2"></div>
                        <div className="h-4 bg-navy/50 rounded mb-4"></div>
                        <div className="flex justify-between items-center">
                          <div className="h-4 w-20 bg-navy/50 rounded"></div>
                          <div className="h-8 w-24 bg-navy/50 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {merchandise.length > 0 ? merchandise.map(item => {
                  const imageUrl = item.attributes.images?.data?.[0]?.attributes?.url 
                    ? `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${item.attributes.images.data[0].attributes.url}`
                    : fallbackImage;
                  
                  return (
                    <div key={item.id} className="bg-sapphire/10 rounded-lg overflow-hidden hover:bg-sapphire/20 transition-colors shadow-lg">
                      {/* Product Image */}
                      <div className="relative aspect-square bg-navy/50">
                        <Image
                          src={imageUrl}
                          alt={item.attributes.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          quality={85}
                          className="object-cover"
                          onError={handleImageError}
                          loading="lazy"
                        />
                      </div>
                      
                      {/* Product Details */}
                      <div className="p-6">
                        <h3 className="text-xl font-mulish mb-2">{item.attributes.name}</h3>
                        <p className="text-ice-blue/80 mb-4">{item.attributes.description}</p>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-electric-blue font-mulish">${item.attributes.price}</span>
                          
                          <button 
                            className={`px-6 py-2 rounded font-mulish transition-colors ${
                              item.attributes.inStock 
                                ? 'bg-electric-blue hover:bg-electric-blue/80 text-white' 
                                : 'bg-navy/50 text-ice-blue/50 cursor-not-allowed'
                            }`}
                            disabled={!item.attributes.inStock}
                          >
                            {item.attributes.inStock ? 'add to cart' : 'sold out'}
                          </button>
                        </div>
                        
                        {item.attributes.sizes && typeof item.attributes.sizes === 'string' && (
                          <div className="mt-4 flex gap-2 flex-wrap">
                            {item.attributes.sizes.split(',').map(size => (
                              <span key={size.trim()} className="px-2 py-1 border border-electric-blue/30 rounded text-xs text-ice-blue/70">
                                {size.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        {item.attributes.featured && (
                          <div className="mt-2">
                            <span className="inline-block px-2 py-1 bg-electric-blue/20 text-electric-blue text-xs rounded">
                              featured
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-ice-blue/60 text-lg">No merchandise available at the moment.</p>
                    <p className="text-ice-blue/40 mt-2">Check back soon for new items!</p>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Additional Info */}
          <div className="mt-16 pt-12 border-t border-electric-blue/20">
            <div className="max-w-xl mx-auto text-center bg-navy/80 backdrop-blur-md p-6 rounded-lg border border-electric-blue/30">
              <h2 className="text-2xl font-mulish mb-4">want to be notified?</h2>
              <p className="mb-6">
                sign up to be the first to know when merchandise becomes available.
              </p>
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your email address"
                  className={`flex-grow p-3 bg-navy/50 border ${
                    submitError ? 'border-red-500' : 'border-electric-blue/30'
                  } rounded focus:outline-none focus:ring-2 focus:ring-electric-blue text-white`}
                  required
                  disabled={isSubmitting}
                />
                <button
                  type="submit"
                  className={`px-6 py-3 bg-electric-blue hover:bg-electric-blue/80 text-white rounded transition font-mulish ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'subscribing...' : 'subscribe'}
                </button>
              </form>
              {submitError && (
                <p className="mt-2 text-red-400 text-sm">{submitError}</p>
              )}
              {submitSuccess && (
                <p className="mt-2 text-electric-blue text-sm">
                  Thanks for subscribing! We'll keep you updated.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  try {
    const [merchandiseResponse, siteSettingsResponse] = await Promise.all([
      getMerchandise(),
      getSiteSettings('merchHeaderImage')
    ]);
    
    const merchandise = merchandiseResponse?.data || [];
    const siteSettings = siteSettingsResponse || null;
    
    return {
      props: {
        merchandise: merchandise,
        siteSettings: siteSettings,
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        merchandise: [],
        siteSettings: null,
      },
    };
  }
}
