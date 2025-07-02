import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';

export default function VerifyEmail() {
  const router = useRouter();
  const { token, email } = router.query;
  
  const [verificationState, setVerificationState] = useState({
    isLoading: true,
    isSuccess: false,
    isError: false,
    message: ''
  });

  useEffect(() => {
    // Only run verification when both token and email are available
    if (!token || !email) return;

    const verifyEmail = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/newsletter-subscriptions/verify`, 
          { params: { token, email } }
        );
        
        setVerificationState({
          isLoading: false,
          isSuccess: true,
          isError: false,
          message: response.data.message || 'Your email has been successfully verified!'
        });
      } catch (error) {
        console.error('Verification error:', error);
        setVerificationState({
          isLoading: false,
          isSuccess: false,
          isError: true,
          message: error.response?.data?.error?.message || 'Failed to verify your email. The link may be invalid or expired.'
        });
      }
    };

    verifyEmail();
  }, [token, email]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-navy to-slate-900 flex flex-col justify-center items-center px-6">
      <Head>
        <title>Email Verification | Evan James</title>
        <meta name="description" content="Verify your email subscription to Evan James updates" />
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
          Email Verification
        </h1>
        
        {verificationState.isLoading && (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-electric-blue mb-4"></div>
            <p className="text-white/80">Verifying your email address...</p>
          </div>
        )}
        
        {verificationState.isSuccess && (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-2xl text-electric-blue mb-4">Verification Successful!</h2>
            <p className="text-white/80 mb-6">{verificationState.message}</p>
            <p className="text-white/80 mb-8">Thank you for subscribing to updates from Evan James.</p>
            <Link href="/" className="px-6 py-3 bg-electric-blue text-white hover:bg-electric-blue/80 transition-colors rounded-md">
              Return to Homepage
            </Link>
          </div>
        )}
        
        {verificationState.isError && (
          <div className="text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <h2 className="text-2xl text-red-400 mb-4">Verification Failed</h2>
            <p className="text-white/80 mb-6">{verificationState.message}</p>
            <p className="text-white/80 mb-8">
              If you need assistance, please contact us at <a href="mailto:support@evanjames.com" className="text-electric-blue hover:underline">support@evanjames.com</a>
            </p>
            <Link href="/" className="px-6 py-3 bg-electric-blue text-white hover:bg-electric-blue/80 transition-colors rounded-md">
              Return to Homepage
            </Link>
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
