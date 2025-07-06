import React, { useState } from 'react';
import Image from 'next/image';

export default function ImageGallery({ images, title, description }) {
  const [selectedImage, setSelectedImage] = useState(null);
  
  const openLightbox = (index) => {
    setSelectedImage(index);
    document.body.style.overflow = 'hidden';
  };
  
  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };
  
  const goToPrev = () => {
    setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  
  const goToNext = () => {
    setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };
  
  const Lightbox = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/95 backdrop-blur-sm">
      {/* Close button */}
      <button 
        onClick={closeLightbox}
        className="absolute top-4 right-4 text-white/70 hover:text-white z-10"
        aria-label="Close"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
      
      {/* Navigation buttons */}
      <button 
        onClick={goToPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white z-10"
        aria-label="Previous image"
      >
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
        </svg>
      </button>
      
      <button 
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white z-10"
        aria-label="Next image"
      >
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>
      
      {/* Image */}
      <div className="relative max-w-4xl max-h-[80vh] w-full h-full flex items-center justify-center">
        <div className="relative w-full h-full">
          <Image
            src={images[selectedImage].src}
            alt={images[selectedImage].alt || 'Gallery image'}
            fill
            className="object-contain"
            priority
          />
        </div>
        
        {/* Caption */}
        {images[selectedImage].caption && (
          <div className="absolute bottom-0 left-0 right-0 bg-navy/70 p-4 text-center">
            <p className="text-ice-blue">{images[selectedImage].caption}</p>
          </div>
        )}
      </div>
    </div>
  );
  
  return (
    <div className="mb-16">
      {title && <h2 className="text-3xl font-mulish mb-4 text-ice-blue">{title}</h2>}
      {description && <p className="mb-8 text-ice-blue/80">{description}</p>}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {images.map((image, index) => (
          <div 
            key={index} 
            className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group shadow-lg"
            onClick={() => openLightbox(index)}
          >
            <Image
              src={image.src}
              alt={image.alt || 'Gallery image'}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
              {image.caption && (
                <p className="text-white p-4 font-mulish">{image.caption}</p>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {selectedImage !== null && <Lightbox />}
    </div>
  );
}
