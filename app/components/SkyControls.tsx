'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

interface SkyControlsProps {
  scrubberRef: React.RefObject<HTMLInputElement | null>;
  timeValRef: React.RefObject<HTMLSpanElement | null>;
  timePhaseRef: React.RefObject<HTMLSpanElement | null>;
}

// Exposed so AsciiSky can wire up scrubber events to it
export default function SkyControls({ scrubberRef, timeValRef, timePhaseRef }: SkyControlsProps) {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();

  // Re-observe #hero whenever the route changes (hero only exists on home page)
  useEffect(() => {
    const heroEl = document.getElementById('hero');
    if (!heroEl) {
      setVisible(false);
      return;
    }

    const obs = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.3 }
    );
    obs.observe(heroEl);
    return () => obs.disconnect();
  }, [pathname]);

  return (
    <>
      {/* Time indicator — always visible (small, non-intrusive) */}
      <div style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2.5rem',
        zIndex: 10,
        textAlign: 'right',
        fontFamily: "'Space Mono', monospace",
        pointerEvents: 'none',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.4s ease',
      }}>
        <span style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', display: 'block', marginBottom: '0.25rem' }}>
          Sky time
        </span>
        <span ref={timeValRef} style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.95)' }}>—</span>
        <span ref={timePhaseRef} style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.55)', display: 'block', marginTop: '0.2rem' }}>—</span>
      </div>

      {/* Time scrubber — only while hero is in view */}
      <div
        style={{
          position: 'fixed',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
          fontFamily: "'Space Mono', monospace",
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? 'auto' : 'none',
          transition: 'opacity 0.4s ease',
        }}
        onPointerDown={e => e.stopPropagation()}
        onTouchStart={e => e.stopPropagation()}
      >
        <span style={{ fontSize: '0.55rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>
          Drag to preview time of day
        </span>
        <input
          ref={scrubberRef}
          type="range"
          min="0"
          max="23.99"
          step="0.1"
          defaultValue="-1"
          style={{
            WebkitAppearance: 'none',
            width: '200px',
            height: '2px',
            background: 'rgba(255,255,255,0.15)',
            outline: 'none',
            borderRadius: '2px',
            cursor: 'pointer',
            touchAction: 'none',
          }}
        />
      </div>
    </>
  );
}
