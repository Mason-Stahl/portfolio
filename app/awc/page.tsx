'use client';

import SubpageNav from '../components/SubpageNav';
import { sidePad, imageHeight } from '../components/HorizontalGallery';
import useBreakpoint from '../hooks/useBreakpoint';

const awcImages: { src: string; label: string }[] = [
  { src: '/images/awc/awc_home.png', label: 'Home' },
  { src: '/images/awc/awc_brands.png', label: 'Companies'  },
  { src: '/images/awc/awc_brand_home.png', label: 'Company Page - Contribute to Org Campaigns' },
  { src: '/images/awc/awc_action.png', label: 'Take Action - Contribute Individually' },
  { src: '/images/awc/awc_ai_action.png', label: 'AI Generated Action Scripts' },
  { src: '/images/awc/awc_login.png', label: 'Login' },
  { src: '/images/awc/awc_org_home.png', label: 'Org Personalized Home' },
  { src: '/images/awc/awc_org_panel_1.png', label: 'Org Panel 1 - Overview' },
  { src: '/images/awc/awc_org_panel_2.png', label: 'Org Panel 2 - With links to references' },
  { src: '/images/awc/awc_org_panel_3.png', label: 'Org Panel 3 - Add information' },
];

export default function AWCPage() {
  const bp = useBreakpoint();
  const pad = sidePad[bp];

  const prose: React.CSSProperties = {
    maxWidth: '100%',
    paddingLeft: pad,
    paddingRight: pad,
    lineHeight: 1.7,
  };

  const h2Style: React.CSSProperties = {
    fontSize: bp === 'phone' ? '0.85rem' : '1.1rem',
    fontWeight: 'bold',
    marginTop: '3rem',
    marginBottom: '0.5rem',
    opacity: 0.5,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
  };

  const h3Style: React.CSSProperties = {
    fontSize: bp === 'phone' ? '0.95rem' : '1.1rem',
    fontWeight: 'bold',
    marginTop: '1.5rem',
    marginBottom: '0.4rem',
    color: 'rgba(255,255,255,1)',
  };

  const pStyle: React.CSSProperties = {
    fontSize: bp === 'phone' ? '0.8rem' : '0.95rem',
    color: 'rgba(255,255,255,0.75)',
    marginBottom: '1rem',
  };

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
        <h1 style={{ fontSize: bp === 'phone' ? '2rem' : '3rem', fontWeight: 'bold', margin: 0, paddingBottom: '2rem' }}>At What Cost</h1>
      </div>

      {/* 1. Scope */}
      <div style={prose}>
        <p style={h2Style}>1. The Scope</p>
        <p style={h3Style}>Problem Statement</p>
        <p style={pStyle}>
          Corporate animal welfare commitments get made, deadlines pass, and nothing happens. At What Cost closes that loop — publicly for consumers, and with serious depth for advocacy organizations running campaigns.
        </p>
        <p style={h3Style}>What It Does</p>
        <p style={pStyle}>
          Public users can browse corporate animal welfare commitments, track accountability scores, see upcoming deadlines, and take one-tap actions (generated email and call scripts) on top of advocacy campaign's actions.
        </p>
        <p style={pStyle}>
          Authenticated organizations get deeper access: company dossiers scoped to their saved watchlist, and OSINT reports generated automatically to support campaign research.
        </p>
      </div>

      {/* Image grid */}
      <div style={{ paddingLeft: pad, paddingRight: pad, marginTop: '6rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(auto-fill, minmax(${imageHeight[bp]}px, 1fr))`,
          gap: '3rem',
        }}>
          {awcImages.map(({ src, label }) => (
            <div key={src} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
              <img src={src} alt={label} style={{ width: '100%', height: 'auto', maxHeight: '800px', objectFit: 'contain', display: 'block' }} />
              <p style={{ fontSize: bp === 'phone' ? '0.7rem' : '0.8rem', color: 'rgba(255,255,255,0.5)', margin: 0, textAlign: 'center' }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Final Designs */}
      <div style={{ ...prose, marginTop: '6rem' }}>
        <p style={h2Style}>Production Build</p>
        <a
          href="watchdog.masonstahl.com"
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
        <p style={h3Style}>94% of cagefree and broiler commitments tracked. 2 organizations onboarded.</p>
        <p style={h3Style}>Reflection:</p>
        <p style={pStyle}>
          It feels good to be using AI for a positive impact, animal welfare. Additionally corporate accountability can be expanded beyong animal welfare commitments anywhere from ESG to inclusivity. It's interesting problem discovery was more difficult then the development. I had 2 teammates but was responsible for the frontend, backend, and user research. Teammates handled design and live-scraping. 
        </p>
      </div>
    </div>
  );
}
