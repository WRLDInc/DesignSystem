import * as React from "react";
import { WrldServicesGrid } from "./wrld-services-grid";

const frame: React.CSSProperties = {
  background: "var(--wrld-bg, var(--color-background, #ffffff))",
  color: "var(--wrld-fg, var(--color-foreground, #0a0a0a))",
  fontFamily: "var(--wrld-font-body, Ubuntu, system-ui, sans-serif)",
};

const settings = {
  eyebrow: "What we do",
  note: "Six service branches. One partner.",
};

export default function Demo(props: Partial<typeof settings>) {
  const s = { ...settings, ...props };
  return (
    <div style={frame}>
      <WrldServicesGrid eyebrow={s.eyebrow} note={s.note} style={{ padding: "48px 32px", borderTop: "none" }} />
    </div>
  );
}
