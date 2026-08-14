import type * as React from 'react';

export interface HelpButtonProps {
  /** Diameter in px. Defaults to 52 (menu/panel scale); 40 suits cards. */
  size?: number;
  /** Accessible label. Defaults to "Open WRLD Help chat". */
  label?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

/**
 * WRLD Help launcher — circular warm-accent (#EE9300) help button; the
 * canonical visual representation of the Gleap widget's corner launcher.
 * One of the few sanctioned static uses of the warm accent.
 */
export function HelpButton(props: HelpButtonProps): JSX.Element;
