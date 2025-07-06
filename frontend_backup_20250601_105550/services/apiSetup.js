// API integration setup for the frontend components
import { 
  getReleases, 
  getFeaturedReleases, 
  getVideos, 
  getFeaturedVideo,
  getAlbums,
  getPhotos,
  getBio,
  getTourDates,
  getUpcomingTourDates,
  getSocialLinks,
  getMerchandise,
  getFeaturedMerchandise,
  getPressKit,
  getPressReleases,
  submitContactForm
} from './api';

// Guide for frontend components using the Strapi API

/**
 * Example usage in a page or component:
 * 
 * import { useEffect, useState } from 'react';
 * import { getReleases } from '../services/apiSetup';
 * 
 * export default function ReleasesPage() {
 *   const [releases, setReleases] = useState([]);
 *   const [loading, setLoading] = useState(true);
 *   const [error, setError] = useState(null);
 * 
 *   useEffect(() => {
 *     const fetchData = async () => {
 *       try {
 *         setLoading(true);
 *         const data = await getReleases();
 *         setReleases(data.data || []);
 *       } catch (err) {
 *         console.error('Error fetching releases:', err);
 *         setError('Failed to load releases');
 *       } finally {
 *         setLoading(false);
 *       }
 *     };
 * 
 *     fetchData();
 *   }, []);
 * 
 *   if (loading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error}</div>;
 * 
 *   return (
 *     <div>
 *       {releases.map(release => (
 *         <div key={release.id}>
 *           <h2>{release.attributes.title}</h2>
 *           {release.attributes.coverImage?.data && (
 *             <img 
 *               src={`${process.env.NEXT_PUBLIC_API_URL}${release.attributes.coverImage.data.attributes.url}`} 
 *               alt={release.attributes.title}
 *             />
 *           )}
 *           <p>Release Date: {new Date(release.attributes.releaseDate).toLocaleDateString()}</p>
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 */

// Data structure examples:

/**
 * Releases data structure:
 * {
 *   data: [
 *     {
 *       id: 1,
 *       attributes: {
 *         title: "Tainted Blue",
 *         releaseDate: "2023-10-15",
 *         type: "Single",
 *         description: "The latest single...",
 *         featured: true,
 *         coverImage: {
 *           data: {
 *             attributes: {
 *               url: "/uploads/tainted_blue_cover_1234.jpg",
 *               width: 1000,
 *               height: 1000
 *             }
 *           }
 *         },
 *         streamLinks: [
 *           {
 *             id: 1,
 *             platform: "Spotify",
 *             url: "https://open.spotify.com/..."
 *           }
 *         ],
 *         tracks: [
 *           {
 *             id: 1,
 *             title: "Tainted Blue",
 *             duration: "3:45",
 *             trackNumber: 1
 *           }
 *         ]
 *       }
 *     }
 *   ],
 *   meta: {
 *     pagination: {
 *       page: 1,
 *       pageSize: 25,
 *       pageCount: 1,
 *       total: 1
 *     }
 *   }
 * }
 */

export {
  getReleases,
  getFeaturedReleases,
  getVideos,
  getFeaturedVideo,
  getAlbums,
  getPhotos,
  getBio,
  getTourDates,
  getUpcomingTourDates,
  getSocialLinks,
  getMerchandise,
  getFeaturedMerchandise,
  getPressKit,
  getPressReleases,
  submitContactForm
}; 