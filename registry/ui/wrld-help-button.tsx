import * as React from "react";

/**
 * WRLD Help Button — the circular warm-accent help launcher that anchors the
 * bottom corner of every WRLD property. In production the Help widget owns
 * that corner; this component is its canonical visual for menus, cards and
 * prototypes (for example the header mega menu's Help panel).
 *
 * Source of truth: github.com/WRLDInc/DesignSystem — ui_kits/wrld-tech/HelpButton.jsx
 *
 * Warm #EE9300 is reserved for commerce and support moments; this is one of the
 * few sanctioned static uses. The glyph and hairline rim use near-black so both
 * the icon and the control boundary clear the WCAG 1.4.11 3:1 non-text contrast
 * threshold (white on #EE9300 is only ~2.4:1). The ping ring is decorative and
 * disabled under prefers-reduced-motion.
 */

const t = {
  mono950: "var(--wrld-mono-950, #0a0a0a)",
  accentWarm: "var(--wrld-accent-warm, #EE9300)",
  shadowAccentWarm: "var(--wrld-shadow-accent-warm, 0 10px 40px -8px rgb(238 147 0 / 0.22))",
  ease: "var(--wrld-ease-standard, cubic-bezier(0.2, 0.8, 0.2, 1))",
} as const;

export interface WrldHelpButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** Diameter in px. Defaults to 52 (menu/panel scale); 40 suits cards. */
  size?: number;
  /** Accessible label. Defaults to "Open WRLD Help chat". */
  label?: string;
}

export function WrldHelpButton({
  size = 52,
  label = "Open WRLD Help chat",
  style,
  onMouseEnter,
  onMouseLeave,
  ...rest
}: WrldHelpButtonProps) {
  const [hover, setHover] = React.useState(false);
  const glyph = Math.round(size * 0.46);
  return (
    <button
      type="button"
      aria-label={label}
      onMouseEnter={(e) => {
        setHover(true);
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        setHover(false);
        onMouseLeave?.(e);
      }}
      style={{
        position: "relative",
        width: size,
        height: size,
        border: `1px solid ${t.mono950}`,
        borderRadius: "50%",
        background: t.accentWarm,
        color: t.mono950,
        display: "grid",
        placeItems: "center",
        cursor: "pointer",
        padding: 0,
        boxShadow: t.shadowAccentWarm,
        transform: hover ? "translateY(-1px) scale(1.05)" : "none",
        transition: `transform 200ms ${t.ease}, box-shadow 200ms ${t.ease}`,
        ...style,
      }}
      {...rest}
    >
      <style>{`
        @keyframes wrld-help-ping {
          0% { transform: scale(1); opacity: .8; }
          70%, 100% { transform: scale(1.5); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .wrld-help-ping { animation: none !important; }
        }
      `}</style>
      <svg
        width={glyph}
        height={glyph}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
        <path d="M9.8 9.3a2.3 2.3 0 0 1 4.5.7c0 1.5-2.3 2.1-2.3 2.1" />
        <path d="M12 15.4h.01" />
      </svg>
      <span
        className="wrld-help-ping"
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          border: "1px solid rgb(238 147 0 / 0.55)",
          animation: `wrld-help-ping 2.8s ${t.ease} infinite`,
          pointerEvents: "none",
        }}
      />
    </button>
  );
}

export default WrldHelpButton;
