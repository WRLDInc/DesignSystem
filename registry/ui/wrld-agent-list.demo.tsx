import * as React from "react";
import { WrldAgentList, type WrldAgent } from "./wrld-agent-list";

const frame: React.CSSProperties = {
  padding: 32,
  maxWidth: 720,
  background: "var(--wrld-bg, var(--color-background, #ffffff))",
  color: "var(--wrld-fg, var(--color-foreground, #0a0a0a))",
  fontFamily: "var(--wrld-font-body, Ubuntu, system-ui, sans-serif)",
};

const agents: WrldAgent[] = [
  { id: "triage", name: "Ticket triage", icon: "inbox", summary: "Classifies inbound tickets and routes to the right queue", status: "healthy", runs: 284, lastRun: "2m ago" },
  { id: "followup", name: "Sales follow-up", icon: "mail", summary: "Drafts follow-ups from pipeline stage changes", status: "healthy", runs: 96, lastRun: "18m ago" },
  { id: "invoices", name: "Invoice reconciliation", icon: "receipt", summary: "Matches payments to invoices every night", status: "degraded", runs: 31, lastRun: "1h ago" },
  { id: "pricing", name: "Vendor price sync", icon: "refresh-cw", summary: "Pulls distributor pricing into the quote sheet", status: "off", runs: 12, lastRun: "3d ago" },
];

export default function Demo() {
  const [activeId, setActiveId] = React.useState("triage");
  return (
    <div style={frame}>
      <WrldAgentList agents={agents} activeId={activeId} onSelect={setActiveId} />
    </div>
  );
}
