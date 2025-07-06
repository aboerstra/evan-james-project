import React, { useEffect, useRef, useState } from 'react';

export default function AnimatedBackground({
  className = "",
  intensity = 0.5,
  particles = true,
  overlayOpacity = 0.4,
  children
}) {
  const bgRef = useRef(null);
  const [offset, setOffset] = useState(0);
  const ticking = useRef(false);
  
  // Parallax effect on scroll with throttling
  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        ticking.current = true;
        
        window.requestAnimationFrame(() => {
          if (bgRef.current) {
            setOffset(window.pageYOffset * intensity);
          }
          ticking.current = false;
        });
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [intensity]);
  
  return (
    <div className={`relative min-h-screen overflow-hidden ${className}`}>
      {/* Background layer with parallax effect */}
      <div 
        ref={bgRef} 
        className="absolute inset-0 z-0 will-change-transform" 
        style={{ transform: `translateY(${offset}px)` }}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-sapphire/30 via-navy to-black" style={{ opacity: overlayOpacity }}></div>
        
        {/* Background image or texture */}
        <div className="absolute inset-0 bg-[url('/images/backgrounds/offline_page_background_1.png')] bg-cover bg-center mix-blend-overlay opacity-40"></div>
        
        {/* Animated particles - only shown if particles prop is true */}
        {particles && (
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <div className="absolute h-2 w-2 rounded-full bg-electric-blue animate-pulse-slow opacity-60" style={{ top: '10%', left: '20%' }}></div>
            <div className="absolute h-3 w-3 rounded-full bg-ice-blue animate-pulse-slow opacity-40" style={{ top: '30%', left: '80%' }}></div>
            <div className="absolute h-2 w-2 rounded-full bg-electric-blue animate-pulse-slow opacity-50" style={{ top: '65%', left: '35%' }}></div>
            <div className="absolute h-4 w-4 rounded-full bg-sapphire animate-pulse-slow opacity-30" style={{ top: '85%', left: '75%' }}></div>
            <div className="absolute h-2 w-2 rounded-full bg-ice-blue animate-pulse-slow opacity-60" style={{ top: '45%', left: '15%' }}></div>
            <div className="absolute h-3 w-3 rounded-full bg-sapphire animate-pulse-slow opacity-20" style={{ top: '15%', left: '55%' }}></div>
            <div className="absolute h-1 w-1 rounded-full bg-ice-blue animate-pulse-slow opacity-50" style={{ top: '75%', left: '25%' }}></div>
            <div className="absolute h-2 w-2 rounded-full bg-electric-blue animate-pulse-slow opacity-40" style={{ top: '55%', left: '85%' }}></div>
          </div>
        )}
      </div>
      
      {/* Content layer */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
