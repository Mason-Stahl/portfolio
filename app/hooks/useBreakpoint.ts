'use client';

import { useEffect, useState } from 'react';
import { type Breakpoint } from '../components/HorizontalGallery';

function getBreakpoint(w: number): Breakpoint {
  if (w < 640) return 'phone';
  if (w < 1024) return 'tablet';
  if (w < 1440) return 'desktop';
  return 'wide';
}

export default function useBreakpoint(): Breakpoint {
  const [bp, setBp] = useState<Breakpoint>(() =>
    typeof window !== 'undefined' ? getBreakpoint(window.innerWidth) : 'desktop'
  );
  useEffect(() => {
    const handler = () => setBp(getBreakpoint(window.innerWidth));
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return bp;
}
