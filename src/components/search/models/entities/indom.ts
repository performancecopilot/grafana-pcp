import { TextItemResponse } from '../endpoints/search';

export interface IndomEntity {
    indom: Omit<TextItemResponse, 'type' | 'indom'>;
    metrics: Omit<TextItemResponse, 'type' | 'indom'>[];
    instances: Omit<TextItemResponse, 'type' | 'indom'>[];
}
