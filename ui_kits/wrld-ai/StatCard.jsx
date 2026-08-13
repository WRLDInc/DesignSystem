export function StatCard({ label, value, delta, deltaPositive }) {
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 8, padding: 20, background: 'var(--bg-elevated)' }}>
      <div className="eyebrow" style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-muted)', marginBottom: 10 }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 32, letterSpacing: '-0.02em', lineHeight: 1.1 }}>{value}</div>
      {delta && (
        <div style={{ marginTop: 6, fontFamily: 'var(--font-mono)', fontSize: 12, color: deltaPositive ? 'var(--status-success)' : 'var(--fg-muted)' }}>
          {deltaPositive ? '↑' : '↓'} {delta}
        </div>
      )}
    </div>
  );
}
window.StatCard = StatCard;
