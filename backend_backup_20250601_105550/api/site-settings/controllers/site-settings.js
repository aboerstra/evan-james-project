'use strict';

/**
 * Site settings controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::site-settings.site-settings', ({ strapi }) => ({
  // Get the site status
  async getStatus(ctx) {
    try {
      const entity = await strapi.db.query('api::site-settings.site-settings').findOne({
        select: ['siteStatus', 'scheduledGoLiveDate'],
      });

      // Check if there's a scheduled go-live date that has passed
      if (entity && entity.scheduledGoLiveDate && entity.siteStatus !== 'live') {
        const scheduledDate = new Date(entity.scheduledGoLiveDate);
        const currentDate = new Date();
        
        // If scheduled date has passed, update the site to live mode
        if (scheduledDate <= currentDate) {
          await strapi.db.query('api::site-settings.site-settings').update({
            where: { id: entity.id },
            data: {
              siteStatus: 'live',
              scheduledGoLiveDate: null
            }
          });
          
          return { status: 'live' };
        }
      }
      
      return {
        status: entity?.siteStatus || 'live',
        scheduledGoLiveDate: entity?.scheduledGoLiveDate || null
      };
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  // Update the site status
  async updateStatus(ctx) {
    try {
      const { status, scheduledGoLiveDate } = ctx.request.body;
      
      if (!status || !['live', 'coming-soon', 'maintenance'].includes(status)) {
        return ctx.badRequest('Invalid status value. Must be one of: live, coming-soon, maintenance');
      }

      // Get existing settings
      const existingSettings = await strapi.db.query('api::site-settings.site-settings').findOne();
      
      let entity;
      
      // Create or update the settings
      if (existingSettings) {
        entity = await strapi.db.query('api::site-settings.site-settings').update({
          where: { id: existingSettings.id },
          data: {
            siteStatus: status,
            scheduledGoLiveDate: scheduledGoLiveDate || null
          }
        });
      } else {
        entity = await strapi.db.query('api::site-settings.site-settings').create({
          data: {
            siteStatus: status,
            scheduledGoLiveDate: scheduledGoLiveDate || null
          }
        });
      }
      
      return {
        status: entity.siteStatus,
        scheduledGoLiveDate: entity.scheduledGoLiveDate
      };
    } catch (err) {
      ctx.throw(500, err);
    }
  }
}));
