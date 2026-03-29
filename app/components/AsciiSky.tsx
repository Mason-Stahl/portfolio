'use client';

import { useEffect, useRef } from 'react';

// ─── CONFIG ───────────────────────────────────────────────────────────────────
// Characters drifting per second — 0 = static, 2 = gentle breeze, 8 = strong wind
const WIND_CHARS_PER_SEC = .5;
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
  const bgRef       = useRef<HTMLDivElement>(null);
  const timeValRef  = useRef<HTMLSpanElement>(null);
  const timePhaseRef= useRef<HTMLSpanElement>(null);
  const scrubberRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const bg = bgRef.current;
    if (!bg) return;

    let W = 0, H = 0, COLS = 0, ROWS = 0;
    let rowEls:    HTMLSpanElement[] = [];
    let rowSpeeds: number[] = [];   // per-row drift rate multiplier
    let animFrame: number | null = null;
    let simTime:   number | null = null;
    let lastTs = 0;
    let driftX = 0;  // global horizontal noise coordinate offset
    let driftY = 0;  // global vertical noise coordinate offset (slow)

    function getHour(): number {
      if (simTime !== null) return simTime;
      const now = new Date();
      return now.getHours() + now.getMinutes()/60 + now.getSeconds()/3600;
    }

    function init() {
      W = window.innerWidth;
      H = window.innerHeight;

      // Measure actual rendered character width to fill the screen precisely
      const probe = document.createElement('span');
      probe.style.cssText = "font-family:'Space Mono',monospace;font-size:11px;letter-spacing:0.05em;position:absolute;visibility:hidden;white-space:pre";
      probe.textContent = 'X'.repeat(200);
      document.body.appendChild(probe);
      const measured = probe.offsetWidth / 200;
      document.body.removeChild(probe);
      // Guard against 0 (font not yet loaded) with a safe fallback
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
        // Rows near the top drift faster (atmospheric parallax)
        const t = r / ROWS;
        rowSpeeds.push((0.4 + Math.random() * 0.6) * (1 - t * 0.5));
      }

      if (animFrame) cancelAnimationFrame(animFrame);
      lastTs = 0;
      animFrame = requestAnimationFrame(loop);
    }

    function loop(ts: number) {
      // First frame: sync timestamp without advancing drift (prevents initial spike)
      const dt = lastTs === 0 ? 0 : Math.min(ts - lastTs, 50);
      lastTs = ts;

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

      // Advance global drift — sinusoidal gust modulates horizontal speed
      const windPerMs = WIND_CHARS_PER_SEC / 1000;
      const globalGust = 1 + 0.3 * Math.sin(ts * 0.0004);
      driftX += windPerMs * dt * globalGust;
      driftY += windPerMs * dt * 0.04; // very slow vertical creep

      for (let r = 0; r < ROWS; r++) {
        const rowFrac = r / ROWS;
        // Each row samples the noise field at its own horizontal offset,
        // creating parallax without physically scrolling any DOM element
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

        // One color per row — eliminates all nested span overhead
        const avgDensity = totalDensity / COLS;
        const colorT = avgDensity * 0.7 + (1 - rowFrac) * 0.15;
        const col = lerpColor(palette.lo, palette.hi, Math.max(0, Math.min(1, colorT)));
        rowEls[r].style.color = `rgb(${col.join(',')})`;
        rowEls[r].textContent = line;
      }

      animFrame = requestAnimationFrame(loop);
    }

    // scrubber wiring
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

    // resize
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
  }, []);

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
      }}>
        <span style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', display: 'block', marginBottom: '0.25rem' }}>
          Sky time
        </span>
        <span ref={timeValRef} style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.95)' }}>—</span>
        <span ref={timePhaseRef} style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.55)', display: 'block', marginTop: '0.2rem' }}>—</span>
      </div>

      {/* Time scrubber */}
      <div style={{
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
      }}>
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
          }}
        />
      </div>
    </>
  );
}
