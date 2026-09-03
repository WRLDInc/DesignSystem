import * as React from "react";
import { WrldLockup } from "./wrld-lockup";

const label: React.CSSProperties = {
  fontFamily: "var(--wrld-font-body, Ubuntu, system-ui, sans-serif)",
  fontSize: 11,
  fontWeight: 500,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
};

const settings = {
  sub: "TECH",
  size: 26,
  animated: false,
};

export default function Demo(props: Partial<typeof settings>) {
  const s = { ...settings, ...props };
  const cell: React.CSSProperties = {
    flex: 1,
    minWidth: 240,
    minHeight: 180,
    display: "flex",
    flexDirection: "column",
    gap: 16,
    padding: "28px 32px",
  };
  return (
    <div style={{ display: "flex", flexWrap: "wrap", fontFamily: "var(--wrld-font-body, Ubuntu, system-ui, sans-serif)" }}>
      <div
        style={{
          ...cell,
          background: "var(--wrld-mono-0, #ffffff)",
          color: "var(--wrld-mono-950, #0a0a0a)",
          borderRight: "1px solid var(--wrld-mono-200, #e4e4e7)",
        }}
      >
        <span style={{ ...label, color: "var(--wrld-mono-600, #52525b)" }}>Mark + wordmark</span>
        <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
          <WrldLockup theme="dark" size={s.size} animated={s.animated} />
        </div>
      </div>
      <div
        style={{
          ...cell,
          background: "var(--wrld-mono-0, #ffffff)",
          color: "var(--wrld-mono-950, #0a0a0a)",
          borderRight: "1px solid var(--wrld-mono-200, #e4e4e7)",
        }}
      >
        <span style={{ ...label, color: "var(--wrld-mono-600, #52525b)" }}>With sub-brand</span>
        <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
          <WrldLockup theme="dark" size={s.size} sub={s.sub} animated={s.animated} />
        </div>
      </div>
      <div style={{ ...cell, background: "var(--wrld-mono-950, #0a0a0a)", color: "var(--wrld-mono-50, #fafafa)" }}>
        <span style={{ ...label, color: "var(--wrld-mono-400, #a1a1aa)" }}>On a dark surface</span>
        <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
          <WrldLockup theme="light" size={s.size} sub="AI" animated={s.animated} />
        </div>
      </div>
    </div>
  );
}
