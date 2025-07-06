import React from 'react';
import Head from 'next/head';
import Navbar from './Navbar';
import Footer from './Footer';
import { useRouter } from 'next/router';

export default function Layout({ 
  children, 
  title = 'evan james | official website', 
  description = 'Official website for independent pop artist Evan James. Featuring Cool Skin from the upcoming Tainted Blue EP.', 
  image = '/images/evanjames_sq_logo.png' 
}) {
  const siteUrl = 'https://evanjamesofficial.com';
  const router = useRouter();
  const isHomePage = router.pathname === '/';

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/images/evanjames_favi.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/images/evanjames_favi.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/images/evanjames_sq_logo.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0047AB" />
        
        {/* Open Graph / Social Media sharing */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={`${siteUrl}${image}`} />
        <meta property="og:image:alt" content="Evan James" />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Evan James Official" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={`${siteUrl}${image}`} />
        <meta name="twitter:creator" content="@evanjamesb" />
        
        {/* Canonical Link */}
        <link rel="canonical" href={siteUrl} />
        
        {/* Custom Fonts - matches brand guidelines */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Moved font stylesheet to _document.js to avoid Next.js warning */}
        
        {/* Additional SEO & UX Improvements */}
        <meta name="application-name" content="Evan James Official" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="msapplication-TileColor" content="#0a192f" />
        <meta name="msapplication-tap-highlight" content="no" />
      </Head>
      <div 
        className={`flex flex-col min-h-screen text-white ${isHomePage ? 'bg-navy' : 'bg-no-repeat bg-cover bg-fixed bg-center'}`}
        style={!isHomePage ? { backgroundImage: 'url("/images/evan_background.png")', backgroundColor: 'rgb(0, 17, 41)' } : {}}
      >
        <Navbar />
        <main className="flex-grow pt-20">{children}</main>
        <Footer />
      </div>
    </>
  );
}
