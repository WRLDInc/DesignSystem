import * as React from "react";
import { WrldButton } from "./wrld-button";

const frame: React.CSSProperties = {
  padding: 32,
  background: "var(--wrld-bg, var(--color-background, #ffffff))",
  color: "var(--wrld-fg, var(--color-foreground, #0a0a0a))",
  fontFamily: "var(--wrld-font-body, Ubuntu, system-ui, sans-serif)",
};

const settings = {
  primaryLabel: "Start a conversation →",
  secondaryLabel: "See if we're a fit",
  ghostLabel: "Learn more →",
  warmLabel: "Upgrade plan",
  showDisabled: true,
};

export default function Demo(props: Partial<typeof settings>) {
  const s = { ...settings, ...props };
  return (
    <div style={frame}>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <WrldButton variant="primary">{s.primaryLabel}</WrldButton>
        <WrldButton variant="secondary">{s.secondaryLabel}</WrldButton>
        <WrldButton variant="ghost">{s.ghostLabel}</WrldButton>
        <WrldButton variant="warm">{s.warmLabel}</WrldButton>
        {s.showDisabled && (
          <WrldButton variant="primary" disabled>
            Disabled
          </WrldButton>
        )}
      </div>
      <p
        style={{
          margin: "20px 0 0",
          fontFamily: "var(--wrld-font-mono, 'Ubuntu Mono', ui-monospace, monospace)",
          fontSize: 12,
          color: "var(--wrld-fg-muted, var(--color-muted-foreground, #52525b))",
        }}
      >
        Hover lifts with an accent-tinted shadow. Primary uses #007FEE, commerce uses #EE9300.
      </p>
    </div>
  );
}
