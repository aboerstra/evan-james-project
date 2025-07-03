import React from 'react';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import AnimatedBackground from '../components/AnimatedBackground';

export default function LandingPage() {
  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  // Email signup state
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Release date - June 15th, 2025
  const releaseDate = new Date('2025-06-15T00:00:00');
  
  // Calculate time remaining
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = releaseDate - now;
      
      if (difference <= 0) {
        clearInterval(timer);
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        });
        return;
      }
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const seconds = Math.floor((difference / 1000) % 60);
      
      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Handle email signup
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Mock API call - would be replaced with actual API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulating success
      setIsSubmitted(true);
      setEmail('');
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <>
      <Head>
        <title>evan james | cool skin - coming soon</title>
        <meta name="description" content="evan james - cool skin, debut single from tainted blue. coming june 2025." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/images/evanjames_favi.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/images/evanjames_favi.png" />
        
        {/* Open Graph / Social Media */}
        <meta property="og:title" content="evan james | cool skin - coming soon" />
        <meta property="og:description" content="evan james - cool skin, debut single from tainted blue. coming june 2025." />
        <meta property="og:image" content="/images/evanjames_sq_logo.png" />
        <meta property="og:url" content="https://evanjamesofficial.com" />
        <meta property="og:type" content="website" />
        
        {/* Custom Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Mulish:wght@300;400;500;600&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </Head>
      
      <AnimatedBackground intensity={0.3} overlayOpacity={0.5}>
        <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
          <div className="animate-fade-in-up">
            {/* Logo */}
            <div className="relative w-40 h-40 mx-auto mb-10 animate-pulse-slow">
              <Image
                src="/images/evanjames_sq_logo.png"
                alt="evan james logo"
                fill
                priority
                className="object-contain drop-shadow-lg"
              />
            </div>
            
            {/* Heading */}
            <h1 className="text-4xl md:text-6xl font-mulish mb-2 text-white tracking-wider">evan james</h1>
            <p className="text-xl md:text-2xl font-mulish mb-10 text-electric-blue">cool skin — june 2025</p>
            
            {/* Countdown timer */}
            <div className="grid grid-cols-4 max-w-lg mx-auto gap-4 mb-12">
              <div className="p-4 md:p-6 bg-gradient-to-b from-sapphire/40 to-navy/80 backdrop-blur-sm rounded-lg border border-electric-blue/20 shadow-lg shadow-electric-blue/10 transition-transform hover:scale-105">
                <div className="text-3xl md:text-5xl font-mulish text-ice-blue mb-1">{timeLeft.days}</div>
                <div className="text-xs md:text-sm text-white/80 uppercase tracking-widest">days</div>
              </div>
              <div className="p-4 md:p-6 bg-gradient-to-b from-sapphire/40 to-navy/80 backdrop-blur-sm rounded-lg border border-electric-blue/20 shadow-lg shadow-electric-blue/10 transition-transform hover:scale-105">
                <div className="text-3xl md:text-5xl font-mulish text-ice-blue mb-1">{timeLeft.hours}</div>
                <div className="text-xs md:text-sm text-white/80 uppercase tracking-widest">hours</div>
              </div>
              <div className="p-4 md:p-6 bg-gradient-to-b from-sapphire/40 to-navy/80 backdrop-blur-sm rounded-lg border border-electric-blue/20 shadow-lg shadow-electric-blue/10 transition-transform hover:scale-105">
                <div className="text-3xl md:text-5xl font-mulish text-ice-blue mb-1">{timeLeft.minutes}</div>
                <div className="text-xs md:text-sm text-white/80 uppercase tracking-widest">minutes</div>
              </div>
              <div className="p-4 md:p-6 bg-gradient-to-b from-sapphire/40 to-navy/80 backdrop-blur-sm rounded-lg border border-electric-blue/20 shadow-lg shadow-electric-blue/10 transition-transform hover:scale-105">
                <div className="text-3xl md:text-5xl font-mulish text-ice-blue mb-1">{timeLeft.seconds}</div>
                <div className="text-xs md:text-sm text-white/80 uppercase tracking-widest">seconds</div>
              </div>
            </div>
            
            {/* Email signup */}
            <div className="max-w-md mx-auto animate-fade-in">
              <p className="mb-6 text-white/90">sign up to be notified when cool skin drops and receive exclusive updates on tainted blue.</p>
              
              {isSubmitted ? (
                <div className="p-4 bg-electric-blue/20 rounded-lg backdrop-blur-sm border border-electric-blue/30">
                  <p className="text-ice-blue">thanks for signing up! we'll be in touch soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your email address"
                    className="flex-grow p-3 bg-navy/70 backdrop-blur-sm border border-electric-blue/30 rounded focus:outline-none focus:ring-2 focus:ring-electric-blue text-white"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    className={`px-6 py-3 ${isLoading ? 'bg-electric-blue/50' : 'bg-electric-blue hover:bg-electric-blue/80'} text-white rounded transition shadow-lg shadow-electric-blue/20`}
                    disabled={isLoading}
                  >
                    {isLoading ? 'subscribing...' : 'notify me'}
                  </button>
                </form>
              )}
              
              {error && <p className="mt-2 text-red-400 text-sm">{error}</p>}
            </div>
            
            {/* Social links */}
            <div className="mt-12 flex justify-center gap-6">
              <a href="https://instagram.com/evanjamesb" target="_blank" rel="noopener noreferrer" className="text-[#0047AB] hover:text-[#1E90FF] transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                </svg>
              </a>
              <a href="https://youtube.com/@evanjamesb" target="_blank" rel="noopener noreferrer" className="text-[#0047AB] hover:text-[#1E90FF] transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"></path>
                </svg>
              </a>
              <a href="https://tiktok.com/@evannjames" target="_blank" rel="noopener noreferrer" className="text-[#0047AB] hover:text-[#1E90FF] transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
              </a>
              <a href="https://open.spotify.com/artist/evan-james" target="_blank" rel="noopener noreferrer" className="text-[#0047AB] hover:text-[#1E90FF] transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
              </a>
            </div>
            
            {/* Copyright */}
            <div className="mt-12 text-white/50 text-sm">
              © 2025 evan james
            </div>
          </div>
        </div>
      </AnimatedBackground>
    </>
  );
}
