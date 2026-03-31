'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const MOUNTAINS = {
  zIndex: 0,
  liftPx: 220,
  liftPxMobile: 412, // +192 at ≤767px
  intersectionThreshold: 0.05,
  // Slide + fade in (triggered by mountain-trigger entering viewport)
  transitionIn: 'transform 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.3s ease',
  // Slide + fade out (triggered by footer leaving viewport)
  transitionOut: 'transform 0.25s ease-in, opacity 0.3s ease-out',
}
// ──────────────────────────────────────────────────────────────────────────────

export default function MountainLayer() {
  const ref = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const updateBottom = () => {
      el.style.bottom = (window.innerWidth <= 767 ? MOUNTAINS.liftPxMobile : MOUNTAINS.liftPx) + 'px'
    }
    updateBottom()
    window.addEventListener('resize', updateBottom, { passive: true })

    // Default: hidden and down
    el.style.transform = 'translateY(100%)'
    el.style.opacity = '0'

    if (pathname !== '/') return

    const trigger = document.getElementById('mountain-trigger')
    const footer = document.querySelector('footer')
    if (!trigger || !footer) return

    let shown = false

    // Slide + fade IN when mountain-trigger enters viewport
    const triggerObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          shown = true
          el.style.transition = MOUNTAINS.transitionIn
          el.style.transform = 'translateY(0)'
          el.style.opacity = '1'
        }
      },
      { threshold: MOUNTAINS.intersectionThreshold }
    )

    // Slide + fade OUT only when footer leaves viewport after having been shown
    const footerObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && shown) {
          shown = false
          el.style.transition = MOUNTAINS.transitionOut
          el.style.transform = 'translateY(100%)'
          el.style.opacity = '0'
        }
      },
      { threshold: MOUNTAINS.intersectionThreshold }
    )

    triggerObserver.observe(trigger)
    footerObserver.observe(footer)

    return () => {
      window.removeEventListener('resize', updateBottom)
      triggerObserver.disconnect()
      footerObserver.disconnect()
    }
  }, [pathname])

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        bottom: MOUNTAINS.liftPx,
        left: 0,
        right: 0,
        pointerEvents: 'none',
        zIndex: MOUNTAINS.zIndex,
        opacity: 0,
      }}
    >
      <div style={{ position: 'relative', width: '100%' }}>
        <img
          src="/images/general/mountains_2.svg"
          alt=""
          style={{ width: '100%', display: 'block' }}
        />
        {/* Rectangle anchored to a % from the top of the SVG — fully responsive.
            SVG is 1920×1080, so top: '90%' = 90% down the SVG's rendered height. */}
        <div style={{
          position: 'absolute',
          top: '83%',
          left: 0,
          right: 0,
          height: 400,
          background: '#2b3733',
        }} />
      </div>
    </div>
  )
}
