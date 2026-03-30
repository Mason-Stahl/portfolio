'use client';

import SubpageNav from '../components/SubpageNav';
import HorizontalGallery, { sidePad } from '../components/HorizontalGallery';
import useBreakpoint from '../hooks/useBreakpoint';

const refImages = [
  '/images/tak/ref_1.png',
  '/images/tak/ref_2.png',
  '/images/tak/ref_3.png',
  '/images/tak/ref_4.png',
  '/images/tak/ref_5.png',
  '/images/tak/ref_6.png',
];

const takImages = [
  '/images/tak/tak_components.png',
  '/images/tak/tak_camera.png',
  '/images/tak/tak_camera_2.png',
  '/images/tak/tak_keyboard.png',
];


export default function TAKPage() {
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
        <h1 style={{ fontSize: bp === 'phone' ? '2rem' : '3rem', fontWeight: 'bold', margin: 0, paddingBottom: '2rem' }}>TAK SafeOps</h1>
      </div>

      {/* 1. Scope */}
      <div style={prose}>
        <p style={h2Style}>1. The Scope</p>
        <p style={h3Style}>Problem Statement</p>
        <p style={pStyle}>
          On the ground soldiers have an archaic system for assessing threats and receiving proper precautionary steps before and during entry of unknown areas. With many different types of dangers in hostile environments, the versatility of an app would be able to provide soldiers with faster, more reliable, and more specific instructions on how to proceed through missions safely, helping to protect the lives of American soldiers.
        </p>
        <p style={h3Style}>Target Audience</p>
        <p style={pStyle}>
          Soldiers in hostile areas, navigating the app on tablets. There is already a DOD software ecosystem, so the app should fit in with the design that they are already familiar with. It should also be designed with equipment in mind (big gloves, goggles) — not for everyday citizens.
        </p>
      </div>

      {/* Reference image gallery */}
      <HorizontalGallery
        images={refImages}
        id="ref-gallery"
        bp={bp}
        label={
          <>
            <p style={h2Style}>2. Ideation and Exploration</p>
            <p style={h3Style}>Research and Insights</p>
            <p style={pStyle}>
              I couldn't find much information on what TAK apps look like, but I was able to find a YouTube video showcasing some of the tools, so I used this as a reference for the visual layout. I observed blocky, simple buttons with logos. Layout has a 1 main focus, typically a map or tactical content, and a scrollable sidebar on the right or bottom. Informed my insight: Usability over Aesthetics.  
            </p>
          </>
        }
      />

      {/* TAK design image gallery */}
      <HorizontalGallery
        images={takImages}
        id="tak-gallery"
        bp={bp}
        label={
          <>
            <p style={h3Style}>Sketches / Wireframes</p>
            <p style={pStyle}>
              Making a dynamic and easily scalable system for multi-select buttons, drop downs, and toggles. Example flow for scanning and potentially labeling objects from camera.
            </p>
          </>
        }
      />

      {/* Design decisions */}
      <div style={prose}>
        <p style={h3Style}>Design Decisions</p>
        <p style={pStyle}>
          I copied as much visually from the TAK screenshots as I could. I made the prototype as compact while thorough to give a professional a complete understanding without needing an explanation.
        </p>
        <p style={pStyle}>
          Using a preestablished brand style made this process easier, but it still meant I had to be careful about what elements I decided to take. From the limited tools I could see, I decided to make yellow for highlights or titles and blue to indicate clickable areas. I cannot confirm this was how the TAK system worked but it made sense to me and the few (non-military) people I was able to test with.
        </p>
      </div>

      {/* 3. Final Designs */}
      <div style={prose}>
        <p style={h2Style}>3. Final Designs</p>
        <a
          href="https://www.figma.com/proto/RGll2QG2hQ7pjnyfagyzcc/TAK-app?node-id=9-667&starting-point-node-id=9%3A667"
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
        <p style={{ ...pStyle, fontStyle: 'italic' }}>"looks great, exactly what I was thinking" -Field Operator, Project Owner</p>
        <p style={h3Style}>Reflection</p>
        <p style={pStyle}>
          I have not designed an app for an android tablet before. Finding the dimensions of the screen was simple, but how the status bar at the top and menu bars affected the available space proved to be rather annoying, and I switched sizes unintentionally multiple times throughout. If I was to do it again differently, I would make sure that I have the proper dimensions and space for elements clearly marked out with sizes first, get that consistent — then proceed.
        </p>
        <p style={pStyle}>
          I'm proud of the mock-up, and am happy with where it can go.
        </p>
      </div>

    </div>
  );
}
