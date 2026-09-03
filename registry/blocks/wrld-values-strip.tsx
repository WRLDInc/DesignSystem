import * as React from "react";

/**
 * WRLD Values Strip — numbered values (01–NN) with a title and a supporting line
 * each, under an eyebrow and a display heading. Five columns at desktop width.
 *
 * Source of truth: github.com/WRLDInc/DesignSystem — ui_kits/wrld-tech/ValuesStrip.jsx
 * Tokens resolve WRLD tokens.css (--wrld-*) → host shadcn theme (--color-*) → WRLD
 * literal. Self-contained by design (one file per 21st component).
 */

const t = {
  fg: "var(--wrld-fg, var(--color-foreground, #0a0a0a))",
  fgMuted: "var(--wrld-fg-muted, var(--color-muted-foreground, #52525b))",
  border: "var(--wrld-border, var(--color-border, #e4e4e7))",
  fontDisplay: "var(--wrld-font-display, Montserrat, 'Helvetica Neue', Arial, sans-serif)",
  fontBody: "var(--wrld-font-body, Ubuntu, system-ui, -apple-system, sans-serif)",
  fontMono: "var(--wrld-font-mono, 'Ubuntu Mono', ui-monospace, SFMono-Regular, Menlo, monospace)",
} as const;

export interface WrldValue {
  /** Two-digit index shown in mono, e.g. "01". Derived from position when omitted. */
  num?: string;
  title: string;
  body: string;
}

export interface WrldValuesStripProps extends React.HTMLAttributes<HTMLElement> {
  eyebrow?: React.ReactNode;
  headline?: React.ReactNode;
  /** Defaults to the five WRLD values. */
  values?: WrldValue[];
}

export const WRLD_VALUES: WrldValue[] = [
  { num: "01", title: "Move with urgency", body: "Responsiveness is a feature, not a favor." },
  { num: "02", title: "Innovation at the edge", body: "Adopt new tools early — but ship, don’t experiment." },
  { num: "03", title: "Foundational integrity", body: "Transparency is non-negotiable." },
  { num: "04", title: "Excellence by action", body: "Quality is proved by outcomes, not promises." },
  { num: "05", title: "Collaboration & humility", body: "Over-communicate. Stay approachable." },
];

export function WrldValuesStrip({
  eyebrow = "How we work",
  headline = "Five values, equally weighted. They shape every design and copy decision.",
  values = WRLD_VALUES,
  style,
  ...rest
}: WrldValuesStripProps) {
  return (
    <section
      style={{
        padding: "80px 32px",
        maxWidth: 1280,
        margin: "0 auto",
        borderTop: `1px solid ${t.border}`,
        color: t.fg,
        fontFamily: t.fontBody,
        ...style,
      }}
      {...rest}
    >
      {eyebrow && (
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
          {eyebrow}
        </div>
      )}
      {headline && (
        <h2
          style={{
            fontFamily: t.fontDisplay,
            fontWeight: 600,
            letterSpacing: "-0.02em",
            fontSize: "clamp(1.75rem, 1.25rem + 1.5vw, 2.5rem)",
            lineHeight: 1.1,
            margin: "16px 0 40px",
            maxWidth: 720,
          }}
        >
          {headline}
        </h2>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 24 }}>
        {values.map((v, i) => (
          <div key={v.num ?? i} style={{ borderTop: `1px solid ${t.fg}`, paddingTop: 16 }}>
            <div style={{ fontFamily: t.fontMono, fontSize: 11, color: t.fgMuted, marginBottom: 8 }}>
              {v.num ?? String(i + 1).padStart(2, "0")}
            </div>
            <div style={{ fontFamily: t.fontDisplay, fontWeight: 600, fontSize: 16, letterSpacing: "-0.02em", marginBottom: 6 }}>
              {v.title}
            </div>
            <div style={{ fontSize: 13, lineHeight: 1.55, color: t.fgMuted }}>{v.body}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default WrldValuesStrip;
