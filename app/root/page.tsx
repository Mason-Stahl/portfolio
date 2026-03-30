'use client';

import SubpageNav from '../components/SubpageNav';
import HorizontalGallery, { sidePad, imageHeight } from '../components/HorizontalGallery';
import useBreakpoint from '../hooks/useBreakpoint';

const logoImages = [
  '/images/root/logo_draft.png',
  '/images/root/logo_process.png',
  '/images/root/logo_final.png',
];

const part1Images = [
  '/images/root/root_1.1.png',
  '/images/root/root_1.2.png',
  '/images/root/root_1.3.png',
];

const part2Images = [
  '/images/root/root_2.0.png',
  '/images/root/root_2.1.png',
];

const part4Images = [
  '/images/root/root_4.0.png',
  '/images/root/root_4.1.png',
];

const part5Images = [
  '/images/root/root_5.0_icon.png',
  '/images/root/root_5.1_login.png',
  '/images/root/root_5.2_home.png',
  '/images/root/root_5.3_profile.png',
  '/images/root/root_5.4_collection.png',
  '/images/root/root_5.5_add.png',
  '/images/root/root_5.6_comment.png',
  '/images/root/root_5.7_discovery.png',
  '/images/root/root_5.8_groups.png',
  '/images/root/root_5.9_chat.png',
  '/images/root/root_5.10_add.png',
  '/images/root/root_5.11_review.png',
  '/images/root/root_5.12_sucess.png',
];


export default function RootPage() {
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
        <h1 style={{ fontSize: bp === 'phone' ? '2rem' : '3rem', fontWeight: 'bold', margin: 0, paddingBottom: '2rem' }}>Root</h1>
      </div>

      {/* 1. Scope */}
      <div style={prose}>
        <p style={h2Style}>1. The Scope</p>
        <p style={h3Style}>Problem Statement</p>
        <p style={pStyle}>
          Music is one of the few universal human experiences, yet streaming and social media apps barely scratch the surface of how people identify with it. This project explores what a social platform built entirely around musical identity could look like — emphasizing exploration, growth, and authentic self-expression.
        </p>
        <p style={h3Style}>Target Audience</p>
        <p style={pStyle}>
          Connecting music lovers with the people and music they'll love.
        </p>
      </div>

      {/* 2. Ideation — Logo gallery */}
      <HorizontalGallery
        images={logoImages}
        id="root-logo-gallery"
        bp={bp}
        label={
          <>
            <p style={h2Style}>2. Ideation and Exploration</p>
            <p style={h3Style}>Research and Insights — The Logo</p>
            <p style={pStyle}>
              Before designing the app, I needed a visual identity. I wanted the logo to capture music, nature, identity, and connection simultaneously. I researched leaves, trees, and roots as references, brainstormed broadly, then iterated on the directions that felt truest to the concept.
            </p>
          </>
        }
      />

      {/* Part 1: Working Layout */}
      <div style={{ ...prose, marginTop: '4rem' }}>
        <p style={h3Style}>Part 1 — Working Layout</p>
        <p style={pStyle}>
          The priority here was structure — getting the core pages to function logically before worrying about aesthetics.
        </p>
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
          {part1Images.map((src, i) => (
            <img key={i} src={src} alt="" style={{ height: `${imageHeight[bp]}px`, width: 'auto' }} />
          ))}
        </div>
      </div>

      {/* Part 2: Increasing Fidelity */}
      <div style={{ ...prose, marginTop: '4rem' }}>
        <p style={h3Style}>Part 2 — Increasing Fidelity</p>
        <p style={pStyle}>
          With the layout established, I began refining the UI — tightening spacing, introducing visual hierarchy, and making it feel less like a wireframe.
        </p>
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
          {part2Images.map((src, i) => (
            <img key={i} src={src} alt="" style={{ height: `${imageHeight[bp]}px`, width: 'auto' }} />
          ))}
        </div>
      </div>

      {/* Part 3: Modernized Interface — single image, shown inline */}
      <div style={{ ...prose, marginTop: '4rem' }}>
        <p style={h3Style}>Part 3 — Modernized Interface</p>
        <p style={pStyle}>
          A visual overhaul pushing the design toward something more polished and contemporary.
        </p>
        <img
          src="/images/root/root_3.1.png"
          alt="Modernized interface"
          style={{ height: `${imageHeight[bp]}px`, width: 'auto', marginTop: '1.5rem' }}
        />
      </div>

      {/* Part 4: Pill Style */}
      <HorizontalGallery
        images={part4Images}
        id="root-part4-gallery"
        bp={bp}
        label={
          <>
            <p style={h3Style}>Part 4 — Layout Experimentation: Pill Style</p>
            <p style={pStyle}>
              I explored whether a softer, rounder UI language would feel more social and approachable, versus the harder edges of a more utilitarian interface.
            </p>
          </>
        }
      />

      {/* Part 5: Final Design Flow */}
      <HorizontalGallery
        images={part5Images}
        id="root-part5-gallery"
        bp={bp}
        label={
          <>
            <p style={h3Style}>Part 5 — Final Design Flow</p>
            <p style={pStyle}>
              The complete user experience: login, home, posts, collections, song view, comment threads, discover, messaging, group chats, post creation, rating, and feed.
            </p>
          </>
        }
      />

      {/* 3. Final Designs */}
      <div style={prose}>
        <p style={h2Style}>3. Final Designs</p>
        <a
          href="https://www.figma.com/proto/p9IKd3hxAG1iBZZwLBOspR?node-id=366-4503&t=qGmBVbg70FTOUiO2-6"
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
        <p style={h3Style}>Reflection</p>
        <p style={pStyle}>
          This has been a passion project of mine for years. I loved building it. If I would do it again, I would start with a cleaner Figma organization. Eventually I got there, but it would have saved me so much time if I made the initial effort upfront. Having an MVP like this has been invaluable to show people the idea I'm thinking of and getting feedback. 
        </p>
      </div>
    </div>
  );
}
