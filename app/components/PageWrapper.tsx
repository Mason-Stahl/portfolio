'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useTransition } from '../contexts/TransitionContext';
import { useWind, DEFAULT_WIND_SPEED } from '../contexts/WindContext';

// useLayoutEffect is safe in client components; suppress SSR warning with this alias
const useClientLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { leavingDirection, setLeavingDirection } = useTransition();
  const { targetWindSpeedRef } = useWind();
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Enter animation: fires synchronously before browser paint so no flash occurs.
  // Also restores scroll position if a section was stored before navigating away.
  // If wind speed is elevated (arriving from a transition), slide in from the opposite side.
  useClientLayoutEffect(() => {
    const sectionId = sessionStorage.getItem('returnSection');
    if (sectionId) {
      sessionStorage.removeItem('returnSection');
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'instant' as ScrollBehavior });
    }

    const el = wrapperRef.current;
    if (!el) return;

    const windSpeed = targetWindSpeedRef.current;
    if (Math.abs(windSpeed) > 1) {
      // Arriving from a wind transition
      // Rightward wind (negative speed) → page entered going right → slide in from left
      // Leftward wind (positive speed)  → page entered going left  → slide in from right
      const enterFrom = windSpeed < 0 ? '-100vw' : '100vw';

      el.style.transition = 'none';
      el.style.transform = `translateX(${enterFrom})`;
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
    setLeavingDirection(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Leave animation: slides content in the leaving direction
  useEffect(() => {
    if (!leavingDirection) return;
    const el = wrapperRef.current;
    if (!el) return;
    const slideOut = leavingDirection === 'right' ? '100vw' : '-100vw';
    el.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
    el.style.transform = `translateX(${slideOut})`;
    el.style.opacity = '0';
  }, [leavingDirection]);

  // Wind ramp-down: after each navigation wait 500ms then settle back to default.
  // This replaces the WindRampDown component — no need to add it per-page.
  useEffect(() => {
    const timer = setTimeout(() => {
      targetWindSpeedRef.current = DEFAULT_WIND_SPEED;
    }, 500);
    return () => clearTimeout(timer);
  }, [pathname, targetWindSpeedRef]);

  return (
    // position + z-index: 2 ensures this stacking context sits above the fixed
    // AmbientBirds layer (z-index: 1) in the root stacking context.
    <div ref={wrapperRef} style={{ position: 'relative', zIndex: 2, opacity: 1, willChange: 'transform, opacity' }}>
      {children}
    </div>
  );
}
