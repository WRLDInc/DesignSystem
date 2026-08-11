export interface SidebarProps {
  /** Active nav item id. */
  active?: string;
  onNavigate?: (route: string) => void;
}

/** WRLD.AI dashboard left nav with lockup, sections, and plan footer. */
export function Sidebar(props: SidebarProps): JSX.Element;
