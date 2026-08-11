export interface HeaderProps {
  /** Currently-active top-level route id (drives the active underline). */
  activeRoute?: string;
  /** Called with the target route id when a nav item is clicked. */
  onNavigate?: (route: string) => void;
}

/** Sticky wrld.tech site header with animated submenu + traveling underline; collapses to a drawer when narrow. */
export function Header(props: HeaderProps): JSX.Element;
