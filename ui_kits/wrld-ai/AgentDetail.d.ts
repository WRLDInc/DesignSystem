export interface AgentDetailAgent {
  id: string;
  name: string;
  icon: string;
  summary: string;
  status: 'healthy' | 'degraded' | 'off';
  runs: number;
  lastRun: string;
  description?: string;
}

export interface AgentRun {
  status: 'success' | 'failed' | 'running';
  summary: string;
  duration: string;
  time: string;
}

export interface AgentDetailProps {
  agent: AgentDetailAgent | null;
  runs: AgentRun[];
}

/** Detail pane for one agent: header, description, and its recent run history. */
export function AgentDetail(props: AgentDetailProps): JSX.Element;
