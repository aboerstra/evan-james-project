# [ARCHIVED] Integrating Strapi Backend with Next.js Frontend

> **Note**: This document has been archived. Please refer to the new consolidated [Integration Guide](../INTEGRATION_GUIDE.md) for the most up-to-date information.

This guide explains how to connect your Next.js frontend to the Strapi backend API for the Evan James website.

## API Services Setup

The project already includes API service files that handle communication between the frontend and backend:

- `frontend/services/api.js` - Core API functions
- `frontend/services/apiSetup.js` - Ready-to-use API functions for components

## Authentication

### Setting Up Auth in Strapi

1. **Create API Token in Strapi Admin**:
   - Go to `Settings` → `API Tokens`
   - Click `Create new API Token`
   - Set a name (e.g., "Frontend API Token")
   - Set token type to `Full access`
   - Copy the generated token

2. **Store the Token in Frontend Environment**:
   - Add the token to your frontend `.env.local` file:
     ```
     STRAPI_API_TOKEN=your_token_here
     ```

3. **Use the Token in API Requests**:
   - Update API service to include the token in requests:
     ```javascript
     const mergedOptions = {
       headers: {
         'Content-Type': 'application/json',
         Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
       },
       ...options,
     };
     ```

## Content Type Integration

### Releases

**Strapi Content Type**: `release`

**Frontend Component Example**:
```jsx
import { useEffect, useState } from 'react';
import { getReleases } from '../services/apiSetup';

export default function ReleasesSection() {
  const [releases, setReleases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReleases() {
      try {
        const response = await getReleases();
        setReleases(response.data);
      } catch (error) {
        console.error('Error fetching releases:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchReleases();
  }, []);

  if (loading) return <div>Loading releases...</div>;

  return (
    <div className="releases-grid">
      {releases.map((release) => (
        <div key={release.id} className="release-card">
          <img 
            src={`${process.env.NEXT_PUBLIC_API_URL}${release.attributes.coverImage.data.attributes.url}`} 
            alt={release.attributes.title} 
          />
          <h3>{release.attributes.title}</h3>
          <p>{new Date(release.attributes.releaseDate).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
}
```

### Videos

**Strapi Content Type**: `video`

**Frontend Component Example**:
```jsx
import { useEffect, useState } from 'react';
import { getVideos } from '../services/apiSetup';

export default function VideosSection() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVideos() {
      try {
        const response = await getVideos();
        setVideos(response.data);
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchVideos();
  }, []);

  if (loading) return <div>Loading videos...</div>;

  return (
    <div className="videos-grid">
      {videos.map((video) => (
        <div key={video.id} className="video-card">
          <div className="video-thumbnail">
            <img 
              src={`${process.env.NEXT_PUBLIC_API_URL}${video.attributes.thumbnailImage.data.attributes.url}`} 
              alt={video.attributes.title} 
            />
          </div>
          <h3>{video.attributes.title}</h3>
          <a href={video.attributes.videoURL} target="_blank" rel="noopener noreferrer">
            Watch Video
          </a>
        </div>
      ))}
    </div>
  );
}
```

### Tour Dates

**Strapi Content Type**: `tour-date`

**Frontend Component Example**:
```jsx
import { useEffect, useState } from 'react';
import { getUpcomingTourDates } from '../services/apiSetup';

export default function TourDatesSection() {
  const [tourDates, setTourDates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTourDates() {
      try {
        const response = await getUpcomingTourDates();
        setTourDates(response.data);
      } catch (error) {
        console.error('Error fetching tour dates:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTourDates();
  }, []);

  if (loading) return <div>Loading tour dates...</div>;

  return (
    <div className="tour-dates">
      {tourDates.length === 0 ? (
        <p>No upcoming shows at this time. Check back soon!</p>
      ) : (
        tourDates.map((date) => (
          <div key={date.id} className="tour-date-card">
            <div className="date">
              {new Date(date.attributes.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </div>
            <div className="venue-info">
              <h3>{date.attributes.venueName}</h3>
              <p>{date.attributes.city}, {date.attributes.state}</p>
            </div>
            {date.attributes.ticketURL && !date.attributes.soldOut ? (
              <a 
                href={date.attributes.ticketURL} 
                className="ticket-button"
                target="_blank" 
                rel="noopener noreferrer"
              >
                Tickets
              </a>
            ) : (
              <span className="sold-out">Sold Out</span>
            )}
          </div>
        ))
      )}
    </div>
  );
}
```

## Image Handling

Strapi provides media endpoints for images. When accessing images, use the following pattern:

```javascript
// For a single image:
const imageUrl = `${process.env.NEXT_PUBLIC_API_URL}${data.attributes.image.data.attributes.url}`;

// For multiple images:
const imageUrls = data.attributes.images.data.map(
  img => `${process.env.NEXT_PUBLIC_API_URL}${img.attributes.url}`
);
```

Optimize images using Next.js Image component:

```jsx
import Image from 'next/image';

// In your component:
<Image 
  src={`${process.env.NEXT_PUBLIC_API_URL}${image.attributes.url}`}
  width={image.attributes.width}
  height={image.attributes.height}
  alt="Image description"
/>
```

## Contact Form Submission

To handle contact form submissions to Strapi:

```jsx
import { submitContactForm } from '../services/apiSetup';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState({ loading: false, success: false, error: null });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: null });

    try {
      await submitContactForm(formData);
      setStatus({ loading: false, success: true, error: null });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setStatus({ loading: false, success: false, error: 'Failed to submit the form.' });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      
      {/* Other form fields */}
      
      <button type="submit" disabled={status.loading}>
        {status.loading ? 'Sending...' : 'Send Message'}
      </button>
      
      {status.success && <p className="success-message">Message sent successfully!</p>}
      {status.error && <p className="error-message">{status.error}</p>}
    </form>
  );
}
```

## Handling API Errors

Create a uniform error handling approach:

```javascript
// In your API service
export async function fetchFromAPI(endpoint, options = {}) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/${endpoint}`, options);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}

// In your component
const [error, setError] = useState(null);

try {
  const data = await fetchFromAPI('releases');
  // Process data
} catch (error) {
  setError(error.message || 'An unexpected error occurred');
}

// Display error to user if needed
{error && <div className="error-alert">{error}</div>}
```

## SSR vs. Client-side Fetching

For better SEO and performance, use getServerSideProps or getStaticProps:

```javascript
// pages/releases.js
import { getReleases } from '../services/apiSetup';

export default function ReleasesPage({ releases, error }) {
  if (error) return <div>Error loading releases: {error}</div>;
  
  return (
    <div className="releases-container">
      <h1>Music Releases</h1>
      <div className="releases-grid">
        {releases.map((release) => (
          <ReleaseCard key={release.id} release={release} />
        ))}
      </div>
    </div>
  );
}

export async function getStaticProps() {
  try {
    const response = await getReleases();
    
    return {
      props: {
        releases: response.data || [],
      },
      // Revalidate every hour
      revalidate: 3600,
    };
  } catch (error) {
    console.error('Error fetching releases:', error);
    return {
      props: {
        releases: [],
        error: 'Failed to load releases',
      },
    };
  }
}
```
