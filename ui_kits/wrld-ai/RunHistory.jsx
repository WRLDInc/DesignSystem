function RunHistory({ runs }) {
  const statusBg = {
    success: { bg: '#ecfdf5', fg: '#065f46', dot: 'var(--status-success)' },
    running: { bg: 'var(--bg-muted)', fg: 'var(--fg)', dot: 'var(--accent-secondary)' },
    failed:  { bg: '#fef2f2', fg: '#991b1b', dot: 'var(--status-danger)' },
  };
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
      <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', background: 'var(--bg-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 600, fontSize: 14 }}>Recent runs</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)' }}>last 24h</div>
      </div>
      <div>
        {runs.map((r, i) => {
          const s = statusBg[r.status];
          return (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '120px 1fr 100px 80px', gap: 16, alignItems: 'center', padding: '12px 20px', borderTop: i === 0 ? 'none' : '1px solid var(--border)', fontSize: 13 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '2px 8px', borderRadius: 9999, fontSize: 11, fontWeight: 500, background: s.bg, color: s.fg, width: 'fit-content' }}>
                <span style={{ width: 6, height: 6, background: s.dot, borderRadius: 99 }}></span>{r.status}
              </span>
              <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.summary}</div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)' }}>{r.duration}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)', textAlign: 'right' }}>{r.time}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
window.RunHistory = RunHistory;
