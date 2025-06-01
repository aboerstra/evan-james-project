import React, { useState } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import Hero from '../components/Hero';
import MusicGrid from '../components/MusicGrid';
import { getFeaturedRelease, getAlbums, getFeaturedVideo, getBio, subscribeToNewsletter, getStrapiImageUrl, formatStrapiData } from '../services/api';
import { getSiteSettings } from '../services/siteSettingsService';
import Image from 'next/image';

export default function Home({ 
  featuredRelease: serverFeaturedRelease, 
  releases: serverReleases, 
  featuredVideo: serverFeaturedVideo, 
  bio: serverBio, 
  siteSettings: serverSiteSettings 
}) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Use server-side data directly
  const featuredRelease = serverFeaturedRelease;
  const releases = serverReleases;
  const featuredVideo = serverFeaturedVideo;
  const bio = serverBio;
  const siteSettings = serverSiteSettings;
  const loading = false; // No loading state needed with SSR

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      await subscribeToNewsletter({
        email,
        source: 'homepage'
      });
      setSubmitSuccess(true);
      setEmail('');
    } catch (error) {
      setSubmitError('there was a problem submitting your email. please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get bio content or fallback to default
  const bioContent = bio ? {
    shortDescription: bio.shortBio || bio.description?.substring(0, 200) + '...',
    fullDescription: bio.description,
    headshot: getStrapiImageUrl(bio.headshot)
  } : {
    shortDescription: siteSettings?.aboutShortDescription || "evan james is an independent pop artist based in new york city, creating cinematic soundscapes with introspective lyrics that explore themes of identity, expectation, and transformation.",
    fullDescription: siteSettings?.aboutFullDescription || "his debut ep \"tainted blue\" represents his artistic vision that balances commercial accessibility with artistic integrity, drawing inspiration from artists like troye sivan, lorde, and frank ocean.",
    headshot: getStrapiImageUrl(siteSettings?.aboutBackgroundImage) || "/images/artist_photos/bio_portrait_1.png"
  };

  return (
    <Layout title={siteSettings?.metaTitle || "evan james | official website"}>
      <Hero 
        featuredRelease={featuredRelease} 
        loading={loading} 
        siteSettings={siteSettings}
      />
      
      {/* Short Bio */}
      <section className="py-20 bg-gradient-to-b from-navy to-sapphire/20 relative">
        <div className="absolute inset-0 opacity-10">
          <Image
            src={bioContent.headshot}
            alt="background"
            fill
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy to-sapphire/50"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-mulish mb-8 text-ice-blue">
              {siteSettings?.aboutTitle || "about evan james"}
            </h2>
            <div className="prose prose-lg prose-invert mx-auto">
              <p className="text-xl leading-relaxed mb-6">
                {bioContent.shortDescription}
              </p>
              <p className="text-lg opacity-80">
                {bioContent.fullDescription}
              </p>
            </div>
            <div className="mt-8">
              <a 
                href="/about" 
                className="inline-block px-6 py-3 border border-electric-blue text-electric-blue hover:bg-electric-blue/10 transition-colors rounded-md"
              >
                {siteSettings?.aboutButtonText || "read more"}
              </a>
            </div>
          </div>
        </div>
      </section>
      
      {/* Music Video Section - Enhanced */}
      <section id="music-video" className="py-20 bg-navy">
        <div className="container mx-auto px-6">
          {featuredVideo ? (
            <>
              <h2 className="text-3xl md:text-4xl font-mulish mb-6 text-center">
                {featuredVideo.title}
              </h2>
              <p className="text-center text-ice-blue/70 mb-12 max-w-2xl mx-auto">
                {featuredVideo.description}
              </p>
              
              <div className="max-w-4xl mx-auto">
                {/* Video Container with Strapi thumbnail */}
                <div className="relative aspect-video rounded-lg overflow-hidden shadow-2xl">
                  <Image
                    src={getStrapiImageUrl(featuredVideo.thumbnail) || "/images/video_content/music_video_thumbnail_1.png"}
                    alt={featuredVideo.title}
                    fill
                    className="object-cover"
                  />
                  
                  {/* Play button overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-sapphire/40 to-navy/40 z-10 flex items-center justify-center">
                    <a 
                      href={featuredVideo.videoUrl || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-20 h-20 bg-electric-blue/90 rounded-full flex items-center justify-center shadow-lg hover:bg-electric-blue transition-colors"
                    >
                      <svg className="w-8 h-8 text-navy" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"></path>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-3xl md:text-4xl font-mulish mb-6 text-center">
                {siteSettings?.videoSectionTitle || "cool skin — official visual"}
              </h2>
              <p className="text-center text-ice-blue/70 mb-12 max-w-2xl mx-auto">
                {siteSettings?.videoSectionDescription || "directed by sarah winters. shot on location in new york city, winter 2025."}
              </p>
              
              <div className="max-w-4xl mx-auto">
                <div className="relative aspect-video rounded-lg overflow-hidden shadow-2xl">
                  <Image
                    src="/images/video_content/music_video_thumbnail_1.png"
                    alt="cool skin - official visual"
                    fill
                    className="object-cover"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-r from-sapphire/40 to-navy/40 z-10 flex items-center justify-center">
                    <button className="w-20 h-20 bg-electric-blue/90 rounded-full flex items-center justify-center shadow-lg hover:bg-electric-blue transition-colors">
                      <svg className="w-8 h-8 text-navy" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
          
          {/* Streaming options */}
          <div className="mt-8 text-center">
            <p className="mb-4 text-ice-blue">listen to "cool skin" on your preferred platform</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="https://spotify.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-4 py-2 bg-black rounded-md hover:bg-black/80 transition-colors flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.8-.179-.92-.6-.12-.421.18-.8.6-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.48.659.262 1.08zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"></path>
                </svg>
                <span>spotify</span>
              </a>
              <a 
                href="https://music.apple.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-4 py-2 bg-black rounded-md hover:bg-black/80 transition-colors flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.997 6.124c0-.738-.065-1.47-.24-2.19-.317-1.31-1.062-2.31-2.18-3.043C21.003.517 20.373.285 19.7.164c-.517-.093-1.038-.135-1.564-.15-.04-.003-.083-.01-.124-.013H5.988c-.152.01-.303.017-.455.026C4.786.07 4.043.15 3.34.428 2.004.958 1.02 1.88.475 3.208c-.192.466-.34.943-.408 1.44-.087.625-.108 1.25-.108 1.878 0 .56.016 1.12.048 1.678.026.45.083.93.152 1.388.178 1.178.607 2.19 1.29 3.093.693.916 1.583 1.558 2.645 1.896.772.242 1.56.34 2.368.383.196.01.39.016.588.018 1.954.048 3.908.057 5.863.058 1.952-.001 3.902-.01 5.857-.058.2-.002.396-.008.592-.018.807-.044 1.595-.14 2.366-.383 1.062-.338 1.95-.98 2.643-1.896.683-.904 1.112-1.915 1.29-3.093.07-.458.124-.935.152-1.388.032-.56.048-1.12.048-1.678 0-.63-.02-1.254-.107-1.88-.07-.492-.216-.972-.407-1.436-.348-.99-.87-1.83-1.568-2.514-.653-.64-1.395-1.12-2.235-1.436-.937-.35-1.92-.468-2.92-.492-.496-.008-.995.005-1.49.03-.153.008-.306.013-.46.018z"></path>
                  <path d="M12.142 5.025c-1.066 0-2.033.178-2.9.53-1.71.697-2.845 2.01-3.037 3.84-.08.766.033 1.5.338 2.196.63 1.437 1.713 2.34 3.283 2.64.5.096 1.018.144 1.53.144.698 0 1.398-.063 2.075-.19.703-.133 1.362-.37 1.94-.756 1.244-.833 1.935-2.03 1.93-3.573-.006-2.54-2.322-4.83-5.16-4.83z" fill="white"></path>
                </svg>
                <span>apple music</span>
              </a>
              <a 
                href="https://youtube.com/@evanjamesb" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-4 py-2 bg-black rounded-md hover:bg-black/80 transition-colors flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"></path>
                </svg>
                <span>youtube</span>
              </a>
            </div>
          </div>
        </div>
      </section>
      
      {/* Email Signup Section */}
      <section id="email-signup" className="py-20 bg-sapphire/30 relative">
        <div className="absolute inset-0 opacity-15">
          <Image
            src="/images/backgrounds/offline_page_background_1.png"
            alt="background pattern"
            fill
            className="object-cover"
          />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-mulish mb-4 text-ice-blue">
                {siteSettings?.newsletterTitle || "stay connected"}
              </h2>
              <p className="text-xl text-white/80">
                {siteSettings?.newsletterDescription || "be the first to hear what's next from evan james"}
              </p>
            </div>
            
            <div className="bg-navy/50 rounded-lg p-8 backdrop-blur-sm">
              {submitSuccess ? (
                <div className="text-center py-4">
                  <svg className="w-16 h-16 text-electric-blue mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <h3 className="text-2xl font-mulish mb-2">thanks for subscribing!</h3>
                  <p className="text-ice-blue/80">
                    you're now on the list to receive updates about new music, tour dates, and more.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-ice-blue mb-2 font-mulish">
                      email address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full p-3 bg-navy/70 border border-electric-blue/30 rounded focus:outline-none focus:ring-2 focus:ring-electric-blue text-white"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  {submitError && <p className="text-red-400 text-sm">{submitError}</p>}
                  
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full py-3 ${isSubmitting ? 'bg-electric-blue/50' : 'bg-electric-blue hover:bg-electric-blue/80'} text-white rounded transition-colors font-mulish`}
                    >
                      {isSubmitting ? 'subscribing...' : 'subscribe'}
                    </button>
                  </div>
                  
                  <p className="text-xs text-white/60 text-center mt-4">
                    no spam, ever. unsubscribe at any time. your email will never be shared with third parties.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Upcoming Shows Preview (smaller section now) */}
      <section className="py-16 bg-navy relative">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/images/merch/tshirt_1.jpg"
            alt="tour background"
            fill
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-navy/80"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <h2 className="text-3xl font-mulish mb-8 text-center">upcoming shows</h2>
          
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-ice-blue/70 mb-8">
              tour dates for the tainted blue era coming soon.
            </p>
            
            <a 
              href="/tour" 
              className="px-6 py-3 border border-electric-blue text-electric-blue hover:bg-electric-blue/10 transition-colors rounded-md inline-block font-mulish"
            >
              view tour page
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export async function getServerSideProps() {
  try {
    console.log('Homepage: Fetching data server-side...');
    
    // Fetch data from Strapi server-side
    const [featuredData, releasesData, videoData, bioData, settingsData] = await Promise.all([
      getFeaturedRelease(),
      getAlbums(),
      getFeaturedVideo(),
      getBio(),
      getSiteSettings()
    ]);
    
    console.log('Homepage: Server-side data fetched successfully');
    
    return {
      props: {
        featuredRelease: featuredData ? formatStrapiData(featuredData) : null,
        releases: releasesData?.data ? formatStrapiData(releasesData.data) : [],
        featuredVideo: videoData ? formatStrapiData(videoData) : null,
        bio: bioData?.data ? formatStrapiData(bioData.data) : null,
        siteSettings: settingsData?.data ? settingsData.data.attributes : null,
      },
    };
  } catch (error) {
    console.error('Homepage: Error fetching server-side data:', error);
    
    // Return empty props on error to prevent page crash
    return {
      props: {
        featuredRelease: null,
        releases: [],
        featuredVideo: null,
        bio: null,
        siteSettings: null,
      },
    };
  }
}
