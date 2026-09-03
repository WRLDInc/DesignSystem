import * as React from "react";
import { WrldHero } from "./wrld-hero";

const frame: React.CSSProperties = {
  background: "var(--wrld-bg, var(--color-background, #ffffff))",
  color: "var(--wrld-fg, var(--color-foreground, #0a0a0a))",
  fontFamily: "var(--wrld-font-body, Ubuntu, system-ui, sans-serif)",
};

const settings = {
  eyebrow: "WRLD · Tech · Design · Support",
  headline: "Your strategic partner in technology and business growth.",
  lede: "We're the technology arm of your business — hosting to hardware to AI, under one roof. Built for SMBs that move fast and expect their tech to keep up.",
  primaryLabel: "Start a conversation →",
  secondaryLabel: "See if we're a fit",
};

export default function Demo(props: Partial<typeof settings>) {
  const s = { ...settings, ...props };
  return (
    <div style={frame}>
      <WrldHero
        eyebrow={s.eyebrow}
        headline={s.headline}
        lede={s.lede}
        primaryLabel={s.primaryLabel}
        secondaryLabel={s.secondaryLabel}
        style={{ padding: "72px 32px 56px" }}
      />
    </div>
  );
}
