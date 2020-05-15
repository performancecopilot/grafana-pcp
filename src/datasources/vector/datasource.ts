
import { DataQueryRequest, DataQueryResponse, DataSourceApi, DataSourceInstanceSettings, MutableDataFrame, FieldType, MutableField, DataFrame } from '@grafana/data';
import { VectorQuery, VectorOptions, defaultQuery, VectorQueryWithUrl, DatasourceRequestOptions } from './types';
import { defaults, every, mapValues } from 'lodash';
import { isBlank, getTemplateSrv } from './utils';
import { Poller, MetricStore, Endpoint } from './poller';
import { pcpUnitToGrafanaUnit, InstanceId } from './pcp';
import { applyTransformations } from './field_transformations';
import { PmApi } from './pmapi';

interface DataSourceState {
    datasourceRequestOptions: DatasourceRequestOptions;
}

export class DataSource extends DataSourceApi<VectorQuery, VectorOptions> {
    state: DataSourceState;
    poller: Poller;

    constructor(readonly instanceSettings: DataSourceInstanceSettings<VectorOptions>) {
        super(instanceSettings);
        this.state = {
            datasourceRequestOptions: {
                headers: {}
            }
        };

        this.state.datasourceRequestOptions.headers["Content-Type"] = "application/json";
        if (this.instanceSettings.basicAuth || this.instanceSettings.withCredentials)
            this.state.datasourceRequestOptions.withCredentials = true;
        if (this.instanceSettings.basicAuth)
            this.state.datasourceRequestOptions.headers["Authorization"] = this.instanceSettings.basicAuth;

        this.poller = new Poller(this.state.datasourceRequestOptions);
    }

    buildQueryTargets(request: DataQueryRequest<VectorQuery>): VectorQueryWithUrl[] {
        return request.targets
            .map(target => defaults(target, defaultQuery))
            .filter(target => !target.hide && !isBlank(target.expr))
            .map(target => {
                const url = target.url || this.instanceSettings.url;
                if (isBlank(url))
                    throw new Error("Please specify a connection URL in the datasource settings or in the query editor.");
                return {
                    ...target,
                    expr: getTemplateSrv().replace(target.expr.trim(), request.scopedVars),
                    url: getTemplateSrv().replace(url, request.scopedVars),
                    container: target.container ? getTemplateSrv().replace(target.container, request.scopedVars) : undefined,
                };
            });
    }


    getFieldName(request: DataQueryRequest<VectorQuery>, target: VectorQueryWithUrl,
        endpoint: Endpoint, metricStore: MetricStore, instanceId: InstanceId | null) {
        if (target.legendFormat) {
            const metricName = metricStore.metadata.name;
            const metricSpl = metricName.split('.');

            const pcpLabels = {
                ...(endpoint.context ? endpoint.context.labels : {}),
                ...metricStore.metadata.labels,
                ...metricStore.instanceDomain.labels,
                ...(instanceId != null && instanceId in metricStore.instanceDomain.instances ? metricStore.instanceDomain.instances[instanceId].labels : {}),
            }
            const vars: any = {
                ...mapValues(pcpLabels, val => ({ value: val })),
                metric: { value: metricName },
                metric0: { value: metricSpl[metricSpl.length - 1] },
                ...request.scopedVars,
            };

            if (instanceId != null && instanceId in metricStore.instanceDomain.instances)
                vars["instance"] = { value: metricStore.instanceDomain.instances[instanceId].name };

            return getTemplateSrv().replace(target.legendFormat, vars);
        }
        else {
            if (instanceId != null && instanceId in metricStore.instanceDomain.instances)
                return metricStore.instanceDomain.instances[instanceId].name;
            else
                return metricStore.metadata.name;
        }
    }

    async queryTarget(request: DataQueryRequest<VectorQuery>, target: VectorQueryWithUrl): Promise<DataFrame> {
        const requestRangeFromMs = request.range?.from.valueOf()!;
        const requestRangeToMs = request.range?.to.valueOf()!;

        let dataFrame = new MutableDataFrame();
        const timeField = dataFrame.addField({ name: 'Time', type: FieldType.time });
        const instanceIdToField = new Map<InstanceId | null, MutableField>();

        const [endpoint, metricStore] = await this.poller.query(target);
        if (!metricStore) {
            return dataFrame;
        }

        for (const snapshot of metricStore.values) {
            if (!(requestRangeFromMs <= snapshot.timestampMs && (!request.endTime || snapshot.timestampMs <= requestRangeToMs))) {
                continue;
            }

            // create all dataFrame fields in one go, because Grafana automatically matches
            // the vector length of newly created fields with already existing fields by adding empty data
            for (const instanceValue of snapshot.values) {
                if (!instanceIdToField.has(instanceValue.instance)) {
                    instanceIdToField.set(instanceValue.instance, dataFrame.addField({
                        name: this.getFieldName(request, target, endpoint, metricStore, instanceValue.instance),
                        type: FieldType.number,
                        config: { unit: pcpUnitToGrafanaUnit(metricStore.metadata) }
                    }));
                }
            }

            timeField.values.add(snapshot.timestampMs);
            for (const instanceValue of snapshot.values) {
                let field = instanceIdToField.get(instanceValue.instance)!;
                field.values.add(instanceValue.value);
            }
        }

        return applyTransformations(metricStore.metadata, dataFrame);
    }

    async query(request: DataQueryRequest<VectorQuery>): Promise<DataQueryResponse> {
        const targets = this.buildQueryTargets(request);
        if (targets.length === 0)
            return { data: [] };
        if (!every(targets, ['format', targets[0].format]))
            throw new Error("Format must be the same for all queries of a panel.");

        return { data: await Promise.all(targets.map(target => this.queryTarget(request, target))) };
    }

    async testDatasource() {
        try {
            await new PmApi(this.state.datasourceRequestOptions).createContext(this.instanceSettings.url!);
            return {
                status: 'success',
                message: 'Data source is working',
            };
        }
        catch (error) {
            return {
                status: 'error',
                message: `${error.message}. To use this data source, please configure the URL in the query editor.`
            };
        }
    }
}
