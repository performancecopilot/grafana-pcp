export enum MetricType {
    Control = "control",
    Histogram = "histogram",
    Output = "output",
    Stacks = "stacks"
}

export enum Status {
    Stopped = "stopped",
    Starting = "starting",
    Started = "started",
    Stopping = "stopping",
    Error = "error"
}

export interface VariableDefinition {
    single: boolean;
    semantics: number;
    datatype: number;
    metrictype: MetricType;
}

export interface ScriptMetadata {
    name: string | null;
    include: string[] | null;
    table_retain_lines: number | null;
}

export interface State {
    status: Status;
    pid: number;
    exit_code: number;
    error: string;
    probes: number;
    data: Record<string, any>;
}

export interface Script {
    script_id: string;
    state: State;
    variables: Record<string, VariableDefinition>;
    metadata: ScriptMetadata;
}
