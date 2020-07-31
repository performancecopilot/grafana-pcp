import { TextItemResponse } from '../endpoints/search';

export type IndomEntitySparseItem = Omit<TextItemResponse, 'type' | 'indom'>;

export interface IndomEntity {
    indom: IndomEntitySparseItem;
    metrics: IndomEntitySparseItem[];
    instances: IndomEntitySparseItem[];
}
