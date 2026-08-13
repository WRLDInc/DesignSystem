import type * as React from 'react';

/** Props for the canonical WRLD lockup. */
export interface LockupProps {
  /** Sub-brand label shown to the right of the wordmark (e.g. "TECH"). Null/undefined hides it. */
  sub?: string | null;
  /** "dark" = black mark on light surfaces; "light" = white mark on dark surfaces. */
  theme?: 'dark' | 'light';
  /** Wordmark font-size in px; the mark scales relative to it. */
  size?: number;
  /** Animate the sub-label fade + wordmark re-center (use for nav lockups that morph on hover). */
  animated?: boolean;
  style?: React.CSSProperties;
}

/** Canonical WRLD lockup: starburst mark + wordmark + optional right-aligned sub-brand label. */
export function Lockup(props: LockupProps): JSX.Element;
