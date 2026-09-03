import * as React from "react";

/**
 * WRLD Stat Card — a single KPI tile: eyebrow label, display value, signed delta.
 *
 * Source of truth: github.com/WRLDInc/DesignSystem — ui_kits/wrld-ai/StatCard.jsx
 * Tokens resolve WRLD tokens.css (--wrld-*) → host shadcn theme (--color-*) → WRLD
 * literal. Self-contained by design (one file per 21st component).
 *
 * Monochrome surface, hairline border, 8px radius. The only colour is the
 * system-semantic success green on a positive delta.
 */

const t = {
  bgElevated: "var(--wrld-bg-elevated, var(--color-card, #ffffff))",
  fg: "var(--wrld-fg, var(--color-foreground, #0a0a0a))",
  fgMuted: "var(--wrld-fg-muted, var(--color-muted-foreground, #52525b))",
  border: "var(--wrld-border, var(--color-border, #e4e4e7))",
  statusSuccess: "var(--wrld-status-success, #10b981)",
  fontDisplay: "var(--wrld-font-display, Montserrat, 'Helvetica Neue', Arial, sans-serif)",
  fontBody: "var(--wrld-font-body, Ubuntu, system-ui, -apple-system, sans-serif)",
  fontMono: "var(--wrld-font-mono, 'Ubuntu Mono', ui-monospace, SFMono-Regular, Menlo, monospace)",
} as const;

export interface WrldStatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Eyebrow label, e.g. "Runs · 30d". */
  label: string;
  /** Display value, e.g. "284" or "98.6%". */
  value: React.ReactNode;
  /** Optional delta text, e.g. "12% wow". Rendered in mono with an arrow. */
  delta?: string;
  /** Positive deltas render with an up arrow in success green; otherwise a muted down arrow. */
  deltaPositive?: boolean;
}

export function WrldStatCard({ label, value, delta, deltaPositive = false, style, ...rest }: WrldStatCardProps) {
  return (
    <div
      style={{
        border: `1px solid ${t.border}`,
        borderRadius: 8,
        padding: 20,
        background: t.bgElevated,
        color: t.fg,
        ...style,
      }}
      {...rest}
    >
      <div
        className="eyebrow"
        style={{
          fontFamily: t.fontBody,
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: t.fgMuted,
          marginBottom: 10,
        }}
      >
        {label}
      </div>
      <div style={{ fontFamily: t.fontDisplay, fontWeight: 600, fontSize: 32, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
        {value}
      </div>
      {delta && (
        <div
          style={{
            marginTop: 6,
            fontFamily: t.fontMono,
            fontSize: 12,
            color: deltaPositive ? t.statusSuccess : t.fgMuted,
          }}
        >
          {deltaPositive ? "↑" : "↓"} {delta}
        </div>
      )}
    </div>
  );
}

export default WrldStatCard;
