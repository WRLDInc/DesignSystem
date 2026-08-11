export interface RunHistoryRun {
  status: 'success' | 'failed' | 'running';
  summary: string;
  duration: string;
  time: string;
}

export interface RunHistoryProps {
  runs: RunHistoryRun[];
}

/** Chronological list of agent run outcomes (success / failed / running). */
export function RunHistory(props: RunHistoryProps): JSX.Element;
