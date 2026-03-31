'use client';

import SubpageNav from '../components/SubpageNav';
import { sidePad, imageHeight } from '../components/HorizontalGallery';
import useBreakpoint from '../hooks/useBreakpoint';
import { useSubpageStyles } from '../hooks/useSubpageStyles';

const ttdImages: { src: string; label: string }[] = [
  { src: '/images/ttd/lobby.png', label: 'Lobby' },
  { src: '/images/ttd/searching.png', label: 'Searching...' },
  { src: '/images/ttd/game.png', label: 'Game Board' },
]

export default function TTDPage() {
  const bp = useBreakpoint();
  const pad = sidePad[bp];
  const { prose, h2Style, h3Style, pStyle, captionStyle } = useSubpageStyles(bp, pad);

  return (
    <div
      style={{
        position: 'relative',
        zIndex: 2,
        minHeight: '100vh',
        fontFamily: "'Space Mono', monospace",
        paddingBottom: '8rem',
      }}
    >
      <SubpageNav backHref="/" scrollTo="ai-applications" />

      {/* Header */}
      <div style={{ paddingTop: '3rem', paddingLeft: pad }}>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: bp === 'phone' ? '0.85rem' : '1.1rem', marginBottom: '0.25rem' }}>AI Applications</p>
        <h1 style={{ fontSize: bp === 'phone' ? '2rem' : '3rem', fontWeight: 'bold', margin: 0, paddingBottom: '2rem' }}>To The Death</h1>
      </div>

      {/* 1. Scope */}
      <div style={prose}>
        <p style={h2Style}>1. The Scope</p>
        <p style={h3Style}>Problem Statement</p>
        <p style={pStyle}>
Create an online multiplayer version of the boardgame that my friend is creating, so that we can playtest remotely. 
        </p>
        <p style={h3Style}>What It Does</p>
        <p style={pStyle}>
Inlcudes lobbies to play with friends, and a computer bot to play against (who is not completelty random) 
        </p>
      </div>

      {/* Image grid */}
      <div style={{ paddingLeft: pad, paddingRight: pad, marginTop: '6rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(auto-fill, minmax(${imageHeight[bp]}px, 1fr))`,
          gap: '3rem',
        }}>
          {ttdImages.map(({ src, label }) => (
            <div key={src} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
              <img src={src} alt={label} style={{ width: '100%', height: 'auto', maxHeight: '800px', objectFit: 'contain', display: 'block' }} />
              <p style={captionStyle}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Final Designs */}
      <div style={{ ...prose, marginTop: '6rem' }}>
        <p style={h2Style}>Production Build</p>
        <a
          href="https://tothedeath.masonstahl.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'rgba(255, 255, 255, 0.86)', fontSize: '0.85rem', textDecoration: 'underline' }}
        >
          View App →
        </a>
      </div>

      {/* 4. Results */}
      <div style={{ ...prose, marginTop: '6rem' }}>
        <p style={h2Style}>4. Results and Impact</p>
        <p style={h3Style}>Reflection:</p>
        <p style={pStyle}>
It's such a fun game. Getting the board properly displayed and clickable was challanging. However, getting turns to sync across two browsers, the order of operations of listeners and updating game states, was the most challanging aspect. Once everything was built however, adding the bot was surprisingly simple, and so was deploying, getting it to be playable over the internet. I figured the dev to build change would throw huge challanges, but it was not. Learned cloudflare workers and KV for this, and found it very interesting.  
        </p>
      </div>
    </div>
  );
}
