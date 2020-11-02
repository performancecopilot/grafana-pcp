import { TextItemResponse } from 'common/services/pmsearch/types';

export type IndomEntitySparseItem = Omit<TextItemResponse, 'type' | 'indom'>;

export interface IndomEntity {
    indom: IndomEntitySparseItem;
    metrics: IndomEntitySparseItem[];
    instances: IndomEntitySparseItem[];
}
