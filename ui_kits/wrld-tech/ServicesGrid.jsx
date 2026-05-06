function ServiceCard({ sub, body, href }) {
  const [hover, setHover] = React.useState(false);
  return (
    <a href={href} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: 'block', padding: 24, borderRadius: 8,
        background: 'var(--bg-elevated)', border: '1px solid var(--border)',
        textDecoration: 'none', color: 'var(--fg)',
        transition: 'all 200ms cubic-bezier(.2,.8,.2,1)',
        boxShadow: hover ? 'var(--shadow-md), var(--shadow-accent-primary)' : 'none',
        transform: hover ? 'translateY(-2px)' : 'none',
      }}>
      <div style={{ marginBottom: 20 }}><Lockup sub={sub} size={18} /></div>
      <div style={{ fontSize: 13, lineHeight: 1.55, color: 'var(--fg-muted)' }}>{body}</div>
      <div style={{ marginTop: 18, fontFamily: 'var(--font-mono)', fontSize: 11, color: hover ? 'var(--accent-primary)' : 'var(--fg-subtle)', display: 'flex', justifyContent: 'space-between' }}>
        <span>{href.replace('https://', '')}</span><span>↗</span>
      </div>
    </a>
  );
}

function ServicesGrid() {
  const services = [
    { sub: 'HOST',     body: 'Clustered, ethically-operated hosting. Reserved for clients and approved partners.', href: 'https://wrld.host' },
    { sub: 'DESIGN',   body: 'Design that ships. We build the sites we design, and we build them to work.',       href: 'https://wrld.design' },
    { sub: 'AI',       body: 'Tailored agents tuned by humans who know your operations.',                          href: 'https://wrld.ai' },
    { sub: 'SERVICES', body: '24/7 monitoring, patching, and proactive infrastructure care.',                      href: 'https://services.wrld.tech' },
    { sub: 'SUPPORT',  body: 'Real humans on the other end of every ticket. SLA-backed.',                          href: 'https://support.wrld.tech' },
    { sub: 'PRESS',    body: 'Premium WordPress hosting with WRLD-tuned plugins.',                                  href: 'https://wrld.press' },
  ];
  return (
    <section style={{ padding: '64px 32px', maxWidth: 1280, margin: '0 auto', borderTop: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 32 }}>
        <Eyebrow>What we do</Eyebrow>
        <div style={{ fontSize: 13, color: 'var(--fg-muted)' }}>Six service branches. One partner.</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {services.map(s => <ServiceCard key={s.sub} {...s} />)}
      </div>
    </section>
  );
}
window.ServicesGrid = ServicesGrid;
window.ServiceCard = ServiceCard;
