export interface Agent {
  id: string;
  name: string;
  icon: string;
  summary: string;
  status: 'healthy' | 'degraded' | 'off';
  runs: number;
  lastRun: string;
  description?: string;
}

export interface AgentListProps {
  agents: Agent[];
  /** id of the currently-selected agent. */
  activeId?: string;
  onSelect?: (id: string) => void;
}

/** Selectable list of AI agents with status dot, summary, and run counts. */
export function AgentList(props: AgentListProps): JSX.Element;
