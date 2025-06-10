export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #000000 0%, #111111 100%)',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '100', marginBottom: '1rem' }}>
          🚀 Agentic Web
        </h1>
        <p style={{ fontSize: '1.5rem', color: '#00D4FF', marginBottom: '2rem' }}>
          Chat Stream Engine Demo
        </p>
        <div style={{
          background: 'rgba(0, 212, 255, 0.1)',
          border: '1px solid rgba(0, 212, 255, 0.3)',
          borderRadius: '12px',
          padding: '2rem',
          maxWidth: '600px'
        }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
            🌐 Protocol-Native AI Infrastructure
          </h2>
          <p style={{ lineHeight: '1.6', marginBottom: '1.5rem' }}>
            Experience the future of web interaction with our revolutionary
            Conversational Scroll Engine. Content streams in progressively
            as you scroll, creating an immersive, chat-like experience.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button style={{
              background: 'linear-gradient(135deg, #00D4FF 0%, #8B5CF6 100%)',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              color: 'white',
              fontWeight: '500',
              cursor: 'pointer'
            }}>
              🚀 Initialize Protocol
            </button>
            <button style={{
              background: 'transparent',
              border: '1px solid #00D4FF',
              borderRadius: '8px',
              padding: '12px 24px',
              color: '#00D4FF',
              cursor: 'pointer'
            }}>
              📄 Parse Website
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
