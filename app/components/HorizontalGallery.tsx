'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export type Breakpoint = 'phone' | 'tablet' | 'desktop' | 'wide';

export const imageHeight: Record<Breakpoint, number> = {
  phone: 180,
  tablet: 280,
  desktop: 500,
  wide: 560,
};

export const scrollMultiplier: Record<Breakpoint, number> = {
  phone: 40,
  tablet: 55,
  desktop: 80,
  wide: 90,
};

export const sidePad: Record<Breakpoint, string> = {
  phone: '1.25rem',
  tablet: '2rem',
  desktop: '4rem',
  wide: '4rem',
};

interface HorizontalGalleryProps {
  images: string[];
  id: string;
  label?: React.ReactNode;
  bp: Breakpoint;
}

export default function HorizontalGallery({ images, id, label, bp }: HorizontalGalleryProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: () => {
          const overflow = track.scrollWidth - window.innerWidth;
          return overflow > 0 ? -overflow : 0;
        },
        ease: 'none',
        scrollTrigger: {
          id,
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    });

    // Refresh after images load so scrollWidth is measured correctly
    const imgs = track.querySelectorAll('img');
    let loaded = 0;
    const onLoad = () => {
      loaded++;
      if (loaded === imgs.length) ScrollTrigger.refresh();
    };
    imgs.forEach(img => {
      if (img.complete) { loaded++; }
      else img.addEventListener('load', onLoad);
    });
    if (loaded === imgs.length) ScrollTrigger.refresh();

    return () => ctx.revert();
  }, [id, bp]);

  const pad = sidePad[bp];

  return (
    <div ref={sectionRef} style={{ height: `${images.length * scrollMultiplier[bp]}vh` }}>
      <div style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}>
        {label && (
          <div style={{ paddingLeft: pad, paddingRight: pad, paddingBottom: '1.5rem', flexShrink: 0 }}>
            {label}
          </div>
        )}
        <div
          ref={trackRef}
          style={{ display: 'flex', gap: '1.5rem', padding: `0 ${pad}`, width: 'max-content' }}
        >
          {images.map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              style={{ height: `${imageHeight[bp]}px`, width: 'auto', display: 'block', flexShrink: 0 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
