import type { Attribute, Schema } from '@strapi/strapi';

export interface ContactContactInfo extends Schema.Component {
  collectionName: 'components_contact_contact_infos';
  info: {
    description: 'Contact information';
    displayName: 'Contact Info';
  };
  attributes: {
    email: Attribute.Email & Attribute.Required;
    name: Attribute.String & Attribute.Required;
    organization: Attribute.String;
    phone: Attribute.String;
    position: Attribute.String;
  };
}

export interface LinksSocialLink extends Schema.Component {
  collectionName: 'components_links_social_links';
  info: {
    description: 'Social media platform links';
    displayName: 'Social Link';
  };
  attributes: {
    icon: Attribute.Media<'images'>;
    platform: Attribute.Enumeration<
      [
        'Instagram',
        'TikTok',
        'YouTube',
        'Twitter',
        'Facebook',
        'Snapchat',
        'LinkedIn',
        'Discord'
      ]
    > &
      Attribute.Required;
    url: Attribute.String & Attribute.Required;
  };
}

export interface LinksStreamLink extends Schema.Component {
  collectionName: 'components_links_stream_links';
  info: {
    description: 'Links to streaming platforms';
    displayName: 'Stream Link';
  };
  attributes: {
    platform: Attribute.Enumeration<
      [
        'Spotify',
        'Apple Music',
        'YouTube',
        'SoundCloud',
        'Amazon Music',
        'Tidal',
        'Deezer',
        'Bandcamp'
      ]
    > &
      Attribute.Required;
    url: Attribute.String & Attribute.Required;
  };
}

export interface MerchandiseProductVariant extends Schema.Component {
  collectionName: 'components_merchandise_product_variants';
  info: {
    description: 'Product variations like size, color, etc.';
    displayName: 'Product Variant';
  };
  attributes: {
    color: Attribute.String;
    image: Attribute.Media<'images'>;
    isAvailable: Attribute.Boolean & Attribute.DefaultTo<true>;
    name: Attribute.String & Attribute.Required;
    price: Attribute.Decimal;
    size: Attribute.Enumeration<['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size']>;
    sku: Attribute.String & Attribute.Unique;
    stockQuantity: Attribute.Integer & Attribute.DefaultTo<0>;
  };
}

export interface MusicTrack extends Schema.Component {
  collectionName: 'components_music_tracks';
  info: {
    description: 'Individual song track';
    displayName: 'Track';
  };
  attributes: {
    audioPreview: Attribute.Media<'audios'>;
    duration: Attribute.String;
    isExplicit: Attribute.Boolean & Attribute.DefaultTo<false>;
    title: Attribute.String & Attribute.Required;
    trackNumber: Attribute.Integer;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'contact.contact-info': ContactContactInfo;
      'links.social-link': LinksSocialLink;
      'links.stream-link': LinksStreamLink;
      'merchandise.product-variant': MerchandiseProductVariant;
      'music.track': MusicTrack;
    }
  }
}
