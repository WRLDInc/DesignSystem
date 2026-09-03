import * as React from "react";
import { WrldValuesStrip } from "./wrld-values-strip";

const frame: React.CSSProperties = {
  background: "var(--wrld-bg, var(--color-background, #ffffff))",
  color: "var(--wrld-fg, var(--color-foreground, #0a0a0a))",
  fontFamily: "var(--wrld-font-body, Ubuntu, system-ui, sans-serif)",
};

const settings = {
  eyebrow: "How we work",
  headline: "Five values, equally weighted. They shape every design and copy decision.",
};

export default function Demo(props: Partial<typeof settings>) {
  const s = { ...settings, ...props };
  return (
    <div style={frame}>
      <WrldValuesStrip eyebrow={s.eyebrow} headline={s.headline} style={{ padding: "56px 32px", borderTop: "none" }} />
    </div>
  );
}
