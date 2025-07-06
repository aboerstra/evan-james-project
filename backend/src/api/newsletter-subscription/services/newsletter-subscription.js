'use strict';

/**
 * newsletter-subscription service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::newsletter-subscription.newsletter-subscription', ({ strapi }) => ({
  /**
   * Override the create method to add Mautic sync
   */
  async create(params) {
    // Call the default create method
    const result = await super.create(params);
    
    // Sync to Mautic after successful creation (only if email is verified or verification is not required)
    if (result && (result.isActive || result.emailVerified)) {
      try {
        const mauticIntegration = strapi.service('api::newsletter-subscription.mautic-integration');
        const syncResult = await mauticIntegration.syncToMautic(result);
        
        if (syncResult.success) {
          // Update the subscription with Mautic contact ID
          await strapi.entityService.update('api::newsletter-subscription.newsletter-subscription', result.id, {
            data: {
              mauticContactId: syncResult.mauticContactId,
              mauticSyncedAt: new Date().toISOString(),
              mauticSyncStatus: 'synced'
            }
          });
          
          strapi.log.info(`Newsletter subscription synced to Mautic: ${result.email}`);
        } else {
          strapi.log.warn(`Failed to sync to Mautic: ${result.email}`, syncResult);
        }
      } catch (error) {
        strapi.log.error('Error syncing to Mautic:', error);
      }
    }
    
    return result;
  },

  /**
   * Override the update method to handle Mautic sync
   */
  async update(entityId, params) {
    const oldEntity = await strapi.entityService.findOne('api::newsletter-subscription.newsletter-subscription', entityId);
    const result = await super.update(entityId, params);
    
    if (result) {
      try {
        const mauticIntegration = strapi.service('api::newsletter-subscription.mautic-integration');
        
        // If subscription was activated (email verified)
        if (!oldEntity.isActive && result.isActive) {
          const syncResult = await mauticIntegration.syncToMautic(result);
          
          if (syncResult.success) {
            await strapi.entityService.update('api::newsletter-subscription.newsletter-subscription', result.id, {
              data: {
                mauticContactId: syncResult.mauticContactId,
                mauticSyncedAt: new Date().toISOString(),
                mauticSyncStatus: 'synced'
              }
            });
            
            strapi.log.info(`Newsletter subscription activated and synced to Mautic: ${result.email}`);
          }
        }
        
        // If subscription was deactivated (unsubscribed)
        if (oldEntity.isActive && !result.isActive) {
          const unsubscribeResult = await mauticIntegration.unsubscribeFromMautic(result.email);
          
          if (unsubscribeResult.success) {
            await strapi.entityService.update('api::newsletter-subscription.newsletter-subscription', result.id, {
              data: {
                mauticSyncedAt: new Date().toISOString(),
                mauticSyncStatus: 'unsubscribed'
              }
            });
            
            strapi.log.info(`Newsletter subscription unsubscribed from Mautic: ${result.email}`);
          }
        }
        
        // If other data was updated and contact is active
        if (result.isActive && oldEntity.isActive) {
          const syncResult = await mauticIntegration.syncToMautic(result);
          
          if (syncResult.success) {
            await strapi.entityService.update('api::newsletter-subscription.newsletter-subscription', result.id, {
              data: {
                mauticSyncedAt: new Date().toISOString(),
                mauticSyncStatus: 'synced'
              }
            });
            
            strapi.log.info(`Newsletter subscription updated in Mautic: ${result.email}`);
          }
        }
        
      } catch (error) {
        strapi.log.error('Error syncing update to Mautic:', error);
      }
    }
    
    return result;
  },

  /**
   * Manually sync a subscription to Mautic
   */
  async syncToMautic(entityId) {
    const subscription = await strapi.entityService.findOne('api::newsletter-subscription.newsletter-subscription', entityId);
    
    if (!subscription) {
      throw new Error('Subscription not found');
    }
    
    const mauticIntegration = strapi.service('api::newsletter-subscription.mautic-integration');
    
    if (subscription.isActive) {
      const syncResult = await mauticIntegration.syncToMautic(subscription);
      
      if (syncResult.success) {
        await strapi.entityService.update('api::newsletter-subscription.newsletter-subscription', subscription.id, {
          data: {
            mauticContactId: syncResult.mauticContactId,
            mauticSyncedAt: new Date().toISOString(),
            mauticSyncStatus: 'synced'
          }
        });
      }
      
      return syncResult;
    } else {
      const unsubscribeResult = await mauticIntegration.unsubscribeFromMautic(subscription.email);
      
      if (unsubscribeResult.success) {
        await strapi.entityService.update('api::newsletter-subscription.newsletter-subscription', subscription.id, {
          data: {
            mauticSyncedAt: new Date().toISOString(),
            mauticSyncStatus: 'unsubscribed'
          }
        });
      }
      
      return unsubscribeResult;
    }
  },

  /**
   * Bulk sync all active subscriptions to Mautic
   */
  async bulkSyncToMautic() {
    const subscriptions = await strapi.entityService.findMany('api::newsletter-subscription.newsletter-subscription', {
      filters: {
        isActive: true,
        $or: [
          { mauticSyncStatus: { $null: true } },
          { mauticSyncStatus: { $ne: 'synced' } }
        ]
      },
      limit: 100 // Process in batches
    });

    const results = {
      total: subscriptions.length,
      synced: 0,
      failed: 0,
      errors: []
    };

    const mauticIntegration = strapi.service('api::newsletter-subscription.mautic-integration');

    for (const subscription of subscriptions) {
      try {
        const syncResult = await mauticIntegration.syncToMautic(subscription);
        
        if (syncResult.success) {
          await strapi.entityService.update('api::newsletter-subscription.newsletter-subscription', subscription.id, {
            data: {
              mauticContactId: syncResult.mauticContactId,
              mauticSyncedAt: new Date().toISOString(),
              mauticSyncStatus: 'synced'
            }
          });
          
          results.synced++;
        } else {
          results.failed++;
          results.errors.push({
            email: subscription.email,
            error: syncResult.error || syncResult.reason
          });
        }
        
        // Add delay to avoid overwhelming Mautic API
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        results.failed++;
        results.errors.push({
          email: subscription.email,
          error: error.message
        });
      }
    }

    return results;
  }
}));
