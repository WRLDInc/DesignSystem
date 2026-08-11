export interface StatCardProps {
  label: string;
  value: string | number;
  /** Delta text, e.g. "12%". */
  delta?: string;
  /** true renders an up arrow / positive treatment; false a down arrow. */
  deltaPositive?: boolean;
}

/** Single KPI tile: label, value, and optional signed delta. */
export function StatCard(props: StatCardProps): JSX.Element;
