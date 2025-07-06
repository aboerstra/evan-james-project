const fs = require('fs');
const path = require('path');

async function seedData() {
  try {
    // Initialize Strapi
    const strapi = await require('@strapi/strapi').createStrapi();
    await strapi.load();
    await strapi.server.mount();

    console.log('Starting to seed data...');

    // 1. Create Site Settings
    const siteSettings = await strapi.entityService.create('api::site-settings.site-settings', {
      data: {
        siteStatus: 'coming-soon',
        scheduledGoLiveDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        comingSoon: {
          heroTitle: 'Evan James - Coming Soon',
          description: 'New music and website launching soon. Stay tuned!',
          showCountdown: true,
          showEmailSignup: true
        }
      }
    });
    console.log('✓ Site settings created');

    // 2. Create Biography
    const bio = await strapi.entityService.create('api::bio.bio', {
      data: {
        shortBio: 'Evan James is an emerging artist known for blending contemporary electronic elements with classical training.',
        fullBio: '# About Evan James\n\nEvan James is a multi-instrumentalist and producer whose music transcends traditional genre boundaries...',
        metaTitle: 'About Evan James - Official Biography',
        metaDescription: 'Learn about Evan James, an emerging artist blending electronic and classical elements in contemporary music.',
        publishedAt: new Date()
      }
    });
    console.log('✓ Biography created');

    // 3. Create Social Links
    const socialPlatforms = [
      { platform: 'Instagram', url: 'https://instagram.com/evanjames' },
      { platform: 'YouTube', url: 'https://youtube.com/@evanjames' },
      { platform: 'Spotify', url: 'https://open.spotify.com/artist/evanjames' }
    ];

    for (const platform of socialPlatforms) {
      await strapi.entityService.create('api::social-link.social-link', {
        data: {
          ...platform,
          displayOrder: socialPlatforms.indexOf(platform),
          publishedAt: new Date()
        }
      });
    }
    console.log('✓ Social links created');

    // 4. Create Sample Album Release
    const album = await strapi.entityService.create('api::album.album', {
      data: {
        title: 'Debut EP',
        releaseDate: '2024-06-01',
        description: 'The debut EP showcasing a unique blend of electronic and classical elements.',
        releaseType: 'ep',
        featured: true,
        isSingle: false,
        tracks: [
          {
            title: 'Track 1',
            duration: '3:45',
            isExplicit: false
          },
          {
            title: 'Track 2',
            duration: '4:12',
            isExplicit: false
          }
        ],
        streamLinks: [
          {
            platform: 'Spotify',
            url: 'https://open.spotify.com/album/example'
          },
          {
            platform: 'Apple Music',
            url: 'https://music.apple.com/album/example'
          }
        ],
        publishedAt: new Date()
      }
    });
    console.log('✓ Sample album created');

    // 5. Create Sample Video
    const video = await strapi.entityService.create('api::video.video', {
      data: {
        title: 'Debut Single - Official Music Video',
        description: 'The official music video for the debut single.',
        videoUrl: 'https://youtube.com/watch?v=example',
        videoType: 'music video',
        featured: true,
        releaseDate: '2024-05-15',
        publishedAt: new Date()
      }
    });
    console.log('✓ Sample video created');

    // 6. Create Sample Tour Dates
    const tourDates = [
      {
        eventName: 'EP Launch Party',
        date: '2024-06-15T20:00:00.000Z',
        venueName: 'The Music Hall',
        city: 'Los Angeles',
        state: 'CA',
        country: 'USA',
        isAnnounced: true,
        description: 'Special EP launch performance with guest artists',
        publishedAt: new Date()
      },
      {
        eventName: 'Summer Music Festival',
        date: '2024-07-20T18:00:00.000Z',
        venueName: 'Festival Grounds',
        city: 'Austin',
        state: 'TX',
        country: 'USA',
        isAnnounced: true,
        description: 'Festival performance featuring new material',
        publishedAt: new Date()
      }
    ];

    for (const date of tourDates) {
      await strapi.entityService.create('api::tour-date.tour-date', {
        data: date
      });
    }
    console.log('✓ Tour dates created');

    // 7. Create Sample Merchandise
    const merchandise = await strapi.entityService.create('api::merchandise.merchandise', {
      data: {
        name: 'Debut EP T-Shirt',
        description: 'Limited edition t-shirt featuring artwork from the debut EP',
        price: 25.00,
        category: 'clothing',
        featured: true,
        showOnShop: true,
        productVariants: [
          {
            size: 'S',
            color: 'Black',
            stockQuantity: 50
          },
          {
            size: 'M',
            color: 'Black',
            stockQuantity: 50
          },
          {
            size: 'L',
            color: 'Black',
            stockQuantity: 50
          }
        ],
        publishedAt: new Date()
      }
    });
    console.log('✓ Sample merchandise created');

    // 8. Create Sample Press Release
    const pressRelease = await strapi.entityService.create('api::press-release.press-release', {
      data: {
        title: 'Evan James Announces Debut EP',
        publishDate: '2024-05-01',
        content: '## FOR IMMEDIATE RELEASE\n\nEmerging artist Evan James announces his debut EP, set to release June 1st, 2024...',
        excerpt: 'Emerging artist Evan James announces debut EP releasing June 1st, 2024',
        publishedAt: new Date()
      }
    });
    console.log('✓ Sample press release created');

    console.log('\nData seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('An error occurred during seeding:', error);
    process.exit(1);
  }
}

seedData(); 