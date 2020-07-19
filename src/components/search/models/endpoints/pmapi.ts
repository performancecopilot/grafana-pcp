export interface PmApiLabelsResponse {
    [key: string]: string;
}

export interface PmApiMetricMetricResponse {
    name: string;
    series: string;
    pmid: string;
    type: string;
    indom?: string;
    sem: string;
    units: string;
    labels: PmApiLabelsResponse;
    'text-oneline': string;
    'text-help': string;
}

export interface PmApiMetricEndpointResponse {
    context: number;
    metrics: PmApiMetricMetricResponse[];
}

export interface PmApiIndomEndpointInstanceResponse {
    instance: number;
    name: string;
    labels: PmApiLabelsResponse;
}

export interface PmApiIndomEndpointResponse {
    context: number;
    indom: string;
    labels: PmApiLabelsResponse;
    'text-oneline': string;
    'text-help': string;
    instances: PmApiIndomEndpointInstanceResponse[];
}
