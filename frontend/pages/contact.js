import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Layout from '../components/Layout';
import { submitContactForm, getSiteSettings } from '../services/api';
import { getRateLimitInfo, getWaitTimeMinutes } from '../services/rateLimitHandler';

export default function Contact({ siteSettings }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general'
  });
  
  const [status, setStatus] = useState({
    submitted: false,
    submitting: false,
    info: { error: false, msg: null }
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // State for rate limit countdown
  const [rateLimitCountdown, setRateLimitCountdown] = useState(null);
  
  // Effect for countdown timer
  useEffect(() => {
    if (!rateLimitCountdown) return;
    
    const timer = setInterval(() => {
      setRateLimitCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setStatus(prevStatus => ({
            ...prevStatus,
            info: { error: false, msg: null }
          }));
          return null;
        }
        
        // Update the status message with the new countdown
        setStatus(prevStatus => ({
          ...prevStatus,
          info: { 
            error: true, 
            msg: `Rate limit exceeded. Please wait ${Math.ceil(prev/60)} minute(s) before trying again. (${prev}s remaining)`
          }
        }));
        
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [rateLimitCountdown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(prevStatus => ({ ...prevStatus, submitting: true }));
    
    try {
      await submitContactForm(formData);
      
      setStatus({
        submitted: true,
        submitting: false,
        info: { error: false, msg: 'Message sent successfully! We\'ll get back to you soon.' }
      });
      
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        type: 'general'
      });
      
    } catch (error) {
      console.error('Contact form submission error:', error);
      
      // Check if it's a rate limit error
      if (error.message && error.message.includes('Too many requests')) {
        // Extract wait time if available
        let waitTime = 60; // Default to 60 seconds if we can't determine the actual wait time
        
        // Try to extract a more specific wait time from the error message
        const timeMatch = error.message.match(/try again in (\d+)/i);
        if (timeMatch && timeMatch[1]) {
          waitTime = parseInt(timeMatch[1]) * 60; // Convert minutes to seconds
        }
        
        setRateLimitCountdown(waitTime);
        
        setStatus({
          submitted: false,
          submitting: false,
          info: { 
            error: true, 
            msg: `Rate limit exceeded. Please wait ${Math.ceil(waitTime/60)} minute(s) before trying again. (${waitTime}s remaining)`
          }
        });
      } else {
        // Handle other errors
        setStatus({
          submitted: false,
          submitting: false,
          info: { error: true, msg: 'An error occurred. Please try again later.' }
        });
      }
    }
  };

  return (
    <Layout title="Contact | Evan James">
      {/* Contact Page Header */}
      <div className="relative w-full h-[600px] overflow-hidden">
        <Image 
          src={siteSettings?.contactHeaderImage?.data?.attributes?.url 
            ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337'}${siteSettings.contactHeaderImage.data.attributes.url}`
            : "/images/hero_banners/press_kit_header_1.png"}
          alt="Contact Evan James"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/60 to-navy/40 flex items-center">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-6xl md:text-7xl font-mulish text-white mb-4 lowercase">get in touch</h1>
              <p className="text-xl md:text-2xl text-ice-blue/90 max-w-2xl">
                Have a question, booking inquiry, or collaboration idea? Let's connect.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div className="bg-navy/80 backdrop-blur-md p-6 rounded-lg border border-electric-blue/30">
              <div className="rich-text space-y-6">
                <p className="text-xl">
                  Have a question, booking inquiry, or just want to say hello? Use the form or reach out directly.
                </p>
                
                <div className="mt-8 space-y-6">
                  <div>
                    <h3 className="text-xl font-mulish mb-2 lowercase">management</h3>
                    <p>Emily Parker</p>
                    <a href="mailto:management@evanjamesmusic.com" className="text-electric-blue hover:text-ice-blue transition-colors">
                      management@evanjamesmusic.com
                    </a>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-mulish mb-2 lowercase">booking</h3>
                    <p>Nathan Reynolds</p>
                    <a href="mailto:booking@evanjamesmusic.com" className="text-electric-blue hover:text-ice-blue transition-colors">
                      booking@evanjamesmusic.com
                    </a>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-mulish mb-2 lowercase">press</h3>
                    <p>Lily Thompson</p>
                    <a href="mailto:press@evanjamesmusic.com" className="text-electric-blue hover:text-ice-blue transition-colors">
                      press@evanjamesmusic.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-navy/80 backdrop-blur-md p-6 rounded-lg border border-electric-blue/30">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block mb-2">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    minLength="2"
                    maxLength="100"
                    pattern="^[a-zA-Z\s\-']+$"
                    title="Name should only contain letters, spaces, hyphens, and apostrophes"
                    className="w-full px-4 py-3 bg-navy/50 border border-electric-blue/30 rounded focus:outline-none focus:border-electric-blue"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                    title="Please enter a valid email address"
                    maxLength="100"
                    className="w-full px-4 py-3 bg-navy/50 border border-electric-blue/30 rounded focus:outline-none focus:border-electric-blue"
                  />
                </div>

                <div>
                  <label htmlFor="type" className="block mb-2">Inquiry Type</label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-navy/50 border border-electric-blue/30 rounded focus:outline-none focus:border-electric-blue"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="booking">Booking Request</option>
                    <option value="press">Press/Media</option>
                    <option value="collaboration">Collaboration</option>
                    <option value="fan-mail">Fan Mail</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block mb-2">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    minLength="2"
                    maxLength="200"
                    className="w-full px-4 py-3 bg-navy/50 border border-electric-blue/30 rounded focus:outline-none focus:border-electric-blue"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block mb-2">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="5"
                    required
                    minLength="10"
                    maxLength="2000"
                    className="w-full px-4 py-3 bg-navy/50 border border-electric-blue/30 rounded focus:outline-none focus:border-electric-blue"
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  disabled={status.submitting || rateLimitCountdown !== null}
                  className="px-6 py-3 bg-electric-blue text-white font-bold rounded-md hover:bg-electric-blue/80 transition-colors disabled:opacity-70"
                >
                  {status.submitting ? 'Sending...' : 
                   rateLimitCountdown ? `Try again in ${Math.ceil(rateLimitCountdown/60)}m ${rateLimitCountdown % 60}s` : 
                   'Send Message'}
                </button>
                
                {status.info.msg && (
                  <div className={`p-4 rounded mt-4 ${status.info.error ? 'bg-red-500/20' : 'bg-green-500/20'}`}>
                    {status.info.msg}
                  </div>
                )}
              </form>
            </div>
          </div>
          
          {/* FAQ Section */}
          <div className="mt-20 bg-navy/80 backdrop-blur-md p-6 rounded-lg border border-electric-blue/30">
            <h2 className="text-3xl font-mulish mb-8 lowercase">frequently asked questions</h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-mulish mb-2 text-electric-blue lowercase">do you offer private performances?</h3>
                <p>Yes, Evan is available for private events and performances depending on his schedule. Please contact the booking email with details about your event.</p>
              </div>
              
              <div>
                <h3 className="text-xl font-mulish mb-2 text-electric-blue lowercase">are you interested in collaborations?</h3>
                <p>Evan is always open to collaboration opportunities with other artists and producers. Please send collaboration inquiries through the contact form above.</p>
              </div>
              
              <div>
                <h3 className="text-xl font-mulish mb-2 text-electric-blue lowercase">how can i get updates about new music and tour dates?</h3>
                <p>Subscribe to the newsletter at the bottom of the page to receive updates about new releases, tour dates, and exclusive content.</p>
              </div>
              
              <div>
                <h3 className="text-xl font-mulish mb-2 text-electric-blue lowercase">do you offer music lessons?</h3>
                <p>Currently, Evan is focused on his recording and touring schedule and is not offering regular music lessons. This may change in the future.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  try {
    // Fetch site settings with contactHeaderImage populated
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337'}/api/site-settings?populate=contactHeaderImage`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch site settings: ${response.statusText}`);
    }
    
    const data = await response.json();
    const siteSettings = data?.data?.attributes || {};
    
    return {
      props: {
        siteSettings,
      },
    };
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return {
      props: {
        siteSettings: {},
      },
    };
  }
}
