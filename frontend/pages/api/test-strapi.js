// API route to test Strapi connection
export default async function handler(req, res) {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';
    
    console.log('Testing Strapi connection to:', API_URL);
    
    // Test multiple endpoints
    const tests = {};
    
    // Test albums
    try {
      const albumsResponse = await fetch(`${API_URL}/api/albums`);
      const albumsData = await albumsResponse.json();
      tests.albums = {
        status: albumsResponse.status,
        count: albumsData?.data?.length || 0,
        success: albumsResponse.ok
      };
    } catch (error) {
      tests.albums = { error: error.message, success: false };
    }
    
    // Test tour dates
    try {
      const tourResponse = await fetch(`${API_URL}/api/tour-dates`);
      const tourData = await tourResponse.json();
      tests.tourDates = {
        status: tourResponse.status,
        count: tourData?.data?.length || 0,
        success: tourResponse.ok
      };
    } catch (error) {
      tests.tourDates = { error: error.message, success: false };
    }
    
    // Test videos
    try {
      const videosResponse = await fetch(`${API_URL}/api/videos`);
      const videosData = await videosResponse.json();
      tests.videos = {
        status: videosResponse.status,
        count: videosData?.data?.length || 0,
        success: videosResponse.ok
      };
    } catch (error) {
      tests.videos = { error: error.message, success: false };
    }
    
    // Test newsletter subscriptions
    try {
      const newsletterResponse = await fetch(`${API_URL}/api/newsletter-subscriptions`);
      const newsletterData = await newsletterResponse.json();
      tests.newsletters = {
        status: newsletterResponse.status,
        count: newsletterData?.data?.length || 0,
        success: newsletterResponse.ok
      };
    } catch (error) {
      tests.newsletters = { error: error.message, success: false };
    }
    
    // Test merchandise
    try {
      const merchResponse = await fetch(`${API_URL}/api/merchandises`);
      const merchData = await merchResponse.json();
      tests.merchandise = {
        status: merchResponse.status,
        count: merchData?.data?.length || 0,
        success: merchResponse.ok
      };
    } catch (error) {
      tests.merchandise = { error: error.message, success: false };
    }
    
    res.status(200).json({
      message: 'Strapi connection test completed',
      apiUrl: API_URL,
      tests,
      summary: {
        total: Object.keys(tests).length,
        successful: Object.values(tests).filter(t => t.success).length,
        failed: Object.values(tests).filter(t => !t.success).length
      }
    });
    
  } catch (error) {
    console.error('Test error:', error);
    res.status(500).json({
      error: 'Failed to test Strapi connection',
      message: error.message
    });
  }
} 