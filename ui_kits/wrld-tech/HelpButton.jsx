// WRLD Help launcher — the circular warm-accent help button that anchors the
// bottom corner of every WRLD property (the Gleap widget owns that corner in
// production; this component is its canonical visual representation for use
// inside menus, cards, and prototypes — e.g. the header mega menu's Help panel).
//
// Warm #EE9300 is reserved for commerce/support moments; this is one of the
// few sanctioned static uses. The glyph and hairline rim use near-black
// (--mono-950) so both the icon and the control boundary clear the WCAG 1.4.11
// 3:1 non-text contrast threshold on light surfaces (white on #EE9300 is only
// ~2.4:1). The ping ring is decorative and disabled under
// prefers-reduced-motion.
export function HelpButton({ size = 52, label = 'Open WRLD Help chat', onClick, style }) {
  const [hover, setHover] = React.useState(false);
  const glyph = Math.round(size * 0.46);
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative',
        width: size, height: size,
        border: '1px solid var(--mono-950)', borderRadius: '50%',
        background: 'var(--accent-warm)',
        color: 'var(--mono-950)',
        display: 'grid', placeItems: 'center',
        cursor: 'pointer', padding: 0,
        boxShadow: 'var(--shadow-accent-warm)',
        transform: hover ? 'translateY(-1px) scale(1.05)' : 'none',
        transition: 'transform 200ms cubic-bezier(.2,.8,.2,1), box-shadow 200ms cubic-bezier(.2,.8,.2,1)',
        ...style,
      }}>
      <style>{`
        @keyframes wrld-help-ping {
          0% { transform: scale(1); opacity: .8; }
          70%, 100% { transform: scale(1.5); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .wrld-help-ping { animation: none !important; }
        }
      `}</style>
      <svg width={glyph} height={glyph} viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
        <path d="M9.8 9.3a2.3 2.3 0 0 1 4.5.7c0 1.5-2.3 2.1-2.3 2.1" />
        <path d="M12 15.4h.01" />
      </svg>
      <span className="wrld-help-ping" aria-hidden style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        border: '1px solid rgb(238 147 0 / 0.55)',
        animation: 'wrld-help-ping 2.8s cubic-bezier(.2,.8,.2,1) infinite',
        pointerEvents: 'none',
      }} />
    </button>
  );
}
window.HelpButton = HelpButton;
