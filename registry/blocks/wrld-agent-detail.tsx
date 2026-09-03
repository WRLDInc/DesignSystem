import * as React from "react";

/**
 * WRLD Agent Detail — the main pane of a WRLD.AI agents view: header with
 * actions, description, four KPI tiles and the recent run history.
 *
 * Source of truth: github.com/WRLDInc/DesignSystem — ui_kits/wrld-ai/AgentDetail.jsx
 * The stat card and run history are inlined because 21st publishes one
 * self-contained file per component; the standalone versions are wrld-stat-card
 * and wrld-run-history in the same library.
 */

const t = {
  bgSubtle: "var(--wrld-bg-subtle, var(--color-sidebar, #fafafa))",
  bgMuted: "var(--wrld-bg-muted, var(--color-muted, #f4f4f5))",
  bgElevated: "var(--wrld-bg-elevated, var(--color-card, #ffffff))",
  fg: "var(--wrld-fg, var(--color-foreground, #0a0a0a))",
  fgMuted: "var(--wrld-fg-muted, var(--color-muted-foreground, #52525b))",
  fgInverse: "var(--wrld-fg-inverse, var(--color-background, #ffffff))",
  border: "var(--wrld-border, var(--color-border, #e4e4e7))",
  borderStrong: "var(--wrld-border-strong, var(--color-input, #d4d4d8))",
  accentSecondary: "var(--wrld-accent-secondary, #00adee)",
  statusSuccess: "var(--wrld-status-success, #10b981)",
  statusDanger: "var(--wrld-status-danger, #ef4444)",
  fontDisplay: "var(--wrld-font-display, Montserrat, 'Helvetica Neue', Arial, sans-serif)",
  fontBody: "var(--wrld-font-body, Ubuntu, system-ui, -apple-system, sans-serif)",
  fontMono: "var(--wrld-font-mono, 'Ubuntu Mono', ui-monospace, SFMono-Regular, Menlo, monospace)",
} as const;

export type WrldAgentStatus = "healthy" | "degraded" | "off";
export type WrldRunStatus = "success" | "running" | "failed";

export interface WrldAgentDetailAgent {
  id: string;
  name: string;
  description?: string;
  status?: WrldAgentStatus;
}

export interface WrldAgentRun {
  status: WrldRunStatus;
  summary: string;
  duration: string;
  time: string;
}

export interface WrldAgentStat {
  label: string;
  value: React.ReactNode;
  delta?: string;
  deltaPositive?: boolean;
}

export interface WrldAgentDetailProps extends React.HTMLAttributes<HTMLDivElement> {
  agent: WrldAgentDetailAgent | null;
  runs: WrldAgentRun[];
  /** KPI tiles. Defaults to a representative set of four. */
  stats?: WrldAgentStat[];
  editLabel?: string | null;
  runLabel?: string | null;
  onEdit?: () => void;
  onRun?: () => void;
}

export const WRLD_AGENT_STATS: WrldAgentStat[] = [
  { label: "Runs · 30d", value: "284", delta: "12% wow", deltaPositive: true },
  { label: "Avg duration", value: "3.2s", delta: "0.4s wow", deltaPositive: true },
  { label: "Success rate", value: "98.6%", delta: "0.2pp wow", deltaPositive: true },
  { label: "Cost · 30d", value: "$14.20", delta: "2% wow" },
];

const actionBase: React.CSSProperties = {
  fontFamily: t.fontBody,
  fontSize: 13,
  fontWeight: 500,
  lineHeight: 1.4,
  padding: "8px 14px",
  borderRadius: 4,
  cursor: "pointer",
};

function StatCard({ label, value, delta, deltaPositive }: WrldAgentStat) {
  return (
    <div style={{ border: `1px solid ${t.border}`, borderRadius: 8, padding: 20, background: t.bgElevated }}>
      <div
        className="eyebrow"
        style={{ fontFamily: t.fontBody, fontSize: 11, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: t.fgMuted, marginBottom: 10 }}
      >
        {label}
      </div>
      <div style={{ fontFamily: t.fontDisplay, fontWeight: 600, fontSize: 32, letterSpacing: "-0.02em", lineHeight: 1.1 }}>{value}</div>
      {delta && (
        <div style={{ marginTop: 6, fontFamily: t.fontMono, fontSize: 12, color: deltaPositive ? t.statusSuccess : t.fgMuted }}>
          {deltaPositive ? "↑" : "↓"} {delta}
        </div>
      )}
    </div>
  );
}

const pillStyles: Record<WrldRunStatus, { bg: string; fg: string; dot: string }> = {
  success: { bg: `color-mix(in srgb, ${t.statusSuccess} 14%, transparent)`, fg: t.statusSuccess, dot: t.statusSuccess },
  running: { bg: t.bgMuted, fg: t.fg, dot: t.accentSecondary },
  failed: { bg: `color-mix(in srgb, ${t.statusDanger} 14%, transparent)`, fg: t.statusDanger, dot: t.statusDanger },
};

function RunHistory({ runs }: { runs: WrldAgentRun[] }) {
  return (
    <div style={{ border: `1px solid ${t.border}`, borderRadius: 8, overflow: "hidden" }}>
      <div
        style={{
          padding: "14px 20px",
          borderBottom: `1px solid ${t.border}`,
          background: t.bgSubtle,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ fontWeight: 600, fontSize: 14 }}>Recent runs</div>
        <div style={{ fontFamily: t.fontMono, fontSize: 11, color: t.fgMuted }}>last 24h</div>
      </div>
      <div>
        {runs.map((run, i) => {
          const s = pillStyles[run.status];
          return (
            <div
              key={`${run.time}-${i}`}
              style={{
                display: "grid",
                gridTemplateColumns: "120px 1fr 100px 80px",
                gap: 16,
                alignItems: "center",
                padding: "12px 20px",
                borderTop: i === 0 ? "none" : `1px solid ${t.border}`,
                fontSize: 13,
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "2px 8px",
                  borderRadius: 9999,
                  fontSize: 11,
                  fontWeight: 500,
                  background: s.bg,
                  color: s.fg,
                  width: "fit-content",
                }}
              >
                <span style={{ width: 6, height: 6, background: s.dot, borderRadius: 99 }} />
                {run.status}
              </span>
              <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{run.summary}</div>
              <span style={{ fontFamily: t.fontMono, fontSize: 11, color: t.fgMuted }}>{run.duration}</span>
              <span style={{ fontFamily: t.fontMono, fontSize: 11, color: t.fgMuted, textAlign: "right" }}>{run.time}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function WrldAgentDetail({
  agent,
  runs,
  stats = WRLD_AGENT_STATS,
  editLabel = "Edit prompt",
  runLabel = "Run now",
  onEdit,
  onRun,
  style,
  ...rest
}: WrldAgentDetailProps) {
  if (!agent) return null;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, color: t.fg, fontFamily: t.fontBody, ...style }} {...rest}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
        <div>
          <div
            className="eyebrow"
            style={{ fontFamily: t.fontBody, fontSize: 11, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: t.fgMuted, marginBottom: 8 }}
          >
            Agent · {agent.id}
          </div>
          <h2 style={{ fontFamily: t.fontDisplay, fontWeight: 600, fontSize: 24, letterSpacing: "-0.02em", lineHeight: 1.2, margin: "0 0 8px" }}>
            {agent.name}
          </h2>
          {agent.description && (
            <p style={{ fontSize: 14, color: t.fgMuted, maxWidth: 640, margin: 0, lineHeight: 1.55 }}>{agent.description}</p>
          )}
        </div>
        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          {editLabel && (
            <button type="button" onClick={onEdit} style={{ ...actionBase, border: `1px solid ${t.borderStrong}`, background: "transparent", color: t.fg }}>
              {editLabel}
            </button>
          )}
          {runLabel && (
            <button type="button" onClick={onRun} style={{ ...actionBase, border: `1px solid ${t.fg}`, background: t.fg, color: t.fgInverse }}>
              {runLabel}
            </button>
          )}
        </div>
      </div>
      {stats.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12 }}>
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>
      )}
      <RunHistory runs={runs} />
    </div>
  );
}

export default WrldAgentDetail;
