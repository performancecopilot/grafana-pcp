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
    url: string;
    hostspec?: string;
    context?: number;
}

export interface ContextRequest extends PmapiRequest {
    /** context timeout in seconds */
    polltimeout?: number;
}
export type ContextResponse = Context;

export interface MetricRequest extends PmapiRequest {
    names: string[];
}
export interface MetricResponse {
    metrics: Metadata[];
}

export interface IndomRequest extends PmapiRequest {
    name: string;
}
export interface IndomResponse {
    instances: Indom[];
    labels: Labels;
}

export interface FetchRequest extends PmapiRequest {
    names: string[];
}
export interface FetchResponse {
    timestamp: number;
    values: MetricInstanceValues[];
}

export interface StoreRequest extends PmapiRequest {
    name: string;
    value: string;
}
export interface StoreResponse {
    success: boolean;
}

export interface DeriveRequest extends PmapiRequest {
    name: string;
    expr: string;
}
export interface DeriveResponse {
    success: boolean;
}

export interface ChildrenRequest extends PmapiRequest {
    prefix: string;
}
export interface ChildrenResponse {
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
