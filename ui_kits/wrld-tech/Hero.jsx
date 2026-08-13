export function Hero() {
  return (
    <section style={{ padding: '120px 32px 80px', maxWidth: 1280, margin: '0 auto' }}>
      <Eyebrow>WRLD · Tech · Design · Support</Eyebrow>
      <h1 style={{
        fontFamily: 'var(--font-display)', fontWeight: 600, letterSpacing: '-0.02em',
        fontSize: 'clamp(2.5rem, 1.5rem + 4vw, 5rem)', lineHeight: 1.05,
        margin: '20px 0 24px', maxWidth: 900, textWrap: 'balance',
      }}>
        Your strategic partner in technology and business growth.
      </h1>
      <p style={{
        fontSize: 20, lineHeight: 1.55, color: 'var(--fg-muted)',
        maxWidth: 640, margin: '0 0 36px', textWrap: 'pretty',
      }}>
        We're the technology arm of your business — hosting to hardware to AI, under one roof.
        Built for SMBs that move fast and expect their tech to keep up.
      </p>
      <div style={{ display: 'flex', gap: 12 }}>
        <Button variant="primary">Start a conversation →</Button>
        <Button variant="ghost">See if we're a fit</Button>
      </div>
    </section>
  );
}
window.Hero = Hero;
