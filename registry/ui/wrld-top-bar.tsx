import * as React from "react";

/**
 * WRLD Top Bar — dashboard content header: eyebrow subtitle, page title, and a
 * secondary + primary action pair on the right.
 *
 * Source of truth: github.com/WRLDInc/DesignSystem — ui_kits/wrld-ai/TopBar.jsx
 * Tokens resolve WRLD tokens.css (--wrld-*) → host shadcn theme (--color-*) → WRLD
 * literal. Self-contained by design (one file per 21st component).
 */

const t = {
  fg: "var(--wrld-fg, var(--color-foreground, #0a0a0a))",
  fgMuted: "var(--wrld-fg-muted, var(--color-muted-foreground, #52525b))",
  fgInverse: "var(--wrld-fg-inverse, var(--color-background, #ffffff))",
  border: "var(--wrld-border, var(--color-border, #e4e4e7))",
  borderStrong: "var(--wrld-border-strong, var(--color-input, #d4d4d8))",
  fontDisplay: "var(--wrld-font-display, Montserrat, 'Helvetica Neue', Arial, sans-serif)",
  fontBody: "var(--wrld-font-body, Ubuntu, system-ui, -apple-system, sans-serif)",
} as const;

export interface WrldTopBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Page title, rendered as an h1 in Montserrat. */
  title: string;
  /** Eyebrow line above the title, e.g. the workspace name. */
  subtitle?: string;
  /** Label of the filled primary action. Defaults to "+ New agent". */
  primaryLabel?: string;
  /** Label of the outlined secondary action. Defaults to "Export". Pass null to hide it. */
  secondaryLabel?: string | null;
  onPrimary?: () => void;
  onSecondary?: () => void;
  /** Replace the default action pair entirely. */
  actions?: React.ReactNode;
}

const actionBase: React.CSSProperties = {
  fontFamily: t.fontBody,
  fontSize: 13,
  fontWeight: 500,
  lineHeight: 1.4,
  padding: "8px 14px",
  borderRadius: 4,
  cursor: "pointer",
};

export function WrldTopBar({
  title,
  subtitle,
  primaryLabel = "+ New agent",
  secondaryLabel = "Export",
  onPrimary,
  onSecondary,
  actions,
  style,
  ...rest
}: WrldTopBarProps) {
  return (
    <div
      style={{
        borderBottom: `1px solid ${t.border}`,
        padding: "24px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 24,
        color: t.fg,
        ...style,
      }}
      {...rest}
    >
      <div>
        {subtitle && (
          <div
            className="eyebrow"
            style={{
              fontFamily: t.fontBody,
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: t.fgMuted,
              marginBottom: 6,
            }}
          >
            {subtitle}
          </div>
        )}
        <h1 style={{ fontFamily: t.fontDisplay, fontWeight: 600, fontSize: 28, letterSpacing: "-0.02em", lineHeight: 1.2, margin: 0 }}>
          {title}
        </h1>
      </div>
      <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
        {actions ?? (
          <>
            {secondaryLabel && (
              <button
                type="button"
                onClick={onSecondary}
                style={{ ...actionBase, border: `1px solid ${t.borderStrong}`, background: "transparent", color: t.fg }}
              >
                {secondaryLabel}
              </button>
            )}
            <button
              type="button"
              onClick={onPrimary}
              style={{ ...actionBase, border: `1px solid ${t.fg}`, background: t.fg, color: t.fgInverse }}
            >
              {primaryLabel}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default WrldTopBar;
