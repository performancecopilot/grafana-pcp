
import { DataQueryRequest, DataQueryResponse, DataSourceApi, DataSourceInstanceSettings, MutableDataFrame, FieldType, MutableField } from '@grafana/data';
import { getBackendSrv, BackendSrvRequest } from '@grafana/runtime';
import { VectorQuery, VectorOptions, defaultQuery } from './types';
import PmApi from './pmapi';
import { defaults, every } from 'lodash';
import { isBlank, getTemplateSrv } from './utils';
import { NetworkError } from './errors';
import { Labels, MetricMetadata, InstanceDomain, MetricInstanceValue } from './pcp';

interface Context {
    context: number;
    labels: Labels;
}

interface Snapshot {
    time: Date;
    context: Context;
    metadata: MetricMetadata;
    instanceDomain: InstanceDomain;
    fetchTimestampMs: number;
    values: MetricInstanceValue[];
}

// labels: context, metric, indom,

interface DataSourceState {
    contexts: Record<string, Context>;
    snapshots: Record<string, Snapshot[]>;
}

interface VectorQueryWithUrl extends VectorQuery {
    url: string;
}

export class DataSource extends DataSourceApi<VectorQuery, VectorOptions> {
    state: DataSourceState;
    pmApi: PmApi;

    constructor(private instanceSettings: DataSourceInstanceSettings<VectorOptions>) {
        super(instanceSettings);
        this.state = {
            contexts: {},
            snapshots: {}
        };
        this.pmApi = new PmApi(this.datasourceRequest.bind(this));

        //const myWorker = new Worker("worker.js");
        //console.log(myWorker);
    }

    async datasourceRequest(options: BackendSrvRequest) {
        options = defaults(options, {
            headers: {}
        })
        options.headers["Content-Type"] = "application/json";

        if (this.instanceSettings.basicAuth || this.instanceSettings.withCredentials)
            options.withCredentials = true;
        if (this.instanceSettings.basicAuth)
            options.headers["Authorization"] = this.instanceSettings.basicAuth;

        try {
            return await getBackendSrv().datasourceRequest(options);
        }
        catch (error) {
            throw new NetworkError(error);
        }
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

    static async createSnapshot(pmApi: PmApi, context: Context, target: VectorQueryWithUrl, previousSnapshot?: Snapshot): Promise<Snapshot> {
        // request metric metadatas (semantics, ...) if not existing
        // TODO: clear cache?
        let metadata;
        if (previousSnapshot) {
            metadata = previousSnapshot.metadata;
        }
        else {
            const metadataResponse = await pmApi.getMetricMetadata(target.url, context.context, target.expr);
            metadata = metadataResponse.metrics.find(metadata => metadata.name == target.expr);
            if (!metadata) {
                throw new Error(`Metric metadata for ${target.expr} not found in response.`);
            }
        }

        // fetch metric values
        const valuesResponse = await pmApi.getMetricValues(target.url, context.context, target.expr);
        const metricInstanceValues = valuesResponse.values.find(metricInstanceValues => metricInstanceValues.name == target.expr);
        if (!metricInstanceValues) {
            throw new Error(`Metric values for ${target.expr} not found in response.`);
        }

        // check if all instances from current values are in previous instance domain
        // if not, refresh it
        let instanceDomain: InstanceDomain;
        if (previousSnapshot) {
            instanceDomain = previousSnapshot.instanceDomain;

            let needRefresh = false;
            for (const metricInstanceValue of metricInstanceValues.instances) {
                if (!instanceDomain.instances.find(instance => instance.instance == metricInstanceValue.instance)) {
                    needRefresh = true;
                    break;
                }
            }

            if (needRefresh)
                instanceDomain = await pmApi.getMetricInstances(target.url, context.context, target.expr);
        }
        else {
            // some redundancy is required here because of TypeScript's strict use-before-assignment checks.. :)
            instanceDomain = await pmApi.getMetricInstances(target.url, context.context, target.expr);
        }

        return {
            time: new Date(),
            context,
            metadata: metadata,
            instanceDomain,
            fetchTimestampMs: valuesResponse.timestamp * 1000,
            values: metricInstanceValues.instances
        };
    }

    async queryTarget(request: DataQueryRequest<VectorQuery>, target: VectorQueryWithUrl): Promise<MutableDataFrame> {
        let snapshots = this.state.snapshots[target.expr];
        if (!snapshots)
            snapshots = this.state.snapshots[target.expr] = [];

        const endpoint = `${target.url}::${target.container}`;
        let context = this.state.contexts[endpoint];
        if (!context)
            context = this.state.contexts[endpoint] = await this.pmApi.createContext(target.url, target.container);

        const previousSnapshot = snapshots.length > 0 ? snapshots[snapshots.length - 1] : undefined;
        let currentSnapshot: Snapshot;
        try {
            currentSnapshot = await DataSource.createSnapshot(this.pmApi, context, target, previousSnapshot);
        }
        catch (error) {
            // todo: execute only if ctx is expired
            if (true) {
                context = this.state.contexts[endpoint] = await this.pmApi.createContext(target.url, target.container);
                currentSnapshot = await DataSource.createSnapshot(this.pmApi, context, target, previousSnapshot);
            }
            else {
                throw error;
            }
        }
        snapshots.push(currentSnapshot);

        const dataFrame = new MutableDataFrame();
        dataFrame.name = target.expr;
        const timeField = dataFrame.addField({ name: 'time', type: FieldType.time });

        const instanceIdToField: Record<number, MutableField> = {};
        const requestRangeFromMs = request.range?.from.valueOf()!;
        const requestRangeToMs = request.range?.to.valueOf()!;

        for (const snapshot of snapshots) {
            if (!(requestRangeFromMs <= snapshot.fetchTimestampMs && (!request.endTime || snapshot.fetchTimestampMs <= requestRangeToMs))) {
                continue;
            }

            // create all dataFrame fields in one go, because Grafana automatically matches
            // the vector length of newly created fields with already existing fields by adding empty data
            for (const instanceValue of snapshot.values) {
                if (!(instanceValue.instance in instanceIdToField)) {
                    const instance = snapshot.instanceDomain.instances.find(instance => instance.instance == instanceValue.instance);
                    // it's possible that an instance disappeared between the call to /fetch and /indom
                    const instanceName = instance ? instance.name : `instance ${instanceValue.instance}`;
                    instanceIdToField[instanceValue.instance] = dataFrame.addField({ name: instanceName, type: FieldType.number, config: { unit: "bytes" } });
                }
            }

            timeField.values.add(snapshot.fetchTimestampMs);
            for (const instanceValue of snapshot.values) {
                let field = instanceIdToField[instanceValue.instance];
                field.values.add(instanceValue.value);
            }
        }

        if (currentSnapshot.metadata.sem === "counter") {
            console.log("counter");
        }
        return dataFrame;
    }

    async query(request: DataQueryRequest<VectorQuery>): Promise<DataQueryResponse> {
        const targets = this.buildQueryTargets(request);
        if (targets.length === 0)
            return { data: [] };
        if (!every(targets, ['format', targets[0].format]))
            throw new Error("Format must be the same for all queries of a panel.");


        return { data: await Promise.all(targets.map(target => this.queryTarget(request, target))) };

        /*


                console.log(request);
                //const { range } = request;
                //const from = range!.from.valueOf();
                //const to = range!.to.valueOf();

                const numbers = interval(2000);

                //const takeFourNumbers = numbers.pipe(take(4));
                console.log("new q at", new Date());

                const data = new CircularDataFrame({
                    append: 'tail',
                    capacity: request.maxDataPoints || 1000,
                });
                data.refId = request.targets[0].refId;
                data.name = 'Signal ' + request.targets[0].refId;
                data.addField({ name: 'time', type: FieldType.time });
                data.addField({ name: 'value', type: FieldType.number });

                let i = 0;

                return new Observable<DataQueryResponse>(subscriber => {
                    numbers.subscribe(x => {
                        data.fields[0].values.add(new Date().getTime());
                        data.fields[1].values.add(i++);

                        subscriber.next({ data: [data] });
                    });
                });





                const example: Observable<DataQueryResponse> = numbers.pipe(
                  map(val => {
                    data.fields[0].values.add(new Date().getTime());
                    data.fields[1].values.add(value);

                    // Return a constant for each query.
                    const data = request.targets.map(target => {
                      const query = defaults(target, defaultQuery);
                      return new MutableDataFrame({
                        refId: query.refId,
                        fields: [
                          { name: 'Time', values: [new Date().getTime()], type: FieldType.time },
                          { name: 'Value', values: [query.constant], type: FieldType.number },
                        ],
                      });
                    });

                    return { data };
                  })
                );

                return example;*/
    }

    async testDatasource() {
        try {
            await this.pmApi.createContext(this.instanceSettings.url!);
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
