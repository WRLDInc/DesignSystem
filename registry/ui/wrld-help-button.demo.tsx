import * as React from "react";
import { WrldHelpButton } from "./wrld-help-button";

const frame: React.CSSProperties = {
  padding: 32,
  background: "var(--wrld-bg, var(--color-background, #ffffff))",
  color: "var(--wrld-fg, var(--color-foreground, #0a0a0a))",
  fontFamily: "var(--wrld-font-body, Ubuntu, system-ui, sans-serif)",
};

const settings = {
  size: 52,
  label: "Open WRLD Help chat",
};

export default function Demo(props: Partial<typeof settings>) {
  const s = { ...settings, ...props };
  return (
    <div style={frame}>
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <WrldHelpButton size={s.size} label={s.label} />
        <WrldHelpButton size={40} label={s.label} />
        <div style={{ maxWidth: 360, fontSize: 13, lineHeight: 1.55, color: "var(--wrld-fg-muted, var(--color-muted-foreground, #52525b))" }}>
          The Help launcher. Warm #EE9300 is one of the few sanctioned static accent uses; the near-black glyph and rim keep
          3:1 non-text contrast. The ping ring pauses under reduced motion.
        </div>
      </div>
    </div>
  );
}
