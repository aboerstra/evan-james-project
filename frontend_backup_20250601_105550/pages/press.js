import React, { useState } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import Image from 'next/image';
import { getSiteSettings } from '../services/api';

export default function PressPage({ siteSettings }) {
  // State to manage access to protected content
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const samplePressPhotos = [
    { id: 1, src: '/images/artist_photos/press_kit_portrait_1_1.png', alt: 'evan james press photo 1' },
    { id: 2, src: '/images/artist_photos/press_kit_portrait_2_1.png', alt: 'evan james press photo 2' },
    { id: 3, src: '/images/artist_photos/bio_portrait_1.png', alt: 'evan james press photo 3' },
  ];

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    // Simple password authentication - would be replaced by proper auth
    if (password === 'taintedblue') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('incorrect password. please try again or contact management for access.');
    }
  };

  const PasswordProtectedContent = () => (
    <>
      {/* Header Image - full width spanning the screen */}
      <div className="relative w-full h-96 md:h-[600px] overflow-hidden">
        <Image 
          src={
            siteSettings?.data?.attributes?.pressHeaderImage?.data?.attributes?.url 
              ? `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${siteSettings.data.attributes.pressHeaderImage.data.attributes.url}`
              : "/images/hero_banners/press_kit_header_1.png"
          }
          alt="evan james press kit"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/60 to-navy/40 flex items-center">
          <div className="max-w-6xl mx-auto px-6 w-full">
            <h1 className="text-4xl md:text-5xl font-mulish text-white">press kit</h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Password Protection Form */}
        <div className="flex flex-col items-center justify-center text-white">
          <div className="max-w-md w-full bg-navy/80 backdrop-blur-md p-8 rounded-lg border border-electric-blue/30">
            <h2 className="text-2xl font-mulish mb-6 text-center">press kit access</h2>
            <p className="mb-6 text-center text-ice-blue/80">
              please enter the password to access the press kit.
            </p>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 bg-navy/50 border border-electric-blue/30 rounded focus:outline-none focus:ring-2 focus:ring-electric-blue text-white"
                  placeholder="password"
                  required
                />
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button
                type="submit"
                className="w-full py-3 bg-electric-blue hover:bg-electric-blue/80 text-white rounded transition duration-300 font-mulish"
              >
                access press kit
              </button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-sm text-ice-blue/60">
                need access? <a href="/contact" className="text-electric-blue hover:underline">contact management</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const PressContent = () => (
    <>
      {/* Header Image - full width spanning the screen */}
      <div className="relative w-full h-96 md:h-[600px] overflow-hidden">
        <Image 
          src={
            siteSettings?.data?.attributes?.pressHeaderImage?.data?.attributes?.url 
              ? `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${siteSettings.data.attributes.pressHeaderImage.data.attributes.url}`
              : "/images/hero_banners/press_kit_header_1.png"
          }
          alt="evan james press kit"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/60 to-navy/40 flex items-center">
          <div className="max-w-6xl mx-auto px-6 w-full">
            <h1 className="text-4xl md:text-5xl font-mulish text-white">press kit</h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="space-y-16">
          
          {/* Bio Section */}
          <section className="bg-navy/80 backdrop-blur-md p-6 rounded-lg border border-electric-blue/30">
            <h2 className="text-3xl font-mulish mb-6 text-ice-blue">bio</h2>
            <div className="prose prose-lg prose-invert max-w-none">
              <p>
                evan james is an independent pop artist based in new york city. with his debut ep "tainted blue"
                on the horizon, evan is establishing himself as a serious voice in the indie pop scene, merging
                cinematic soundscapes with introspective lyrics that explore themes of identity, expectation,
                and transformation.
              </p>
              <p>
                his first single "cool skin" represents his artistic vision that balances commercial accessibility
                with artistic integrity, drawing inspiration from artists like troye sivan, lorde, and frank ocean.
              </p>
              <p>
                self-produced and independently released, evan's work reflects his commitment to creative control
                and artistic authenticity.
              </p>
            </div>
          </section>

          {/* Press Photos */}
          <section className="bg-navy/80 backdrop-blur-md p-6 rounded-lg border border-electric-blue/30">
            <h2 className="text-3xl font-mulish mb-6 text-ice-blue">press photos</h2>
            <p className="mb-6 text-sm text-ice-blue/80">
              all images are available in high resolution. click on images to download.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {samplePressPhotos.map(photo => (
                <div key={photo.id} className="group relative aspect-square bg-navy/50 overflow-hidden rounded-lg shadow-lg">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-4">
                    <a 
                      href={photo.src} 
                      download
                      className="px-4 py-2 bg-electric-blue text-white rounded text-sm font-mulish"
                    >
                      download high-res
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Music Links */}
          <section className="bg-navy/80 backdrop-blur-md p-6 rounded-lg border border-electric-blue/30">
            <h2 className="text-3xl font-mulish mb-6 text-ice-blue">music</h2>
            <div className="space-y-6">
              <div className="p-6 rounded-lg bg-sapphire/20">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/4">
                    <div className="relative aspect-square rounded-lg overflow-hidden shadow-lg">
                      <Image
                        src="/images/music_releases/latest_single_cover_1.png"
                        alt="cool skin single cover"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="md:w-3/4">
                    <h3 className="text-xl font-mulish mb-2">cool skin (single)</h3>
                    <p className="mb-4 text-ice-blue/80">release date: june 2025</p>
                    <div className="flex flex-wrap gap-3">
                      <a href="https://spotify.com" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-black rounded flex items-center space-x-2 hover:bg-black/80 transition font-mulish">
                        <span>spotify</span>
                      </a>
                      <a href="https://music.apple.com" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-black rounded flex items-center space-x-2 hover:bg-black/80 transition font-mulish">
                        <span>apple music</span>
                      </a>
                      <a href="https://youtube.com/@evanjamesb" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-black rounded flex items-center space-x-2 hover:bg-black/80 transition font-mulish">
                        <span>youtube music</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Videos */}
          <section className="bg-navy/80 backdrop-blur-md p-6 rounded-lg border border-electric-blue/30">
            <h2 className="text-3xl font-mulish mb-6 text-ice-blue">videos</h2>
            <div className="relative aspect-video bg-navy/50 rounded-lg overflow-hidden shadow-lg">
              <Image
                src="/images/video_content/music_video_thumbnail_1.png"
                alt="cool skin - official visual"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/70 to-transparent flex items-center justify-center">
                <div className="relative z-10">
                  <button className="w-16 h-16 bg-electric-blue/90 rounded-full flex items-center justify-center shadow-lg hover:bg-electric-blue transition-colors">
                    <svg className="w-6 h-6 text-navy" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"></path>
                    </svg>
                  </button>
                  <p className="text-ice-blue text-center mt-4 font-mulish">cool skin (official visual)</p>
                </div>
              </div>
            </div>
          </section>

          {/* Download Press Kit */}
          <section className="py-8">
            <div className="bg-navy/80 backdrop-blur-md border border-electric-blue/30 rounded-lg p-8 text-center">
              <h2 className="text-2xl font-mulish mb-4">download complete press kit</h2>
              <p className="mb-6 text-ice-blue/80">
                includes hi-res photos, full bio, and additional information for media.
              </p>
              <a 
                href="#" 
                className="inline-block px-8 py-3 bg-electric-blue text-white rounded-md hover:bg-electric-blue/80 transition font-mulish"
              >
                download press kit (pdf)
              </a>
            </div>
          </section>
        </div>
      </div>
    </>
  );

  return (
    <Layout title="press kit | evan james official" 
            description="press resources for independent pop artist evan james. access bio, high-resolution photos, music, and more.">
      <Head>
        <meta name="robots" content="noindex" />
      </Head>
      
      {!isAuthenticated ? <PasswordProtectedContent /> : <PressContent />}
    </Layout>
  );
}

export async function getServerSideProps() {
  try {
    const siteSettings = await getSiteSettings('pressHeaderImage');
    
    return {
      props: {
        siteSettings: siteSettings || null,
      },
    };
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return {
      props: {
        siteSettings: null,
      },
    };
  }
}
