# Mautic-Strapi Integration Guide

This guide explains how to set up automatic synchronization between Strapi newsletter subscriptions and Mautic contacts.

## Overview

The integration automatically:
- Creates Mautic contacts when users subscribe to the newsletter in Strapi
- Updates Mautic contacts when subscription data changes
- Adds contacts to Do Not Contact list when they unsubscribe
- Tracks sync status and provides admin tools for management

## Features

### Automatic Synchronization
- **New Subscriptions**: When a user verifies their email subscription, they're automatically added to Mautic
- **Updates**: Changes to subscription data (name, preferences) are synced to Mautic
- **Unsubscribes**: When users unsubscribe, they're added to Mautic's Do Not Contact list

### Data Mapping
Strapi newsletter subscription data is mapped to Mautic contact fields:

| Strapi Field | Mautic Field | Description |
|--------------|--------------|-------------|
| email | email | Primary contact email |
| name | firstname/lastname | Parsed from full name |
| source | newsletter_source | Subscription source (homepage, tour-page, etc.) |
| subscribedAt | newsletter_subscribed_at | Subscription timestamp |
| preferences | newsletter_preferences | JSON array of preferences |
| consentGiven | newsletter_consent_given | CASL compliance |
| consentTimestamp | newsletter_consent_timestamp | When consent was given |
| ipAddress | newsletter_ip_address | IP address at subscription |

### Mautic Tags and Segments
Contacts are automatically tagged with:
- `newsletter-subscriber` - All newsletter subscribers
- `source-{source}` - Based on subscription source (e.g., `source-homepage`)

Contacts are added to segments:
- `newsletter-subscribers` - Main newsletter segment

## Setup Instructions

### 1. Enable Mautic API

In your Mautic admin panel:

1. Go to **Settings** → **Configuration** → **API Settings**
2. Set **API enabled** to **Yes**
3. Set **API auth mode** to **Basic Auth**
4. Save the configuration

### 2. Create API User

1. Go to **Settings** → **Users**
2. Click **New** to create a new user
3. Fill in the user details:
   - **Username**: `strapi-api` (or your preferred name)
   - **Email**: A valid email address
   - **First Name**: `Strapi`
   - **Last Name**: `Integration`
   - **Role**: Create a custom role or use existing with appropriate permissions
4. Set a strong password
5. Save the user

### 3. Configure User Permissions

The API user needs the following permissions:
- **Contacts**: View, Create, Edit
- **Segments**: View, Edit (to add contacts to segments)
- **Categories**: View (if using contact categories)

### 4. Configure Environment Variables

Add these variables to your Strapi `.env` file:

```env
# Mautic Integration
MAUTIC_INTEGRATION_ENABLED=true
MAUTIC_BASE_URL=https://mautic.evanjamesofficial.com
MAUTIC_API_USERNAME=strapi-api
MAUTIC_API_PASSWORD=your_secure_password
MAUTIC_API_TIMEOUT=10000
```

### 5. Create Mautic Segments (Optional)

In Mautic, create a segment for newsletter subscribers:

1. Go to **Segments** → **New**
2. Name: `Newsletter Subscribers`
3. Alias: `newsletter-subscribers`
4. Add filters as needed (e.g., has tag `newsletter-subscriber`)

### 6. Test the Integration

Use the admin API endpoints to test:

```bash
# Test Mautic connection
GET /api/newsletter-subscriptions/mautic/test-connection

# Manually sync a subscription
POST /api/newsletter-subscriptions/{id}/sync-to-mautic

# Bulk sync all subscriptions
POST /api/newsletter-subscriptions/bulk-sync-to-mautic
```

## API Endpoints

### Admin Endpoints (Require Authentication)

#### Test Mautic Connection
```
GET /api/newsletter-subscriptions/mautic/test-connection
```

Response:
```json
{
  "success": true,
  "message": "Mautic connection successful",
  "details": {
    "success": true,
    "status": 200,
    "message": "Connection successful"
  }
}
```

#### Sync Single Subscription
```
POST /api/newsletter-subscriptions/{id}/sync-to-mautic
```

Response:
```json
{
  "success": true,
  "message": "Subscription synced to Mautic successfully",
  "details": {
    "success": true,
    "mauticContactId": 123,
    "action": "created"
  }
}
```

#### Bulk Sync All Subscriptions
```
POST /api/newsletter-subscriptions/bulk-sync-to-mautic
```

Response:
```json
{
  "success": true,
  "message": "Bulk sync completed. 45 synced, 2 failed.",
  "details": {
    "total": 47,
    "synced": 45,
    "failed": 2,
    "errors": [
      {
        "email": "invalid@example.com",
        "error": "Invalid email format"
      }
    ]
  }
}
```

## Database Schema Changes

The integration adds these fields to the newsletter subscription content type:

```json
{
  "mauticContactId": {
    "type": "integer",
    "description": "Mautic contact ID for this subscription"
  },
  "mauticSyncedAt": {
    "type": "datetime",
    "description": "Last time this subscription was synced to Mautic"
  },
  "mauticSyncStatus": {
    "type": "enumeration",
    "enum": ["pending", "synced", "failed", "unsubscribed"],
    "description": "Status of Mautic synchronization"
  }
}
```

## Workflow

### New Subscription Flow
1. User submits newsletter subscription form
2. Strapi creates subscription record with `isActive: false`
3. Verification email is sent
4. User clicks verification link
5. Strapi updates subscription to `isActive: true`
6. **Mautic sync triggers automatically**
7. Contact is created/updated in Mautic
8. Subscription record is updated with Mautic contact ID

### Unsubscribe Flow
1. User clicks unsubscribe link or confirms unsubscribe
2. Strapi updates subscription to `isActive: false`
3. **Mautic sync triggers automatically**
4. Contact is added to Do Not Contact list in Mautic
5. Subscription record is updated with sync status

## Troubleshooting

### Common Issues

#### "Mautic connection failed"
- Check that Mautic API is enabled
- Verify API credentials are correct
- Ensure Mautic URL is accessible from Strapi server
- Check firewall settings

#### "Failed to sync to Mautic"
- Check Mautic logs for API errors
- Verify API user has sufficient permissions
- Check for rate limiting issues
- Review Strapi logs for detailed error messages

#### "Contact not found" during unsubscribe
- This is normal if the contact was never synced to Mautic
- Check if the original subscription was successfully synced

### Debugging

Enable debug logging in Strapi to see detailed sync information:

```javascript
// In your Strapi configuration
module.exports = {
  logger: {
    level: 'debug',
    // ... other logger config
  }
};
```

Check logs for messages like:
- `Newsletter subscription synced to Mautic: email@example.com`
- `Failed to sync to Mautic: email@example.com`
- `Mautic sync error: [error details]`

### Manual Recovery

If subscriptions get out of sync, you can:

1. **Bulk sync all subscriptions**:
   ```bash
   POST /api/newsletter-subscriptions/bulk-sync-to-mautic
   ```

2. **Manually sync individual subscriptions**:
   ```bash
   POST /api/newsletter-subscriptions/{id}/sync-to-mautic
   ```

3. **Reset sync status** (via database):
   ```sql
   UPDATE newsletter_subscriptions 
   SET mautic_sync_status = NULL, mautic_synced_at = NULL 
   WHERE mautic_sync_status = 'failed';
   ```

## Security Considerations

- API credentials are stored as environment variables
- All admin endpoints require authentication
- API requests use HTTPS
- Sensitive data is not logged
- Rate limiting prevents API abuse

## Performance

- Sync operations are asynchronous and don't block user requests
- Bulk sync processes in batches of 100 with delays to prevent API overload
- Failed syncs can be retried without affecting successful ones
- Database indexes on email and sync status fields for efficient queries

## Monitoring

Monitor the integration by:
- Checking sync status in Strapi admin panel
- Reviewing Mautic contact creation/updates
- Monitoring API response times
- Setting up alerts for failed syncs

## Future Enhancements

Potential improvements:
- Webhook-based real-time sync
- Two-way synchronization (Mautic → Strapi)
- Custom field mapping configuration
- Segment assignment rules
- Retry mechanisms for failed syncs
- Sync analytics and reporting
