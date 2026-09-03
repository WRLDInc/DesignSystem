import * as React from "react";

/**
 * WRLD Button — the flagship wrld.tech button, ported for the 21st.dev registry.
 *
 * Source of truth: github.com/WRLDInc/DesignSystem — ui_kits/wrld-tech/Button.jsx
 * Tokens resolve in this order: WRLD tokens.css (--wrld-*) → the host's shadcn /
 * Tailwind v4 theme (--color-*) → the WRLD light-mode literal. The token map is
 * repeated in every registry file on purpose: 21st publishes one self-contained
 * component file, so nothing here imports a shared module.
 *
 * Brand rules: surfaces stay monochrome; the accents (#007fee blue, #EE9300 warm)
 * appear only as the hover shadow lift. Sentence case labels. No emoji.
 */

const t = {
  fg: "var(--wrld-fg, var(--color-foreground, #0a0a0a))",
  fgInverse: "var(--wrld-fg-inverse, var(--color-background, #ffffff))",
  borderStrong: "var(--wrld-border-strong, var(--color-input, #d4d4d8))",
  accentPrimary: "var(--wrld-accent-primary, #007fee)",
  fontBody: "var(--wrld-font-body, Ubuntu, system-ui, -apple-system, sans-serif)",
  shadowAccentPrimary: "var(--wrld-shadow-accent-primary, 0 10px 40px -8px rgb(0 127 238 / 0.22))",
  shadowAccentWarm: "var(--wrld-shadow-accent-warm, 0 10px 40px -8px rgb(238 147 0 / 0.22))",
  duration: "var(--wrld-duration-default, 200ms)",
  ease: "var(--wrld-ease-standard, cubic-bezier(0.2, 0.8, 0.2, 1))",
} as const;

export type WrldButtonVariant = "primary" | "secondary" | "ghost" | "warm";

export interface WrldButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * primary — filled, blue hover shadow. secondary — hairline outline.
   * ghost — text only, blue on hover. warm — filled, commerce (#EE9300) hover shadow
   * for cart, upgrade and renew moments.
   */
  variant?: WrldButtonVariant;
}

export function WrldButton({
  variant = "primary",
  style,
  children,
  disabled,
  onMouseEnter,
  onMouseLeave,
  ...rest
}: WrldButtonProps) {
  const [hover, setHover] = React.useState(false);
  const lifted = hover && !disabled;

  const base: React.CSSProperties = {
    fontFamily: t.fontBody,
    fontSize: 14,
    fontWeight: 500,
    lineHeight: 1.4,
    padding: "10px 18px",
    borderRadius: 4,
    border: "1px solid transparent",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    transition: `all ${t.duration} ${t.ease}`,
  };
  const variants: Record<WrldButtonVariant, React.CSSProperties> = {
    primary: { background: t.fg, color: t.fgInverse, borderColor: t.fg },
    secondary: { background: "transparent", color: t.fg, borderColor: t.borderStrong },
    ghost: { background: "transparent", color: t.fg },
    warm: { background: t.fg, color: t.fgInverse, borderColor: t.fg },
  };
  const hoverFx: Record<WrldButtonVariant, React.CSSProperties> = {
    primary: { boxShadow: t.shadowAccentPrimary, transform: "translateY(-1px)" },
    secondary: { borderColor: t.fg },
    ghost: { color: t.accentPrimary },
    warm: { boxShadow: t.shadowAccentWarm, transform: "translateY(-1px)" },
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onMouseEnter={(e) => {
        setHover(true);
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        setHover(false);
        onMouseLeave?.(e);
      }}
      style={{ ...base, ...variants[variant], ...(lifted ? hoverFx[variant] : null), ...style }}
      {...rest}
    >
      {children}
    </button>
  );
}

export default WrldButton;
