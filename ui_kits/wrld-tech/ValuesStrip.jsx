function ValuesStrip() {
  const values = [
    { num: '01', title: 'Move with urgency', body: 'Responsiveness is a feature, not a favor.' },
    { num: '02', title: 'Innovation at the edge', body: 'Adopt new tools early — but ship, don\u2019t experiment.' },
    { num: '03', title: 'Foundational integrity', body: 'Transparency is non-negotiable.' },
    { num: '04', title: 'Excellence by action', body: 'Quality is proved by outcomes, not promises.' },
    { num: '05', title: 'Collaboration & humility', body: 'Over-communicate. Stay approachable.' },
  ];
  return (
    <section style={{ padding: '80px 32px', maxWidth: 1280, margin: '0 auto', borderTop: '1px solid var(--border)' }}>
      <Eyebrow>How we work</Eyebrow>
      <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, letterSpacing: '-0.02em', fontSize: 40, lineHeight: 1.1, margin: '16px 0 40px', maxWidth: 720 }}>
        Five values, equally weighted. They shape every design and copy decision.
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 24 }}>
        {values.map(v => (
          <div key={v.num} style={{ borderTop: '1px solid var(--fg)', paddingTop: 16 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)', marginBottom: 8 }}>{v.num}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16, letterSpacing: '-0.02em', marginBottom: 6 }}>{v.title}</div>
            <div style={{ fontSize: 13, lineHeight: 1.55, color: 'var(--fg-muted)' }}>{v.body}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
window.ValuesStrip = ValuesStrip;
