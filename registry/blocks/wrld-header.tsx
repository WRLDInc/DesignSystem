import * as React from "react";

/**
 * WRLD Header — the sticky wrld.tech site header. The submenu lives inside the
 * nav row (same column as its parent link) rather than as a floating overlay,
 * a single traveling underline slides between top links, and the lockup morphs
 * its sub-brand label to match the hovered section. Below `collapseBelow` px
 * the header becomes a drawer.
 *
 * Source of truth: github.com/WRLDInc/DesignSystem — ui_kits/wrld-tech/Header.jsx
 * The lockup and buttons are inlined because 21st publishes one self-contained
 * file per component; the standalone versions are wrld-lockup and wrld-button.
 *
 * Animation choreography: fade-dominant transitions; a sequence guard so an
 * outgoing submenu finishes its exit before the next one opens (rapid hovers
 * queue instead of jittering); items stagger in.
 */

/**
 * The mark. An inline 128px render of the authentic raster artwork
 * (registry/assets/wrld-mark-black-128.png, resized from
 * assets/logos/wrld-mark-black.png) so the component needs no network and
 * survives sandboxed previews — 21st's renderer refuses cross-origin requests.
 * The white variant for dark surfaces is the same pixels under filter: invert(1),
 * as the styleguide does. Sharp up to a wordmark size of about 40; for larger
 * lockups pass `markSrc` with the full-resolution file, e.g.
 * https://wrld.design/assets/logos/wrld-mark-black.png (or -white.png).
 */
const MARK_BLACK = "data:image/png;base64,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";

const t = {
  bg: "var(--wrld-bg, var(--color-background, #ffffff))",
  fg: "var(--wrld-fg, var(--color-foreground, #0a0a0a))",
  fgMuted: "var(--wrld-fg-muted, var(--color-muted-foreground, #52525b))",
  fgInverse: "var(--wrld-fg-inverse, var(--color-background, #ffffff))",
  border: "var(--wrld-border, var(--color-border, #e4e4e7))",
  borderStrong: "var(--wrld-border-strong, var(--color-input, #d4d4d8))",
  accentPrimary: "var(--wrld-accent-primary, #007fee)",
  mono950: "var(--wrld-mono-950, #0a0a0a)",
  mono0: "var(--wrld-mono-0, #ffffff)",
  mono600: "var(--wrld-mono-600, #52525b)",
  mono400: "var(--wrld-mono-400, #a1a1aa)",
  fontDisplay: "var(--wrld-font-display, Montserrat, 'Helvetica Neue', Arial, sans-serif)",
  fontBody: "var(--wrld-font-body, Ubuntu, system-ui, -apple-system, sans-serif)",
  shadowAccentPrimary: "var(--wrld-shadow-accent-primary, 0 10px 40px -8px rgb(0 127 238 / 0.22))",
  duration: "var(--wrld-duration-default, 200ms)",
  ease: "var(--wrld-ease-standard, cubic-bezier(0.2, 0.8, 0.2, 1))",
} as const;

export interface WrldNavItem {
  id: string;
  label: string;
  /** Sub-brand label the lockup morphs to while this item is hovered. */
  sub?: string | null;
  submenu?: string[] | null;
  href?: string;
}

export const WRLD_NAV: WrldNavItem[] = [
  { id: "tech", label: "Tech", sub: "TECH", submenu: ["Why WRLD", "Process", "Case studies", "Pricing"] },
  { id: "services", label: "Services", sub: "SERVICES", submenu: ["Managed IT", "Monitoring", "Patching", "Onboarding"] },
  { id: "host", label: "Host", sub: "HOST", submenu: ["Plans", "Stack", "Status", "Migrations"] },
  { id: "ai", label: "AI", sub: "AI", submenu: ["Build", "Test", "Deploy", "RAG", "Training", "Chat"] },
  { id: "help", label: "Help", sub: null, submenu: null },
  { id: "contact", label: "Contact", sub: null, submenu: null },
];

export interface WrldHeaderProps {
  /** Currently active top-level route id (drives the resting underline). */
  activeRoute?: string;
  /** Called with the route id when a nav item, the lockup ("home") or the CTA is clicked. */
  onNavigate: (route: string) => void;
  items?: WrldNavItem[];
  /** Outlined right-hand link. Pass null to hide. */
  portalLabel?: string | null;
  portalHref?: string;
  /** Filled right-hand call to action. Pass null to hide. */
  ctaLabel?: string | null;
  /** Route passed to onNavigate when the CTA is clicked. */
  ctaRoute?: string;
  /** Viewport width (px) below which the header collapses to a drawer. */
  collapseBelow?: number;
  /** "dark" = black mark for light surfaces (default); "light" = white mark for dark surfaces. */
  markTheme?: "dark" | "light";
  /** Custom mark image. Defaults to an inline 128px render of the authentic mark; pass the full-resolution https://wrld.design/assets/logos/wrld-mark-black.png (or -white) for large sizes. */
  markSrc?: string;
  style?: React.CSSProperties;
  className?: string;
}

const EASE = "cubic-bezier(.22, 1, .36, 1)";
const EASE_SOFT = "cubic-bezier(.32, .72, .28, 1)";
const D_INDICATOR = 380; // traveling underline
const D_FADE_IN = 520; // submenu opacity in
const D_FADE_OUT = 360; // submenu opacity out
const D_SLIDE_IN = 460; // submenu translate in
const D_SLIDE_OUT = 320; // submenu translate out
const D_CHROME = 480; // header padding-bottom
const STAGGER = 55; // per-submenu-item delay
const SETTLE_HOLD = 120; // ms to hold close before re-opening on a rapid switch

type Phase = "idle" | "opening" | "open" | "closing";
type Timer = ReturnType<typeof setTimeout> | null;

function Lockup({ sub, theme, size, animated, markSrc }: { sub?: string | null; theme: "dark" | "light"; size: number; animated?: boolean; markSrc?: string }) {
  const light = theme === "light";
  const hasSub = Boolean(sub);
  const subLineH = size * 0.5 + 4;
  const wordmarkY = animated && hasSub ? -subLineH / 2 : 0;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 2, lineHeight: 1 }}>
      <img
        src={markSrc ?? MARK_BLACK}
        alt="WRLD"
        width={size * 1.7}
        height={size * 1.7}
        style={{ height: size * 1.7, width: size * 1.7, objectFit: "contain", flexShrink: 0, display: "block", filter: !markSrc && light ? "invert(1)" : undefined }}
      />
      <span
        style={{
          position: "relative",
          display: "inline-flex",
          flexDirection: "column",
          paddingRight: "4.2em",
          lineHeight: 1,
          height: animated ? size + subLineH : "auto",
          justifyContent: animated ? "flex-start" : "center",
        }}
      >
        <span
          style={{
            fontFamily: t.fontDisplay,
            fontWeight: 700,
            fontSize: size,
            letterSpacing: "0.04em",
            color: light ? t.mono0 : t.mono950,
            transform: `translateY(${wordmarkY}px)`,
            transition: animated ? `transform 280ms ${t.ease}` : "none",
            marginTop: animated ? subLineH / 2 : 0,
          }}
        >
          WRLD
        </span>
        <span
          aria-hidden={!hasSub}
          style={{
            fontFamily: t.fontDisplay,
            fontWeight: 500,
            fontSize: size * 0.5,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: light ? t.mono400 : t.mono600,
            marginTop: 4,
            opacity: hasSub ? 1 : 0,
            transform: animated ? `translateY(${hasSub ? 0 : -4}px)` : "none",
            transition: animated ? `opacity 220ms ease, transform 280ms ${t.ease}` : "none",
            height: animated ? subLineH : hasSub ? "auto" : 0,
            display: animated || hasSub ? "block" : "none",
            pointerEvents: "none",
          }}
        >
          {sub || ""}
        </span>
      </span>
    </span>
  );
}

function Button({
  variant,
  children,
  onClick,
  href,
}: {
  variant: "primary" | "secondary";
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
}) {
  const [hover, setHover] = React.useState(false);
  const filled = variant === "primary";
  const style: React.CSSProperties = {
    fontFamily: t.fontBody,
    fontSize: 14,
    fontWeight: 500,
    lineHeight: 1.4,
    padding: "10px 18px",
    borderRadius: 4,
    cursor: "pointer",
    textDecoration: "none",
    display: "inline-block",
    border: `1px solid ${filled ? t.fg : hover ? t.fg : t.borderStrong}`,
    background: filled ? t.fg : "transparent",
    color: filled ? t.fgInverse : t.fg,
    boxShadow: filled && hover ? t.shadowAccentPrimary : "none",
    transform: filled && hover ? "translateY(-1px)" : "none",
    transition: `all ${t.duration} ${t.ease}`,
  };
  const hoverProps = { onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false) };
  return href ? (
    <a href={href} onClick={onClick} style={style} {...hoverProps}>
      {children}
    </a>
  ) : (
    <button type="button" onClick={onClick} style={style} {...hoverProps}>
      {children}
    </button>
  );
}

// Horizontal row of links matching the top-nav type spec. Anchoring rules:
//   1. Fit from the parent link's left edge to the nav's right edge.
//   2. Otherwise right-align so the last item ends at the parent's right edge.
//   3. Otherwise cap the width to the roomier side and let flex-wrap drop a row.
function Submenu({
  items,
  isShowing,
  navRef,
  cell,
  onMouseEnter,
  onMouseLeave,
}: {
  items: string[];
  isShowing: boolean;
  navRef: React.RefObject<HTMLElement | null>;
  cell: HTMLElement | null;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [anchor, setAnchor] = React.useState<{ side: "left" | "right"; width: number | null }>({ side: "left", width: null });

  React.useLayoutEffect(() => {
    if (!ref.current || !navRef.current || !cell) return;
    const el = ref.current;
    const navR = navRef.current.getBoundingClientRect();
    const parentR = cell.getBoundingClientRect();

    // Measure intrinsic width by temporarily releasing the wrap constraint.
    const prevWidth = el.style.width;
    const prevWrap = el.style.flexWrap;
    el.style.width = "max-content";
    el.style.flexWrap = "nowrap";
    const intrinsic = el.scrollWidth;
    el.style.width = prevWidth;
    el.style.flexWrap = prevWrap;

    const availLeft = navR.right - parentR.left;
    const availRight = parentR.right - navR.left;

    if (intrinsic <= availLeft) setAnchor({ side: "left", width: null });
    else if (intrinsic <= availRight) setAnchor({ side: "right", width: null });
    else if (availLeft >= availRight) setAnchor({ side: "left", width: availLeft });
    else setAnchor({ side: "right", width: availRight });
  }, [items, isShowing, navRef, cell]);

  const posStyle: React.CSSProperties = anchor.side === "right" ? { right: 0, left: "auto" } : { left: 0, right: "auto" };

  return (
    <div
      ref={ref}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      aria-hidden={!isShowing}
      style={{
        position: "absolute",
        top: "100%",
        ...posStyle,
        paddingTop: 14,
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: anchor.side === "right" ? "flex-end" : "flex-start",
        gap: 36,
        rowGap: 10,
        width: anchor.width ?? undefined,
        maxWidth: navRef.current ? navRef.current.getBoundingClientRect().width : undefined,
        pointerEvents: isShowing ? "auto" : "none",
      }}
    >
      {items.map((item, i) => {
        const fadeDelay = isShowing ? 60 + i * STAGGER : 0;
        const slideDelay = isShowing ? 40 + i * STAGGER : 0;
        return (
          <a
            key={item}
            href="#"
            tabIndex={isShowing ? 0 : -1}
            onClick={(e) => e.preventDefault()}
            style={{
              cursor: "pointer",
              textDecoration: "none",
              fontFamily: t.fontBody,
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: t.accentPrimary,
              opacity: isShowing ? 1 : 0,
              transform: `translateY(${isShowing ? 0 : -6}px)`,
              transition:
                `opacity ${isShowing ? D_FADE_IN : D_FADE_OUT}ms ${EASE_SOFT} ${fadeDelay}ms,` +
                `transform ${isShowing ? D_SLIDE_IN : D_SLIDE_OUT}ms ${EASE} ${slideDelay}ms,` +
                `color ${D_FADE_OUT}ms ${EASE}`,
              willChange: "transform, opacity",
              whiteSpace: "nowrap",
              lineHeight: "22px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "inherit";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "";
            }}
          >
            {item}
          </a>
        );
      })}
    </div>
  );
}

export function WrldHeader({
  activeRoute,
  onNavigate,
  items = WRLD_NAV,
  portalLabel = "Client portal ↗",
  portalHref = "https://wrld.host/clientarea.php",
  ctaLabel = "Start a conversation",
  ctaRoute = "contact",
  collapseBelow = 900,
  markTheme = "dark",
  markSrc,
  style,
  className,
}: WrldHeaderProps) {
  // hoverId — what the user is pointing at (intent); visibleId — what is
  // actually visible or animating; phase — the state machine for it.
  const [hoverId, setHoverId] = React.useState<string | null>(null);
  const [visibleId, setVisibleId] = React.useState<string | null>(null);
  const [phase, setPhase] = React.useState<Phase>("idle");
  const [narrow, setNarrow] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const closeTimer = React.useRef<Timer>(null);
  const phaseTimer = React.useRef<Timer>(null);

  const navRef = React.useRef<HTMLElement | null>(null);
  const itemRefs = React.useRef<Record<string, HTMLAnchorElement | null>>({});
  const [indicator, setIndicator] = React.useState({ left: 0, width: 0, opacity: 0 });

  const submenuLength = React.useCallback(
    (id: string | null) => items.find((l) => l.id === id)?.submenu?.length ?? 0,
    [items],
  );

  React.useEffect(() => {
    const onResize = () => setNarrow(window.innerWidth < collapseBelow);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [collapseBelow]);

  // Drive the state machine off (hoverId, visibleId). Animations always finish;
  // we never interrupt mid-phase.
  React.useEffect(() => {
    if (phaseTimer.current) clearTimeout(phaseTimer.current);

    if (hoverId === visibleId) {
      if (phase === "closing" && hoverId !== null) {
        // The user came back to the still-closing menu: let it finish, then re-open.
        phaseTimer.current = setTimeout(() => {
          setVisibleId(hoverId);
          setPhase("opening");
          phaseTimer.current = setTimeout(() => setPhase("open"), D_FADE_IN + submenuLength(hoverId) * STAGGER);
        }, D_FADE_OUT);
      }
      return;
    }

    if (visibleId === null) {
      // Nothing open: open the new one immediately.
      setVisibleId(hoverId);
      setPhase("opening");
      phaseTimer.current = setTimeout(() => setPhase("open"), D_FADE_IN + submenuLength(hoverId) * STAGGER);
      return;
    }

    // A different menu is visible: close it fully, settle, then open the new one.
    if (phase !== "closing") setPhase("closing");
    phaseTimer.current = setTimeout(() => {
      if (hoverId === null) {
        setVisibleId(null);
        setPhase("idle");
      } else {
        setVisibleId(null);
        setPhase("idle");
        phaseTimer.current = setTimeout(() => {
          setVisibleId(hoverId);
          setPhase("opening");
          phaseTimer.current = setTimeout(() => setPhase("open"), D_FADE_IN + submenuLength(hoverId) * STAGGER);
        }, SETTLE_HOLD);
      }
    }, Math.max(D_FADE_OUT, D_SLIDE_OUT));

    return () => {
      if (phaseTimer.current) clearTimeout(phaseTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- phase is read, not a trigger
  }, [hoverId, visibleId]);

  // Keep the traveling underline under the hovered (or active) link, and
  // re-measure whenever the nav reflows.
  const measureIndicator = React.useCallback(() => {
    const targetId = hoverId ?? activeRoute ?? null;
    const el = targetId ? itemRefs.current[targetId] : null;
    const navEl = navRef.current;
    if (!el || !navEl) {
      setIndicator((s) => ({ ...s, opacity: 0 }));
      return;
    }
    const er = el.getBoundingClientRect();
    const nr = navEl.getBoundingClientRect();
    setIndicator({ left: er.left - nr.left, width: er.width, opacity: 1 });
  }, [hoverId, activeRoute]);

  React.useEffect(() => {
    measureIndicator();
  }, [measureIndicator, narrow]);

  React.useEffect(() => {
    if (!navRef.current || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => measureIndicator());
    ro.observe(navRef.current);
    window.addEventListener("resize", measureIndicator);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measureIndicator);
    };
  }, [measureIndicator, narrow]);

  const open = (id: string) => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setHoverId(id);
  };
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setHoverId(null), 180);
  };

  const go = (e: React.MouseEvent<HTMLAnchorElement>, route: string) => {
    e.preventDefault();
    onNavigate(route);
  };

  const visible = items.find((l) => l.id === visibleId);
  const showSubmenu = Boolean(visible?.submenu && (phase === "opening" || phase === "open"));
  const lockupSub = visible?.sub ?? null;

  // Reserve a fixed bottom slot equal to the tallest submenu (two wrapped rows)
  // so the chrome does not bounce as different menus open.
  const SUBMENU_ROW_H = 22;
  const SUBMENU_MAX_ROWS = 2;
  const submenuSlotH = SUBMENU_ROW_H * SUBMENU_MAX_ROWS + 28;

  const linkType: React.CSSProperties = {
    fontFamily: t.fontBody,
    fontSize: 12,
    fontWeight: 500,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    textDecoration: "none",
    cursor: "pointer",
  };

  if (!narrow) {
    return (
      <header
        className={className}
        onMouseLeave={scheduleClose}
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: `color-mix(in srgb, ${t.bg} 85%, transparent)`,
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: `1px solid ${t.border}`,
          color: t.fg,
          paddingBottom: showSubmenu ? submenuSlotH : 0,
          transition: `padding-bottom ${D_CHROME}ms ${EASE_SOFT}`,
          ...style,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "auto 1fr auto",
            alignItems: "start",
            padding: "0 32px",
            gap: 32,
            position: "relative",
            zIndex: 2,
            minHeight: 64,
          }}
        >
          <a
            href="#"
            aria-label="WRLD home"
            onClick={(e) => go(e, "home")}
            style={{ display: "flex", cursor: "pointer", textDecoration: "none", alignSelf: "center", height: 64, alignItems: "center" }}
          >
            <Lockup size={20} animated sub={lockupSub} theme={markTheme} markSrc={markSrc} />
          </a>

          <nav ref={navRef} aria-label="Primary" style={{ display: "flex", justifyContent: "center", gap: 36, position: "relative" }}>
            {/* Traveling underline: one element that slides between items. */}
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                top: 32,
                height: 1,
                background: t.accentPrimary,
                left: indicator.left,
                width: indicator.width,
                opacity: indicator.opacity,
                transition: `left ${D_INDICATOR}ms ${EASE}, width ${D_INDICATOR}ms ${EASE}, opacity ${D_FADE_OUT}ms ${EASE}`,
                willChange: "left, width, opacity",
                pointerEvents: "none",
              }}
            />

            {items.map((l) => {
              const isHover = hoverId === l.id;
              const isActive = activeRoute === l.id;
              const isVisible = visibleId === l.id;
              const isShowing = isVisible && (phase === "opening" || phase === "open");
              return (
                <div
                  key={l.id}
                  onMouseEnter={() => open(l.id)}
                  style={{ position: "relative", display: "flex", alignItems: "center", height: 64 }}
                >
                  <a
                    ref={(el) => {
                      itemRefs.current[l.id] = el;
                    }}
                    href={l.href ?? "#"}
                    aria-current={isActive ? "page" : undefined}
                    onClick={(e) => go(e, l.id)}
                    onFocus={() => open(l.id)}
                    style={{
                      ...linkType,
                      position: "relative",
                      display: "inline-block",
                      color: isActive || isShowing || isHover ? t.accentPrimary : t.fg,
                      transition: `color ${D_FADE_OUT}ms ${EASE}`,
                    }}
                  >
                    {l.label}
                  </a>
                  {l.submenu && isVisible && (
                    <Submenu
                      items={l.submenu}
                      isShowing={isShowing}
                      navRef={navRef}
                      cell={itemRefs.current[l.id]}
                      onMouseEnter={() => open(l.id)}
                      onMouseLeave={scheduleClose}
                    />
                  )}
                </div>
              );
            })}
          </nav>

          <div style={{ display: "flex", gap: 12, alignSelf: "center", height: 64, alignItems: "center" }}>
            {portalLabel && (
              <Button variant="secondary" href={portalHref}>
                {portalLabel}
              </Button>
            )}
            {ctaLabel && (
              <Button variant="primary" onClick={() => onNavigate(ctaRoute)}>
                {ctaLabel}
              </Button>
            )}
          </div>
        </div>
      </header>
    );
  }

  // Narrow layout: compact bar plus a drawer.
  return (
    <header
      className={className}
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: `color-mix(in srgb, ${t.bg} 95%, transparent)`,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: `1px solid ${t.border}`,
        color: t.fg,
        ...style,
      }}
    >
      <div style={{ height: 56, display: "flex", alignItems: "center", padding: "0 16px", gap: 12 }}>
        <a
          href="#"
          aria-label="WRLD home"
          onClick={(e) => {
            go(e, "home");
            setDrawerOpen(false);
          }}
          style={{ display: "flex", cursor: "pointer", textDecoration: "none" }}
        >
          <Lockup size={16} theme={markTheme} markSrc={markSrc} />
        </a>
        <div style={{ flex: 1 }} />
        <button
          type="button"
          onClick={() => setDrawerOpen((o) => !o)}
          aria-label="Menu"
          aria-expanded={drawerOpen}
          style={{
            width: 36,
            height: 36,
            border: `1px solid ${t.borderStrong}`,
            background: "transparent",
            borderRadius: 4,
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 4,
            padding: 0,
          }}
        >
          <span style={{ width: 14, height: 1, background: t.fg }} />
          <span style={{ width: 14, height: 1, background: t.fg }} />
          <span style={{ width: 14, height: 1, background: t.fg }} />
        </button>
      </div>
      <div style={{ maxHeight: drawerOpen ? 600 : 0, overflow: "hidden", transition: `max-height ${D_FADE_IN}ms ${EASE}` }}>
        <div style={{ padding: "8px 16px 20px", display: "flex", flexDirection: "column" }}>
          {items.map((l) => (
            <div key={l.id} style={{ borderTop: `1px solid ${t.border}`, padding: "14px 4px" }}>
              <a
                href={l.href ?? "#"}
                onClick={(e) => {
                  go(e, l.id);
                  setDrawerOpen(false);
                }}
                style={{ ...linkType, display: "flex", alignItems: "baseline", justifyContent: "space-between", color: t.fg }}
              >
                <span>{l.label}</span>
                {l.sub && (
                  <span style={{ fontFamily: t.fontDisplay, fontWeight: 500, fontSize: 10, letterSpacing: "0.18em", color: t.fgMuted }}>
                    WRLD · {l.sub}
                  </span>
                )}
              </a>
              {l.submenu && (
                <div
                  style={{
                    marginTop: 12,
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    fontFamily: t.fontBody,
                    fontSize: 11,
                    fontWeight: 300,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: t.accentPrimary,
                  }}
                >
                  {l.submenu.map((item) => (
                    <a key={item} href="#" onClick={(e) => e.preventDefault()} style={{ cursor: "pointer", color: "inherit", textDecoration: "none" }}>
                      {item}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}

export default WrldHeader;
