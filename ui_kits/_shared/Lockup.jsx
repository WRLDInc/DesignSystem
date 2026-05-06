// Canonical WRLD lockup. Mark + wordmark + optional right-aligned sub-brand label.
// `sub` can be a string (always shown) or null/undefined (hidden).
// `animated` (boolean): when true, sub-label fades + wordmark nudges up smoothly when sub is set.
//   Use `animated` for nav lockups that morph on hover. Static lockups (footer, sub-cards) leave it off.
function Lockup({ sub, theme = 'dark', size = 24, animated = false, style }) {
  const markSrc = theme === 'light'
    ? '../../assets/logos/wrld-mark-white.png'
    : '../../assets/logos/wrld-mark-black.png';
  const fg = theme === 'light' ? '#fff' : '#000';
  const subFg = theme === 'light' ? '#a1a1aa' : '#52525b';
  const hasSub = !!sub;

  // Animated mode: text column has a fixed reserved height (wordmark + sub line) and
  // we shift the wordmark up by half a sub-line when sub appears, so it visually
  // re-centers around the mark instead of jumping.
  const subLineH = size * 0.5 + 4;
  const wordmarkY = animated ? (hasSub ? -subLineH / 2 : 0) : 0;

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 2, lineHeight: 1, ...style,
    }}>
      <img src={markSrc} alt="WRLD" style={{
        height: size * 1.7, width: size * 1.7, objectFit: 'contain',
        flexShrink: 0, display: 'block',
      }} />
      <span style={{
        position: 'relative',
        display: 'inline-flex', flexDirection: 'column',
        paddingRight: '4.2em', lineHeight: 1,
        height: animated ? size + subLineH : 'auto',
        justifyContent: animated ? 'flex-start' : 'center',
      }}>
        <span style={{
          fontFamily: "'Montserrat', sans-serif", fontWeight: 700,
          fontSize: size, letterSpacing: '0.04em', color: fg,
          transform: `translateY(${wordmarkY}px)`,
          transition: animated ? 'transform 280ms cubic-bezier(.2,.8,.2,1)' : 'none',
          marginTop: animated ? subLineH / 2 : 0,
        }}>WRLD</span>
        <span style={{
          fontFamily: "'Montserrat', sans-serif", fontWeight: 500,
          fontSize: size * 0.5, letterSpacing: '0.18em',
          textTransform: 'uppercase', color: subFg, marginTop: 4,
          opacity: animated ? (hasSub ? 1 : 0) : (hasSub ? 1 : 0),
          transform: animated ? `translateY(${hasSub ? 0 : -4}px)` : 'none',
          transition: animated ? 'opacity 220ms ease, transform 280ms cubic-bezier(.2,.8,.2,1)' : 'none',
          height: animated ? subLineH : (hasSub ? 'auto' : 0),
          display: animated ? 'block' : (hasSub ? 'block' : 'none'),
          pointerEvents: 'none',
        }}>{sub || ''}</span>
      </span>
    </span>
  );
}
window.Lockup = Lockup;
