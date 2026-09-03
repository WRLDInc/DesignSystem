import * as React from "react";
import { WrldSidebar } from "./wrld-sidebar";

const frame: React.CSSProperties = {
  // 21st's preview container is shrink-to-fit, so the frame needs a real width or
  // auto-fit grids collapse to one column. 100vw keeps it inside narrow panes.
  width: "min(1120px, 100vw)",
  boxSizing: "border-box",
  display: "flex",
  height: 520,
  background: "var(--wrld-bg, var(--color-background, #ffffff))",
  color: "var(--wrld-fg, var(--color-foreground, #0a0a0a))",
  fontFamily: "var(--wrld-font-body, Ubuntu, system-ui, sans-serif)",
};

const settings = {
  workspaceName: "Acme Roofing",
  planLine: "Pro plan · 12 agents",
};

export default function Demo(props: Partial<typeof settings>) {
  const s = { ...settings, ...props };
  const [active, setActive] = React.useState("agents");
  return (
    <div style={frame}>
      <WrldSidebar active={active} onNavigate={setActive} workspace={{ name: s.workspaceName, plan: s.planLine }} style={{ height: "100%" }} />
      <div style={{ flex: 1, padding: 32, fontSize: 13, color: "var(--wrld-fg-muted, var(--color-muted-foreground, #52525b))" }}>
        Active: {active}
      </div>
    </div>
  );
}
