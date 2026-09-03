import * as React from "react";

/**
 * WRLD CTA — the closing call-to-action band: an inverted monochrome surface
 * (near-black in light mode) with eyebrow, display headline, one button and a
 * contact line. Use once, at the end of a marketing page.
 *
 * Source of truth: github.com/WRLDInc/DesignSystem — ui_kits/wrld-tech/CTA.jsx
 * The band is deliberately fixed to the mono scale rather than the surface
 * tokens: it is the one inverted moment on the page in either theme.
 */

const t = {
  mono950: "var(--wrld-mono-950, #0a0a0a)",
  mono50: "var(--wrld-mono-50, #fafafa)",
  mono400: "var(--wrld-mono-400, #a1a1aa)",
  fontDisplay: "var(--wrld-font-display, Montserrat, 'Helvetica Neue', Arial, sans-serif)",
  fontBody: "var(--wrld-font-body, Ubuntu, system-ui, -apple-system, sans-serif)",
  fontMono: "var(--wrld-font-mono, 'Ubuntu Mono', ui-monospace, SFMono-Regular, Menlo, monospace)",
  shadowAccentPrimary: "var(--wrld-shadow-accent-primary, 0 10px 40px -8px rgb(0 127 238 / 0.22))",
  duration: "var(--wrld-duration-default, 200ms)",
  ease: "var(--wrld-ease-standard, cubic-bezier(0.2, 0.8, 0.2, 1))",
} as const;

export interface WrldCtaProps extends React.HTMLAttributes<HTMLElement> {
  /** Eyebrow above the headline. Defaults to "Get in touch". */
  eyebrow?: React.ReactNode;
  /** Display headline. Defaults to the short tagline. */
  headline?: React.ReactNode;
  /** Button label. Pass null to hide the button. */
  buttonLabel?: string | null;
  /** Optional link target; renders the button as an anchor. */
  href?: string;
  onClick?: () => void;
  /** Mono contact line under the button, e.g. an email and a city. */
  contact?: React.ReactNode;
}

export function WrldCta({
  eyebrow = "Get in touch",
  headline = "Tech that moves with you.",
  buttonLabel = "Start a conversation →",
  href,
  onClick,
  contact = "ridge@wrld.tech · Dallas, TX",
  style,
  ...rest
}: WrldCtaProps) {
  const [hover, setHover] = React.useState(false);
  const buttonStyle: React.CSSProperties = {
    fontFamily: t.fontBody,
    fontSize: 14,
    fontWeight: 500,
    lineHeight: 1.4,
    padding: "14px 22px",
    borderRadius: 4,
    cursor: "pointer",
    background: t.mono50,
    color: t.mono950,
    border: "none",
    textDecoration: "none",
    display: "inline-block",
    boxShadow: hover ? t.shadowAccentPrimary : "none",
    transform: hover ? "translateY(-1px)" : "none",
    transition: `all ${t.duration} ${t.ease}`,
  };
  const hoverProps = { onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false) };

  return (
    <section style={{ padding: "0 32px", fontFamily: t.fontBody, ...style }} {...rest}>
      <div
        style={{
          maxWidth: 1280,
          margin: "64px auto",
          padding: "80px 64px",
          background: t.mono950,
          color: t.mono50,
          borderRadius: 8,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 48,
        }}
      >
        <div>
          {eyebrow && (
            <div
              className="eyebrow"
              style={{
                color: t.mono400,
                fontFamily: t.fontBody,
                fontSize: 12,
                fontWeight: 500,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              {eyebrow}
            </div>
          )}
          <h2
            style={{
              fontFamily: t.fontDisplay,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              fontSize: "clamp(2rem, 1.5rem + 1.5vw, 2.75rem)",
              lineHeight: 1.1,
              margin: 0,
              maxWidth: 640,
            }}
          >
            {headline}
          </h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-end" }}>
          {buttonLabel &&
            (href ? (
              <a href={href} onClick={onClick} style={buttonStyle} {...hoverProps}>
                {buttonLabel}
              </a>
            ) : (
              <button type="button" onClick={onClick} style={buttonStyle} {...hoverProps}>
                {buttonLabel}
              </button>
            ))}
          {contact && <div style={{ fontFamily: t.fontMono, fontSize: 12, color: t.mono400 }}>{contact}</div>}
        </div>
      </div>
    </section>
  );
}

export default WrldCta;
