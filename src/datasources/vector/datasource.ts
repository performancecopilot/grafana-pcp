
import { DataQueryRequest, DataQueryResponse, DataSourceApi, DataSourceInstanceSettings } from '@grafana/data';
import { getBackendSrv, BackendSrvRequest } from '@grafana/runtime';
import { VectorQuery, VectorOptions, defaultQuery, VectorQueryWithUrl } from './types';
import PmApi from './pmapi';
import { defaults, every } from 'lodash';
import { isBlank, getTemplateSrv } from './utils';
import { NetworkError } from './errors';
import PollerWorker from './poller.worker'

interface DataSourceState {
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

        const myWorker = new PollerWorker();
        myWorker.onmessage = (e) => {
            console.log("main: msg recv", e.data);
        };
        myWorker.postMessage("test");
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


    async query(request: DataQueryRequest<VectorQuery>): Promise<DataQueryResponse> {
        const targets = this.buildQueryTargets(request);
        if (targets.length === 0)
            return { data: [] };
        if (!every(targets, ['format', targets[0].format]))
            throw new Error("Format must be the same for all queries of a panel.");


        return { data: []};//await Promise.all(targets.map(target => this.queryTarget(request, target))) };

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
