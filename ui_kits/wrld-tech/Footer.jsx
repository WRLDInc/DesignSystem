function Footer() {
  const cols = [
    { title: 'Services', items: ['Hosting', 'Design', 'AI', 'Managed IT', 'Support', 'Press'] },
    { title: 'Company', items: ['About', 'Values', 'Contact', 'Careers'] },
    { title: 'Resources', items: ['Client portal', 'Status', 'Brand kit', 'Privacy'] },
  ];
  return (
    <footer style={{ borderTop: '1px solid var(--border)', padding: '48px 32px 32px', maxWidth: 1280, margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 32 }}>
        <div>
          <div style={{ marginBottom: 16 }}><Lockup size={20} /></div>
          <div style={{ fontSize: 13, color: 'var(--fg-muted)', maxWidth: 320, lineHeight: 1.55 }}>
            WRLD Tech Co., a DBA of WRLD Inc. SMB business technology, automation, and AI solutions.
          </div>
        </div>
        {cols.map(c => (
          <div key={c.title}>
            <div className="eyebrow" style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-muted)', marginBottom: 12 }}>{c.title}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {c.items.map(i => <a key={i} href="#" style={{ fontSize: 13, color: 'var(--fg)', textDecoration: 'none' }}>{i}</a>)}
            </div>
          </div>
        ))}
      </div>
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)' }}>
        <span>© 2026 WRLD Inc. · EIN 84-5122446 · Dallas, TX</span>
        <span>v0.1.0</span>
      </div>
    </footer>
  );
}
window.Footer = Footer;
