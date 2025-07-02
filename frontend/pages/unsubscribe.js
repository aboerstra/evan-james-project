import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';

export default function Unsubscribe() {
  const router = useRouter();
  const { email, token } = router.query;
  
  const [unsubscribeState, setUnsubscribeState] = useState({
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: '',
    email: ''
  });

  // Handle one-click unsubscribe when email and token are provided in URL
  useEffect(() => {
    if (!email || !token) return;
    
    const processOneClickUnsubscribe = async () => {
      setUnsubscribeState(prev => ({ ...prev, isLoading: true }));
      
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/newsletter-subscriptions/unsubscribe`, 
          { params: { email, token } }
        );
        
        setUnsubscribeState({
          isLoading: false,
          isSuccess: true,
          isError: false,
          message: response.data.message || 'You have been successfully unsubscribed.',
          email: email
        });
      } catch (error) {
        console.error('Unsubscribe error:', error);
        setUnsubscribeState({
          isLoading: false,
          isSuccess: false,
          isError: true,
          message: error.response?.data?.error?.message || 'Failed to unsubscribe. Please try again.',
          email: email
        });
      }
    };

    processOneClickUnsubscribe();
  }, [email, token]);

  // Handle form submission for manual unsubscribe
  const handleUnsubscribe = async (e) => {
    e.preventDefault();
    setUnsubscribeState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // First check if the email exists
      const checkResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/newsletter-subscriptions/unsubscribe`, 
        { params: { email: unsubscribeState.email } }
      );
      
      if (checkResponse.data.success) {
        // Email exists, now confirm unsubscribe
        const confirmResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/newsletter-subscriptions/confirm-unsubscribe`,
          { email: unsubscribeState.email }
        );
        
        setUnsubscribeState(prev => ({
          ...prev,
          isLoading: false,
          isSuccess: true,
          isError: false,
          message: confirmResponse.data.message || 'You have been successfully unsubscribed.'
        }));
      }
    } catch (error) {
      console.error('Unsubscribe error:', error);
      setUnsubscribeState(prev => ({
        ...prev,
        isLoading: false,
        isSuccess: false,
        isError: true,
        message: error.response?.data?.error?.message || 'Failed to unsubscribe. Please try again.'
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-navy to-slate-900 flex flex-col justify-center items-center px-6">
      <Head>
        <title>Unsubscribe | Evan James</title>
        <meta name="description" content="Unsubscribe from Evan James email updates" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Wavy background pattern */}
      <div className="absolute inset-0 opacity-15 bg-repeat bg-center bg-[url('/images/backgrounds/offline_page_background_1.png')]"></div>
      
      {/* Animated gradients for depth */}
      <div className="absolute inset-0 opacity-25">
        <div className="absolute -inset-[100%] animate-spin-slow bg-gradient-radial from-white/10 via-transparent to-transparent blur-xl"></div>
        <div className="absolute -inset-[100%] animate-spin-slow-reverse bg-gradient-radial from-white/10 via-transparent to-transparent blur-xl"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0039A6]/80 via-transparent to-[#0039A6]/80"></div>
      </div>
      
      <div className="max-w-md w-full mx-auto text-center relative z-10 bg-navy/30 backdrop-blur-sm p-8 rounded-lg border border-electric-blue/20">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <Image
            src="/images/evanjames_logo_gradient_tight_trans.png"
            alt="Evan James"
            width={200}
            height={60}
            priority
          />
        </div>
        
        <h1 className="text-3xl font-mulish font-light text-white mb-6">
          Unsubscribe
        </h1>
        
        {unsubscribeState.isLoading && (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-electric-blue mb-4"></div>
            <p className="text-white/80">Processing your request...</p>
          </div>
        )}
        
        {unsubscribeState.isSuccess && (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-2xl text-electric-blue mb-4">Unsubscribed Successfully</h2>
            <p className="text-white/80 mb-6">{unsubscribeState.message}</p>
            <p className="text-white/80 mb-8">
              We're sorry to see you go. Your email address has been deactivated in our system and you will no longer receive any communications from us. If you change your mind, you can always subscribe again in the future.
            </p>
            <Link href="/" className="px-6 py-3 bg-electric-blue text-white hover:bg-electric-blue/80 transition-colors rounded-md">
              Return to Homepage
            </Link>
          </div>
        )}
        
        {unsubscribeState.isError && (
          <div className="text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <h2 className="text-2xl text-red-400 mb-4">Unsubscribe Failed</h2>
            <p className="text-white/80 mb-6">{unsubscribeState.message}</p>
            <p className="text-white/80 mb-8">
              If you need assistance, please contact us at <a href="mailto:support@evanjames.com" className="text-electric-blue hover:underline">support@evanjames.com</a>
            </p>
          </div>
        )}
        
        {!unsubscribeState.isLoading && !unsubscribeState.isSuccess && !unsubscribeState.isError && (
          <div>
            <p className="text-white/80 mb-6">
              Enter your email address below to unsubscribe from our mailing list.
            </p>
            
            <form onSubmit={handleUnsubscribe} className="mb-6">
              <div className="mb-4">
                <input
                  type="email"
                  value={unsubscribeState.email}
                  onChange={(e) => setUnsubscribeState(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Your email address"
                  className="w-full px-4 py-3 bg-transparent border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-electric-blue transition-colors rounded"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full px-6 py-3 bg-red-500 text-white hover:bg-red-600 transition-colors rounded-md"
              >
                Unsubscribe
              </button>
            </form>
            
            <p className="text-white/60 text-sm">
              If you unsubscribe, you will no longer receive any emails from us.
            </p>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-white/40 text-sm font-mulish">
          © {new Date().getFullYear()} Evan James | All Rights Reserved
        </p>
      </div>
    </div>
  );
}
