import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Authenticate with Strapi backend using users-permissions plugin
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/local`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: email, // users-permissions uses 'identifier' instead of 'email'
          password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Login response:', data); // Debug log
        
        // users-permissions returns { jwt, user } directly
        const token = data.jwt;
        const user = data.user;
        
        if (token) {
          // Store the JWT token for authenticated requests
          localStorage.setItem('adminToken', token);
          localStorage.setItem('adminUser', JSON.stringify(user));
          router.push('/admin/dashboard');
        } else {
          setError('Authentication failed - no token received');
        }
      } else {
        const errorData = await response.json();
        console.error('Login error response:', errorData); // Debug log
        setError(errorData.error?.message || errorData.message || 'Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Unable to connect to server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login | Admin Dashboard | Evan James</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      
      <div className="min-h-screen bg-no-repeat bg-cover bg-fixed flex items-center justify-center px-4" style={{ backgroundImage: 'url("/images/evan_background.png")' }}>
        <div className="max-w-md w-full space-y-8 bg-black/90 backdrop-blur-md p-8 rounded-lg border border-electric-blue/30">
          <div className="text-center">
            <div className="mx-auto w-36 mb-6">
              <Image 
                src="/images/evanjames_logo_250_new.png" 
                alt="Evan James"
                width={144}
                height={41} 
                priority
              />
            </div>
            <h2 className="text-xl font-mulish lowercase text-ice-blue">admin login</h2>
            <p className="mt-2 text-sm text-white/60">
              Please sign in to access the admin dashboard
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/20 border border-red-500/40 rounded-md p-3 text-sm">
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm mb-1">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-black/50 border border-electric-blue/30 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-blue text-white"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm mb-1">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-black/50 border border-electric-blue/30 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-blue text-white"
              />
            </div>
            
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-electric-blue hover:bg-electric-blue/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-electric-blue transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
          
          <div className="text-center">
            <p className="text-xs text-white/40">
              Connected to Strapi CMS
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
