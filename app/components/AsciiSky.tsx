'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useWind, DEFAULT_WIND_SPEED } from '../contexts/WindContext';

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const ROWS_PER_PX        = 1 / 14.85;

const CHARS = [' ', ' ', ' ', '.', '·', '˙', '·', '.', ':', '·', '.', '~', '-', '~', '·', '.'];

const SKY_PALETTES: Record<number, { bg: string; lo: string; hi: string }> = {
   0: { bg: '#02060f', lo: '#0a1832', hi: '#0f2045' },
   4: { bg: '#020813', lo: '#0c1e3d', hi: '#132750' },
   5: { bg: '#0d0b1f', lo: '#2d1a4a', hi: '#4a2060' },
   6: { bg: '#1a0a1a', lo: '#7a2535', hi: '#c44a2a' },
   7: { bg: '#200d08', lo: '#b04520', hi: '#e8823a' },
   8: { bg: '#0a1520', lo: '#1a4a7a', hi: '#3a7abf' },
  10: { bg: '#071020', lo: '#1a3d70', hi: '#2f6ab8' },
  12: { bg: '#060d1a', lo: '#1a3a6e', hi: '#2960aa' },
  15: { bg: '#060d1a', lo: '#1a3560', hi: '#2755a0' },
  17: { bg: '#080b15', lo: '#1a2f5a', hi: '#284e90' },
  18: { bg: '#10080f', lo: '#602050', hi: '#c04880' },
  19: { bg: '#180808', lo: '#803020', hi: '#e06030' },
  20: { bg: '#0f0510', lo: '#4a1535', hi: '#8a2555' },
  21: { bg: '#060410', lo: '#1a1040', hi: '#2a1860' },
  22: { bg: '#03050e', lo: '#0c1530', hi: '#152040' },
  23: { bg: '#02060f', lo: '#0a1832', hi: '#0f2045' },
};

// ─── SCRUBBER CONFIG ──────────────────────────────────────────────────────────
// Section IDs where the time scrubber is visible. Add/remove IDs to control
// which sections show the scrubber. The scrubber fades whenever any listed
// section enters or leaves the viewport — so listing two adjacent sections
// (e.g. 'hero' and 'ai-applications') keeps it visible across both.
const SCRUBBER_CONFIG = {
  visibleInSections: ['hero'] as string[],
  fadeTransitionMs: 200,
};

// ─── PURE HELPERS ─────────────────────────────────────────────────────────────

function noise2(x: number, y: number): number {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = x - xi, yf = y - yi;
  const h = (a: number, b: number) => {
    const n = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
    return n - Math.floor(n);
  };
  const v00 = h(xi, yi), v10 = h(xi+1, yi), v01 = h(xi, yi+1), v11 = h(xi+1, yi+1);
  const sx = xf*xf*(3-2*xf), sy = yf*yf*(3-2*yf);
  return v00 + (v10-v00)*sx + (v01-v00)*sy + (v00-v10-v01+v11)*sx*sy;
}

function fbm(x: number, y: number): number {
  let v = 0, amp = 0.5, freq = 1;
  for (let i = 0; i < 4; i++) { v += noise2(x*freq, y*freq)*amp; amp *= 0.5; freq *= 2.1; }
  return v;
}

function hexToRgb(h: string): [number, number, number] {
  return [parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16)];
}

function lerpRgb(a: [number,number,number], b: [number,number,number], t: number): [number,number,number] {
  return [
    Math.round(a[0]+(b[0]-a[0])*t),
    Math.round(a[1]+(b[1]-a[1])*t),
    Math.round(a[2]+(b[2]-a[2])*t),
  ];
}

function lerpColor(a: [number,number,number], b: [number,number,number], t: number): [number,number,number] {
  return lerpRgb(a, b, Math.max(0, Math.min(1, t)));
}

function getPalette(hour: number): { bg: [number,number,number]; lo: [number,number,number]; hi: [number,number,number] } {
  const keys = Object.keys(SKY_PALETTES).map(Number).sort((a,b) => a-b);
  let lo = keys[keys.length-1], hi = keys[0];
  for (let i = 0; i < keys.length; i++) {
    if (hour >= keys[i]) lo = keys[i];
    if (hour < keys[i] && hi === keys[0]) hi = keys[i];
  }
  if (hour < keys[0]) { lo = keys[keys.length-1]; hi = keys[0]; }
  const loP = SKY_PALETTES[lo], hiP = SKY_PALETTES[hi];
  let t = (lo === hi) ? 0 : (hour - lo) / ((hi > lo ? hi : hi+24) - lo);
  t = Math.max(0, Math.min(1, t));
  return {
    bg: lerpRgb(hexToRgb(loP.bg), hexToRgb(hiP.bg), t),
    lo: lerpRgb(hexToRgb(loP.lo), hexToRgb(hiP.lo), t),
    hi: lerpRgb(hexToRgb(loP.hi), hexToRgb(hiP.hi), t),
  };
}

function phaseName(h: number): string {
  if (h < 5)    return 'Night';
  if (h < 6)    return 'Pre-dawn';
  if (h < 7.5)  return 'Sunrise';
  if (h < 9)    return 'Morning';
  if (h < 12)   return 'Late Morning';
  if (h < 14)   return 'Midday';
  if (h < 17)   return 'Afternoon';
  if (h < 18.5) return 'Late Afternoon';
  if (h < 19.5) return 'Sunset';
  if (h < 21)   return 'Dusk';
  return 'Night';
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export default function AsciiSky() {
  const bgRef        = useRef<HTMLDivElement>(null);
  const timeValRef   = useRef<HTMLSpanElement>(null);
  const timePhaseRef = useRef<HTMLSpanElement>(null);
  const scrubberRef  = useRef<HTMLInputElement>(null);
  const { targetWindSpeedRef } = useWind();
  const pathname = usePathname();
  const [scrubberVisible, setScrubberVisible] = useState(false);

  // ── ASCII wind loop ──────────────────────────────────────────────────────────
  useEffect(() => {
    const bg = bgRef.current;
    if (!bg) return;

    let W = 0, H = 0, COLS = 0, ROWS = 0;
    let rowEls:    HTMLSpanElement[] = [];
    let rowSpeeds: number[] = [];
    let animFrame: number | null = null;
    let simTime:   number | null = null;
    let lastTs = 0;
    let driftX = 0;
    let driftY = 0;
    let currentWindSpeed = DEFAULT_WIND_SPEED;

    function getHour(): number {
      if (simTime !== null) return simTime;
      const now = new Date();
      return now.getHours() + now.getMinutes()/60 + now.getSeconds()/3600;
    }

    function init() {
      if (!bg) return;
      W = window.innerWidth;
      H = window.innerHeight;

      const probe = document.createElement('span');
      probe.style.cssText = "font-family:'Space Mono',monospace;font-size:11px;letter-spacing:0.05em;position:absolute;visibility:hidden;white-space:pre";
      probe.textContent = 'X'.repeat(200);
      document.body.appendChild(probe);
      const measured = probe.offsetWidth / 200;
      document.body.removeChild(probe);
      const charWidth = measured > 2 ? measured : 11.5;

      COLS = Math.ceil(W / charWidth) + 8;
      ROWS = Math.ceil(H * ROWS_PER_PX) + 4;

      bg.innerHTML = '';
      rowEls = [];
      rowSpeeds = [];
      driftX = 0;
      driftY = 0;

      for (let r = 0; r < ROWS; r++) {
        const el = document.createElement('span');
        el.style.cssText = `position:absolute;left:0;width:100%;display:block;top:${r * 14.85}px`;
        bg.appendChild(el);
        rowEls.push(el);
        const t = r / ROWS;
        rowSpeeds.push((0.4 + Math.random() * 0.6) * (1 - t * 0.5));
      }

      if (animFrame) cancelAnimationFrame(animFrame);
      lastTs = 0;
      animFrame = requestAnimationFrame(loop);
    }

    function loop(ts: number) {
      const dt = lastTs === 0 ? 0 : Math.min(ts - lastTs, 50);
      lastTs = ts;

      const k = dt === 0 ? 0 : 1 - Math.exp(-dt / 200);
      currentWindSpeed += (targetWindSpeedRef.current - currentWindSpeed) * k;

      const hour    = getHour();
      const palette = getPalette(hour);

      document.body.style.background = `rgb(${palette.bg.join(',')})`;

      if (timeValRef.current) {
        const rH = Math.floor(hour), rM = Math.floor((hour % 1) * 60);
        timeValRef.current.textContent = String(rH).padStart(2,'0') + ':' + String(rM).padStart(2,'0');
      }
      if (timePhaseRef.current) {
        timePhaseRef.current.textContent = phaseName(hour);
      }

      const windPerMs = currentWindSpeed / 1000;
      const globalGust = 1 + 0.3 * Math.sin(ts * 0.0004);
      driftX += windPerMs * dt * globalGust;
      driftY += windPerMs * dt * 0.04;

      for (let r = 0; r < ROWS; r++) {
        const rowFrac = r / ROWS;
        const rowDriftX = driftX * rowSpeeds[r];
        let line = '';
        let totalDensity = 0;
        for (let c = 0; c < COLS; c++) {
          const raw = fbm(c * 0.09 + rowDriftX, r * 0.14 + driftY);
          const vGrad = 1 - Math.abs(rowFrac - 0.45) * 1.2;
          const density = raw * 0.6 + vGrad * 0.4;
          totalDensity += density;
          const idx = Math.floor(density * (CHARS.length - 1));
          line += CHARS[Math.max(0, Math.min(CHARS.length - 1, idx))];
        }
        const avgDensity = totalDensity / COLS;
        const colorT = avgDensity * 0.7 + (1 - rowFrac) * 0.15;
        const col = lerpColor(palette.lo, palette.hi, Math.max(0, Math.min(1, colorT)));
        rowEls[r].style.color = `rgb(${col.join(',')})`;
        rowEls[r].textContent = line;
      }

      animFrame = requestAnimationFrame(loop);
    }

    const scrubber = scrubberRef.current;
    const onScrub = () => { if (scrubber) simTime = parseFloat(scrubber.value); };
    const onDblClick = () => {
      simTime = null;
      if (scrubber) scrubber.value = String(getHour());
    };
    scrubber?.addEventListener('input', onScrub);
    scrubber?.addEventListener('dblclick', onDblClick);
    if (scrubber) {
      const now = new Date();
      scrubber.value = String(now.getHours() + now.getMinutes()/60);
    }

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(init, 150); };
    window.addEventListener('resize', onResize);

    init();

    return () => {
      if (animFrame) cancelAnimationFrame(animFrame);
      window.removeEventListener('resize', onResize);
      scrubber?.removeEventListener('input', onScrub);
      scrubber?.removeEventListener('dblclick', onDblClick);
      document.body.style.background = '';
    };
  }, [targetWindSpeedRef]);

  // ── Scrubber visibility — watches SCRUBBER_CONFIG.visibleInSections ──────────
  // Re-runs on pathname change so observers are rebuilt when the DOM changes.
  useEffect(() => {
    const targets = SCRUBBER_CONFIG.visibleInSections
      .map(id => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (targets.length === 0) {
      setScrubberVisible(false);
      return;
    }

    const visible = new Set<string>();
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).id;
          if (entry.isIntersecting) visible.add(id);
          else visible.delete(id);
        }
        setScrubberVisible(visible.size > 0);
      },
      { threshold: 0.3 }
    );

    targets.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [pathname]);

  // ─── RENDER ─────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ASCII canvas */}
      <div
        ref={bgRef}
        style={{
          position: 'fixed',
          inset: 0,
          fontFamily: "'Space Mono', monospace",
          fontSize: '11px',
          lineHeight: '1.35',
          letterSpacing: '0.05em',
          whiteSpace: 'pre',
          overflow: 'hidden',
          pointerEvents: 'none',
          userSelect: 'none',
          zIndex: 0,
        }}
      />

      {/* Time indicator */}
      <div style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2.5rem',
        zIndex: 10,
        textAlign: 'right',
        fontFamily: "'Space Mono', monospace",
        pointerEvents: 'none',
        opacity: scrubberVisible ? 1 : 0,
        transition: `opacity ${SCRUBBER_CONFIG.fadeTransitionMs}ms ease`,
      }}>
        <span style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', display: 'block', marginBottom: '0.25rem' }}>
          Sky time
        </span>
        <span ref={timeValRef} style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.95)' }}>—</span>
        <span ref={timePhaseRef} style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.55)', display: 'block', marginTop: '0.2rem' }}>—</span>
      </div>

      {/* Time scrubber */}
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
          opacity: scrubberVisible ? 1 : 0,
          pointerEvents: scrubberVisible ? 'auto' : 'none',
          transition: `opacity ${SCRUBBER_CONFIG.fadeTransitionMs}ms ease`,
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
