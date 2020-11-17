import { IndomData, MetricData, MetricSiblingsData } from './state';
import {
    LOAD_INDOM_ERROR,
    LOAD_INDOM_INIT,
    LOAD_INDOM_PENDING,
    LOAD_INDOM_SUCCESS,
    LOAD_METRIC_ERROR,
    LOAD_METRIC_INIT,
    LOAD_METRIC_PENDING,
    LOAD_METRIC_SIBLINGS_ERROR,
    LOAD_METRIC_SIBLINGS_INIT,
    LOAD_METRIC_SIBLINGS_PENDING,
    LOAD_METRIC_SIBLINGS_SUCCESS,
    LOAD_METRIC_SUCCESS,
} from './types';

export interface LoadMetricInitAction {
    type: typeof LOAD_METRIC_INIT;
}

export interface LoadMetricPendingAction {
    type: typeof LOAD_METRIC_PENDING;
}

export interface LoadMetricSuccessAction {
    type: typeof LOAD_METRIC_SUCCESS;
    payload: MetricData;
}

export interface LoadMetricErrorAction {
    type: typeof LOAD_METRIC_ERROR;
}

export type LoadMetricAction =
    | LoadMetricInitAction
    | LoadMetricPendingAction
    | LoadMetricSuccessAction
    | LoadMetricErrorAction;

export interface LoadMetricSiblingsInitAction {
    type: typeof LOAD_METRIC_SIBLINGS_INIT;
}

export interface LoadMetricSiblingsPendingAction {
    type: typeof LOAD_METRIC_SIBLINGS_PENDING;
}

export interface LoadMetricSiblingsSuccessAction {
    type: typeof LOAD_METRIC_SIBLINGS_SUCCESS;
    payload: MetricSiblingsData;
}

export interface LoadMetricSiblingsErrorAction {
    type: typeof LOAD_METRIC_SIBLINGS_ERROR;
}

export type LoadMetricSiblingsAction =
    | LoadMetricSiblingsInitAction
    | LoadMetricSiblingsPendingAction
    | LoadMetricSiblingsSuccessAction
    | LoadMetricSiblingsErrorAction;

export interface LoadIndomInitAction {
    type: typeof LOAD_INDOM_INIT;
}

export interface LoadIndomPendingAction {
    type: typeof LOAD_INDOM_PENDING;
}

export interface LoadIndomSuccessAction {
    type: typeof LOAD_INDOM_SUCCESS;
    payload: IndomData;
}

export interface LoadIndomErrorAction {
    type: typeof LOAD_INDOM_ERROR;
}

export type LoadIndomAction =
    | LoadIndomInitAction
    | LoadIndomPendingAction
    | LoadIndomSuccessAction
    | LoadIndomErrorAction;

export type EntityAction = LoadMetricAction | LoadMetricSiblingsAction | LoadIndomAction;
