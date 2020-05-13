import { Labels, MetricMetadata, MetricInstance, InstanceValuesSnapshot, MetricName } from './pcp';
import { DataQueryRequest } from '@grafana/data';
import { VectorQuery, VectorQueryWithUrl } from './types';

type Endpoint = string;

interface Context {
    context: number;
    labels: Labels;
}

interface MetricState {
    metadata: MetricMetadata;
    instanceLabels: Labels;
    instances: MetricInstance[];
    values: InstanceValuesSnapshot[];
}

interface EndpointState {
    context: Context;
    metrics: Record<MetricName, MetricState[]>;
}

interface WorkerState {
    endpoints: Record<Endpoint, EndpointState>;
    queries: VectorQueryWithUrl[];
}

interface PollerRequest {
    type: "query";
}

interface QueryRequest extends PollerRequest {
    type:"query";
    request: DataQueryRequest<VectorQuery>;
    targets: VectorQueryWithUrl[];
}
// labels: context, metric, indom

export default class Poller {
    state: WorkerState;

    constructor(private worker: Worker) {
        this.state = {
            contexts: {},
            metrics: {}
        };
        this.worker.onmessage = this.onmessage.bind(this);
    }

    onmessage(e: MessageEvent): any {
        const request = e.data as PollerRequest;
        switch(request.type) {
            case "query":
        }
        console.log('Worker: Message received from main script4', e.data);
        this.worker.postMessage("response 3");
    }

    dummy() {
        console.log(this.state);
    }

    /*
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
                //console.log("counter");
            }
            return dataFrame;
        }*/
}
