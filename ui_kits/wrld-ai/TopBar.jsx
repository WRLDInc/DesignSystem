export function TopBar({ title, subtitle }) {
  return (
    <div style={{ borderBottom: '1px solid var(--border)', padding: '24px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div>
        <div className="eyebrow" style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-muted)', marginBottom: 6 }}>{subtitle}</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 28, letterSpacing: '-0.02em', margin: 0 }}>{title}</h1>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500, padding: '8px 14px', borderRadius: 4, border: '1px solid var(--border-strong)', background: 'transparent', cursor: 'pointer' }}>Export</button>
        <button style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500, padding: '8px 14px', borderRadius: 4, border: '1px solid var(--fg)', background: 'var(--fg)', color: 'var(--fg-inverse)', cursor: 'pointer' }}>+ New agent</button>
      </div>
    </div>
  );
}
window.TopBar = TopBar;
