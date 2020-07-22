import { getTemplateSrv } from '@grafana/runtime';
import { isBlank } from './utils';
import { defaults } from 'lodash';
import { DataQueryRequest, DataSourceInstanceSettings } from '@grafana/data';
import { CompletePmapiQuery, PmapiQuery, DefaultRequestOptions } from './types';
import { PmApi } from './pmapi';

export function getRequestOptions(instanceSettings: DataSourceInstanceSettings) {
    const defaultRequestOptions: DefaultRequestOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
    };
    if (instanceSettings.basicAuth || instanceSettings.withCredentials) {
        defaultRequestOptions.withCredentials = true;
    }
    if (instanceSettings.basicAuth) {
        defaultRequestOptions.headers['Authorization'] = instanceSettings.basicAuth;
    }
    return defaultRequestOptions;
}

export function buildQueries<Q extends PmapiQuery>(
    request: DataQueryRequest<Q>,
    defaultQuery: Partial<Q>,
    defaultUrl: string,
    defaultHostspec: string
): CompletePmapiQuery[] {
    return request.targets
        .map(target => defaults(target, defaultQuery))
        .filter(target => !target.hide && !isBlank(target.expr))
        .map(target => {
            const url = target.url ?? defaultUrl;
            const hostspec = target.hostspec ?? defaultHostspec;
            if (isBlank(url)) {
                throw new Error('Please specify a connection URL in the datasource settings or in the query editor.');
            }
            if (isBlank(hostspec)) {
                throw new Error(
                    'Please specify a host specification in the datasource settings or in the query editor.'
                );
            }

            return {
                ...target,
                expr: getTemplateSrv().replace(target.expr.trim(), request.scopedVars),
                url: getTemplateSrv().replace(url!, request.scopedVars),
                hostspec: getTemplateSrv().replace(hostspec!, request.scopedVars),
                targetId: `${request.dashboardId}/${request.panelId}/${target.refId}`,
            };
        });
}

export async function testDatasource(pmApi: PmApi, url: string, hostspec: string) {
    try {
        const context = await pmApi.createContext(url, hostspec);
        const pmcdVersionMetric = await pmApi.getMetricValues(url, context.context, ['pmcd.version']);
        return {
            status: 'success',
            message: `Data source is working, using PCP Version ${pmcdVersionMetric.values[0].instances[0].value}`,
        };
    } catch (error) {
        return {
            status: 'error',
            message: `${error.message}. To use this data source, please configure the URL in the query editor.`,
        };
    }
}
