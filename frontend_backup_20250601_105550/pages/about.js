import React from 'react';
import Layout from '../components/Layout';
import Image from 'next/image';
import ImageGallery from '../components/ImageGallery';
import { getBio, getPortfolioPhotos, getStrapiImageUrl } from '../services/api';

export default function About({ bioData: serverBioData, portfolioPhotos: serverPortfolioPhotos }) {
  // Use server-side data directly
  const bioData = serverBioData;
  const portfolioPhotos = serverPortfolioPhotos;
  const loading = false; // No loading state needed with SSR
  const error = null; // Error handling done in getServerSideProps

  // Format portfolio photos for ImageGallery component
  const getFormattedPortfolioImages = () => {
    if (portfolioPhotos && portfolioPhotos.length > 0) {
      return portfolioPhotos.map((photo) => ({
        src: getStrapiImageUrl(photo.attributes.image),
        alt: photo.attributes.altText || photo.attributes.title,
        caption: photo.attributes.caption || photo.attributes.title
      }));
    }
    
    // Fallback images if no portfolio photos
    return [
      {
        src: '/images/artist_photos/press_kit_portrait_1_1.png',
        alt: 'evan in the studio',
        caption: 'recording "cool skin" at skyline studios'
      },
      {
        src: '/images/artist_photos/casual_bts_photo_1_1.png',
        alt: 'behind the scenes',
        caption: 'behind the scenes during music video shoot'
      },
      {
        src: '/images/artist_photos/press_kit_portrait_2_1.png',
        alt: 'evan performing',
        caption: 'live performance at mercury lounge'
      },
      {
        src: '/images/artist_photos/bio_portrait_1.png',
        alt: 'evan portrait',
        caption: 'promotional photoshoot for tainted blue'
      },
      {
        src: '/images/music_releases/latest_single_cover_1.png',
        alt: 'cool skin artwork',
        caption: 'cool skin artwork'
      },
      {
        src: '/images/video_content/music_video_thumbnail_1.png',
        alt: 'music video still',
        caption: 'from the "cool skin" visual'
      }
    ];
  };

  const studioImages = getFormattedPortfolioImages();

  // Helper function to render bio content
  const renderBioContent = (bioText) => {
    if (!bioText) return null;
    
    // Split by paragraphs and render each one
    const paragraphs = bioText.split('\n\n').filter(p => p.trim() && !p.startsWith('#'));
    
    return paragraphs.map((paragraph, index) => (
      <p key={index} className="mb-4">
        {paragraph.trim()}
      </p>
    ));
  };

  // Get headshot image URL
  const getHeadshotUrl = () => {
    return bioData?.attributes?.headshot 
      ? getStrapiImageUrl(bioData.attributes.headshot)
      : '/images/artist_photos/bio_portrait_1.png';
  };

  // Get header image URL
  const getHeaderImageUrl = () => {
    return bioData?.attributes?.headerImage 
      ? getStrapiImageUrl(bioData.attributes.headerImage)
      : '/images/hero_banners/about_page_hero_1.png';
  };

  const headshotUrl = getHeadshotUrl();
  const headerImageUrl = getHeaderImageUrl();

  return (
    <Layout 
      title={bioData?.attributes?.metaTitle || "about | evan james official"}
      description={bioData?.attributes?.metaDescription || "learn about independent pop artist evan james, his music, influences, and artistic vision."}
    >
      {/* Hero Banner */}
      <div className="relative w-full h-72 md:h-96">
        <Image 
          src={headerImageUrl}
          alt="evan james"
          fill
          className="object-cover"
          priority 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/80 to-transparent flex items-center">
          <div className="container mx-auto px-6">
            <h1 className="text-4xl md:text-6xl font-mulish text-white max-w-xl">about</h1>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Bio Grid with Image */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 items-center">
            <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-xl">
              <Image
                src={headshotUrl}
                alt="evan james"
                fill
                className="object-cover"
              />
            </div>
            <div className="bg-navy/80 backdrop-blur-md p-6 rounded-lg border border-electric-blue/30">
              <h2 className="text-3xl font-mulish mb-6 text-ice-blue">the artist</h2>
              <div className="prose prose-lg prose-invert">
                {bioData?.attributes?.fullBio ? (
                  renderBioContent(bioData.attributes.fullBio)
                ) : (
                  // Fallback content if no bio data
                  <>
                    <p>
                      evan james is an independent pop artist based in new york city. with his debut ep "tainted blue" 
                      on the horizon, evan is establishing himself as a serious voice in the indie pop scene, blending
                      emotive songwriting with cinematic soundscapes.
                    </p>
                    <p>
                      inspired by artists like troye sivan, lorde, and frank ocean, evan's music explores themes of 
                      identity, expectation, and transformation. his approach balances commercial accessibility with 
                      artistic integrity, creating music that resonates with listeners on a personal level.
                    </p>
                    <p>
                      self-produced and independently released, evan's work reflects his commitment to creative control
                      and artistic authenticity. each song is crafted to create an immersive emotional experience, drawing
                      listeners into evan's world of vivid sonic landscapes and intimate storytelling.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* Timeline Section */}
          <div className="mb-16 bg-navy/80 backdrop-blur-md p-6 rounded-lg border border-electric-blue/30">
            <h2 className="text-3xl font-mulish mb-8 text-ice-blue">journey</h2>
            <div className="relative border-l border-electric-blue/30 pl-8 space-y-10 ml-4">
              {/* Timeline Item 1 */}
              <div className="relative">
                <div className="absolute -left-12 mt-1.5 h-6 w-6 rounded-full border-2 border-electric-blue bg-navy"></div>
                <h3 className="text-xl font-mulish text-electric-blue">2023</h3>
                <p className="mt-2">began writing and producing "tainted blue" ep in brooklyn home studio</p>
              </div>
              
              {/* Timeline Item 2 */}
              <div className="relative">
                <div className="absolute -left-12 mt-1.5 h-6 w-6 rounded-full border-2 border-electric-blue bg-navy"></div>
                <h3 className="text-xl font-mulish text-electric-blue">early 2024</h3>
                <p className="mt-2">recorded final vocals and instrumentals for debut single "cool skin"</p>
              </div>
              
              {/* Timeline Item 3 */}
              <div className="relative">
                <div className="absolute -left-12 mt-1.5 h-6 w-6 rounded-full border-2 border-electric-blue bg-navy"></div>
                <h3 className="text-xl font-mulish text-electric-blue">spring 2024</h3>
                <p className="mt-2">collaborated with director sarah winters on the "cool skin" visual</p>
              </div>
              
              {/* Timeline Item 4 */}
              <div className="relative">
                <div className="absolute -left-12 mt-1.5 h-6 w-6 rounded-full border-2 border-electric-blue bg-navy"></div>
                <h3 className="text-xl font-mulish text-electric-blue">june 2025</h3>
                <p className="mt-2">"cool skin" official release across all streaming platforms</p>
              </div>
              
              {/* Timeline Item 5 */}
              <div className="relative">
                <div className="absolute -left-12 mt-1.5 h-6 w-6 rounded-full border-2 border-electric-blue bg-navy"></div>
                <h3 className="text-xl font-mulish text-electric-blue">fall 2025</h3>
                <p className="mt-2">full "tainted blue" ep release and supporting tour</p>
              </div>
            </div>
          </div>
          
          {/* Quote Section */}
          <div className="py-10 border-t border-b border-electric-blue/30 mb-16 bg-navy/80 backdrop-blur-md p-6 rounded-lg">
            <blockquote className="text-2xl md:text-3xl font-mulish text-center italic text-electric-blue">
              "my goal is to create music that resonates with listeners on an emotional level - songs that feel like a conversation between friends."
            </blockquote>
          </div>
          
          {/* Image Gallery */}
          {portfolioPhotos.length > 0 ? (
            <ImageGallery 
              images={studioImages} 
              title="visual portfolio"
              description="select images from studio sessions, live performances, and promotional content"
            />
          ) : (
            <div className="mb-16 text-center py-12">
              <h2 className="text-3xl font-mulish mb-6 text-ice-blue">visual portfolio</h2>
              <p className="text-white/70">No gallery images available</p>
            </div>
          )}
          
          {/* Music Influences */}
          <div className="mb-16 bg-navy/80 backdrop-blur-md p-6 rounded-lg border border-electric-blue/30">
            <h2 className="text-3xl font-mulish mb-6 text-ice-blue">influences</h2>
            <div className="prose prose-lg prose-invert">
              <p>
                evan draws inspiration from a diverse array of artists across pop, indie, and electronic music. 
                key influences include troye sivan's intimate songwriting, lorde's distinctive production choices, 
                and frank ocean's boundary-pushing creativity.
              </p>
              <p>
                sonically, evan's music explores the space between commercial pop production and experimental 
                electronic elements, creating a signature sound that's both accessible and artistically ambitious.
              </p>
            </div>
          </div>
          
          {/* FAQ Section */}
          <div className="mb-16 bg-navy/80 backdrop-blur-md p-6 rounded-lg border border-electric-blue/30">
            <h2 className="text-3xl font-mulish mb-6 text-ice-blue">faq</h2>
            <div className="space-y-8">
              <div className="border-b border-electric-blue/30 pb-4">
                <h3 className="text-xl font-mulish mb-2 text-white">what does "tainted blue" represent?</h3>
                <p className="text-ice-blue/80">
                  "tainted blue" represents the duality of personal identity - the contrast between how we present ourselves 
                  to the world and who we truly are beneath the surface. the ep explores themes of authenticity, vulnerability, 
                  and the courage it takes to reveal our true selves.
                </p>
              </div>
              
              <div className="border-b border-electric-blue/30 pb-4">
                <h3 className="text-xl font-mulish mb-2 text-white">who produces your music?</h3>
                <p className="text-ice-blue/80">
                  evan is involved in every aspect of his music's production, from songwriting to final mixing. 
                  while he collaborates with select producers on certain tracks, he maintains creative control 
                  over the entire production process.
                </p>
              </div>
              
              <div className="border-b border-electric-blue/30 pb-4">
                <h3 className="text-xl font-mulish mb-2 text-white">will you be touring?</h3>
                <p className="text-ice-blue/80">
                  yes! evan will be announcing tour dates for fall 2025 to support the release of the "tainted blue" ep. 
                  sign up for the mailing list to be the first to know about upcoming shows in your city.
                </p>
              </div>
            </div>
          </div>
          
          {/* Contact/Connect Section */}
          <div className="text-center bg-navy/80 backdrop-blur-md p-6 rounded-lg border border-electric-blue/30">
            <h2 className="text-3xl font-mulish mb-4 text-ice-blue">connect</h2>
            <p className="mb-6 text-lg">
              for management, press, or booking inquiries, please visit our <a href="/contact" className="text-electric-blue hover:underline">contact page</a>.
            </p>
            <div className="flex justify-center gap-6">
              <a href="https://instagram.com/evanjamesb" target="_blank" rel="noopener noreferrer" className="text-ice-blue hover:text-electric-blue transition-colors">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                </svg>
              </a>
              <a href="https://youtube.com/@evanjamesb" target="_blank" rel="noopener noreferrer" className="text-ice-blue hover:text-electric-blue transition-colors">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"></path>
                </svg>
              </a>
              <a href="https://tiktok.com/@evannjames" target="_blank" rel="noopener noreferrer" className="text-ice-blue hover:text-electric-blue transition-colors">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  try {
    console.log('About page: Fetching data server-side...');
    
    // Fetch both bio data and portfolio photos
    const [bioResponse, portfolioResponse] = await Promise.all([
      getBio(),
      getPortfolioPhotos()
    ]);
    
    console.log('About page: Server-side data fetched successfully');
    
    return {
      props: {
        bioData: bioResponse.data || null,
        portfolioPhotos: portfolioResponse.data || [],
      },
    };
  } catch (error) {
    console.error('About page: Error fetching server-side data:', error);
    
    // Return empty props on error to prevent page crash
    return {
      props: {
        bioData: null,
        portfolioPhotos: [],
      },
    };
  }
}
