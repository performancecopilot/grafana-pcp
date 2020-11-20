import { defaults, defaultsDeep } from 'lodash';
import { DeepPartial } from 'utility-types';
import { MinimalPmapiQuery, PmapiQuery } from '../../../../datasources/lib/pmapi/types';
import { TargetFormat } from '../../../../datasources/lib/types';

export function query(props?: Partial<MinimalPmapiQuery>): MinimalPmapiQuery {
    return defaults({}, props, {
        refId: 'A',
        expr: 'disk.dev.read',
        format: TargetFormat.TimeSeries,
    });
}

export function pmapiQuery(props?: DeepPartial<PmapiQuery>): PmapiQuery {
    return defaultsDeep({}, props, {
        ...query(props),
        url: '',
        hostspec: '',
        options: {
            rateConversation: true,
            timeUtilizationConversation: true,
        },
    });
}
