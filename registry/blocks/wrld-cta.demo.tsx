import * as React from "react";
import { WrldCta } from "./wrld-cta";

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
  eyebrow: "Get in touch",
  headline: "Tech that moves with you.",
  buttonLabel: "Start a conversation →",
  contact: "ridge@wrld.tech · Dallas, TX",
};

export default function Demo(props: Partial<typeof settings>) {
  const s = { ...settings, ...props };
  return (
    <div style={frame}>
      <WrldCta eyebrow={s.eyebrow} headline={s.headline} buttonLabel={s.buttonLabel} contact={s.contact} href="mailto:ridge@wrld.tech" />
    </div>
  );
}
