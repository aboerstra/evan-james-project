import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function MusicGrid({ releases }) {
  // Placeholder data for development
  const placeholderReleases = [
    {
      id: 1,
      title: "Infinite Blue",
      type: "Single",
      releaseDate: "June 15, 2023",
      coverImage: "/images/evanjames_sq_logo.png",
      streamUrl: "https://open.spotify.com",
    },
    {
      id: 2,
      title: "Midnight Hour",
      type: "Single",
      releaseDate: "March 10, 2023",
      coverImage: "/images/evanjames_sq_logo.png",
      streamUrl: "https://open.spotify.com",
    },
    {
      id: 3,
      title: "Dreamscape",
      type: "EP",
      releaseDate: "September 5, 2022",
      coverImage: "/images/evanjames_sq_logo.png",
      streamUrl: "https://open.spotify.com",
    },
    {
      id: 4,
      title: "Echoes",
      type: "Album",
      releaseDate: "January 20, 2022",
      coverImage: "/images/evanjames_sq_logo.png",
      streamUrl: "https://open.spotify.com",
    },
  ];

  const displayReleases = releases || placeholderReleases;

  return (
    <section className="py-16 bg-navy">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-serif mb-12 text-center">Latest Releases</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayReleases.map((release) => (
            <div key={release.id} className="group">
              <div className="relative aspect-square overflow-hidden rounded-lg mb-4">
                <Image
                  src={release.coverImage}
                  alt={release.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
                  <Link href={release.streamUrl} target="_blank" rel="noopener noreferrer">
                    <button className="px-4 py-2 bg-electric-blue text-navy font-bold rounded-md hover:bg-ice-blue transition-colors mb-4">
                      Stream
                    </button>
                  </Link>
                </div>
              </div>
              <h3 className="text-xl font-serif text-white">{release.title}</h3>
              <div className="flex justify-between items-center mt-1">
                <span className="text-sm text-electric-blue">{release.type}</span>
                <span className="text-sm text-gray-400">{release.releaseDate}</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link href="/music">
            <button className="px-6 py-3 border border-electric-blue text-electric-blue hover:bg-electric-blue/10 transition-colors rounded-md">
              View All Music
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
