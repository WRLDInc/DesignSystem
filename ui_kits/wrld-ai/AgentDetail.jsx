export function AgentDetail({ agent, runs }) {
  if (!agent) return null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24 }}>
        <div>
          <div className="eyebrow" style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-muted)', marginBottom: 8 }}>Agent · {agent.id}</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 24, letterSpacing: '-0.02em', margin: 0, marginBottom: 8 }}>{agent.name}</h2>
          <p style={{ fontSize: 14, color: 'var(--fg-muted)', maxWidth: 640, margin: 0, lineHeight: 1.55 }}>{agent.description}</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{ fontSize: 13, fontWeight: 500, padding: '8px 14px', borderRadius: 4, border: '1px solid var(--border-strong)', background: 'transparent', cursor: 'pointer' }}>Edit prompt</button>
          <button style={{ fontSize: 13, fontWeight: 500, padding: '8px 14px', borderRadius: 4, border: '1px solid var(--fg)', background: 'var(--fg)', color: 'var(--fg-inverse)', cursor: 'pointer' }}>Run now</button>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        <StatCard label="Runs · 30d" value="284" delta="12% wow" deltaPositive />
        <StatCard label="Avg duration" value="3.2s" delta="0.4s wow" deltaPositive />
        <StatCard label="Success rate" value="98.6%" delta="0.2pp wow" deltaPositive />
        <StatCard label="Cost · 30d" value="$14.20" delta="2% wow" />
      </div>
      <RunHistory runs={runs} />
    </div>
  );
}
window.AgentDetail = AgentDetail;
