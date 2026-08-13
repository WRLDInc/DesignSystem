import type * as React from 'react';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'warm';
  children?: React.ReactNode;
  onClick?: () => void;
  [key: string]: any;
}

/** WRLD.Tech button. Accents appear only on hover (shadow/lift), never as static fills. */
export function Button(props: ButtonProps): JSX.Element;
