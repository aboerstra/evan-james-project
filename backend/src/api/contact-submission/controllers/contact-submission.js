'use strict';

/**
 * contact-submission controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::contact-submission.contact-submission', ({ strapi }) => ({
  // Override the create method to add validation
  async create(ctx) {
    const { data } = ctx.request.body;

    // Validate required fields
    if (!data.name || !data.email || !data.message) {
      return ctx.badRequest('Name, email, and message are required fields');
    }

    // Validate name (letters, spaces, hyphens, and apostrophes only)
    const nameRegex = /^[a-zA-Z\s\-']+$/;
    if (!nameRegex.test(data.name)) {
      return ctx.badRequest('Name should only contain letters, spaces, hyphens, and apostrophes');
    }

    // Validate name length
    if (data.name.length < 2 || data.name.length > 100) {
      return ctx.badRequest('Name should be between 2 and 100 characters');
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(data.email)) {
      return ctx.badRequest('Please provide a valid email address');
    }

    // Validate email length
    if (data.email.length > 100) {
      return ctx.badRequest('Email should be less than 100 characters');
    }

    // Validate subject length if provided
    if (data.subject && (data.subject.length < 2 || data.subject.length > 200)) {
      return ctx.badRequest('Subject should be between 2 and 200 characters');
    }

    // Validate message length
    if (data.message.length < 10 || data.message.length > 2000) {
      return ctx.badRequest('Message should be between 10 and 2000 characters');
    }

    // Sanitize inputs to prevent XSS
    const sanitizedData = {
      name: strapi.sanitize.sanitizeInput(data.name),
      email: strapi.sanitize.sanitizeInput(data.email),
      subject: data.subject ? strapi.sanitize.sanitizeInput(data.subject) : undefined,
      message: strapi.sanitize.sanitizeInput(data.message),
      type: data.type ? strapi.sanitize.sanitizeInput(data.type) : 'general',
      submittedAt: data.submittedAt || new Date().toISOString(),
      isRead: false
    };

    // Create the contact submission with sanitized data
    ctx.request.body.data = sanitizedData;
    
    // Call the default create method with the sanitized data
    const response = await super.create(ctx);
    
    return response;
  }
}));
