function Sidebar({ active, onNavigate }) {
  const items = [
    { id: 'agents', label: 'Agents', icon: 'bot' },
    { id: 'runs', label: 'Run history', icon: 'activity' },
    { id: 'data', label: 'Data sources', icon: 'database' },
    { id: 'integrations', label: 'Integrations', icon: 'plug' },
    { id: 'team', label: 'Team', icon: 'users' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
  ];
  return (
    <aside style={{
      width: 240, borderRight: '1px solid var(--border)', background: 'var(--bg-subtle)',
      padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: 6,
      height: '100vh', position: 'sticky', top: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 8px', marginBottom: 20 }}>
        <Lockup sub="AI" size={16} />
      </div>
      <div className="eyebrow" style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-muted)', padding: '0 8px', marginBottom: 4 }}>Workspace</div>
      {items.map(it => {
        const isActive = active === it.id;
        return (
          <a key={it.id} onClick={() => onNavigate(it.id)} style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px',
            borderRadius: 4, fontSize: 14, fontWeight: 500, cursor: 'pointer',
            textDecoration: 'none',
            color: isActive ? 'var(--fg)' : 'var(--fg-muted)',
            background: isActive ? 'var(--bg)' : 'transparent',
            border: isActive ? '1px solid var(--border)' : '1px solid transparent',
          }}>
            <i data-lucide={it.icon} style={{ width: 16, height: 16 }}></i>
            <span>{it.label}</span>
          </a>
        );
      })}
      <div style={{ marginTop: 'auto', padding: '12px 10px', borderTop: '1px solid var(--border)', fontSize: 12, color: 'var(--fg-muted)' }}>
        <div style={{ fontWeight: 500, color: 'var(--fg)' }}>Acme Roofing</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>Pro plan · 12 agents</div>
      </div>
    </aside>
  );
}
window.Sidebar = Sidebar;
