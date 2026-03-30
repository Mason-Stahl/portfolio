'use client';

import TransitionLink from './TransitionLink';

interface SubpageNavProps {
  backHref: string;
  scrollTo?: string;
}

export default function SubpageNav({ backHref, scrollTo }: SubpageNavProps) {
  return (
    <div style={{
      position: 'sticky',
      top: 0,
      zIndex: 10,
      display: 'flex',
      alignItems: 'center',
      padding: '1rem 4rem',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      backgroundColor: 'rgba(0,0,0,0.35)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      fontFamily: "'Space Mono', monospace",
    }}>
      <TransitionLink href={backHref} direction="right" scrollTo={scrollTo} className="text-sm opacity-50 hover:opacity-100 transition-opacity">
        ← Back
      </TransitionLink>
    </div>
  );
}
