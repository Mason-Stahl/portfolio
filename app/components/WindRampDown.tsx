'use client';

import { useEffect } from 'react';
import { useWind } from '../contexts/WindContext';

// Drop-in component: when mounted, waits 500ms then ramps wind back to default.
// Include on any page that should receive a wind-transition entrance.
export default function WindRampDown() {
  const { targetWindSpeedRef } = useWind();
  useEffect(() => {
    const timer = setTimeout(() => {
      targetWindSpeedRef.current = 0.6;
    }, 500);
    return () => clearTimeout(timer);
  }, [targetWindSpeedRef]);
  return null;
}
