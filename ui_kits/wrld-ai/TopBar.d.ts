export interface TopBarProps {
  title: string;
  subtitle?: string;
}

/** WRLD.AI content top bar: title + subtitle on the left, primary action on the right. */
export function TopBar(props: TopBarProps): JSX.Element;
