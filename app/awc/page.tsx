import TransitionLink from '../components/TransitionLink';

export default function AWCPage() {
  return (
    <div
      style={{
        position: 'relative',
        zIndex: 2,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '2rem',
        fontFamily: "'Space Mono', monospace",
      }}
    >
      <h1 style={{ fontSize: '3rem', fontWeight: 'bold' }}>At What Cost</h1>
      <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem' }}>AI Application</p>
      <TransitionLink href="/" className="text-sm opacity-50 hover:opacity-100 transition-opacity">
        ← Back
      </TransitionLink>
    </div>
  );
}
