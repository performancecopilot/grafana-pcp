import { DataSourceWithBackend, getTemplateSrv, getBackendSrv } from '@grafana/runtime';
import { RedisQuery, RedisOptions } from './types';
import { DataSourceInstanceSettings, ScopedVars, MetricFindValue, VariableModel } from '@grafana/data';
import { DefaultRequestOptions } from '../lib/models/pcp';
import PmSeriesApiService from '../../lib/services/PmSeriesApiService';
import { getRequestOptions } from '../../lib/utils/api';
import { isBlank, getLogger } from '../lib/utils';
const log = getLogger('datasource');
log.setDefaultLevel('debug');

interface DataSourceState {
    defaultRequestOptions: DefaultRequestOptions;
    pmSeriesApi: PmSeriesApiService;
}

export class DataSource extends DataSourceWithBackend<RedisQuery, RedisOptions> {
    state: DataSourceState;

    constructor(instanceSettings: DataSourceInstanceSettings<RedisOptions>) {
        super(instanceSettings);

        const defaultRequestOptions = getRequestOptions(instanceSettings);
        const pmSeriesApi = new PmSeriesApiService(getBackendSrv(), instanceSettings.url!, defaultRequestOptions);

        this.state = {
            defaultRequestOptions,
            pmSeriesApi,
        };
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
        const regex = /([a-zA-Z][a-zA-Z0-9_]*(?:\.[a-zA-Z][a-zA-Z0-9_]*)+)(?:{\s*(.*?)\s*})?/g;
        return expr.replaceAll(regex, (_substring: string, metric: string, qualifiers: string) => {
            return qualifiers ? `${metric}{${qualifiers}, ${adhocQualifiers}}` : `${metric}{${adhocQualifiers}}`;
        });
    }

    applyTemplateVariables(query: RedisQuery, scopedVars: ScopedVars): Record<string, any> {
        const expr = getTemplateSrv().replace(query.expr, scopedVars);
        const exprWithAdhocQualifiers = this.applyAdhocQualifiers(expr, getTemplateSrv().getVariables());
        return {
            ...query,
            expr: exprWithAdhocQualifiers,
        };
    }

    filterQuery(query: RedisQuery): boolean {
        return !(query.hide === true || isBlank(query.expr));
    }

    /*query(request: DataQueryRequest<RedisQuery>): Observable<DataQueryResponse> {
        const data = super.query(request);
        data.subscribe({
            next: x => {
                log.debug('query', request, x);
            },
        });
        return data;
    }*/

    async metricFindQuery(query: string, options?: any): Promise<MetricFindValue[]> {
        query = getTemplateSrv().replace(query.trim());
        return await this.getResource('metricFindQuery', { query });
    }

    async getTagKeys(options?: any): Promise<MetricFindValue[]> {
        return await this.getResource('getLabelNames');
    }

    async getTagValues(options: any): Promise<MetricFindValue[]> {
        return await this.getResource('getLabelValues', { name: options.key });
    }

    /*
    buildQueries(request: DataQueryRequest<RedisQuery>, defaultQuery: Partial<RedisQuery>): RedisQuery[] {
        return request.targets
            .map(target => defaults(target, defaultQuery))
            .filter(target => !target.hide && !isBlank(target.expr))
            .map(target => {
                return {
                    ...target,
                    expr: getTemplateSrv().replace(target.expr.trim(), request.scopedVars),
                };
            });
    }

    buildAdHocExpr(expr: string) {
        return expr;
    }

    createDataFrame(target: SeriesTarget, metric: SeriesMetric, values: SeriesValuesItemResponse[]) {
        const dataFrame = new MutableDataFrame();
        const timeField = dataFrame.addField({ name: 'Time', type: FieldType.time });
        const instanceIdToField = new Map<SeriesInstanceId | null, MutableField>();

        for (const value of values) {
            const instanceId = value.instance ?? null;
            if (instanceIdToField.has(instanceId)) {
                continue;
            }

            let fieldName = target.query.expr;
            let instanceName: InstanceName | undefined;
            if (instanceId !== null) {
                instanceName = metric.instanceDomain.instances[instanceId]?.name;
                if (instanceName) {
                    fieldName += `[${instanceName}]`;
                }
            }

            instanceIdToField.set(
                instanceId,
                dataFrame.addField({
                    name: fieldName,
                    ...getFieldMetadata(metric, instanceId, instanceName),
                })
            );
        }

        let curValue = 0;
        for (const value of values) {
            const instanceId = value.instance ?? null;

            if (Math.abs(value.timestamp - curValue) > 0.1) {
                // it's possible that some instance existed previously but disappeared -> fill field with MISSING_VALUE
                for (const field of instanceIdToField.values()) {
                    if (field.values.length !== timeField.values.length) {
                        field.values.add(MISSING_VALUE);
                    }
                }

                timeField.values.add(value.timestamp);
                curValue = value.timestamp;
            }

            let field = instanceIdToField.get(instanceId)!;
            field.values.add(parseFloat(value.value));
        }
        return dataFrame;
    }

    processTarget(
        target: SeriesTarget,
        metrics: SeriesMetric[],
        valuesBySeries: Dict<SeriesId, SeriesValuesItemResponse[]>
    ) {
        const metricsOfTarget = metrics.filter(metric => target.series.includes(metric.metadata.series));
        return {
            target,
            targetResult: metricsOfTarget.map(metric => ({
                metric,
                dataFrame: this.createDataFrame(target, metric, valuesBySeries[metric.metadata.series]!),
            })),
        };
    }

    async query(request: DataQueryRequest<RedisQuery>): Promise<DataQueryResponse> {
        const queries = this.buildQueries(request, defaultRedisQuery);
        const targets = await Promise.all(
            queries.map(async query => {
                const adhocExpr = this.buildAdHocExpr(query.expr);
                const series = (await this.state.pmSeriesApi.query({ expr: adhocExpr })) as string[];
                return {
                    query,
                    adhocExpr,
                    series,
                };
            })
        );
        for (const target of targets) {
            if (target.series.length === 0) {
                throw new Error(`Could not find any series for ${target.query.expr}`);
            }
        }

        const series = targets.flatMap(result => result.series);
        const metricsAction = await this.state.store.dispatch(fetchMetrics(series));
        const metrics = unwrapResult(metricsAction);

        const interval = (request.intervalMs ?? 1000) / 1000; // seconds
        // request a bigger time frame to fill the chart (otherwise left and right border of chart is empty)
        // because of the rate conversation of counters first datapoint my be "lost" -> expand timeframe at the beginning
        const additionalTimeRange = Math.max(interval, 60); // 60s is the default sample interval of pmlogger
        const start = Math.floor(request.range.from.valueOf() / 1000 - 2 * additionalTimeRange); // seconds
        const finish = Math.ceil(request.range.to.valueOf() / 1000 + additionalTimeRange); // seconds

        const values = await this.state.pmSeriesApi.values({
            series,
            start: start.toString(),
            finish: finish.toString(),
            interval: interval.toString(),
        });
        const valuesBySeries = groupBy(values, v => v.series);

        const result = targets.map(target => this.processTarget(target, metrics, valuesBySeries));
        const data = processTargets(request, result);

        log.debug('query', request, queries, data);
        return { data };
    }

    async testDatasource() {}*/
}
