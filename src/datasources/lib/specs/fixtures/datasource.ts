import { PmapiQuery, TemplatedPmapiQuery } from 'datasources/lib/pmapi/types';
import { TargetFormat } from 'datasources/lib/types';
import { defaults } from 'lodash';

export function query(props?: Partial<PmapiQuery>): PmapiQuery {
    return defaults(props, {
        refId: 'A',
        expr: 'disk.dev.read',
        format: TargetFormat.TimeSeries,
    });
}

export function templatedQuery(props?: Partial<TemplatedPmapiQuery>): TemplatedPmapiQuery {
    return defaults(props, {
        ...query(props),
        url: '',
        hostspec: '',
    });
}
