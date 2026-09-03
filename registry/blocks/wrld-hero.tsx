import * as React from "react";

/**
 * WRLD Hero — the wrld.tech marketing hero: eyebrow, display headline, lede
 * and a call-to-action row. One hero element per view; no visual competition.
 *
 * Source of truth: github.com/WRLDInc/DesignSystem — ui_kits/wrld-tech/Hero.jsx
 * Tokens resolve WRLD tokens.css (--wrld-*) → host shadcn theme (--color-*) → WRLD
 * literal. The eyebrow and button are inlined because 21st publishes one
 * self-contained file per component; the standalone versions live in the same
 * library (wrld-eyebrow, wrld-button).
 */

const t = {
  fg: "var(--wrld-fg, var(--color-foreground, #0a0a0a))",
  fgMuted: "var(--wrld-fg-muted, var(--color-muted-foreground, #52525b))",
  fgInverse: "var(--wrld-fg-inverse, var(--color-background, #ffffff))",
  accentPrimary: "var(--wrld-accent-primary, #007fee)",
  fontDisplay: "var(--wrld-font-display, Montserrat, 'Helvetica Neue', Arial, sans-serif)",
  fontBody: "var(--wrld-font-body, Ubuntu, system-ui, -apple-system, sans-serif)",
  shadowAccentPrimary: "var(--wrld-shadow-accent-primary, 0 10px 40px -8px rgb(0 127 238 / 0.22))",
  duration: "var(--wrld-duration-default, 200ms)",
  ease: "var(--wrld-ease-standard, cubic-bezier(0.2, 0.8, 0.2, 1))",
} as const;

export interface WrldHeroProps extends React.HTMLAttributes<HTMLElement> {
  /** Uppercase eyebrow above the headline. Defaults to the WRLD descriptor line. */
  eyebrow?: React.ReactNode;
  /** Display headline. Defaults to the primary tagline. */
  headline?: React.ReactNode;
  /** Supporting paragraph. */
  lede?: React.ReactNode;
  /** Filled call to action. Pass null to hide. */
  primaryLabel?: string | null;
  /** Ghost call to action. Pass null to hide. */
  secondaryLabel?: string | null;
  onPrimary?: () => void;
  onSecondary?: () => void;
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="eyebrow"
      style={{
        fontFamily: t.fontBody,
        fontSize: 12,
        fontWeight: 500,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: t.fgMuted,
      }}
    >
      {children}
    </div>
  );
}

function Button({
  variant,
  children,
  onClick,
}: {
  variant: "primary" | "ghost";
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const [hover, setHover] = React.useState(false);
  const filled = variant === "primary";
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        fontFamily: t.fontBody,
        fontSize: 14,
        fontWeight: 500,
        lineHeight: 1.4,
        padding: "10px 18px",
        borderRadius: 4,
        cursor: "pointer",
        border: `1px solid ${filled ? t.fg : "transparent"}`,
        background: filled ? t.fg : "transparent",
        color: filled ? t.fgInverse : hover ? t.accentPrimary : t.fg,
        boxShadow: filled && hover ? t.shadowAccentPrimary : "none",
        transform: filled && hover ? "translateY(-1px)" : "none",
        transition: `all ${t.duration} ${t.ease}`,
      }}
    >
      {children}
    </button>
  );
}

export function WrldHero({
  eyebrow = "WRLD · Tech · Design · Support",
  headline = "Your strategic partner in technology and business growth.",
  lede = "We're the technology arm of your business — hosting to hardware to AI, under one roof. Built for SMBs that move fast and expect their tech to keep up.",
  primaryLabel = "Start a conversation →",
  secondaryLabel = "See if we're a fit",
  onPrimary,
  onSecondary,
  style,
  ...rest
}: WrldHeroProps) {
  return (
    <section
      style={{
        padding: "120px 32px 80px",
        maxWidth: 1280,
        margin: "0 auto",
        color: t.fg,
        fontFamily: t.fontBody,
        ...style,
      }}
      {...rest}
    >
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h1
        style={{
          fontFamily: t.fontDisplay,
          fontWeight: 600,
          letterSpacing: "-0.02em",
          fontSize: "clamp(2.5rem, 1.5rem + 4vw, 5rem)",
          lineHeight: 1.05,
          margin: "20px 0 24px",
          maxWidth: 900,
          textWrap: "balance",
        }}
      >
        {headline}
      </h1>
      {lede && (
        <p
          style={{
            fontSize: 20,
            lineHeight: 1.55,
            color: t.fgMuted,
            maxWidth: 640,
            margin: "0 0 36px",
            textWrap: "pretty",
          }}
        >
          {lede}
        </p>
      )}
      {(primaryLabel || secondaryLabel) && (
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {primaryLabel && (
            <Button variant="primary" onClick={onPrimary}>
              {primaryLabel}
            </Button>
          )}
          {secondaryLabel && (
            <Button variant="ghost" onClick={onSecondary}>
              {secondaryLabel}
            </Button>
          )}
        </div>
      )}
    </section>
  );
}

export default WrldHero;
