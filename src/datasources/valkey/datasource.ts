import 'core-js/features/instance/replace-all';
import { DataSourceInstanceSettings, MetricFindValue, ScopedVars, VariableModel } from '@grafana/data';
import { DataSourceWithBackend, getTemplateSrv } from '@grafana/runtime';
import { isBlank } from '../../common/utils';
import { ValkeyOptions, ValkeyQuery } from './types';

//const log = getLogger('datasource');

export class PCPValkeyDataSource extends DataSourceWithBackend<ValkeyQuery, ValkeyOptions> {
    constructor(instanceSettings: DataSourceInstanceSettings<ValkeyOptions>) {
        super(instanceSettings);
    }

    applyAdhocQualifiers(expr: string, variables: VariableModel[]) {
        const adhocQualifiers = variables
            .filter(v => v.type === 'adhoc')
            .flatMap(v => (v as any).filters)
            .map(({ key, operator, value }) => {
                if (operator === '=') {
                    operator = '==';
                }
                const isNumericValue = /^\-?\d+(\.\d+)?$/.test(value);
                const formattedValue = isNumericValue ? value : `"${value}"`;
                return `${key} ${operator} ${formattedValue}`;
            })
            .join(', ');
        if (!adhocQualifiers) {
            return expr;
        }

        // this regex captures metric names with optional qualifiers, and ignores empty qualifiers (whitespace)
        // also works with functions, i.e. rate(kernel.all.sysfork{hostname=="..."})
        const regex = /([\w.]+)(?:{\s*(.*?)\s*})?/g;
        return expr.replaceAll(regex, (_substring: string, metric: string, qualifiers: string) => {
            return qualifiers ? `${metric}{${qualifiers}, ${adhocQualifiers}}` : `${metric}{${adhocQualifiers}}`;
        });
    }

    applyTemplateVariables(query: ValkeyQuery, scopedVars: ScopedVars): Record<string, any> {
        const expr = getTemplateSrv().replace(query.expr.trim(), scopedVars);
        const exprWithAdhocQualifiers = this.applyAdhocQualifiers(expr, getTemplateSrv().getVariables());
        return {
            ...query,
            expr: exprWithAdhocQualifiers,
        };
    }

    filterQuery(query: ValkeyQuery): boolean {
        return !(query.hide === true || isBlank(query.expr));
    }

    /*query(request: DataQueryRequest<ValkeyQuery>): Observable<DataQueryResponse> {
        const data = super.query(request);
        data.subscribe({
            next: x => {
                log.debug('query', request, x);
            },
        });
        return data;
    }*/

    async metricFindQuery(query: string): Promise<MetricFindValue[]> {
        query = getTemplateSrv().replace(query.trim());
        return await this.getResource('metricFindQuery', { query });
    }

    async getTagKeys(): Promise<MetricFindValue[]> {
        return await this.getResource('metricFindQuery', { query: 'label_names()' });
    }

    async getTagValues(options: any): Promise<MetricFindValue[]> {
        return await this.getResource('metricFindQuery', { query: `label_values(${options.key})` });
    }
}
