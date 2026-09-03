import * as React from "react";
import { icons, type LucideIcon } from "lucide-react";

/**
 * WRLD Agent List — selectable list of AI agents with a status dot, summary and
 * run counts.
 *
 * Source of truth: github.com/WRLDInc/DesignSystem — ui_kits/wrld-ai/AgentList.jsx
 * Tokens resolve WRLD tokens.css (--wrld-*) → host shadcn theme (--color-*) → WRLD
 * literal. Self-contained by design (one file per 21st component).
 *
 * Icons: Lucide is the working icon set of the system (1.5px stroke, currentColor).
 * `icon` accepts a Lucide name such as "bot" or "mail", or any React node.
 * Rows are real buttons, so the list is keyboard reachable.
 */

const t = {
  bgSubtle: "var(--wrld-bg-subtle, var(--color-sidebar, #fafafa))",
  bgMuted: "var(--wrld-bg-muted, var(--color-muted, #f4f4f5))",
  bgElevated: "var(--wrld-bg-elevated, var(--color-card, #ffffff))",
  fg: "var(--wrld-fg, var(--color-foreground, #0a0a0a))",
  fgMuted: "var(--wrld-fg-muted, var(--color-muted-foreground, #52525b))",
  fgSubtle: "var(--wrld-fg-subtle, var(--color-muted-foreground, #71717a))",
  border: "var(--wrld-border, var(--color-border, #e4e4e7))",
  statusSuccess: "var(--wrld-status-success, #10b981)",
  statusWarning: "var(--wrld-status-warning, #f59e0b)",
  fontBody: "var(--wrld-font-body, Ubuntu, system-ui, -apple-system, sans-serif)",
  fontMono: "var(--wrld-font-mono, 'Ubuntu Mono', ui-monospace, SFMono-Regular, Menlo, monospace)",
  shadowMd: "var(--wrld-shadow-md, 0 4px 12px 0 rgb(0 0 0 / 0.08), 0 2px 4px 0 rgb(0 0 0 / 0.04))",
  shadowAccentSecondary: "var(--wrld-shadow-accent-secondary, 0 10px 40px -8px rgb(0 173 238 / 0.20))",
  duration: "var(--wrld-duration-default, 200ms)",
  ease: "var(--wrld-ease-standard, cubic-bezier(0.2, 0.8, 0.2, 1))",
} as const;

export type WrldAgentStatus = "healthy" | "degraded" | "off";

export interface WrldAgent {
  id: string;
  name: string;
  /** Lucide icon name (e.g. "bot", "mail") or a React node. */
  icon?: string | React.ReactNode;
  summary: string;
  status: WrldAgentStatus;
  runs: number;
  lastRun: string;
  description?: string;
}

export interface WrldAgentListProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  agents: WrldAgent[];
  /** id of the selected agent. */
  activeId?: string;
  onSelect: (id: string) => void;
}

const statusColor: Record<WrldAgentStatus, string> = {
  healthy: t.statusSuccess,
  degraded: t.statusWarning,
  off: t.fgSubtle,
};

const toPascal = (name: string) =>
  name
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");

function AgentIcon({ icon, size = 18 }: { icon?: string | React.ReactNode; size?: number }) {
  if (icon == null) return null;
  if (typeof icon !== "string") return <>{icon}</>;
  const Icon = (icons as Record<string, LucideIcon>)[toPascal(icon)] ?? icons.Bot;
  return <Icon size={size} strokeWidth={1.5} aria-hidden="true" />;
}

function AgentRow({ agent, active, onSelect }: { agent: WrldAgent; active: boolean; onSelect: (id: string) => void }) {
  const [hover, setHover] = React.useState(false);
  const lifted = hover && !active;
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={() => onSelect(agent.id)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        width: "100%",
        textAlign: "left",
        padding: "16px 20px",
        borderRadius: 8,
        border: `1px solid ${t.border}`,
        background: active ? t.bgSubtle : t.bgElevated,
        color: t.fg,
        fontFamily: t.fontBody,
        cursor: "pointer",
        transition: `all ${t.duration} ${t.ease}`,
        boxShadow: lifted ? `${t.shadowMd}, ${t.shadowAccentSecondary}` : "none",
        transform: lifted ? "translateY(-1px)" : "none",
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 4,
          background: t.bgMuted,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <AgentIcon icon={agent.icon} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ fontWeight: 600, fontSize: 14 }}>{agent.name}</div>
          <span
            role="img"
            aria-label={agent.status}
            style={{ width: 6, height: 6, background: statusColor[agent.status], borderRadius: 99 }}
          />
        </div>
        <div style={{ fontSize: 12, color: t.fgMuted, marginTop: 2 }}>{agent.summary}</div>
      </div>
      <div style={{ fontFamily: t.fontMono, fontSize: 11, color: t.fgMuted, textAlign: "right", flexShrink: 0 }}>
        <div>{agent.runs} runs</div>
        <div>{agent.lastRun}</div>
      </div>
    </button>
  );
}

export function WrldAgentList({ agents, activeId, onSelect, style, ...rest }: WrldAgentListProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, ...style }} {...rest}>
      {agents.map((agent) => (
        <AgentRow key={agent.id} agent={agent} active={activeId === agent.id} onSelect={onSelect} />
      ))}
    </div>
  );
}

export default WrldAgentList;
