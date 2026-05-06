function Eyebrow({ children, style }) {
  return <div className="eyebrow" style={{
    fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500,
    letterSpacing: '0.12em', textTransform: 'uppercase',
    color: 'var(--fg-muted)', ...style
  }}>{children}</div>;
}
window.Eyebrow = Eyebrow;
