import * as React from "react";
import { WrldSearchTrigger } from "./wrld-search-trigger";

const frame: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 16,
  padding: 32,
  background: "var(--wrld-bg, var(--color-background, #ffffff))",
  color: "var(--wrld-fg, var(--color-foreground, #0a0a0a))",
  fontFamily: "var(--wrld-font-body, Ubuntu, system-ui, sans-serif)",
};

const settings = {
  label: "Search WRLD",
  size: 40,
  showShortcut: true,
  expanded: false,
};

export default function Demo(props: Partial<typeof settings>) {
  const s = { ...settings, ...props };
  return (
    <div style={frame}>
      <WrldSearchTrigger label={s.label} size={s.size} expanded={s.expanded} />
      <WrldSearchTrigger label={s.label} size={s.size} expanded={s.expanded} showShortcut={s.showShortcut} />
      <WrldSearchTrigger label={s.label} size={s.size} expanded />
    </div>
  );
}
