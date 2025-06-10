'use client';

import { useEffect, useRef, useCallback } from 'react';

interface ScrollTriggerControllerProps {
  onTrigger: () => void;
  threshold?: number;
  enabled?: boolean;
  rootMargin?: string;
}

const ScrollTriggerController: React.FC<ScrollTriggerControllerProps> = ({
  onTrigger,
  threshold = 0.8,
  enabled = true,
  rootMargin = '0px',
}) => {
  const triggerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && enabled) {
        onTrigger();
      }
    },
    [onTrigger, enabled]
  );

  useEffect(() => {
    if (!enabled) return;

    const currentTrigger = triggerRef.current;
    if (!currentTrigger) return;

    // Clean up previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Create new observer
    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
    });

    observerRef.current.observe(currentTrigger);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleIntersection, threshold, rootMargin, enabled]);

  // Alternative scroll-based trigger for better compatibility
  useEffect(() => {
    if (!enabled) return;

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;
      
      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;
      
      if (scrollPercentage >= threshold) {
        onTrigger();
      }
    };

    // Throttle scroll events
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', throttledScroll);
    };
  }, [onTrigger, threshold, enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={triggerRef}
      className="h-px w-full absolute bottom-0 pointer-events-none"
      aria-hidden="true"
    />
  );
};

export default ScrollTriggerController;
