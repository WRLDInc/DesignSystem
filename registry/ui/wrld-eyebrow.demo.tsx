import * as React from "react";
import { WrldEyebrow } from "./wrld-eyebrow";

const frame: React.CSSProperties = {
  padding: 32,
  background: "var(--wrld-bg, var(--color-background, #ffffff))",
  color: "var(--wrld-fg, var(--color-foreground, #0a0a0a))",
  fontFamily: "var(--wrld-font-body, Ubuntu, system-ui, sans-serif)",
};

const settings = {
  eyebrow: "WRLD · Tech · Design · Support",
  heading: "Your strategic partner in technology and business growth.",
};

export default function Demo(props: Partial<typeof settings>) {
  const s = { ...settings, ...props };
  return (
    <div style={frame}>
      <WrldEyebrow>{s.eyebrow}</WrldEyebrow>
      <h2
        style={{
          fontFamily: "var(--wrld-font-display, Montserrat, 'Helvetica Neue', Arial, sans-serif)",
          fontWeight: 600,
          fontSize: 32,
          letterSpacing: "-0.02em",
          lineHeight: 1.1,
          margin: "16px 0 0",
          maxWidth: 640,
        }}
      >
        {s.heading}
      </h2>
    </div>
  );
}
