'use client';

import { useEffect, useState } from 'react';

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const MOUNTAINS = {
  // z-index: must be below AmbientBirds (zIndex: 1)
  zIndex: 0,
  // How many pixels from page bottom to start fading in (larger = earlier fade-in)
  fadeStartPx: 600,
}
// ──────────────────────────────────────────────────────────────────────────────

export default function MountainLayer() {
  const [opacity, setOpacity] = useState(0)

  useEffect(() => {
    const update = () => {
      const scrollBottom = window.scrollY + window.innerHeight
      const pageHeight = document.documentElement.scrollHeight
      const distFromBottom = pageHeight - scrollBottom
      const t = 1 - Math.min(distFromBottom / MOUNTAINS.fadeStartPx, 1)
      setOpacity(t)
    }
    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        pointerEvents: 'none',
        zIndex: MOUNTAINS.zIndex,
        opacity,
        transition: 'opacity 0.2s ease',
      }}
    >
      <img
        src="/images/general/mountains_2.svg"
        alt=""
        style={{ width: '100%', display: 'block' }}
      />
    </div>
  );
}
