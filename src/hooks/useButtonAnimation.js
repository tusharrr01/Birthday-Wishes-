import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

/**
 * Custom hook to animate button appearance using GSAP
 * Reduces repetitive useEffect blocks
 * @param {boolean} shouldAnimate - Whether to trigger animation
 * @param {string} buttonId - data-button attribute value
 * @param {object} options - Animation options (defaults provided)
 */
export const useButtonAnimation = (shouldAnimate, buttonId, options = {}) => {
  const buttonRef = useRef(null);
  const timelineRef = useRef(null);

  useEffect(() => {
    if (shouldAnimate && buttonRef.current) {
      // Kill previous animation
      if (timelineRef.current) {
        timelineRef.current.kill();
      }

      const defaults = {
        opacity: 0,
        x: -30,
        scale: 0.8,
        duration: 0.5,
        ease: 'back.out(1.7)',
      };

      const finalOptions = { ...defaults, ...options };

      timelineRef.current = gsap.fromTo(
        buttonRef.current,
        {
          opacity: finalOptions.opacity,
          x: finalOptions.x,
          scale: finalOptions.scale,
        },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: finalOptions.duration,
          ease: finalOptions.ease,
        }
      );
    }

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [shouldAnimate, buttonId, options]);

  return buttonRef;
};
