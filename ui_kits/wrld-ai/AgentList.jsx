function AgentRow({ agent, active, onSelect }) {
  const [hover, setHover] = React.useState(false);
  const statusColor = { healthy: 'var(--status-success)', degraded: 'var(--status-warning)', off: 'var(--fg-subtle)' }[agent.status];
  return (
    <div onClick={() => onSelect(agent.id)} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px',
        borderRadius: 8, border: '1px solid var(--border)',
        background: active ? 'var(--bg-subtle)' : 'var(--bg-elevated)',
        cursor: 'pointer', transition: 'all 200ms cubic-bezier(.2,.8,.2,1)',
        boxShadow: hover && !active ? 'var(--shadow-md), var(--shadow-accent-secondary)' : 'none',
        transform: hover && !active ? 'translateY(-1px)' : 'none',
      }}>
      <div style={{ width: 36, height: 36, borderRadius: 4, background: 'var(--bg-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <i data-lucide={agent.icon} style={{ width: 18, height: 18 }}></i>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ fontWeight: 600, fontSize: 14 }}>{agent.name}</div>
          <span style={{ width: 6, height: 6, background: statusColor, borderRadius: 99 }}></span>
        </div>
        <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 2 }}>{agent.summary}</div>
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)', textAlign: 'right' }}>
        <div>{agent.runs} runs</div>
        <div>{agent.lastRun}</div>
      </div>
    </div>
  );
}

export function AgentList({ agents, activeId, onSelect }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {agents.map(a => <AgentRow key={a.id} agent={a} active={activeId === a.id} onSelect={onSelect} />)}
    </div>
  );
}
window.AgentList = AgentList;
window.AgentRow = AgentRow;
