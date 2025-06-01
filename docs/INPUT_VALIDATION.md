# Input Validation Guide

This document outlines the input validation rules implemented in the Evan James website project, covering both frontend and backend validation.

## Why Input Validation is Important

Input validation is a critical security measure that helps:

- Prevent injection attacks (SQL, XSS, etc.)
- Ensure data integrity
- Improve user experience by providing immediate feedback
- Reduce server load by catching errors early
- Protect against malicious inputs

## Validation Approach

The project implements a multi-layered validation approach:

1. **Frontend HTML5 Validation**: Using built-in attributes like `required`, `minlength`, `maxlength`, and `pattern`
2. **Frontend JavaScript Validation**: For more complex validation rules
3. **Backend Controller Validation**: Server-side validation in Strapi controllers
4. **Database Constraints**: Schema-level constraints like required fields and unique values

This defense-in-depth strategy ensures that even if one layer is bypassed, others will still protect the application.

## Contact Form Validation

### Frontend Validation

The contact form (`frontend/pages/contact.js`) implements the following validation rules:

| Field | Validation Rules |
|-------|-----------------|
| Name | - Required<br>- Min length: 2 characters<br>- Max length: 100 characters<br>- Pattern: Letters, spaces, hyphens, and apostrophes only |
| Email | - Required<br>- Valid email format<br>- Max length: 100 characters |
| Subject | - Required<br>- Min length: 2 characters<br>- Max length: 200 characters |
| Message | - Required<br>- Min length: 10 characters<br>- Max length: 2000 characters |

### Backend Validation

The contact submission controller (`backend/src/api/contact-submission/controllers/contact-submission.js`) implements the following validation:

```javascript
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
```

Additionally, all inputs are sanitized to prevent XSS attacks:

```javascript
const sanitizedData = {
  name: strapi.sanitize.sanitizeInput(data.name),
  email: strapi.sanitize.sanitizeInput(data.email),
  subject: data.subject ? strapi.sanitize.sanitizeInput(data.subject) : undefined,
  message: strapi.sanitize.sanitizeInput(data.message),
  // ...
};
```

## Newsletter Subscription Validation

### Backend Validation

The newsletter subscription controller (`backend/src/api/newsletter-subscription/controllers/newsletter-subscription.js`) implements the following validation:

```javascript
// Validate required fields
if (!data.email) {
  return ctx.badRequest('Email is required');
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

// Validate name length if provided
if (data.name && data.name.length > 100) {
  return ctx.badRequest('Name should be less than 100 characters');
}

// Validate source if provided
const validSources = ['homepage', 'tour-page', 'merch-page', 'coming-soon', 'footer', 'other'];
if (data.source && !validSources.includes(data.source)) {
  return ctx.badRequest('Invalid source value');
}

// Validate preferences if provided
if (data.preferences && !Array.isArray(data.preferences)) {
  return ctx.badRequest('Preferences should be an array');
}
```

The controller also handles duplicate subscriptions by checking if the email already exists:

```javascript
// Check if email already exists
const existingSubscription = await strapi.db.query('api::newsletter-subscription.newsletter-subscription').findOne({
  where: { email: data.email }
});

if (existingSubscription) {
  // If the subscription exists but is inactive, reactivate it
  if (!existingSubscription.isActive) {
    await strapi.entityService.update('api::newsletter-subscription.newsletter-subscription', existingSubscription.id, {
      data: {
        isActive: true,
        unsubscribedAt: null,
        subscribedAt: new Date().toISOString(),
        preferences: data.preferences || existingSubscription.preferences,
        source: data.source || existingSubscription.source
      }
    });
    return { message: 'Subscription reactivated successfully' };
  }
  // If already active, just return success
  return { message: 'Already subscribed' };
}
```

## Best Practices for Adding New Forms

When adding new forms to the application, follow these best practices:

1. **Implement Frontend Validation**:
   - Use HTML5 validation attributes (`required`, `minlength`, `maxlength`, `pattern`)
   - Add appropriate error messages using the `title` attribute
   - Consider adding JavaScript validation for complex rules

2. **Implement Backend Validation**:
   - Create a custom controller that extends the core controller
   - Validate all inputs before processing
   - Return appropriate error messages
   - Sanitize all inputs to prevent XSS attacks

3. **Document Validation Rules**:
   - Update this document with the new validation rules
   - Include examples of valid and invalid inputs

4. **Test Validation**:
   - Test with valid inputs
   - Test with invalid inputs
   - Test with edge cases
   - Test with malicious inputs

## Common Validation Patterns

### Email Validation

```javascript
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
if (!emailRegex.test(email)) {
  return ctx.badRequest('Please provide a valid email address');
}
```

### Name Validation

```javascript
const nameRegex = /^[a-zA-Z\s\-']+$/;
if (!nameRegex.test(name)) {
  return ctx.badRequest('Name should only contain letters, spaces, hyphens, and apostrophes');
}
```

### URL Validation

```javascript
const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
if (!urlRegex.test(url)) {
  return ctx.badRequest('Please provide a valid URL');
}
```

### Phone Number Validation

```javascript
const phoneRegex = /^\+?[1-9]\d{1,14}$/;
if (!phoneRegex.test(phone)) {
  return ctx.badRequest('Please provide a valid phone number');
}
```

## Security Considerations

### XSS Prevention

All user inputs should be sanitized before being stored in the database or displayed on the page. Strapi provides a built-in sanitization function:

```javascript
const sanitizedData = {
  field: strapi.sanitize.sanitizeInput(data.field)
};
```

### SQL Injection Prevention

Strapi's query builder automatically handles SQL injection prevention, but it's still important to validate inputs to ensure they match expected formats.

### CSRF Protection

Strapi includes built-in CSRF protection for authenticated requests. For additional protection, consider implementing CSRF tokens for public forms.

## Maintenance and Updates

### Regular Review

- Review validation rules quarterly
- Update validation patterns as needed
- Test validation with new browsers and devices

### Adding New Fields

When adding new fields to existing forms:

1. Update the frontend validation
2. Update the backend validation
3. Update this documentation
4. Test the validation

## References

- [OWASP Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)
- [Strapi Documentation on Controllers](https://docs.strapi.io/developer-docs/latest/development/backend-customization/controllers.html)
- [HTML5 Form Validation](https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation)

---

*Last updated: May 31, 2025*
