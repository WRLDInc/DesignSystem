import * as React from "react";
import { WrldFooter } from "./wrld-footer";

const frame: React.CSSProperties = {
  // 21st's preview container is shrink-to-fit, so the frame needs a real width or
  // auto-fit grids collapse to one column. 100vw keeps it inside narrow panes.
  width: "min(1280px, 100vw)",
  boxSizing: "border-box",
  background: "var(--wrld-bg, var(--color-background, #ffffff))",
  color: "var(--wrld-fg, var(--color-foreground, #0a0a0a))",
  fontFamily: "var(--wrld-font-body, Ubuntu, system-ui, sans-serif)",
};

const settings = {
  description: "WRLD Tech Co., a DBA of WRLD Inc. SMB business technology, automation, and AI solutions.",
  legal: "© 2026 WRLD Inc. · EIN 84-5122446 · Dallas, TX",
  meta: "design system v0.4.0",
};

export default function Demo(props: Partial<typeof settings>) {
  const s = { ...settings, ...props };
  return (
    <div style={frame}>
      <WrldFooter description={s.description} legal={s.legal} meta={s.meta} style={{ borderTop: "none" }} />
    </div>
  );
}
