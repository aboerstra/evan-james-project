import axios from 'axios';
import { handleRateLimit } from './rateLimitHandler';
import performanceMonitoring from './performanceMonitoring';

// Always use NEXT_PUBLIC_API_URL from your .env files
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';

export { API_URL };

console.log('API Service: API_URL is set to:', API_URL, typeof window === 'undefined' ? '(server-side)' : '(client-side)');

// Configure axios instance for authenticated requests
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Ensures cookies are sent for auth
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is due to a timeout or network error, retry the request
    if ((error.code === 'ECONNABORTED' || !error.response) && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Retry the request with exponential backoff
      const backoffDelay = Math.min(1000 * Math.pow(2, originalRequest._retryCount || 0), 10000);
      await new Promise(resolve => setTimeout(resolve, backoffDelay));
      
      return api(originalRequest);
    }
    
    // Handle specific error cases
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Handle unauthorized
          console.error('Unauthorized access');
          break;
        case 404:
          // Handle not found
          console.error('Resource not found');
          break;
        case 500:
          // Handle server error
          console.error('Server error');
          break;
        default:
          console.error('API error:', error.response.status);
      }
    }
    
    return Promise.reject(error);
  }
);

/**
 * Helper to make GET requests to Strapi API endpoints
 * @param {string} path Path of the API route
 * @param {Object} urlParamsObject URL params object, will be stringified
 * @param {Object} options Options passed to fetch
 * @returns {Object} Response data
 */
export async function fetchAPI(path, urlParamsObject = {}, options = {}) {
  // Merge default and user options
  const mergedOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  };

  // Build request URL
  const queryString = Object.keys(urlParamsObject)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(urlParamsObject[key])}`)
    .join('&');
  const requestUrl = `${API_URL}/api${path}${queryString ? `?${queryString}` : ''}`;

  console.log('fetchAPI: Making request to:', requestUrl);

  const startTime = performance.now();
  let status = 0;

  try {
    // Trigger API call
    const response = await fetch(requestUrl, mergedOptions);
    status = response.status;

    console.log('fetchAPI: Response status:', status);
    // Skip logging headers to avoid potential invalid character issues
    // console.log('fetchAPI: Response headers:', Object.fromEntries(response.headers.entries()));

    // Handle response
    if (!response.ok) {
      console.error('fetchAPI: Response not ok:', status, response.statusText);
      throw new Error(`API request failed: ${status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('fetchAPI: Success, data length:', data?.data?.length || 'N/A');
    
    // Track API request performance
    const duration = performance.now() - startTime;
    performanceMonitoring.trackApiRequest(path, duration, status);
    
    return data;
  } catch (error) {
    console.error('fetchAPI: Error occurred:', error);
    
    // Track failed API request
    const duration = performance.now() - startTime;
    performanceMonitoring.trackApiRequest(path, duration, status || 0);
    
    throw error;
  }
}

// Albums (Music Releases)
export async function getAlbums() {
  return fetchAPI('/albums?populate=cover,tracks,streamLinks');
}

export async function getFeaturedAlbums() {
  return fetchAPI('/albums?populate=cover,tracks,streamLinks&filters[featured][$eq]=true');
}

export async function getAlbum(id) {
  return fetchAPI(`/albums/${id}?populate=cover,tracks,streamLinks`);
}

export async function getFeaturedRelease() {
  const data = await fetchAPI('/albums?populate=cover,tracks,streamLinks&filters[featured][$eq]=true&sort=releaseDate:desc&pagination[limit]=1');
  return data.data?.[0] || null;
}

export async function getReleases() {
  return getAlbums();
}

// Videos
export async function getVideos() {
  return fetchAPI('/videos?populate=thumbnail');
}

export async function getFeaturedVideo() {
  const data = await fetchAPI('/videos?populate=thumbnail&filters[featured][$eq]=true&sort=releaseDate:desc&pagination[limit]=1');
  return data.data?.[0] || null;
}

// Photos
export async function getPhotos() {
  return fetchAPI('/photos?populate=image&sort=createdAt:desc');
}

export async function getPhotosByTag(tag) {
  return fetchAPI(`/photos?populate=image&filters[tags][$contains]=${tag}&sort=createdAt:desc`);
}

export async function getPortfolioPhotos() {
  return getPhotosByTag('portfolio');
}

export async function getFeaturedPhotos() {
  return fetchAPI('/photos?populate=image&filters[featured][$eq]=true&sort=createdAt:desc');
}

// Bio
export async function getBio() {
  return fetchAPI('/bio?populate=headshot,headerImage,galleryImages,socialLinks');
}

// Tour Dates
export async function getTourDates() {
  return fetchAPI('/tour-dates?populate=venueImage,promotionalImage,eventPoster,galleryImages&sort=date:asc');
}

export async function getUpcomingTourDates() {
  const now = new Date().toISOString();
  return fetchAPI(`/tour-dates?populate=venueImage,promotionalImage,eventPoster,galleryImages&filters[date][$gte]=${now}&sort=date:asc`);
}

// Merchandise
export async function getMerchandise() {
  return fetchAPI('/merchandises?populate=images');
}

export async function getFeaturedMerchandise() {
  return fetchAPI('/merchandises?populate=images&filters[featured][$eq]=true');
}

// Press Kit
export async function getPressKit() {
  return fetchAPI('/press-kit?populate=highResPhotos,pressReleasePDF,biographyPDF,logoFiles,musicSamples,videoAssets,additionalAssets,contactInfo');
}

// Press Releases
export async function getPressReleases() {
  return fetchAPI('/press-releases?sort=releaseDate:desc');
}

export async function getFeaturedPressReleases() {
  return fetchAPI('/press-releases?filters[featured][$eq]=true&sort=releaseDate:desc');
}

// Newsletter Subscriptions
export async function subscribeToNewsletter(data) {
  const response = await fetch(`${API_URL}/api/newsletter-subscriptions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: {
        email: data.email,
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        source: data.source || 'website',
        preferences: data.preferences || ['new-releases'],
        isActive: true,
        subscribedAt: new Date().toISOString(),
      },
    }),
  });
  
  // Handle rate limiting
  await handleRateLimit(response, (message, info) => {
    console.warn('Newsletter subscription rate limited:', message);
    console.info('Rate limit info:', info);
  });
  
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  
  return response.json();
}

// Contact Submission
export async function submitContactForm(data) {
  const response = await fetch(`${API_URL}/api/contact-submissions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: {
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
        type: data.type || 'general',
        dateSubmitted: new Date().toISOString(),
      },
    }),
  });
  
  // Handle rate limiting
  await handleRateLimit(response, (message, info) => {
    console.warn('Contact form submission rate limited:', message);
    console.info('Rate limit info:', info);
  });
  
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  
  return response.json();
}

// Site Settings (if needed)
export async function getSiteSettings(populate = '') {
  const populateParam = populate ? `?populate=${populate}` : '';
  return fetchAPI(`/site-settings${populateParam}`);
}

/**
 * Upload a file to Strapi
 * @param {File} file The file to upload
 * @returns {Promise<Object>} The uploaded file data
 */
export async function uploadFile(file) {
  const token = localStorage.getItem('adminToken');
  if (!token) {
    throw new Error('Not authenticated');
  }

  const formData = new FormData();
  formData.append('files', file);
  
  try {
    const response = await fetch(`${API_URL}/api/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Failed to upload file');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

// Helper function to get image URL from Strapi media
export function getStrapiImageUrl(imageData) {
  if (!imageData?.data?.attributes?.url) return null;
  
  const url = imageData.data.attributes.url;
  // If it's a relative URL, prepend the API URL
  if (url.startsWith('/')) {
    return `${API_URL}${url}`;
  }
  return url;
}

// Helper function to format Strapi data for easier use
export function formatStrapiData(data) {
  if (!data) return null;
  
  if (Array.isArray(data)) {
    return data.map(item => ({
      id: item.id,
      ...item.attributes,
    }));
  }
  
  return {
    id: data.id,
    ...data.attributes,
  };
}
