import type { Attribute, Schema } from '@strapi/strapi';

export interface AdminApiToken extends Schema.CollectionType {
  collectionName: 'strapi_api_tokens';
  info: {
    description: '';
    displayName: 'Api Token';
    name: 'Api Token';
    pluralName: 'api-tokens';
    singularName: 'api-token';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    accessKey: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::api-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    description: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Attribute.DefaultTo<''>;
    expiresAt: Attribute.DateTime;
    lastUsedAt: Attribute.DateTime;
    lifespan: Attribute.BigInteger;
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Attribute.Relation<
      'admin::api-token',
      'oneToMany',
      'admin::api-token-permission'
    >;
    type: Attribute.Enumeration<['read-only', 'full-access', 'custom']> &
      Attribute.Required &
      Attribute.DefaultTo<'read-only'>;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'admin::api-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminApiTokenPermission extends Schema.CollectionType {
  collectionName: 'strapi_api_token_permissions';
  info: {
    description: '';
    displayName: 'API Token Permission';
    name: 'API Token Permission';
    pluralName: 'api-token-permissions';
    singularName: 'api-token-permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::api-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    token: Attribute.Relation<
      'admin::api-token-permission',
      'manyToOne',
      'admin::api-token'
    >;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'admin::api-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminPermission extends Schema.CollectionType {
  collectionName: 'admin_permissions';
  info: {
    description: '';
    displayName: 'Permission';
    name: 'Permission';
    pluralName: 'permissions';
    singularName: 'permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    actionParameters: Attribute.JSON & Attribute.DefaultTo<{}>;
    conditions: Attribute.JSON & Attribute.DefaultTo<[]>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    properties: Attribute.JSON & Attribute.DefaultTo<{}>;
    role: Attribute.Relation<'admin::permission', 'manyToOne', 'admin::role'>;
    subject: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminRole extends Schema.CollectionType {
  collectionName: 'admin_roles';
  info: {
    description: '';
    displayName: 'Role';
    name: 'Role';
    pluralName: 'roles';
    singularName: 'role';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    code: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    description: Attribute.String;
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Attribute.Relation<
      'admin::role',
      'oneToMany',
      'admin::permission'
    >;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    users: Attribute.Relation<'admin::role', 'manyToMany', 'admin::user'>;
  };
}

export interface AdminTransferToken extends Schema.CollectionType {
  collectionName: 'strapi_transfer_tokens';
  info: {
    description: '';
    displayName: 'Transfer Token';
    name: 'Transfer Token';
    pluralName: 'transfer-tokens';
    singularName: 'transfer-token';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    accessKey: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::transfer-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    description: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Attribute.DefaultTo<''>;
    expiresAt: Attribute.DateTime;
    lastUsedAt: Attribute.DateTime;
    lifespan: Attribute.BigInteger;
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Attribute.Relation<
      'admin::transfer-token',
      'oneToMany',
      'admin::transfer-token-permission'
    >;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'admin::transfer-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminTransferTokenPermission extends Schema.CollectionType {
  collectionName: 'strapi_transfer_token_permissions';
  info: {
    description: '';
    displayName: 'Transfer Token Permission';
    name: 'Transfer Token Permission';
    pluralName: 'transfer-token-permissions';
    singularName: 'transfer-token-permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::transfer-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    token: Attribute.Relation<
      'admin::transfer-token-permission',
      'manyToOne',
      'admin::transfer-token'
    >;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'admin::transfer-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminUser extends Schema.CollectionType {
  collectionName: 'admin_users';
  info: {
    description: '';
    displayName: 'User';
    name: 'User';
    pluralName: 'users';
    singularName: 'user';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    blocked: Attribute.Boolean & Attribute.Private & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    email: Attribute.Email &
      Attribute.Required &
      Attribute.Private &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    firstname: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    isActive: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
    lastname: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    password: Attribute.Password &
      Attribute.Private &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    preferedLanguage: Attribute.String;
    registrationToken: Attribute.String & Attribute.Private;
    resetPasswordToken: Attribute.String & Attribute.Private;
    roles: Attribute.Relation<'admin::user', 'manyToMany', 'admin::role'> &
      Attribute.Private;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    username: Attribute.String;
  };
}

export interface ApiAlbumAlbum extends Schema.CollectionType {
  collectionName: 'albums';
  info: {
    description: 'Full-length album releases';
    displayName: 'Album';
    pluralName: 'albums';
    singularName: 'album';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    cover: Attribute.Media<'images'> & Attribute.Required;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::album.album',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    description: Attribute.RichText;
    featured: Attribute.Boolean & Attribute.DefaultTo<false>;
    imageNotes: Attribute.Text &
      Attribute.DefaultTo<'Ideal cover dimensions: 1000x1000px (square), minimum 800x800px. Format: JPG or PNG. Should be high quality for streaming platforms and web display.'>;
    isSingle: Attribute.Boolean & Attribute.DefaultTo<false>;
    metaDescription: Attribute.Text;
    metaTitle: Attribute.String;
    publishedAt: Attribute.DateTime;
    releaseDate: Attribute.Date & Attribute.Required;
    releaseType: Attribute.Enumeration<
      ['album', 'ep', 'single', 'compilation']
    > &
      Attribute.Required &
      Attribute.DefaultTo<'album'>;
    slug: Attribute.UID<'api::album.album', 'title'> & Attribute.Required;
    streamLinks: Attribute.Component<'links.stream-link', true>;
    title: Attribute.String & Attribute.Required;
    tracks: Attribute.Component<'music.track', true> &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::album.album',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiBioBio extends Schema.SingleType {
  collectionName: 'bios';
  info: {
    description: 'Artist biography information';
    displayName: 'Biography';
    pluralName: 'bios';
    singularName: 'bio';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::bio.bio', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    fullBio: Attribute.RichText & Attribute.Required;
    galleryImages: Attribute.Media<'images', true>;
    headerImage: Attribute.Media<'images'>;
    headshot: Attribute.Media<'images'> & Attribute.Required;
    imageNotes: Attribute.Text &
      Attribute.DefaultTo<'Headshot: 800x800px (square) or 600x800px (portrait). Header Image: 1920x600px landscape for about page hero banner. Gallery Images: Various sizes for the visual portfolio section. Minimum 1200x400px. Format: JPG or PNG. Should be high-resolution and suitable for web use.'>;
    metaDescription: Attribute.Text;
    metaTitle: Attribute.String &
      Attribute.DefaultTo<'About Evan James - Official Biography'>;
    pressKitFile: Attribute.Media<'files'>;
    publishedAt: Attribute.DateTime;
    shortBio: Attribute.Text & Attribute.Required;
    socialLinks: Attribute.Component<'links.social-link', true>;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<'api::bio.bio', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface ApiContactSubmissionContactSubmission
  extends Schema.CollectionType {
  collectionName: 'contact_submissions';
  info: {
    description: 'Submissions from the contact form';
    displayName: 'Contact Submission';
    pluralName: 'contact-submissions';
    singularName: 'contact-submission';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::contact-submission.contact-submission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    email: Attribute.Email & Attribute.Required;
    isRead: Attribute.Boolean & Attribute.DefaultTo<false>;
    message: Attribute.Text & Attribute.Required;
    name: Attribute.String & Attribute.Required;
    subject: Attribute.String;
    submittedAt: Attribute.DateTime & Attribute.Required;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::contact-submission.contact-submission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiHealthHealth extends Schema.SingleType {
  collectionName: 'healths';
  info: {
    description: 'Health check endpoint for monitoring system status';
    displayName: 'Health';
    pluralName: 'healths';
    singularName: 'health';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::health.health',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    status: Attribute.String & Attribute.DefaultTo<'ok'>;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::health.health',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiMerchandiseMerchandise extends Schema.CollectionType {
  collectionName: 'merchandise';
  info: {
    description: 'Store products and merchandise items';
    displayName: 'Merchandise';
    pluralName: 'merchandises';
    singularName: 'merchandise';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    category: Attribute.Enumeration<
      ['apparel', 'vinyl', 'cd', 'accessories', 'digital', 'other']
    > &
      Attribute.Required;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::merchandise.merchandise',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    description: Attribute.RichText & Attribute.Required;
    dimensions: Attribute.JSON;
    featured: Attribute.Boolean & Attribute.DefaultTo<false>;
    imageNotes: Attribute.Text &
      Attribute.DefaultTo<'Product images: Main image should be 1200x1200px (square). Additional images can be 1200x1200px or 1200x800px. Format: JPG or PNG. High quality for e-commerce display.'>;
    images: Attribute.Media<'images', true> & Attribute.Required;
    inStock: Attribute.Boolean & Attribute.DefaultTo<true>;
    isOnSale: Attribute.Boolean & Attribute.DefaultTo<false>;
    metaDescription: Attribute.Text;
    metaTitle: Attribute.String;
    name: Attribute.String & Attribute.Required;
    price: Attribute.Decimal & Attribute.Required;
    publishedAt: Attribute.DateTime;
    salePrice: Attribute.Decimal;
    sizes: Attribute.JSON;
    sku: Attribute.String & Attribute.Unique;
    slug: Attribute.UID<'api::merchandise.merchandise', 'name'> &
      Attribute.Required;
    stockQuantity: Attribute.Integer & Attribute.DefaultTo<0>;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::merchandise.merchandise',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    variants: Attribute.Component<'merchandise.product-variant', true>;
    weight: Attribute.Decimal;
  };
}

export interface ApiNewsletterSubscriptionNewsletterSubscription
  extends Schema.CollectionType {
  collectionName: 'newsletter_subscriptions';
  info: {
    description: 'Email subscriptions for newsletters and updates';
    displayName: 'Newsletter Subscription';
    pluralName: 'newsletter-subscriptions';
    singularName: 'newsletter-subscription';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::newsletter-subscription.newsletter-subscription',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    email: Attribute.Email & Attribute.Required & Attribute.Unique;
    ipAddress: Attribute.String;
    isActive: Attribute.Boolean & Attribute.DefaultTo<true>;
    name: Attribute.String;
    preferences: Attribute.JSON;
    source: Attribute.Enumeration<
      ['homepage', 'tour-page', 'merch-page', 'coming-soon', 'footer', 'other']
    > &
      Attribute.DefaultTo<'homepage'>;
    subscribedAt: Attribute.DateTime & Attribute.Required;
    unsubscribedAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::newsletter-subscription.newsletter-subscription',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    userAgent: Attribute.Text;
  };
}

export interface ApiPhotoPhoto extends Schema.CollectionType {
  collectionName: 'photos';
  info: {
    description: 'Photos for the gallery';
    displayName: 'Photo';
    pluralName: 'photos';
    singularName: 'photo';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    altText: Attribute.String;
    caption: Attribute.Text;
    category: Attribute.Enumeration<
      ['press', 'tour', 'promotional', 'personal', 'behind the scenes', 'other']
    > &
      Attribute.DefaultTo<'promotional'>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::photo.photo',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    featured: Attribute.Boolean & Attribute.DefaultTo<false>;
    image: Attribute.Media<'images'> & Attribute.Required;
    imageNotes: Attribute.Text &
      Attribute.DefaultTo<'Gallery photos: Ideal dimensions vary by category. Press photos: 2400x1600px (3:2 ratio). Tour photos: 1920x1080px (16:9). Portrait shots: 1200x1600px (3:4). Minimum 800px on shortest side. Format: JPG or PNG. High quality for print and web use.'>;
    publishedAt: Attribute.DateTime;
    tags: Attribute.Enumeration<
      [
        'portfolio',
        'hero',
        'gallery',
        'press-kit',
        'social-media',
        'website',
        'promotional',
        'live-performance',
        'studio',
        'behind-the-scenes'
      ]
    >;
    title: Attribute.String & Attribute.Required;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::photo.photo',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiPressKitPressKit extends Schema.SingleType {
  collectionName: 'press_kits';
  info: {
    description: 'Password-protected press materials and media assets';
    displayName: 'Press Kit';
    pluralName: 'press-kits';
    singularName: 'press-kit';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    additionalAssets: Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    biographyPDF: Attribute.Media<'files'>;
    contactInfo: Attribute.Component<'contact.contact-info'> &
      Attribute.Required;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::press-kit.press-kit',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    description: Attribute.Text & Attribute.Required;
    downloadInstructions: Attribute.RichText;
    highResPhotos: Attribute.Media<'images', true> & Attribute.Required;
    imageNotes: Attribute.Text &
      Attribute.DefaultTo<'High-resolution press photos: Minimum 2400x1600px (300 DPI). Formats: JPG, PNG, TIFF. Include variety: headshots (800x800px), performance shots (1920x1080px), candid/lifestyle (2400x1600px). All images should be professional quality and suitable for print/digital media use.'>;
    lastUpdated: Attribute.DateTime & Attribute.Required;
    logoFiles: Attribute.Media<'images' | 'files', true>;
    metaDescription: Attribute.Text;
    metaTitle: Attribute.String &
      Attribute.DefaultTo<'Evan James Press Kit - Media Resources'>;
    musicSamples: Attribute.Media<'audios', true>;
    password: Attribute.Password & Attribute.Required;
    pressReleasePDF: Attribute.Media<'files'>;
    publishedAt: Attribute.DateTime;
    title: Attribute.String &
      Attribute.Required &
      Attribute.DefaultTo<'Evan James Press Kit'>;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::press-kit.press-kit',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    videoAssets: Attribute.Media<'videos', true>;
  };
}

export interface ApiPressReleasePressRelease extends Schema.CollectionType {
  collectionName: 'press_releases';
  info: {
    description: 'Press releases and announcements';
    displayName: 'Press Release';
    pluralName: 'press-releases';
    singularName: 'press-release';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    attachments: Attribute.Media<'files' | 'images', true>;
    category: Attribute.Enumeration<
      [
        'music-release',
        'tour-announcement',
        'award',
        'collaboration',
        'general',
        'other'
      ]
    > &
      Attribute.DefaultTo<'general'>;
    contactInfo: Attribute.Component<'contact.contact-info'>;
    content: Attribute.RichText & Attribute.Required;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::press-release.press-release',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    excerpt: Attribute.Text & Attribute.Required;
    featured: Attribute.Boolean & Attribute.DefaultTo<false>;
    featuredImage: Attribute.Media<'images'>;
    imageNotes: Attribute.Text &
      Attribute.DefaultTo<'Press release images: 1200x630px (1.91:1 ratio) for social media sharing. Minimum 800x420px. Format: JPG or PNG. Should be professional and newsworthy.'>;
    metaDescription: Attribute.Text;
    metaTitle: Attribute.String;
    publishedAt: Attribute.DateTime;
    releaseDate: Attribute.Date & Attribute.Required;
    slug: Attribute.UID<'api::press-release.press-release', 'title'> &
      Attribute.Required;
    subtitle: Attribute.String;
    tags: Attribute.JSON;
    title: Attribute.String & Attribute.Required;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::press-release.press-release',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiSiteSettingsSiteSettings extends Schema.SingleType {
  collectionName: 'site_settings';
  info: {
    description: 'Global site configuration and settings';
    displayName: 'Site Settings';
    pluralName: 'site-settings-config';
    singularName: 'site-settings';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    aboutBackgroundImage: Attribute.Media<'images'>;
    aboutButtonText: Attribute.String & Attribute.DefaultTo<'read more'>;
    aboutFullDescription: Attribute.Text &
      Attribute.DefaultTo<'his debut ep "tainted blue" represents his artistic vision that balances commercial accessibility with artistic integrity, drawing inspiration from artists like troye sivan, lorde, and frank ocean.'>;
    aboutShortDescription: Attribute.Text &
      Attribute.DefaultTo<'evan james is an independent pop artist based in new york city, creating cinematic soundscapes with introspective lyrics that explore themes of identity, expectation, and transformation.'>;
    aboutTitle: Attribute.String & Attribute.DefaultTo<'about evan james'>;
    analyticsCode: Attribute.Text;
    comingSoonBackgroundImage: Attribute.Media<'images'>;
    comingSoonBackgroundPattern: Attribute.Media<'images'>;
    comingSoonCountdownDate: Attribute.DateTime;
    comingSoonDescription: Attribute.Text &
      Attribute.DefaultTo<'Our new website is on its way. Stay tuned for something amazing.'>;
    comingSoonEmailSignupText: Attribute.String &
      Attribute.DefaultTo<'Get notified when we launch'>;
    comingSoonLogo: Attribute.Media<'images'>;
    comingSoonShowCountdown: Attribute.Boolean & Attribute.DefaultTo<true>;
    comingSoonShowEmailSignup: Attribute.Boolean & Attribute.DefaultTo<true>;
    comingSoonShowSocialMedia: Attribute.Boolean & Attribute.DefaultTo<true>;
    comingSoonSubtitle: Attribute.String &
      Attribute.DefaultTo<"We're launching soon">;
    comingSoonTitle: Attribute.String & Attribute.DefaultTo<'Coming Soon'>;
    contactEmail: Attribute.Email;
    contactHeaderImage: Attribute.Media<'images'>;
    contactPhone: Attribute.String;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::site-settings.site-settings',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    customCSS: Attribute.Text;
    customJS: Attribute.Text;
    footerText: Attribute.String &
      Attribute.DefaultTo<'\u00A9 2025 Evan James. All rights reserved.'>;
    heroBackgroundImage: Attribute.Media<'images'>;
    heroButtonText: Attribute.String & Attribute.DefaultTo<'listen now'>;
    heroDescription: Attribute.Text &
      Attribute.DefaultTo<'creating cinematic soundscapes with introspective lyrics'>;
    heroSecondaryButtonText: Attribute.String &
      Attribute.DefaultTo<'learn more'>;
    heroSubtitle: Attribute.String &
      Attribute.DefaultTo<'independent pop artist'>;
    heroTitle: Attribute.String & Attribute.DefaultTo<'evan james'>;
    logo: Attribute.Media<'images'>;
    merchHeaderImage: Attribute.Media<'images'>;
    metaDescription: Attribute.Text;
    metaTitle: Attribute.String;
    newsletterButtonText: Attribute.String & Attribute.DefaultTo<'subscribe'>;
    newsletterDescription: Attribute.Text &
      Attribute.DefaultTo<'get the latest updates on new releases, tour dates, and exclusive content.'>;
    newsletterTitle: Attribute.String & Attribute.DefaultTo<'stay connected'>;
    pressHeaderImage: Attribute.Media<'images'>;
    scheduledGoLiveDate: Attribute.DateTime;
    siteName: Attribute.String & Attribute.DefaultTo<'Evan James'>;
    siteStatus: Attribute.Enumeration<['live', 'coming-soon', 'maintenance']> &
      Attribute.DefaultTo<'live'>;
    tagline: Attribute.String & Attribute.DefaultTo<'Official Website'>;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::site-settings.site-settings',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    videoSectionDescription: Attribute.Text &
      Attribute.DefaultTo<'directed by sarah winters. shot on location in new york city, winter 2025.'>;
    videoSectionTitle: Attribute.String &
      Attribute.DefaultTo<'cool skin \u2014 official visual'>;
  };
}

export interface ApiTourDateTourDate extends Schema.CollectionType {
  collectionName: 'tour_dates';
  info: {
    description: 'Concert and tour date listings';
    displayName: 'Tour Date';
    pluralName: 'tour-dates';
    singularName: 'tour-date';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    city: Attribute.String & Attribute.Required;
    country: Attribute.String & Attribute.Required;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::tour-date.tour-date',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    date: Attribute.DateTime & Attribute.Required;
    description: Attribute.Text;
    eventName: Attribute.String & Attribute.Required;
    eventPoster: Attribute.Media<'images'>;
    galleryImages: Attribute.Media<'images', true>;
    isAnnounced: Attribute.Boolean & Attribute.DefaultTo<true>;
    isCancelled: Attribute.Boolean & Attribute.DefaultTo<false>;
    isSoldOut: Attribute.Boolean & Attribute.DefaultTo<false>;
    otherArtists: Attribute.String;
    promotionalImage: Attribute.Media<'images'>;
    publishedAt: Attribute.DateTime;
    state: Attribute.String;
    ticketLink: Attribute.String;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::tour-date.tour-date',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    venueAddress: Attribute.String;
    venueImage: Attribute.Media<'images'>;
    venueName: Attribute.String & Attribute.Required;
    venueWebsite: Attribute.String;
  };
}

export interface ApiVideoVideo extends Schema.CollectionType {
  collectionName: 'videos';
  info: {
    description: 'Music videos and other video content';
    displayName: 'Video';
    pluralName: 'videos';
    singularName: 'video';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::video.video',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    description: Attribute.Text;
    embedCode: Attribute.Text;
    featured: Attribute.Boolean & Attribute.DefaultTo<false>;
    imageNotes: Attribute.Text &
      Attribute.DefaultTo<'Ideal thumbnail dimensions: 1280x720px (16:9 aspect ratio) for YouTube compatibility. Minimum 640x360px. Format: JPG or PNG. Should be engaging and represent the video content.'>;
    publishedAt: Attribute.DateTime;
    releaseDate: Attribute.Date;
    slug: Attribute.UID<'api::video.video', 'title'> & Attribute.Required;
    thumbnail: Attribute.Media<'images'>;
    title: Attribute.String & Attribute.Required;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::video.video',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    videoType: Attribute.Enumeration<
      [
        'music video',
        'lyric video',
        'live performance',
        'behind the scenes',
        'interview',
        'other'
      ]
    > &
      Attribute.DefaultTo<'music video'>;
    videoUrl: Attribute.String & Attribute.Required;
  };
}

export interface PluginContentReleasesRelease extends Schema.CollectionType {
  collectionName: 'strapi_releases';
  info: {
    displayName: 'Release';
    pluralName: 'releases';
    singularName: 'release';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    actions: Attribute.Relation<
      'plugin::content-releases.release',
      'oneToMany',
      'plugin::content-releases.release-action'
    >;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::content-releases.release',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    name: Attribute.String & Attribute.Required;
    releasedAt: Attribute.DateTime;
    scheduledAt: Attribute.DateTime;
    status: Attribute.Enumeration<
      ['ready', 'blocked', 'failed', 'done', 'empty']
    > &
      Attribute.Required;
    timezone: Attribute.String;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::content-releases.release',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginContentReleasesReleaseAction
  extends Schema.CollectionType {
  collectionName: 'strapi_release_actions';
  info: {
    displayName: 'Release Action';
    pluralName: 'release-actions';
    singularName: 'release-action';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    contentType: Attribute.String & Attribute.Required;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::content-releases.release-action',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    entry: Attribute.Relation<
      'plugin::content-releases.release-action',
      'morphToOne'
    >;
    isEntryValid: Attribute.Boolean;
    locale: Attribute.String;
    release: Attribute.Relation<
      'plugin::content-releases.release-action',
      'manyToOne',
      'plugin::content-releases.release'
    >;
    type: Attribute.Enumeration<['publish', 'unpublish']> & Attribute.Required;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::content-releases.release-action',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginI18NLocale extends Schema.CollectionType {
  collectionName: 'i18n_locale';
  info: {
    collectionName: 'locales';
    description: '';
    displayName: 'Locale';
    pluralName: 'locales';
    singularName: 'locale';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    code: Attribute.String & Attribute.Unique;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::i18n.locale',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    name: Attribute.String &
      Attribute.SetMinMax<
        {
          max: 50;
          min: 1;
        },
        number
      >;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::i18n.locale',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUploadFile extends Schema.CollectionType {
  collectionName: 'files';
  info: {
    description: '';
    displayName: 'File';
    pluralName: 'files';
    singularName: 'file';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    alternativeText: Attribute.String;
    caption: Attribute.String;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    ext: Attribute.String;
    folder: Attribute.Relation<
      'plugin::upload.file',
      'manyToOne',
      'plugin::upload.folder'
    > &
      Attribute.Private;
    folderPath: Attribute.String &
      Attribute.Required &
      Attribute.Private &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    formats: Attribute.JSON;
    hash: Attribute.String & Attribute.Required;
    height: Attribute.Integer;
    mime: Attribute.String & Attribute.Required;
    name: Attribute.String & Attribute.Required;
    previewUrl: Attribute.String;
    provider: Attribute.String & Attribute.Required;
    provider_metadata: Attribute.JSON;
    related: Attribute.Relation<'plugin::upload.file', 'morphToMany'>;
    size: Attribute.Decimal & Attribute.Required;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    url: Attribute.String & Attribute.Required;
    width: Attribute.Integer;
  };
}

export interface PluginUploadFolder extends Schema.CollectionType {
  collectionName: 'upload_folders';
  info: {
    displayName: 'Folder';
    pluralName: 'folders';
    singularName: 'folder';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    children: Attribute.Relation<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.folder'
    >;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::upload.folder',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    files: Attribute.Relation<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.file'
    >;
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    parent: Attribute.Relation<
      'plugin::upload.folder',
      'manyToOne',
      'plugin::upload.folder'
    >;
    path: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    pathId: Attribute.Integer & Attribute.Required & Attribute.Unique;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::upload.folder',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsPermission
  extends Schema.CollectionType {
  collectionName: 'up_permissions';
  info: {
    description: '';
    displayName: 'Permission';
    name: 'permission';
    pluralName: 'permissions';
    singularName: 'permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String & Attribute.Required;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    role: Attribute.Relation<
      'plugin::users-permissions.permission',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsRole extends Schema.CollectionType {
  collectionName: 'up_roles';
  info: {
    description: '';
    displayName: 'Role';
    name: 'role';
    pluralName: 'roles';
    singularName: 'role';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    description: Attribute.String;
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    permissions: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.permission'
    >;
    type: Attribute.String & Attribute.Unique;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    users: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.user'
    >;
  };
}

export interface PluginUsersPermissionsUser extends Schema.CollectionType {
  collectionName: 'up_users';
  info: {
    description: '';
    displayName: 'User';
    name: 'user';
    pluralName: 'users';
    singularName: 'user';
  };
  options: {
    draftAndPublish: false;
    timestamps: true;
  };
  attributes: {
    blocked: Attribute.Boolean & Attribute.DefaultTo<false>;
    confirmationToken: Attribute.String & Attribute.Private;
    confirmed: Attribute.Boolean & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    email: Attribute.Email &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    password: Attribute.Password &
      Attribute.Private &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    provider: Attribute.String;
    resetPasswordToken: Attribute.String & Attribute.Private;
    role: Attribute.Relation<
      'plugin::users-permissions.user',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    username: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface ContentTypes {
      'admin::api-token': AdminApiToken;
      'admin::api-token-permission': AdminApiTokenPermission;
      'admin::permission': AdminPermission;
      'admin::role': AdminRole;
      'admin::transfer-token': AdminTransferToken;
      'admin::transfer-token-permission': AdminTransferTokenPermission;
      'admin::user': AdminUser;
      'api::album.album': ApiAlbumAlbum;
      'api::bio.bio': ApiBioBio;
      'api::contact-submission.contact-submission': ApiContactSubmissionContactSubmission;
      'api::health.health': ApiHealthHealth;
      'api::merchandise.merchandise': ApiMerchandiseMerchandise;
      'api::newsletter-subscription.newsletter-subscription': ApiNewsletterSubscriptionNewsletterSubscription;
      'api::photo.photo': ApiPhotoPhoto;
      'api::press-kit.press-kit': ApiPressKitPressKit;
      'api::press-release.press-release': ApiPressReleasePressRelease;
      'api::site-settings.site-settings': ApiSiteSettingsSiteSettings;
      'api::tour-date.tour-date': ApiTourDateTourDate;
      'api::video.video': ApiVideoVideo;
      'plugin::content-releases.release': PluginContentReleasesRelease;
      'plugin::content-releases.release-action': PluginContentReleasesReleaseAction;
      'plugin::i18n.locale': PluginI18NLocale;
      'plugin::upload.file': PluginUploadFile;
      'plugin::upload.folder': PluginUploadFolder;
      'plugin::users-permissions.permission': PluginUsersPermissionsPermission;
      'plugin::users-permissions.role': PluginUsersPermissionsRole;
      'plugin::users-permissions.user': PluginUsersPermissionsUser;
    }
  }
}
