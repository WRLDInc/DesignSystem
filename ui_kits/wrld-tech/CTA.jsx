function CTA() {
  return (
    <section style={{ padding: '0 32px' }}>
      <div style={{
        maxWidth: 1280, margin: '64px auto', padding: '80px 64px',
        background: 'var(--mono-950)', color: 'var(--mono-50)', borderRadius: 8,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 48,
      }}>
        <div>
          <div className="eyebrow" style={{ color: 'var(--mono-400)', fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>Get in touch</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, letterSpacing: '-0.02em', fontSize: 44, lineHeight: 1.1, margin: 0, maxWidth: 640 }}>
            Tech that moves with you.
          </h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-end' }}>
          <button style={{
            fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500,
            padding: '14px 22px', borderRadius: 4, cursor: 'pointer',
            background: 'var(--mono-50)', color: 'var(--mono-950)', border: 'none',
          }}>Start a conversation →</button>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--mono-400)' }}>ridge@wrld.tech · Dallas, TX</div>
        </div>
      </div>
    </section>
  );
}
window.CTA = CTA;
