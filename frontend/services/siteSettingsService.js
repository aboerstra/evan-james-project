import { fetchAPI } from './api';

/**
 * Get all site settings including coming soon and maintenance page content
 */
export async function getSiteSettings() {
  try {
    const data = await fetchAPI('/site-settings', {
      populate: 'logo,comingSoonLogo,comingSoonBackgroundImage,comingSoonBackgroundPattern,heroBackgroundImage,aboutBackgroundImage'
    });
    return data;
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return null;
  }
}

/**
 * Get just the site status (live, coming-soon, maintenance)
 */
export async function getSiteStatus() {
  try {
    const response = await fetchAPI('/site-settings');
    return response?.data?.attributes?.siteStatus || 'live'; // Default to live if not set
  } catch (error) {
    console.error('Error fetching site status:', error);
    return 'live'; // Default to live on error
  }
}

/**
 * Update the site status
 */
export async function updateSiteStatus(status, scheduledGoLiveDate = null) {
  try {
    const token = localStorage.getItem('adminToken');
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    const updateData = { siteStatus: status };
    if (scheduledGoLiveDate) {
      updateData.scheduledGoLiveDate = scheduledGoLiveDate;
    }
    
    const response = await fetchAPI('/site-settings', {}, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ data: updateData }),
    });
    return response;
  } catch (error) {
    console.error('Error updating site status:', error);
    throw error;
  }
}

/**
 * Update the full site settings
 */
export async function updateSiteSettings(id, data) {
  try {
    const token = localStorage.getItem('adminToken');
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    const response = await fetchAPI('/site-settings', {}, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ data }),
    });
    return response;
  } catch (error) {
    console.error('Error updating site settings:', error);
    throw error;
  }
} 