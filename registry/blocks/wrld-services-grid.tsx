import * as React from "react";

/**
 * WRLD Services Grid — a grid of sub-brand service cards. Each card carries a
 * WRLD lockup with the sub-brand label, a one-line summary and the destination
 * in mono; hover lifts the card with the accent-tinted shadow.
 *
 * Source of truth: github.com/WRLDInc/DesignSystem — ui_kits/wrld-tech/ServicesGrid.jsx
 * The lockup and eyebrow are inlined (21st publishes one self-contained file per
 * component); the standalone versions are wrld-lockup and wrld-eyebrow.
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
  bgElevated: "var(--wrld-bg-elevated, var(--color-card, #ffffff))",
  fg: "var(--wrld-fg, var(--color-foreground, #0a0a0a))",
  fgMuted: "var(--wrld-fg-muted, var(--color-muted-foreground, #52525b))",
  fgSubtle: "var(--wrld-fg-subtle, var(--color-muted-foreground, #71717a))",
  border: "var(--wrld-border, var(--color-border, #e4e4e7))",
  accentPrimary: "var(--wrld-accent-primary, #007fee)",
  mono950: "var(--wrld-mono-950, #0a0a0a)",
  mono0: "var(--wrld-mono-0, #ffffff)",
  mono600: "var(--wrld-mono-600, #52525b)",
  mono400: "var(--wrld-mono-400, #a1a1aa)",
  fontDisplay: "var(--wrld-font-display, Montserrat, 'Helvetica Neue', Arial, sans-serif)",
  fontBody: "var(--wrld-font-body, Ubuntu, system-ui, -apple-system, sans-serif)",
  fontMono: "var(--wrld-font-mono, 'Ubuntu Mono', ui-monospace, SFMono-Regular, Menlo, monospace)",
  shadowMd: "var(--wrld-shadow-md, 0 4px 12px 0 rgb(0 0 0 / 0.08), 0 2px 4px 0 rgb(0 0 0 / 0.04))",
  shadowAccentPrimary: "var(--wrld-shadow-accent-primary, 0 10px 40px -8px rgb(0 127 238 / 0.22))",
  duration: "var(--wrld-duration-default, 200ms)",
  ease: "var(--wrld-ease-standard, cubic-bezier(0.2, 0.8, 0.2, 1))",
} as const;

export interface WrldService {
  /** Sub-brand label on the lockup, e.g. "HOST". */
  sub: string;
  body: string;
  href: string;
}

export interface WrldServicesGridProps extends React.HTMLAttributes<HTMLElement> {
  eyebrow?: React.ReactNode;
  /** Short note on the right of the eyebrow row. */
  note?: React.ReactNode;
  services?: WrldService[];
  /** "dark" = black mark for light surfaces (default); "light" = white mark for dark surfaces. */
  markTheme?: "dark" | "light";
  /** Custom mark image. Defaults to an inline 128px render of the authentic mark; pass the full-resolution https://wrld.design/assets/logos/wrld-mark-black.png (or -white) for large sizes. */
  markSrc?: string;
}

export const WRLD_SERVICES: WrldService[] = [
  { sub: "HOST", body: "Clustered, ethically-operated hosting. Reserved for clients and approved partners.", href: "https://wrld.host" },
  { sub: "DESIGN", body: "Design that ships. We build the sites we design, and we build them to work.", href: "https://wrld.design" },
  { sub: "AI", body: "Tailored agents tuned by humans who know your operations.", href: "https://wrld.ai" },
  { sub: "SERVICES", body: "24/7 monitoring, patching, and proactive infrastructure care.", href: "https://services.wrld.tech" },
  { sub: "SUPPORT", body: "Real humans on the other end of every ticket. SLA-backed.", href: "https://support.wrld.tech" },
  { sub: "PRESS", body: "Premium WordPress hosting with WRLD-tuned plugins.", href: "https://wrld.press" },
];

function Lockup({ sub, theme, size, markSrc }: { sub?: string | null; theme: "dark" | "light"; size: number; markSrc?: string }) {
  const light = theme === "light";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 2, lineHeight: 1 }}>
      <img
        src={markSrc ?? MARK_BLACK}
        alt="WRLD"
        width={size * 1.7}
        height={size * 1.7}
        style={{ height: size * 1.7, width: size * 1.7, objectFit: "contain", flexShrink: 0, display: "block", filter: !markSrc && light ? "invert(1)" : undefined }}
      />
      <span style={{ display: "inline-flex", flexDirection: "column", justifyContent: "center", lineHeight: 1 }}>
        <span style={{ fontFamily: t.fontDisplay, fontWeight: 700, fontSize: size, letterSpacing: "0.04em", color: light ? t.mono0 : t.mono950 }}>
          WRLD
        </span>
        {sub && (
          <span
            style={{
              fontFamily: t.fontDisplay,
              fontWeight: 500,
              fontSize: size * 0.5,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: light ? t.mono400 : t.mono600,
              marginTop: 4,
            }}
          >
            {sub}
          </span>
        )}
      </span>
    </span>
  );
}

function ServiceCard({ sub, body, href, markTheme, markSrc }: WrldService & { markTheme: "dark" | "light"; markSrc?: string }) {
  const [hover, setHover] = React.useState(false);
  return (
    <a
      href={href}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "block",
        padding: 24,
        borderRadius: 8,
        background: t.bgElevated,
        border: `1px solid ${t.border}`,
        textDecoration: "none",
        color: t.fg,
        transition: `all ${t.duration} ${t.ease}`,
        boxShadow: hover ? `${t.shadowMd}, ${t.shadowAccentPrimary}` : "none",
        transform: hover ? "translateY(-2px)" : "none",
      }}
    >
      <div style={{ marginBottom: 20 }}>
        <Lockup sub={sub} theme={markTheme} size={18} markSrc={markSrc} />
      </div>
      <div style={{ fontSize: 13, lineHeight: 1.55, color: t.fgMuted }}>{body}</div>
      <div
        style={{
          marginTop: 18,
          fontFamily: t.fontMono,
          fontSize: 11,
          color: hover ? t.accentPrimary : t.fgSubtle,
          display: "flex",
          justifyContent: "space-between",
          transition: `color ${t.duration} ${t.ease}`,
        }}
      >
        <span>{href.replace(/^https?:\/\//, "")}</span>
        <span>↗</span>
      </div>
    </a>
  );
}

export function WrldServicesGrid({
  eyebrow = "What we do",
  note = "Six service branches. One partner.",
  services = WRLD_SERVICES,
  markTheme = "dark",
  markSrc,
  style,
  ...rest
}: WrldServicesGridProps) {
  return (
    <section
      style={{
        padding: "64px 32px",
        maxWidth: 1280,
        margin: "0 auto",
        borderTop: `1px solid ${t.border}`,
        color: t.fg,
        fontFamily: t.fontBody,
        ...style,
      }}
      {...rest}
    >
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 32 }}>
        {eyebrow && (
          <div
            className="eyebrow"
            style={{ fontFamily: t.fontBody, fontSize: 12, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: t.fgMuted }}
          >
            {eyebrow}
          </div>
        )}
        {note && <div style={{ fontSize: 13, color: t.fgMuted }}>{note}</div>}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
        {services.map((s) => (
          <ServiceCard key={s.sub} {...s} markTheme={markTheme} markSrc={markSrc} />
        ))}
      </div>
    </section>
  );
}

export default WrldServicesGrid;
