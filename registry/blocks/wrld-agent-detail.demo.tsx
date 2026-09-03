import * as React from "react";
import { WrldAgentDetail, type WrldAgentRun } from "./wrld-agent-detail";

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

const runs: WrldAgentRun[] = [
  { status: "success", summary: "Triaged 14 inbound tickets, escalated 2 to on-call", duration: "3.1s", time: "09:42" },
  { status: "running", summary: "Re-checking SLA timers for the open P2 queue", duration: "12s", time: "09:40" },
  { status: "success", summary: "Closed 5 duplicates and merged their threads", duration: "2.4s", time: "08:15" },
  { status: "failed", summary: "Portal sync — upstream API returned 502", duration: "0.6s", time: "07:00" },
];

const settings = {
  name: "Ticket triage",
  description: "Reads every inbound ticket, classifies it by system and urgency, and routes it to the right queue. Escalates anything that names an outage.",
};

export default function Demo(props: Partial<typeof settings>) {
  const s = { ...settings, ...props };
  return (
    <div style={frame}>
      <WrldAgentDetail agent={{ id: "triage", name: s.name, description: s.description, status: "healthy" }} runs={runs} />
    </div>
  );
}
