'use strict';

/**
 * Mautic Integration Service
 * Handles synchronization between Strapi newsletter subscriptions and Mautic contacts
 */

const axios = require('axios');

module.exports = () => ({
  /**
   * Create or update a contact in Mautic
   * @param {Object} subscriptionData - The newsletter subscription data
   * @returns {Promise<Object>} - Mautic API response
   */
  async syncToMautic(subscriptionData) {
    try {
      const mauticConfig = this.getMauticConfig();
      
      if (!mauticConfig.enabled) {
        strapi.log.info('Mautic integration is disabled');
        return { success: false, reason: 'disabled' };
      }

      // Prepare contact data for Mautic
      const contactData = this.prepareContactData(subscriptionData);
      
      // Check if contact already exists in Mautic
      const existingContact = await this.findMauticContact(contactData.email);
      
      let response;
      if (existingContact) {
        // Update existing contact
        response = await this.updateMauticContact(existingContact.id, contactData);
        strapi.log.info(`Updated Mautic contact: ${contactData.email}`);
      } else {
        // Create new contact
        response = await this.createMauticContact(contactData);
        strapi.log.info(`Created new Mautic contact: ${contactData.email}`);
      }

      return {
        success: true,
        mauticContactId: response.contact?.id || existingContact?.id,
        action: existingContact ? 'updated' : 'created'
      };

    } catch (error) {
      strapi.log.error('Mautic sync error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Remove or unsubscribe a contact in Mautic
   * @param {string} email - The email address to unsubscribe
   * @returns {Promise<Object>} - Mautic API response
   */
  async unsubscribeFromMautic(email) {
    try {
      const mauticConfig = this.getMauticConfig();
      
      if (!mauticConfig.enabled) {
        return { success: false, reason: 'disabled' };
      }

      const contact = await this.findMauticContact(email);
      
      if (contact) {
        // Add to DNC (Do Not Contact) list
        await this.addToDNC(contact.id, email);
        strapi.log.info(`Unsubscribed Mautic contact: ${email}`);
        
        return {
          success: true,
          mauticContactId: contact.id,
          action: 'unsubscribed'
        };
      }

      return { success: false, reason: 'contact_not_found' };

    } catch (error) {
      strapi.log.error('Mautic unsubscribe error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Get Mautic configuration from environment variables
   * @returns {Object} - Mautic configuration
   */
  getMauticConfig() {
    return {
      enabled: process.env.MAUTIC_INTEGRATION_ENABLED === 'true',
      baseUrl: process.env.MAUTIC_BASE_URL || 'https://mautic.evanjamesofficial.com',
      username: process.env.MAUTIC_API_USERNAME,
      password: process.env.MAUTIC_API_PASSWORD,
      timeout: parseInt(process.env.MAUTIC_API_TIMEOUT) || 10000
    };
  },

  /**
   * Prepare contact data for Mautic API
   * @param {Object} subscriptionData - Newsletter subscription data
   * @returns {Object} - Formatted contact data for Mautic
   */
  prepareContactData(subscriptionData) {
    const contactData = {
      email: subscriptionData.email,
      firstname: subscriptionData.name || '',
      tags: ['newsletter-subscriber', `source-${subscriptionData.source}`],
      // Custom fields
      newsletter_source: subscriptionData.source,
      newsletter_subscribed_at: subscriptionData.subscribedAt,
      newsletter_preferences: JSON.stringify(subscriptionData.preferences || []),
      newsletter_consent_given: subscriptionData.consentGiven,
      newsletter_consent_timestamp: subscriptionData.consentTimestamp,
      newsletter_ip_address: subscriptionData.ipAddress,
      // Segments - add to newsletter segment
      segments: ['newsletter-subscribers']
    };

    // Add name parsing if full name is provided
    if (subscriptionData.name) {
      const nameParts = subscriptionData.name.trim().split(' ');
      if (nameParts.length > 1) {
        contactData.firstname = nameParts[0];
        contactData.lastname = nameParts.slice(1).join(' ');
      } else {
        contactData.firstname = nameParts[0];
      }
    }

    return contactData;
  },

  /**
   * Find an existing contact in Mautic by email
   * @param {string} email - Email address to search for
   * @returns {Promise<Object|null>} - Mautic contact or null
   */
  async findMauticContact(email) {
    const mauticConfig = this.getMauticConfig();
    const auth = Buffer.from(`${mauticConfig.username}:${mauticConfig.password}`).toString('base64');

    try {
      const response = await axios.get(`${mauticConfig.baseUrl}/api/contacts`, {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        },
        params: {
          search: `email:${email}`,
          limit: 1
        },
        timeout: mauticConfig.timeout
      });

      const contacts = response.data?.contacts || {};
      const contactIds = Object.keys(contacts);
      
      return contactIds.length > 0 ? contacts[contactIds[0]] : null;

    } catch (error) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  /**
   * Create a new contact in Mautic
   * @param {Object} contactData - Contact data
   * @returns {Promise<Object>} - Mautic API response
   */
  async createMauticContact(contactData) {
    const mauticConfig = this.getMauticConfig();
    const auth = Buffer.from(`${mauticConfig.username}:${mauticConfig.password}`).toString('base64');

    const response = await axios.post(`${mauticConfig.baseUrl}/api/contacts/new`, contactData, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      timeout: mauticConfig.timeout
    });

    return response.data;
  },

  /**
   * Update an existing contact in Mautic
   * @param {number} contactId - Mautic contact ID
   * @param {Object} contactData - Updated contact data
   * @returns {Promise<Object>} - Mautic API response
   */
  async updateMauticContact(contactId, contactData) {
    const mauticConfig = this.getMauticConfig();
    const auth = Buffer.from(`${mauticConfig.username}:${mauticConfig.password}`).toString('base64');

    const response = await axios.patch(`${mauticConfig.baseUrl}/api/contacts/${contactId}/edit`, contactData, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      timeout: mauticConfig.timeout
    });

    return response.data;
  },

  /**
   * Add contact to Do Not Contact list in Mautic
   * @param {number} contactId - Mautic contact ID
   * @param {string} email - Email address
   * @returns {Promise<Object>} - Mautic API response
   */
  async addToDNC(contactId, email) {
    const mauticConfig = this.getMauticConfig();
    const auth = Buffer.from(`${mauticConfig.username}:${mauticConfig.password}`).toString('base64');

    const dncData = {
      contact: contactId,
      channel: 'email',
      reason: 3, // Manual unsubscribe
      comments: 'Unsubscribed via Strapi newsletter'
    };

    const response = await axios.post(`${mauticConfig.baseUrl}/api/contacts/${contactId}/dnc/add`, dncData, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      timeout: mauticConfig.timeout
    });

    return response.data;
  },

  /**
   * Test Mautic connection
   * @returns {Promise<Object>} - Connection test result
   */
  async testConnection() {
    try {
      const mauticConfig = this.getMauticConfig();
      
      if (!mauticConfig.enabled) {
        return { success: false, reason: 'Integration disabled' };
      }

      if (!mauticConfig.username || !mauticConfig.password) {
        return { success: false, reason: 'Missing credentials' };
      }

      const auth = Buffer.from(`${mauticConfig.username}:${mauticConfig.password}`).toString('base64');

      const response = await axios.get(`${mauticConfig.baseUrl}/api/contacts`, {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        },
        params: { limit: 1 },
        timeout: mauticConfig.timeout
      });

      return {
        success: true,
        status: response.status,
        message: 'Connection successful'
      };

    } catch (error) {
      return {
        success: false,
        error: error.message,
        status: error.response?.status
      };
    }
  }
});
