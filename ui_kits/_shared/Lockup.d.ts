import type * as React from 'react';

/** Props for the canonical WRLD lockup. */
export interface LockupProps {
  /** Sub-brand label shown to the right of the wordmark (e.g. "TECH"). Null/undefined hides it. */
  sub?: string | null;
  /** "auto" (default) follows the document theme. "dark" = black mark (light surfaces); "light" = white mark (dark surfaces). */
  theme?: 'auto' | 'dark' | 'light';
  /** Wordmark font-size in px; the mark scales relative to it. */
  size?: number;
  /** Animate the sub-label fade + wordmark re-center (use for nav lockups that morph on hover). */
  animated?: boolean;
  /** URL of the starburst mark. Default: window.WRLD_ASSETS.markBlack / .markWhite when the host page sets them, else the repo's assets/logos/wrld-mark-{black,white}.png. */
  markSrc?: string;
  style?: React.CSSProperties;
}

/** Canonical WRLD lockup: starburst mark + wordmark + optional right-aligned sub-brand label. */
export function Lockup(props: LockupProps): JSX.Element;
