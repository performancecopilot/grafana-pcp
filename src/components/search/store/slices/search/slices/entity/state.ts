import { TrackableStatus } from '../../shared/state';
import { MetricEntity, MetricSiblingsEntity } from '../../../../../models/entities/metric';
import { IndomEntity } from '../../../../../models/entities/indom';
import { EntityType } from '../../../../../models/endpoints/search';

export interface MetricData {
    data: MetricEntity | null;
}

export interface MetricSiblingsData {
    data: MetricSiblingsEntity | null;
}

export interface IndomData {
    data: IndomEntity | null;
}

export type MetricDataState = MetricData & TrackableStatus;

export type MetricSiblingsDataState = MetricSiblingsData & TrackableStatus;

export type IndomDataState = IndomData & TrackableStatus;

export interface MetricDetailState {
    type: EntityType.Metric;
    metric: MetricDataState;
    siblings?: MetricSiblingsDataState;
}

export interface InstanceDomainDetailState {
    type: EntityType.InstanceDomain;
    indom: IndomDataState;
}

export type EntityState = MetricDetailState | InstanceDomainDetailState | null;

export const initialEntity = (): EntityState => null;
