import * as React from "react";

/**
 * WRLD Run History — chronological list of agent run outcomes.
 *
 * Source of truth: github.com/WRLDInc/DesignSystem — ui_kits/wrld-ai/RunHistory.jsx
 * Tokens resolve WRLD tokens.css (--wrld-*) → host shadcn theme (--color-*) → WRLD
 * literal. Self-contained by design (one file per 21st component).
 *
 * Status pills use the system-semantic colours (success, danger) and the
 * secondary accent for "running". Pill backgrounds are a color-mix() tint of
 * the status colour so they hold up in both light and dark themes.
 */

const t = {
  bgSubtle: "var(--wrld-bg-subtle, var(--color-sidebar, #fafafa))",
  bgMuted: "var(--wrld-bg-muted, var(--color-muted, #f4f4f5))",
  fg: "var(--wrld-fg, var(--color-foreground, #0a0a0a))",
  fgMuted: "var(--wrld-fg-muted, var(--color-muted-foreground, #52525b))",
  border: "var(--wrld-border, var(--color-border, #e4e4e7))",
  accentSecondary: "var(--wrld-accent-secondary, #00adee)",
  statusSuccess: "var(--wrld-status-success, #10b981)",
  statusDanger: "var(--wrld-status-danger, #ef4444)",
  fontBody: "var(--wrld-font-body, Ubuntu, system-ui, -apple-system, sans-serif)",
  fontMono: "var(--wrld-font-mono, 'Ubuntu Mono', ui-monospace, SFMono-Regular, Menlo, monospace)",
} as const;

export type WrldRunStatus = "success" | "running" | "failed";

export interface WrldRun {
  status: WrldRunStatus;
  summary: string;
  duration: string;
  time: string;
}

export interface WrldRunHistoryProps extends React.HTMLAttributes<HTMLDivElement> {
  runs: WrldRun[];
  /** Header title. Defaults to "Recent runs". */
  title?: string;
  /** Header meta on the right, in mono. Defaults to "last 24h". */
  meta?: string;
}

const pillStyles: Record<WrldRunStatus, { bg: string; fg: string; dot: string }> = {
  success: {
    bg: `color-mix(in srgb, ${t.statusSuccess} 14%, transparent)`,
    fg: t.statusSuccess,
    dot: t.statusSuccess,
  },
  running: { bg: t.bgMuted, fg: t.fg, dot: t.accentSecondary },
  failed: {
    bg: `color-mix(in srgb, ${t.statusDanger} 14%, transparent)`,
    fg: t.statusDanger,
    dot: t.statusDanger,
  },
};

export function WrldRunHistory({ runs, title = "Recent runs", meta = "last 24h", style, ...rest }: WrldRunHistoryProps) {
  return (
    <div
      style={{
        border: `1px solid ${t.border}`,
        borderRadius: 8,
        overflow: "hidden",
        fontFamily: t.fontBody,
        color: t.fg,
        ...style,
      }}
      {...rest}
    >
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
        <div style={{ fontWeight: 600, fontSize: 14 }}>{title}</div>
        <div style={{ fontFamily: t.fontMono, fontSize: 11, color: t.fgMuted }}>{meta}</div>
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

export default WrldRunHistory;
