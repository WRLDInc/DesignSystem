import * as React from "react";

/**
 * WRLD Search Trigger — the round icon button that opens the WRLD.AI search
 * overlay from a navigation bar. Sits in the nav's tool cluster beside the
 * theme toggle; optional ⌘K / Ctrl K hint for wider bars.
 *
 * Source of truth: github.com/WRLDInc/DesignSystem — deploy/index.html (#searchBtn)
 * Guideline: docs/AI_SEARCH_AGENTS.md §5.1 (part 1, "Trigger")
 *
 * Monochrome at rest. The primary accent appears on hover, focus and while the
 * dialog it controls is open (`expanded`), never as a static fill. Pair it with
 * WrldSearchDialog; the host owns the ⌘K listener and the `open` state.
 */

const t = {
  fg: "var(--wrld-fg, var(--color-foreground, #0a0a0a))",
  fgSubtle: "var(--wrld-fg-subtle, var(--color-muted-foreground, #71717a))",
  border: "var(--wrld-border, var(--color-border, #e4e4e7))",
  accent: "var(--wrld-accent-primary, #007fee)",
  shadowAccent: "var(--wrld-shadow-accent-primary, 0 10px 40px -8px rgb(0 127 238 / 0.22))",
  mono: "var(--wrld-font-mono, 'Ubuntu Mono', ui-monospace, SFMono-Regular, Menlo, monospace)",
  ease: "var(--wrld-ease-standard, cubic-bezier(0.2, 0.8, 0.2, 1))",
  duration: "var(--wrld-duration-default, 200ms)",
} as const;

export interface WrldSearchTriggerProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** Diameter in px. Defaults to 40, the nav tool size. */
  size?: number;
  /** Accessible label. Defaults to "Search WRLD". */
  label?: string;
  /** Show the ⌘K / Ctrl K hint next to the icon (turns the circle into a pill). */
  showShortcut?: boolean;
  /** True while the dialog this button controls is open. */
  expanded?: boolean;
  /** id of the dialog element, for aria-controls. */
  controls?: string;
}

export function WrldSearchTrigger({
  size = 40,
  label = "Search WRLD",
  showShortcut = false,
  expanded = false,
  controls,
  style,
  onMouseEnter,
  onMouseLeave,
  ...rest
}: WrldSearchTriggerProps) {
  const [hover, setHover] = React.useState(false);
  const apple =
    typeof navigator !== "undefined" && /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent);
  const active = hover || expanded;
  const icon = Math.round(size * 0.45);
  return (
    <button
      type="button"
      aria-label={label}
      title={`${label} (${apple ? "⌘K" : "Ctrl K"})`}
      aria-haspopup="dialog"
      aria-expanded={expanded}
      aria-controls={controls}
      aria-keyshortcuts="Meta+K Control+K"
      onMouseEnter={(e) => {
        setHover(true);
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        setHover(false);
        onMouseLeave?.(e);
      }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        height: size,
        width: showShortcut ? undefined : size,
        padding: showShortcut ? "0 12px 0 11px" : 0,
        borderRadius: 9999,
        border: `1px solid ${active ? t.accent : t.border}`,
        background: "transparent",
        color: active ? t.accent : t.fg,
        boxShadow: hover ? t.shadowAccent : "none",
        cursor: "pointer",
        transition: `color ${t.duration} ${t.ease}, border-color ${t.duration} ${t.ease}, box-shadow ${t.duration} ${t.ease}`,
        ...style,
      }}
      {...rest}
    >
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      {showShortcut && (
        <kbd
          style={{
            fontFamily: t.mono,
            fontSize: 11,
            lineHeight: 1,
            color: t.fgSubtle,
            border: `1px solid ${t.border}`,
            borderRadius: 3,
            padding: "3px 5px",
          }}
        >
          {apple ? "⌘K" : "Ctrl K"}
        </kbd>
      )}
    </button>
  );
}
