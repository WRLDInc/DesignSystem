import * as React from "react";
import { WrldHeader } from "./wrld-header";

const frame: React.CSSProperties = {
  // 21st's preview container is shrink-to-fit, so the frame needs a real width or
  // auto-fit grids collapse to one column. 100vw keeps it inside narrow panes.
  width: "min(1280px, 100vw)",
  boxSizing: "border-box",
  minHeight: 360,
  background: "var(--wrld-bg, var(--color-background, #ffffff))",
  color: "var(--wrld-fg, var(--color-foreground, #0a0a0a))",
  fontFamily: "var(--wrld-font-body, Ubuntu, system-ui, sans-serif)",
};

const settings = {
  ctaLabel: "Start a conversation",
  portalLabel: "Client portal ↗",
};

export default function Demo(props: Partial<typeof settings>) {
  const s = { ...settings, ...props };
  const [route, setRoute] = React.useState("home");
  return (
    <div style={frame}>
      <WrldHeader activeRoute={route} onNavigate={setRoute} ctaLabel={s.ctaLabel} portalLabel={s.portalLabel} />
      <div style={{ padding: "48px 32px", fontSize: 13, color: "var(--wrld-fg-muted, var(--color-muted-foreground, #52525b))" }}>
        Hover a section to open its submenu; the lockup takes the section's sub-brand label. Route: {route}
      </div>
    </div>
  );
}
