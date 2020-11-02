import { DataSourceInstanceSettings } from '@grafana/data';
import { InstanceName, Labels, MetricName, Semantics } from 'common/types/pcp';

export interface PmApiConfig {
    dsInstanceSettings: DataSourceInstanceSettings;
    timeoutMs: number;
}

export type InstanceId = number;

export interface Context {
    context: number;
    labels: Labels;
}

export interface Metadata {
    name: MetricName;
    indom?: string;
    type: string;
    sem: Semantics;
    series: string;
    units: string;
    labels: Labels;
    'text-help': string;
    'text-oneline': string;
}

export interface Indom {
    name: InstanceName;
    instance: InstanceId;
    labels: Labels;
}

export interface MetricInstanceValues {
    name: MetricName;
    instances: InstanceValue[];
}

export interface InstanceValue {
    instance: InstanceId | null;
    value: number | string;
}

export interface PmapiRequest {
    hostspec?: string;
    context?: number;
}

export interface PmapiContextRequest extends PmapiRequest {
    /** context timeout in seconds */
    polltimeout?: number;
}
export type PmapiContextResponse = Context;

export interface PmapiMetricRequest extends PmapiRequest {
    names: string[];
}
export interface PmapiMetricResponse {
    metrics: Metadata[];
}

export interface PmapiIndomRequest extends PmapiRequest {
    name: string;
}
export interface PmapiIndomResponse {
    instances: Indom[];
    labels: Labels;
}

export interface PmapiFetchRequest extends PmapiRequest {
    names: string[];
}
export interface PmapiFetchResponse {
    timestamp: number;
    values: MetricInstanceValues[];
}

export interface PmapiStoreRequest extends PmapiRequest {
    name: string;
    value: string;
}
export interface PmapiStoreResponse {
    success: boolean;
}

export interface PmapiDeriveRequest extends PmapiRequest {
    name: string;
    expr: string;
}
export interface PmapiDeriveResponse {
    success: boolean;
}

export interface PmapiChildrenRequest extends PmapiRequest {
    prefix: string;
}
export interface PmapiChildrenResponse {
    leaf: string[];
    nonleaf: string[];
}

export class MetricNotFoundError extends Error {
    constructor(readonly metric: string, message?: string) {
        super(message ?? `Cannot find metric ${metric}. Please check if the PMDA is enabled.`);
        this.metric = metric;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class NoIndomError extends Error {
    constructor(readonly metric: string, message?: string) {
        super(message ?? `Metric ${metric} has no instance domain.`);
        this.metric = metric;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class MetricSemanticError extends Error {
    constructor(readonly expr: string, message?: string) {
        super(message ?? `Semantic error in '${expr}' definition.`);
        this.expr = expr;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class MetricSyntaxError extends Error {
    constructor(readonly expr: string, message?: string) {
        super(message ?? `Syntax error in '${expr}' definition.`);
        this.expr = expr;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class DuplicateDerivedMetricNameError extends Error {
    constructor(readonly metric: string, message?: string) {
        super(message ?? `Duplicate derived metric name ${metric}`);
        this.metric = metric;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class PermissionError extends Error {
    constructor(readonly metric: string, message?: string) {
        super(message ?? `Insufficient permissions to store metric ${metric}. Please check the PMDA configuration.`);
        this.metric = metric;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
