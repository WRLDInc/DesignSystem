import * as React from "react";
import { WrldStatCard } from "./wrld-stat-card";

const frame: React.CSSProperties = {
  // 21st's preview container is shrink-to-fit, so the frame needs a real width or
  // auto-fit grids collapse to one column. 100vw keeps it inside narrow panes.
  width: "min(1120px, 100vw)",
  boxSizing: "border-box",
  padding: 32,
  background: "var(--wrld-bg, var(--color-background, #ffffff))",
  color: "var(--wrld-fg, var(--color-foreground, #0a0a0a))",
  fontFamily: "var(--wrld-font-body, Ubuntu, system-ui, sans-serif)",
};

const settings = {
  label: "Runs · 30d",
  value: "284",
  delta: "12% wow",
  deltaPositive: true,
};

export default function Demo(props: Partial<typeof settings>) {
  const s = { ...settings, ...props };
  return (
    <div style={frame}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
        <WrldStatCard label={s.label} value={s.value} delta={s.delta} deltaPositive={s.deltaPositive} />
        <WrldStatCard label="Avg duration" value="3.2s" delta="0.4s wow" deltaPositive />
        <WrldStatCard label="Success rate" value="98.6%" delta="0.2pp wow" deltaPositive />
        <WrldStatCard label="Cost · 30d" value="$14.20" delta="2% wow" />
      </div>
    </div>
  );
}
