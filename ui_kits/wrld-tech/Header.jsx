// Header — submenu lives inside the nav grid (same column as its parent link)
// rather than as a free-floating overlay. The whole nav is a CSS grid; each
// top link occupies a column at row 1, and on hover the submenu fills row 2
// beneath that column. Siblings don't shift.
//
// Animation choreography:
//   - Slower, fade-dominant transitions (560ms opacity + 460ms translate).
//   - A sequence guard: when the hover target changes while a submenu is
//     mid-animation, the outgoing menu finishes its exit before the
//     incoming one starts. Rapid mouse-overs no longer jitter; they queue.
//   - A single "traveling underline" indicator slides between top links
//     instead of each item growing its own underline — a unified motion.
//   - Submenu items wrap into a second mini-column if the list is long
//     (so menus stay within the nav row's vertical envelope).

const NAV_MODEL = [
  { id: 'tech',     label: 'Tech',     sub: 'TECH',     submenu: ['Why WRLD', 'Process', 'Case studies', 'Pricing'] },
  { id: 'services', label: 'Services', sub: 'SERVICES', submenu: ['Managed IT', 'Monitoring', 'Patching', 'Onboarding'] },
  { id: 'host',     label: 'Host',     sub: 'HOST',     submenu: ['Plans', 'Stack', 'Status', 'Migrations'] },
  { id: 'ai',       label: 'AI',       sub: 'AI',       submenu: ['Build', 'Test', 'Deploy', 'RAG', 'Training', 'Chat'] },
  { id: 'help',     label: 'Help',     sub: null,       submenu: null },
  { id: 'contact',  label: 'Contact',  sub: null,       submenu: null },
];

const EASE = 'cubic-bezier(.22, 1, .36, 1)';
const EASE_SOFT = 'cubic-bezier(.32, .72, .28, 1)';
const D_INDICATOR = 380;     // traveling underline
const D_FADE_IN   = 520;     // submenu opacity in
const D_FADE_OUT  = 360;     // submenu opacity out (slightly faster)
const D_SLIDE_IN  = 460;     // submenu translate in
const D_SLIDE_OUT = 320;     // submenu translate out
const D_CHROME    = 480;     // header padding-bottom
const STAGGER     = 55;      // per-submenu-item delay
const SETTLE_HOLD = 120;     // ms to hold close before re-opening on rapid switch

export function Header({ activeRoute, onNavigate }) {
  // hoverId   — what the user is currently pointed at (intent)
  // visibleId — what's actually visible / animating (state machine)
  // phase     — 'idle' | 'opening' | 'open' | 'closing'
  const [hoverId, setHoverId]     = React.useState(null);
  const [visibleId, setVisibleId] = React.useState(null);
  const [phase, setPhase]         = React.useState('idle');
  const [narrow, setNarrow]       = React.useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const closeTimer = React.useRef(null);
  const phaseTimer = React.useRef(null);

  // For the traveling underline
  const navRef     = React.useRef(null);
  const itemRefs   = React.useRef({});
  const [indicator, setIndicator] = React.useState({ left: 0, width: 0, opacity: 0 });

  React.useEffect(() => {
    const onResize = () => setNarrow(window.innerWidth < 900);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Drive the state machine off (hoverId, visibleId).
  // Rule: animations always finish. We never interrupt mid-phase.
  React.useEffect(() => {
    if (phaseTimer.current) clearTimeout(phaseTimer.current);

    // Same target: nothing to do.
    if (hoverId === visibleId) {
      if (phase === 'closing' && hoverId !== null) {
        // User came back to the still-closing menu — let it fully finish, then re-open.
        phaseTimer.current = setTimeout(() => {
          setVisibleId(hoverId);
          setPhase('opening');
          phaseTimer.current = setTimeout(() => setPhase('open'),
            D_FADE_IN + (NAV_MODEL.find(l => l.id === hoverId)?.submenu?.length || 0) * STAGGER);
        }, D_FADE_OUT);
      }
      return;
    }

    // Target changed.
    if (visibleId === null) {
      // No menu open → open the new one immediately.
      setVisibleId(hoverId);
      setPhase('opening');
      const len = NAV_MODEL.find(l => l.id === hoverId)?.submenu?.length || 0;
      phaseTimer.current = setTimeout(() => setPhase('open'), D_FADE_IN + len * STAGGER);
      return;
    }

    // A different menu is currently visible. Close it fully, settle, then open the new one.
    if (phase !== 'closing') {
      setPhase('closing');
    }
    phaseTimer.current = setTimeout(() => {
      // After exit completes…
      if (hoverId === null) {
        setVisibleId(null);
        setPhase('idle');
      } else {
        // Brief settle hold so the user perceives a finished beat,
        // then open the new menu.
        setVisibleId(null);
        setPhase('idle');
        phaseTimer.current = setTimeout(() => {
          setVisibleId(hoverId);
          setPhase('opening');
          const len = NAV_MODEL.find(l => l.id === hoverId)?.submenu?.length || 0;
          phaseTimer.current = setTimeout(() => setPhase('open'), D_FADE_IN + len * STAGGER);
        }, SETTLE_HOLD);
      }
    }, Math.max(D_FADE_OUT, D_SLIDE_OUT));

    return () => clearTimeout(phaseTimer.current);
  }, [hoverId, visibleId]);

  // Update the traveling underline whenever hover (or active route) changes,
  // OR whenever the nav itself resizes / reflows (which would otherwise leave
  // the indicator stranded at a stale x).
  const measureIndicator = React.useCallback(() => {
    const targetId = hoverId || activeRoute;
    const el = itemRefs.current[targetId];
    const navEl = navRef.current;
    if (!el || !navEl) {
      setIndicator(s => ({ ...s, opacity: 0 }));
      return;
    }
    const er = el.getBoundingClientRect();
    const nr = navEl.getBoundingClientRect();
    setIndicator({ left: er.left - nr.left, width: er.width, opacity: 1 });
  }, [hoverId, activeRoute]);

  React.useEffect(() => { measureIndicator(); }, [measureIndicator, narrow]);

  React.useEffect(() => {
    if (!navRef.current) return;
    const ro = new ResizeObserver(() => measureIndicator());
    ro.observe(navRef.current);
    window.addEventListener('resize', measureIndicator);
    return () => { ro.disconnect(); window.removeEventListener('resize', measureIndicator); };
  }, [measureIndicator]);

  const open = (id) => {
    if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; }
    setHoverId(id);
  };
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setHoverId(null), 180);
  };

  const visible = NAV_MODEL.find(l => l.id === visibleId);
  const showSubmenu = !!(visible && visible.submenu && (phase === 'opening' || phase === 'open'));
  const lockupSub = visible?.sub || null;

  // Reserve a fixed bottom slot equal to the tallest possible submenu so
  // the chrome doesn't bounce as different menus open. Submenu is now a
  // horizontal row that wraps at most twice (height ~ 2 rows).
  const SUBMENU_ROW_H = 22;
  const SUBMENU_MAX_ROWS = 2;
  const submenuSlotH = SUBMENU_ROW_H * SUBMENU_MAX_ROWS + 28;

  if (!narrow) {
    return (
      <header
        onMouseLeave={scheduleClose}
        style={{
          position: 'sticky', top: 0, zIndex: 100,
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border)',
          paddingBottom: showSubmenu ? submenuSlotH : 0,
          transition: `padding-bottom ${D_CHROME}ms ${EASE_SOFT}`,
        }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr auto',
          alignItems: 'start',
          padding: '0 32px', gap: 32,
          position: 'relative', zIndex: 2,
          minHeight: 64,
        }}>
          <a onClick={() => onNavigate('home')}
             style={{ display: 'flex', cursor: 'pointer', textDecoration: 'none', alignSelf: 'center', height: 64, alignItems: 'center' }}>
            <Lockup size={20} animated sub={lockupSub} />
          </a>

          {/* Nav as flex row. Each top-link cell is a positioning context;
              the submenu is absolutely-positioned inside its cell so row-1
              widths stay locked even when the submenu wraps below. */}
          <nav ref={navRef} style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 36,
            position: 'relative',
          }}>
            {/* Traveling underline — single element, slides between items */}
            <span aria-hidden style={{
              position: 'absolute', top: 32, height: 1,
              background: 'var(--accent-primary)',
              left: indicator.left, width: indicator.width,
              opacity: indicator.opacity,
              transition: `left ${D_INDICATOR}ms ${EASE}, width ${D_INDICATOR}ms ${EASE}, opacity ${D_FADE_OUT}ms ${EASE}`,
              willChange: 'left, width, opacity',
              pointerEvents: 'none',
            }} />

            {/* Top-link cells. Each is a positioning context for its own
                absolutely-positioned submenu so row-1 widths stay locked. */}
            {NAV_MODEL.map((l) => {
              const isHover = hoverId === l.id;
              const isActive = activeRoute === l.id;
              const owns = visibleId === l.id && (phase === 'opening' || phase === 'open');
              const isVisible = visibleId === l.id;
              const isShowing = isVisible && (phase === 'opening' || phase === 'open');
              return (
                <div key={l.id}
                  onMouseEnter={() => open(l.id)}
                  style={{
                    position: 'relative',
                    display: 'flex', alignItems: 'center', height: 64,
                  }}>
                  <a
                    ref={(el) => { itemRefs.current[l.id] = el; }}
                    onClick={() => onNavigate(l.id)}
                    style={{
                      cursor: 'pointer', textDecoration: 'none', position: 'relative',
                      fontFamily: 'var(--font-body)',
                      fontSize: 12, fontWeight: 500,
                      letterSpacing: '0.18em', textTransform: 'uppercase',
                      color: (isActive || owns || isHover) ? 'var(--accent-primary)' : 'var(--fg)',
                      transition: `color ${D_FADE_OUT}ms ${EASE}`,
                      display: 'inline-block',
                    }}>
                    {l.label}
                  </a>

                  {/* Submenu — horizontal row, same type spec & gap as the
                      top nav. Starts from this cell's left edge; if its
                      intrinsic width can't fit between here and the nav's
                      right edge, anchors to the right edge of this cell
                      instead (last item ends at parent's right edge). If
                      even right-anchor overflows, flex-wrap drops to row 2. */}
                  {l.submenu && isVisible && (
                    <Submenu
                      items={l.submenu}
                      isShowing={isShowing}
                      navRef={navRef}
                      cellLeft={itemRefs.current[l.id]}
                      onMouseEnter={() => open(l.id)}
                      onMouseLeave={scheduleClose}
                    />
                  )}
                </div>
              );
            })}
          </nav>

          <div style={{ display: 'flex', gap: 12, alignSelf: 'center', height: 64, alignItems: 'center' }}>
            <Button variant="secondary">Client portal ↗</Button>
            <Button variant="primary" onClick={() => onNavigate('contact')}>Start a conversation</Button>
          </div>
        </div>
      </header>
    );
  }

  // Narrow layout (unchanged).
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100, background: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)',
    }}>
      <div style={{ height: 56, display: 'flex', alignItems: 'center', padding: '0 16px', gap: 12 }}>
        <a onClick={() => { onNavigate('home'); setDrawerOpen(false); }} style={{ display: 'flex', cursor: 'pointer', textDecoration: 'none' }}>
          <Lockup size={16} />
        </a>
        <div style={{ flex: 1 }} />
        <button
          onClick={() => setDrawerOpen(o => !o)}
          aria-label="Menu"
          style={{
            width: 36, height: 36, border: '1px solid var(--border-strong)',
            background: 'transparent', borderRadius: 4, cursor: 'pointer',
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            alignItems: 'center', gap: 4, padding: 0,
          }}>
          <span style={{ width: 14, height: 1, background: 'var(--fg)' }} />
          <span style={{ width: 14, height: 1, background: 'var(--fg)' }} />
          <span style={{ width: 14, height: 1, background: 'var(--fg)' }} />
        </button>
      </div>
      <div style={{
        maxHeight: drawerOpen ? 600 : 0, overflow: 'hidden',
        transition: `max-height ${D_FADE_IN}ms ${EASE}`,
      }}>
        <div style={{ padding: '8px 16px 20px', display: 'flex', flexDirection: 'column' }}>
          {NAV_MODEL.map(l => (
            <div key={l.id} style={{ borderTop: '1px solid var(--border)', padding: '14px 4px' }}>
              <a onClick={() => { onNavigate(l.id); setDrawerOpen(false); }} style={{
                display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
                cursor: 'pointer', textDecoration: 'none', color: 'var(--fg)',
                fontFamily: 'var(--font-body)',
                fontSize: 12, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase',
              }}>
                <span>{l.label}</span>
                {l.sub && (
                  <span style={{
                    fontFamily: "'Montserrat', sans-serif", fontWeight: 500,
                    fontSize: 10, letterSpacing: '0.18em', color: 'var(--fg-muted)',
                  }}>WRLD · {l.sub}</span>
                )}
              </a>
              {l.submenu && (
                <div style={{
                  marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8,
                  fontFamily: 'var(--font-body)',
                  fontSize: 11, fontWeight: 300, letterSpacing: '0.16em', textTransform: 'uppercase',
                  color: 'var(--accent-primary)',
                }}>
                  {l.submenu.map(item => <a key={item} style={{ cursor: 'pointer' }}>{item}</a>)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
window.Header = Header;

// ─── Submenu ──────────────────────────────────────────────────────────
// Horizontal row of links matching the top-nav type spec.
// Anchoring rules:
//   1. Try to fit starting at the parent link's left edge → nav's right edge.
//   2. If intrinsic width exceeds that gap but fits between nav's left edge
//      and the parent link's right edge → right-align (last item ends at
//      parent link's right edge).
//   3. Otherwise, set width to max-available and let flex-wrap drop to a
//      second row.
function Submenu({ items, isShowing, navRef, cellLeft, onMouseEnter, onMouseLeave }) {
  const ref = React.useRef(null);
  const [anchor, setAnchor] = React.useState({ side: 'left', width: null });

  React.useLayoutEffect(() => {
    if (!ref.current || !navRef.current || !cellLeft) return;
    const el = ref.current;
    const navR = navRef.current.getBoundingClientRect();
    const parentR = cellLeft.getBoundingClientRect();

    // Measure intrinsic width by temporarily releasing the wrap constraint.
    const prevWidth = el.style.width;
    const prevFlexWrap = el.style.flexWrap;
    el.style.width = 'max-content';
    el.style.flexWrap = 'nowrap';
    const intrinsic = el.scrollWidth;
    el.style.width = prevWidth;
    el.style.flexWrap = prevFlexWrap;

    const availLeft  = navR.right - parentR.left;          // L→R from parent
    const availRight = parentR.right - navR.left;          // R→L from parent

    if (intrinsic <= availLeft) {
      setAnchor({ side: 'left', width: null });
    } else if (intrinsic <= availRight) {
      setAnchor({ side: 'right', width: null });
    } else {
      // Wraps. Choose the side with more room and cap width to that side.
      if (availLeft >= availRight) setAnchor({ side: 'left',  width: availLeft });
      else                          setAnchor({ side: 'right', width: availRight });
    }
  }, [items, isShowing, navRef, cellLeft]);

  const posStyle = anchor.side === 'right'
    ? { right: 0, left: 'auto' }
    : { left: 0,  right: 'auto' };

  return (
    <div
      ref={ref}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      aria-hidden={!isShowing}
      style={{
        position: 'absolute',
        top: '100%',
        ...posStyle,
        paddingTop: 14,
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: anchor.side === 'right' ? 'flex-end' : 'flex-start',
        gap: 36,
        rowGap: 10,
        width: anchor.width || undefined,
        maxWidth: navRef.current ? navRef.current.getBoundingClientRect().width : undefined,
        pointerEvents: isShowing ? 'auto' : 'none',
      }}>
      {items.map((item, i) => {
        const itemFadeDelay  = isShowing ? (60 + i * STAGGER) : 0;
        const itemSlideDelay = isShowing ? (40 + i * STAGGER) : 0;
        return (
          <a key={item}
            style={{
              cursor: 'pointer', textDecoration: 'none',
              fontFamily: 'var(--font-body)',
              fontSize: 12, fontWeight: 500,
              letterSpacing: '0.18em', textTransform: 'uppercase',
              color: 'var(--accent-primary)',
              opacity: isShowing ? 1 : 0,
              transform: `translateY(${isShowing ? 0 : -6}px)`,
              transition: `opacity ${isShowing ? D_FADE_IN : D_FADE_OUT}ms ${EASE_SOFT} ${itemFadeDelay}ms,` +
                          `transform ${isShowing ? D_SLIDE_IN : D_SLIDE_OUT}ms ${EASE} ${itemSlideDelay}ms,` +
                          `color ${D_FADE_OUT}ms ${EASE}`,
              willChange: 'transform, opacity',
              whiteSpace: 'nowrap',
              lineHeight: '22px',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--fg)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--accent-primary)'}>
            {item}
          </a>
        );
      })}
    </div>
  );
}
