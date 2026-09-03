import * as React from "react";

/**
 * WRLD Eyebrow — uppercase, letter-spaced label placed above a heading.
 *
 * Source of truth: github.com/WRLDInc/DesignSystem — ui_kits/wrld-tech/Eyebrow.jsx
 * Tokens resolve WRLD tokens.css (--wrld-*) → host shadcn theme (--color-*) → WRLD
 * literal. Self-contained by design (one file per 21st component).
 *
 * This is one of the few sanctioned uses of uppercase in the system: eyebrow
 * microtype at 0.12em tracking. Everything else is sentence case.
 */

const t = {
  fgMuted: "var(--wrld-fg-muted, var(--color-muted-foreground, #52525b))",
  fontBody: "var(--wrld-font-body, Ubuntu, system-ui, -apple-system, sans-serif)",
  lsEyebrow: "var(--wrld-ls-eyebrow, 0.12em)",
} as const;

export interface WrldEyebrowProps extends React.HTMLAttributes<HTMLElement> {
  /** Element to render. Defaults to "div"; use "span" inline or "p" in prose. */
  as?: "div" | "span" | "p";
}

export function WrldEyebrow({ as: Tag = "div", style, className, children, ...rest }: WrldEyebrowProps) {
  return (
    <Tag
      className={["eyebrow", className].filter(Boolean).join(" ")}
      style={{
        fontFamily: t.fontBody,
        fontSize: 12,
        fontWeight: 500,
        lineHeight: 1.4,
        letterSpacing: t.lsEyebrow,
        textTransform: "uppercase",
        color: t.fgMuted,
        margin: 0,
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export default WrldEyebrow;
