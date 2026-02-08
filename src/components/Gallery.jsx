import { gsap } from "gsap";
import { useCallback, useEffect, useRef, useState } from "react";
import "./Gallery.css";

function Gallery({ isActive }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [photosRevealed, setPhotosRevealed] = useState(false);

  const photosRef = useRef([]);
  const lightboxImgRef = useRef(null);
  const titleRef = useRef(null);

  const photos = [
    { src: "https://dummyimage.com/400x400/ffffff/000000.jpg&text=image+1", alt: "Memory 1" },
    { src: "https://dummyimage.com/400x400/ffffff/000000.jpg&text=image+2", alt: "Memory 1" },
    { src: "https://dummyimage.com/400x400/ffffff/000000.jpg&text=image+3", alt: "Memory 1" },
    { src: "https://dummyimage.com/400x400/ffffff/000000.jpg&text=image+4", alt: "Memory 1" },
    { src: "https://dummyimage.com/400x400/ffffff/000000.jpg&text=image+5", alt: "Memory 1" },
    { src: "https://dummyimage.com/400x400/ffffff/000000.jpg&text=image+6", alt: "Memory 1" },
    { src: "https://dummyimage.com/400x400/ffffff/000000.jpg&text=image+7", alt: "Memory 1" },
    { src: "https://dummyimage.com/400x400/ffffff/000000.jpg&text=image+8", alt: "Memory 1" },
    { src: "https://dummyimage.com/400x400/ffffff/000000.jpg&text=image+9", alt: "Memory 1" },
    { src: "https://dummyimage.com/400x400/ffffff/000000.jpg&text=image+10", alt: "Memory 1" },
    { src: "https://dummyimage.com/400x400/ffffff/000000.jpg&text=image+11", alt: "Memory 1" },
    { src: "https://dummyimage.com/400x400/ffffff/000000.jpg&text=image+12", alt: "Memory 1" },
    
  ];

  // Reveal photos with GSAP when page becomes active
  useEffect(() => {
    if (isActive && !photosRevealed) {
      setTimeout(() => setPhotosRevealed(true), 10);

      // Animate title
      if (titleRef.current) {
        gsap.fromTo(titleRef.current,
          { opacity: 0, y: -20 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
        );
      }

      // Stagger animation for photos
      gsap.fromTo(
        photosRef.current,
        {
          opacity: 0,
          y: 40,
          scale: 0.9,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
          delay: 0.2,
        }
      );
    }
  }, [isActive, photosRevealed]);

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  // Handle body overflow
  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxOpen]);

  const showNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  }, [photos.length]);

  const showPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  }, [photos.length]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return;

      if (e.key === "Escape") {
        closeLightbox();
      } else if (e.key === "ArrowLeft") {
        showPrev();
      } else if (e.key === "ArrowRight") {
        showNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, showNext, showPrev, closeLightbox]);

  return (
    <section className="gallery">
      <h2 ref={titleRef}>
        <span className="gallery-title-emoji">📸</span>
        Our Beautiful Memories
        <span className="gallery-title-emoji">💕</span>
      </h2>
      
      <div className="photos">
        {photos.map((photo, index) => (
          <div key={index} className="photo-wrapper">
            <img
              ref={(el) => (photosRef.current[index] = el)}
              src={photo.src}
              alt={photo.alt}
              onClick={() => openLightbox(index)}
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {lightboxOpen && (
        <div className="lightbox" onClick={closeLightbox}>
          <img
            ref={lightboxImgRef}
            src={photos[currentIndex].src}
            alt={photos[currentIndex].alt}
            onClick={(e) => e.stopPropagation()}
          />
          <div className="lightbox-caption">
            Photo {currentIndex + 1} of {photos.length}
          </div>
          <button
            className="lightbox-close"
            onClick={closeLightbox}
            aria-label="Close lightbox"
          >
            ✖
          </button>
          <button
            className="nav-btn nav-prev"
            onClick={(e) => {
              e.stopPropagation();
              showPrev();
            }}
            aria-label="Previous photo"
          >
            ‹
          </button>
          <button
            className="nav-btn nav-next"
            onClick={(e) => {
              e.stopPropagation();
              showNext();
            }}
            aria-label="Next photo"
          >
            ›
          </button>
        </div>
      )}
    </section>
  );
}

export default Gallery;
