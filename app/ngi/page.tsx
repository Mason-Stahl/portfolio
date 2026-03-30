'use client';

import SubpageNav from '../components/SubpageNav';
import HorizontalGallery, { sidePad } from '../components/HorizontalGallery';
import useBreakpoint from '../hooks/useBreakpoint';

const designImages = [
  '/images/ngi/ngi_0.png',
  '/images/ngi/ngi_1.png',
  '/images/ngi/ngi_2.png',
  '/images/ngi/ngi_3.png',
  '/images/ngi/ngi_4.png',
];

const refImages = [
  '/images/ngi/ngi_design_1.png',
  '/images/ngi/ngi_design_2.png',
];


export default function NGIPage() {
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
      <SubpageNav backHref="/" scrollTo="designs" />

      {/* Header */}
      <div style={{ paddingTop: '3rem', paddingLeft: pad }}>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: bp === 'phone' ? '0.85rem' : '1.1rem', marginBottom: '0.25rem' }}>Design</p>
        <h1 style={{ fontSize: bp === 'phone' ? '2rem' : '3rem', fontWeight: 'bold', margin: 0, paddingBottom: '2rem' }}>NGI</h1>
      </div>

      {/* 1. Scope */}
      <div style={prose}>
        <p style={h2Style}>1. The Scope</p>
        <p style={h3Style}>Problem Statement</p>
        <p style={pStyle}>
          Founder approached me with idea to create a forum and newsletter specifically for up and coming breakthroughs in technology. My responsability would be to establish the brand by designing the logo, the MVP, and the content for the site. 
        </p>
        <p style={h3Style}>Target Audience</p>
        <p style={pStyle}>
          The forum would be for technical, yet curious people. 'Whether you're a startup on the verge of something great or an enthusiast eager to explore what's next.'
        </p>
      </div>

      {/* Reference image gallery */}
      <HorizontalGallery
        images={refImages}
        id="ngi-ref-gallery"
        bp={bp}
        label={
          <>
            <p style={h2Style}>2. Ideation and Exploration</p>
            <p style={h3Style}>Research and Insights</p>
            <p style={pStyle}>
              Throughout this process I was in contact with the developer, I had to present this information in a way that would be accessible when building, as well as making sure the designs were not too complex to be built. This structure, also grounded my Figma designs to be incredibly organized, with auto-layout and future dev in mind.
            </p>
          </>
        }
      />

      {/* Design image gallery */}
      <HorizontalGallery
        images={designImages}
        id="ngi-design-gallery"
        bp={bp}
        label={
          <>
            <p style={h3Style}>Sketches / Wireframes</p>
            <p style={pStyle}>
              The glassy look was to 'reflect' openness and transparency. It also refrences the mission of being on the 'cutting edge' of technology. Blue felt the most modern and tech focused. The triangular angles kept it hard and grounded vs abstract or organic shapes. Strong focus was designing with clear CTAs in mind to get parties interested.  Themes of futurism, technology, clean, modern. 
            </p>
          </>
        }
      />

      {/* 3. Final Designs */}
      <div style={prose}>
        <p style={h2Style}>3. Final Designs</p>
        <a
          href="https://www.figma.com/design/vOsEtUsyhVGeXPj7TulCZh/NGI.com?node-id=29-86&t=rTJpBstVk9BJ8iPy-0"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', textDecoration: 'underline' }}
        >
          View Figma Prototype →
        </a>
      </div>

      {/* 4. Results */}
      <div style={prose}>
        <p style={h2Style}>4. Results and Impact</p>
        <p style={h3Style}>User Feedback</p>
        <p style={{ ...pStyle, fontStyle: 'italic' }}>"So much better than I was imagining" - Founder/Product Owner</p>
        <p style={h3Style}>Reflection</p>
        <p style={pStyle}>
          Much of what I learned through this process was not design-focused, but work-focused. As this was my first freelance experience, time-tracking, budgeting, contracting were all new concepts to me. I failed to execute them perfectly, but that taught me their importance.
        </p>
      </div>
    </div>
  );
}
