/**
 * WRLD Design System — Typed Token Exports
 * Version: 0.1.0 · 2026-04-18
 *
 * These are the raw token values. For themed / semantic colors,
 * prefer the CSS variables from ./tokens.css (they automatically
 * swap between light and dark). Use these TS exports when you
 * need compile-time access to raw values (e.g., in Tailwind config,
 * JS motion code, or image generation pipelines).
 */

export const mono = {
  0:   '#ffffff',
  50:  '#fafafa',
  100: '#f4f4f5',
  200: '#e4e4e7',
  300: '#d4d4d8',
  400: '#a1a1aa',
  500: '#71717a',
  600: '#52525b',
  700: '#3f3f46',
  800: '#27272a',
  900: '#18181b',
  950: '#0a0a0a',
} as const;

/**
 * Interactive-only accent colors.
 * Never use as static fills on page surfaces.
 */
export const accent = {
  primary:   '#007fee', // WRLD blue — default hover/focus
  secondary: '#00adee', // original sky — gradient companion
  warm:      '#EE9300', // commerce CTA hover
} as const;

export const status = {
  success: '#10b981',
  warning: '#f59e0b',
  danger:  '#ef4444',
  info:    '#3b82f6',
} as const;

export const font = {
  display:   "Montserrat, 'Helvetica Neue', Arial, sans-serif",
  body:      'Ubuntu, Inter, system-ui, sans-serif',
  bodyAlt:   'Inter, Ubuntu, system-ui, sans-serif',
  mono:      "'JetBrains Mono', 'Fira Code', ui-monospace, monospace",
} as const;

export const weight = {
  regular:  400,
  medium:   500,
  semibold: 600,
  bold:     700,
} as const;

export const fontSize = {
  displayXl: 'clamp(3rem, 2rem + 4vw, 6rem)',
  displayLg: 'clamp(2.25rem, 1.5rem + 3vw, 4.25rem)',
  displayMd: 'clamp(1.75rem, 1.25rem + 2vw, 3rem)',
  h1:      '2.5rem',
  h2:      '2rem',
  h3:      '1.5rem',
  h4:      '1.25rem',
  h5:      '1.125rem',
  h6:      '1rem',
  bodyLg:  '1.125rem',
  body:    '1rem',
  bodySm:  '0.875rem',
  caption: '0.75rem',
} as const;

export const lineHeight = {
  display: 1.05,
  heading: 1.2,
  body:    1.6,
  ui:      1.4,
} as const;

export const letterSpacing = {
  display: '-0.02em',
  body:    '0',
  eyebrow: '0.12em',
  capsXl:  '0.28em',
} as const;

export const space = {
  0:  '0',
  1:  '0.25rem',
  2:  '0.5rem',
  3:  '0.75rem',
  4:  '1rem',
  5:  '1.25rem',
  6:  '1.5rem',
  8:  '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
  20: '5rem',
  30: '7.5rem',
} as const;

export const radius = {
  0:    '0',
  sm:   '4px',
  md:   '8px',
  lg:   '12px',
  pill: '9999px',
} as const;

export const border = {
  hairline: '1px',
  standard: '2px',
  emphasis: '3px',
} as const;

export const duration = {
  micro:    '120ms',
  default:  '200ms',
  emphasis: '320ms',
  reveal:   '600ms',
} as const;

export const easing = {
  standard: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
  enter:    'cubic-bezier(0.4, 0, 0.2, 1)',
  exit:     'cubic-bezier(0.4, 0, 1, 1)',
  precise:  'cubic-bezier(0.83, 0, 0.17, 1)',
} as const;

export const breakpoint = {
  sm:  '640px',
  md:  '768px',
  lg:  '1024px',
  xl:  '1280px',
  '2xl': '1536px',
} as const;

/**
 * Motion gradient — reserved for interaction moments.
 * Do NOT use as a static fill.
 */
export const accentGradient =
  `linear-gradient(90deg, ${accent.primary} 0%, ${accent.secondary} 50%, ${accent.warm} 100%)`;

export const tokens = {
  mono,
  accent,
  status,
  font,
  weight,
  fontSize,
  lineHeight,
  letterSpacing,
  space,
  radius,
  border,
  duration,
  easing,
  breakpoint,
  accentGradient,
} as const;

export type WRLDTokens = typeof tokens;
export default tokens;
