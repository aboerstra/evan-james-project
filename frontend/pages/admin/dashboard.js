import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getAlbums, getTourDates, getVideos, fetchAPI } from '../../services/api';
import { useRouter } from 'next/router';

// Dashboard Home
export default function Dashboard({ serverStats, serverActivity }) {
  const [stats, setStats] = useState(serverStats || {
    releases: 0,
    tourDates: 0,
    videos: 0,
    subscribers: 0,
    contactSubmissions: 0,
    merchandise: 0
  });
  
  const [loading, setLoading] = useState(false);
  const [recentActivity, setRecentActivity] = useState(serverActivity || []);
  const router = useRouter();
  const TIMEOUT_MINUTES = 30; // 30 minutes of inactivity

  // If we have server data, use it and don't make client-side calls
  useEffect(() => {
    if (serverStats) {
      console.log('Dashboard: Using server-side data:', serverStats);
      setStats(serverStats);
      setRecentActivity(serverActivity || []);
      setLoading(false);
      return;
    }

    // Fallback to client-side data fetching if no server data
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        console.log('Dashboard: Starting to load data...');
        console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
        
        // Fetch all data in parallel
        const [
          albumsData,
          tourDatesData,
          videosData,
          subscribersData,
          contactData,
          merchData
        ] = await Promise.all([
          getAlbums().then(data => {
            console.log('Albums data:', data);
            return data;
          }),
          getTourDates().then(data => {
            console.log('Tour dates data:', data);
            return data;
          }),
          getVideos().then(data => {
            console.log('Videos data:', data);
            return data;
          }),
          fetchAPI('/newsletter-subscriptions').then(data => {
            console.log('Newsletter subscriptions data:', data);
            return data;
          }),
          fetchAPI('/contact-submissions?sort=dateSubmitted:desc&pagination[limit]=5').then(data => {
            console.log('Contact submissions data:', data);
            return data;
          }),
          fetchAPI('/merchandises').then(data => {
            console.log('Merchandise data:', data);
            return data;
          })
        ]);

        const newStats = {
          releases: albumsData?.data?.length || 0,
          tourDates: tourDatesData?.data?.length || 0,
          videos: videosData?.data?.length || 0,
          subscribers: subscribersData?.data?.length || 0,
          contactSubmissions: contactData?.data?.length || 0,
          merchandise: merchData?.data?.length || 0
        };
        
        console.log('Dashboard stats:', newStats);
        setStats(newStats);

        // Format recent activity from contact submissions
        if (contactData?.data) {
          const activity = contactData.data.slice(0, 5).map(submission => ({
            id: submission.id,
            type: 'contact',
            message: `New ${submission.attributes.type} inquiry from ${submission.attributes.name}`,
            time: new Date(submission.attributes.dateSubmitted).toLocaleDateString(),
            subject: submission.attributes.subject
          }));
          setRecentActivity(activity);
        }
        
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [serverStats, serverActivity]);
  
  useEffect(() => {
    let timeoutId;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        // Call logout endpoint to clear the cookie
        fetch('/api/auth/logout', { credentials: 'include' })
          .then(() => router.push('/admin/login'));
      }, TIMEOUT_MINUTES * 60 * 1000);
    };

    // Reset timer on user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, resetTimer);
    });

    resetTimer(); // Start timer

    return () => {
      clearTimeout(timeoutId);
      events.forEach(event => {
        document.removeEventListener(event, resetTimer);
      });
    };
  }, [router]);
  
  return (
    <AdminLayout title="Dashboard">
      <div className="mb-6">
        <h1 className="text-3xl font-mulish lowercase text-ice-blue mb-2">dashboard</h1>
        <p className="text-white/70">welcome to your site administration</p>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-navy/80 backdrop-blur-md p-6 rounded-lg border border-electric-blue/30">
          <h3 className="text-sm uppercase tracking-wider text-white/70 mb-1">Music Releases</h3>
          <div className="text-3xl font-mulish text-ice-blue">
            {loading ? '...' : stats.releases}
          </div>
        </div>
        
        <div className="bg-navy/80 backdrop-blur-md p-6 rounded-lg border border-electric-blue/30">
          <h3 className="text-sm uppercase tracking-wider text-white/70 mb-1">Tour Dates</h3>
          <div className="text-3xl font-mulish text-ice-blue">
            {loading ? '...' : stats.tourDates}
          </div>
        </div>
        
        <div className="bg-navy/80 backdrop-blur-md p-6 rounded-lg border border-electric-blue/30">
          <h3 className="text-sm uppercase tracking-wider text-white/70 mb-1">Videos</h3>
          <div className="text-3xl font-mulish text-ice-blue">
            {loading ? '...' : stats.videos}
          </div>
        </div>
        
        <div className="bg-navy/80 backdrop-blur-md p-6 rounded-lg border border-electric-blue/30">
          <h3 className="text-sm uppercase tracking-wider text-white/70 mb-1">Email Subscribers</h3>
          <div className="text-3xl font-mulish text-ice-blue">
            {loading ? '...' : stats.subscribers}
          </div>
        </div>

        <div className="bg-navy/80 backdrop-blur-md p-6 rounded-lg border border-electric-blue/30">
          <h3 className="text-sm uppercase tracking-wider text-white/70 mb-1">Contact Messages</h3>
          <div className="text-3xl font-mulish text-ice-blue">
            {loading ? '...' : stats.contactSubmissions}
          </div>
        </div>

        <div className="bg-navy/80 backdrop-blur-md p-6 rounded-lg border border-electric-blue/30">
          <h3 className="text-sm uppercase tracking-wider text-white/70 mb-1">Merchandise Items</h3>
          <div className="text-3xl font-mulish text-ice-blue">
            {loading ? '...' : stats.merchandise}
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="bg-navy/80 backdrop-blur-md p-6 rounded-lg border border-electric-blue/30 mb-8">
        <h2 className="text-xl font-mulish lowercase text-ice-blue mb-4">quick actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a 
            href="http://localhost:1337/admin/content-manager/collectionType/api::album.album?page=1&pageSize=10&sort=title:ASC" 
            target="_blank"
            rel="noopener noreferrer"
            className="bg-electric-blue hover:bg-electric-blue/80 text-white px-4 py-3 rounded-md text-center transition-colors"
          >
            manage releases
          </a>
          <a 
            href="http://localhost:1337/admin/content-manager/collectionType/api::tour-date.tour-date?page=1&pageSize=10&sort=date:ASC" 
            target="_blank"
            rel="noopener noreferrer"
            className="bg-electric-blue hover:bg-electric-blue/80 text-white px-4 py-3 rounded-md text-center transition-colors"
          >
            manage tour dates
          </a>
          <a 
            href="http://localhost:1337/admin/content-manager/collectionType/api::photo.photo?page=1&pageSize=10&sort=title:ASC" 
            target="_blank"
            rel="noopener noreferrer"
            className="bg-electric-blue hover:bg-electric-blue/80 text-white px-4 py-3 rounded-md text-center transition-colors"
          >
            manage photos
          </a>
        </div>
        
        <div className="mt-4 pt-4 border-t border-electric-blue/20">
          <a 
            href="http://localhost:1337/admin" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-sapphire hover:bg-sapphire/80 text-white px-6 py-3 rounded-md transition-colors"
          >
            open strapi admin panel
          </a>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-navy/80 backdrop-blur-md p-6 rounded-lg border border-electric-blue/30">
        <h2 className="text-xl font-mulish lowercase text-ice-blue mb-4">recent contact submissions</h2>
        <div className="divide-y divide-electric-blue/10">
          {loading ? (
            <div className="py-3">
              <div className="animate-pulse">
                <div className="h-4 bg-white/20 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-white/20 rounded w-1/2"></div>
              </div>
            </div>
          ) : recentActivity.length > 0 ? (
            recentActivity.map(activity => (
              <div key={activity.id} className="py-3">
                <p className="text-white">{activity.message}</p>
                <p className="text-sm text-ice-blue/70 mt-1">
                  Subject: {activity.subject} • {activity.time}
                </p>
              </div>
            ))
          ) : (
            <div className="py-3">
              <p className="text-white/70">No recent contact submissions</p>
            </div>
          )}
        </div>
        
        {recentActivity.length > 0 && (
          <div className="mt-4 pt-4 border-t border-electric-blue/20">
            <a 
              href="http://localhost:1337/admin/content-manager/collectionType/api::contact-submission.contact-submission?page=1&pageSize=10&sort=dateSubmitted:DESC" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-electric-blue hover:text-ice-blue transition-colors"
            >
              view all contact submissions →
            </a>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

// Fetch data on the server side
export async function getServerSideProps() {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';
    
    console.log('Dashboard SSR: Fetching data from:', API_URL);
    
    // Fetch all data in parallel on the server
    const [
      albumsResponse,
      tourDatesResponse,
      videosResponse,
      subscribersResponse,
      contactResponse,
      merchResponse
    ] = await Promise.all([
      fetch(`${API_URL}/api/albums`).catch(() => ({ ok: false })),
      fetch(`${API_URL}/api/tour-dates`).catch(() => ({ ok: false })),
      fetch(`${API_URL}/api/videos`).catch(() => ({ ok: false })),
      fetch(`${API_URL}/api/newsletter-subscriptions`).catch(() => ({ ok: false })),
      fetch(`${API_URL}/api/contact-submissions?sort=dateSubmitted:desc&pagination[limit]=5`).catch(() => ({ ok: false })),
      fetch(`${API_URL}/api/merchandises`).catch(() => ({ ok: false }))
    ]);

    // Parse responses
    const albumsData = albumsResponse.ok ? await albumsResponse.json() : { data: [] };
    const tourDatesData = tourDatesResponse.ok ? await tourDatesResponse.json() : { data: [] };
    const videosData = videosResponse.ok ? await videosResponse.json() : { data: [] };
    const subscribersData = subscribersResponse.ok ? await subscribersResponse.json() : { data: [] };
    const contactData = contactResponse.ok ? await contactResponse.json() : { data: [] };
    const merchData = merchResponse.ok ? await merchResponse.json() : { data: [] };

    const serverStats = {
      releases: albumsData?.data?.length || 0,
      tourDates: tourDatesData?.data?.length || 0,
      videos: videosData?.data?.length || 0,
      subscribers: subscribersData?.data?.length || 0,
      contactSubmissions: contactData?.data?.length || 0,
      merchandise: merchData?.data?.length || 0
    };

    // Format recent activity from contact submissions
    const serverActivity = contactData?.data ? contactData.data.slice(0, 5).map(submission => ({
      id: submission.id,
      type: 'contact',
      message: `New ${submission.attributes.type} inquiry from ${submission.attributes.name}`,
      time: new Date(submission.attributes.dateSubmitted).toLocaleDateString(),
      subject: submission.attributes.subject
    })) : [];

    console.log('Dashboard SSR: Stats calculated:', serverStats);

    return {
      props: {
        serverStats,
        serverActivity
      }
    };
  } catch (error) {
    console.error('Dashboard SSR: Error fetching data:', error);
    
    // Return default data if there's an error
    return {
      props: {
        serverStats: {
          releases: 0,
          tourDates: 0,
          videos: 0,
          subscribers: 0,
          contactSubmissions: 0,
          merchandise: 0
        },
        serverActivity: []
      }
    };
  }
}
