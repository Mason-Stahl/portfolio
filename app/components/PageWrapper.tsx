'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useTransition } from '../contexts/TransitionContext';
import { useWind } from '../contexts/WindContext';

// useLayoutEffect is safe in client components; suppress SSR warning with this alias
const useClientLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isLeaving, setLeaving } = useTransition();
  const { targetWindSpeedRef } = useWind();
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Enter animation: fires synchronously before browser paint so no flash occurs.
  // If wind speed is elevated (arriving from a transition), slide in from right.
  useClientLayoutEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    if (targetWindSpeedRef.current > 1) {
      // Arriving from a wind transition — start off-screen right, slide to center
      el.style.transition = 'none';
      el.style.transform = 'translateX(100vw)';
      el.style.opacity = '0';

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
          el.style.transform = 'translateX(0)';
          el.style.opacity = '1';
        });
      });
    } else {
      // Direct URL load — show immediately, no animation
      el.style.transition = 'none';
      el.style.transform = 'translateX(0)';
      el.style.opacity = '1';
    }

    // Clear leaving state now that new page has mounted
    setLeaving(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Leave animation: slides content left when isLeaving becomes true
  useEffect(() => {
    if (!isLeaving) return;
    const el = wrapperRef.current;
    if (!el) return;
    el.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
    el.style.transform = 'translateX(-100vw)';
    el.style.opacity = '0';
  }, [isLeaving]);

  return (
    // position + z-index: 2 ensures this stacking context sits above the fixed
    // AmbientBirds layer (z-index: 1) in the root stacking context.
    <div ref={wrapperRef} style={{ position: 'relative', zIndex: 2, opacity: 1, willChange: 'transform, opacity' }}>
      {children}
    </div>
  );
}
