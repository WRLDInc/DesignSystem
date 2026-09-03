import * as React from "react";
import { WrldRunHistory, type WrldRun } from "./wrld-run-history";

const frame: React.CSSProperties = {
  padding: 32,
  background: "var(--wrld-bg, var(--color-background, #ffffff))",
  color: "var(--wrld-fg, var(--color-foreground, #0a0a0a))",
  fontFamily: "var(--wrld-font-body, Ubuntu, system-ui, sans-serif)",
};

const runs: WrldRun[] = [
  { status: "success", summary: "Triaged 14 inbound tickets, escalated 2 to on-call", duration: "3.1s", time: "09:42" },
  { status: "running", summary: "Weekly invoice reconciliation against QuickBooks", duration: "1m 12s", time: "09:30" },
  { status: "success", summary: "Drafted 6 follow-up emails for the sales pipeline", duration: "2.8s", time: "08:15" },
  { status: "failed", summary: "Vendor price sync — API rate limit reached", duration: "0.4s", time: "07:00" },
  { status: "success", summary: "Nightly backup verification across 3 sites", duration: "4.6s", time: "02:00" },
];

const settings = {
  title: "Recent runs",
  meta: "last 24h",
};

export default function Demo(props: Partial<typeof settings>) {
  const s = { ...settings, ...props };
  return (
    <div style={frame}>
      <WrldRunHistory runs={runs} title={s.title} meta={s.meta} />
    </div>
  );
}
