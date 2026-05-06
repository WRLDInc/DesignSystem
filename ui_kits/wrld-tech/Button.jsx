function Button({ variant = 'primary', children, onClick, ...rest }) {
  const base = {
    fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500,
    padding: '10px 18px', borderRadius: 4, cursor: 'pointer',
    border: '1px solid transparent',
    transition: 'all 200ms cubic-bezier(.2,.8,.2,1)',
  };
  const variants = {
    primary:   { background: 'var(--fg)', color: 'var(--fg-inverse)', borderColor: 'var(--fg)' },
    secondary: { background: 'transparent', color: 'var(--fg)', borderColor: 'var(--border-strong)' },
    ghost:     { background: 'transparent', color: 'var(--fg)' },
    warm:      { background: 'var(--fg)', color: 'var(--fg-inverse)', borderColor: 'var(--fg)' },
  };
  const [hover, setHover] = React.useState(false);
  const hoverFx = {
    primary:   hover ? { boxShadow: 'var(--shadow-accent-primary)', transform: 'translateY(-1px)' } : {},
    secondary: hover ? { borderColor: 'var(--fg)' } : {},
    ghost:     hover ? { color: 'var(--accent-primary)' } : {},
    warm:      hover ? { boxShadow: 'var(--shadow-accent-warm)', transform: 'translateY(-1px)' } : {},
  };
  return (
    <button onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ ...base, ...variants[variant], ...hoverFx[variant] }} {...rest}>
      {children}
    </button>
  );
}
window.Button = Button;
