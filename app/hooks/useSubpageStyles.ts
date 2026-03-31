'use client';

import { type Breakpoint } from '../components/HorizontalGallery';

export function useSubpageStyles(bp: Breakpoint, pad: string) {
  const isPhone = bp === 'phone';

  const prose: React.CSSProperties = {
    maxWidth: '100%',
    paddingLeft: pad,
    paddingRight: pad,
    lineHeight: 1.7,
  };

  const h2Style: React.CSSProperties = {
    fontSize: isPhone ? '0.85rem' : '1.1rem',
    fontWeight: 'bold',
    marginTop: '3rem',
    marginBottom: '0.5rem',
    opacity: 0.5,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
  };

  const h3Style: React.CSSProperties = {
    fontSize: isPhone ? '0.95rem' : '1.1rem',
    fontWeight: 'bold',
    marginTop: '1.5rem',
    marginBottom: '0.4rem',
    color: 'rgba(255,255,255,1)',
  };

  const pStyle: React.CSSProperties = {
    fontSize: isPhone ? '0.8rem' : '0.95rem',
    color: 'rgba(255,255,255,0.75)',
    marginBottom: '1rem',
  };

  const captionStyle: React.CSSProperties = {
    fontSize: isPhone ? '0.7rem' : '0.8rem',
    color: 'rgba(255,255,255,0.5)',
    margin: 0,
    textAlign: 'center',
  };

  return { prose, h2Style, h3Style, pStyle, captionStyle };
}
