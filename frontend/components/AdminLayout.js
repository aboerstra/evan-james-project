import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { getSiteStatus } from '../services/siteSettingsService';

// Admin Dashboard Layout Component
export default function AdminLayout({ children, title }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [siteStatus, setSiteStatus] = useState('live');
  const router = useRouter();
  
  // Check if user is authenticated on component mount
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
    }
    
    // Fetch site status
    async function fetchSiteStatus() {
      try {
        const status = await getSiteStatus();
        setSiteStatus(status);
      } catch (error) {
        console.error('Error fetching site status:', error);
      }
    }
    
    fetchSiteStatus();
  }, [router]);
  
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };
  
  const navigationItems = [
    { name: 'dashboard', href: '/admin/dashboard', icon: 'grid' },
    { name: 'homepage', href: '/admin/homepage', icon: 'home' },
    { name: 'releases', href: '/admin/releases', icon: 'music' },
    { name: 'videos', href: '/admin/videos', icon: 'film' },
    { name: 'photos', href: '/admin/photos', icon: 'image' },
    { name: 'biography', href: '/admin/biography', icon: 'file-text' },
    { name: 'tour dates', href: '/admin/tour', icon: 'calendar' },
    { name: 'merchandise', href: '/admin/merch', icon: 'shopping-bag' },
    { name: 'press kit', href: '/admin/press-kit', icon: 'briefcase' },
    { name: 'coming soon', href: '/admin/coming-soon', icon: 'eye-off' },
    { name: 'settings', href: '/admin/settings', icon: 'settings' }
  ];
  
  // Create a single string for the title
  const pageTitle = title ? `${title} | Evan James` : 'Admin Dashboard | Evan James';
  
  // Status badge color based on current site status
  const getStatusColor = () => {
    switch(siteStatus) {
      case 'live':
        return 'bg-green-500';
      case 'coming-soon':
        return 'bg-blue-500';
      case 'maintenance':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  return (
    <div className="min-h-screen bg-no-repeat bg-cover bg-fixed flex flex-col" style={{ backgroundImage: 'url("/images/evan_background.png")' }}>
      <Head>
        <title>{pageTitle}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      
      {/* Top Navigation Bar */}
      <header className="bg-black/50 backdrop-blur-sm border-b border-electric-blue/20 py-3 px-4 flex justify-between items-center">
        <div className="flex items-center">
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden mr-4 text-white focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
          
          {/* Logo */}
          <Link href="/admin/dashboard">
            <div className="flex items-center">
              <Image
                src="/images/evanjames_logo_250_new.png"
                alt="Evan James"
                width={120}
                height={34}
                priority
              />
              <span className="ml-2 text-ice-blue font-mulish">admin</span>
            </div>
          </Link>
        </div>
        
        {/* Site Status Indicator */}
        <Link 
          href="/admin/coming-soon"
          className="flex items-center mx-4 bg-navy/40 hover:bg-navy/60 transition rounded-md px-3 py-1.5 border border-electric-blue/20"
        >
          <div className={`w-2.5 h-2.5 rounded-full ${getStatusColor()} mr-2`}></div>
          <span className="text-sm text-white capitalize">{siteStatus}</span>
        </Link>
        
        {/* User menu */}
        <div className="flex items-center">
          <button
            onClick={handleLogout}
            className="text-sm text-white hover:text-ice-blue transition-colors"
          >
            sign out
          </button>
        </div>
      </header>
      
      <div className="flex flex-1">
        {/* Sidebar Navigation */}
        <aside 
          className={`w-64 bg-navy border-r border-electric-blue/20 md:block fixed md:static top-0 left-0 h-full z-40 transform transition-transform duration-300 ease-in-out md:transform-none ${
            isMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          style={{ marginTop: '59px', height: 'calc(100vh - 59px)' }}
        >
          <nav className="py-6 px-4 h-full overflow-y-auto">
            <ul className="space-y-2">
              {navigationItems.map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.href}
                    className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                      router.pathname === item.href 
                        ? 'bg-electric-blue/20 text-ice-blue' 
                        : 'text-white hover:bg-navy/70 hover:text-ice-blue'
                    }`}
                  >
                    <span className="font-mulish lowercase">{item.name}</span>
                    {item.name === 'coming soon' && siteStatus !== 'live' && (
                      <span className={`ml-auto px-1.5 py-0.5 rounded-full text-xs ${getStatusColor()} text-white`}>
                        active
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        
        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
