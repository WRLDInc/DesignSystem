import * as React from "react";
import { WrldTopBar } from "./wrld-top-bar";

const frame: React.CSSProperties = {
  // 21st's preview container is shrink-to-fit, so the frame needs a real width or
  // auto-fit grids collapse to one column. 100vw keeps it inside narrow panes.
  width: "min(1120px, 100vw)",
  boxSizing: "border-box",
  background: "var(--wrld-bg, var(--color-background, #ffffff))",
  color: "var(--wrld-fg, var(--color-foreground, #0a0a0a))",
  fontFamily: "var(--wrld-font-body, Ubuntu, system-ui, sans-serif)",
};

const settings = {
  title: "Agents",
  subtitle: "Workspace · Acme Roofing",
  primaryLabel: "+ New agent",
  secondaryLabel: "Export",
};

export default function Demo(props: Partial<typeof settings>) {
  const s = { ...settings, ...props };
  return (
    <div style={frame}>
      <WrldTopBar title={s.title} subtitle={s.subtitle} primaryLabel={s.primaryLabel} secondaryLabel={s.secondaryLabel} />
      <div style={{ padding: "24px 32px", fontSize: 13, color: "var(--wrld-fg-muted, var(--color-muted-foreground, #52525b))" }}>
        Content pane
      </div>
    </div>
  );
}
