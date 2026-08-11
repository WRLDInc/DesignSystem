import type * as React from 'react';

export interface EyebrowProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

/** Uppercase, letter-spaced eyebrow label sitting above headings. */
export function Eyebrow(props: EyebrowProps): JSX.Element;
