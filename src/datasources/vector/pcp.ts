export type MetricName = string;
export type Expr = string;
export type InstanceName = string;
export type InstanceId = number;
export type Labels = Record<string, string>;

export interface Context {
    context: number;
    labels: Labels;
}

export interface MetricMetadata {
    name: MetricName;
    indom?: string;
    sem: string;
    units: string;
    labels: Labels;
}

export interface Instance {
    name: InstanceName;
    instance: InstanceId;
    labels: Labels;
}

export interface InstanceDomain {
    instances: Instance[];
    labels: Labels;
}

export interface InstanceValue {
    instance: InstanceId | null;
    value: number;
}

export interface InstanceValuesSnapshot {
    timestampMs: number;
    values: InstanceValue[];
}


export function pcpUnitToGrafanaUnit(metadata: MetricMetadata): string | undefined {
    // pcp/src/libpcp/src/units.c
    // grafana-data/src/valueFormats/categories.ts
    if (metadata.sem == "counter") {
        switch (metadata.units) {
            case "byte": return "Bps";
            case "Kbyte": return "KBs";
            case "Mbyte": return "MBs";
            case "Gbyte": return "GBs";
        }
    }
    else {
        switch (metadata.units) {
            case "byte": return "bytes";
            case "Kbyte": return "kbytes";
            case "Mbyte": return "mbytes";
            case "Gbyte": return "gbytes";
        }
    }
    return undefined;
}