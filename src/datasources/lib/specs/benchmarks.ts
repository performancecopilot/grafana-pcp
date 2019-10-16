import Benchmark from "benchmark";
import DataStore from "../datastore";
import { Transformations } from "../transformations";
import { Datapoint, TargetFormat } from "../models/datasource";
import { MetricInstance } from "../models/metrics";

interface BenchmarkCase {
    setup?: () => void;
    run: (deferred: any) => void;
    finish?: () => void;
}

class IngestWithRateConversation {
    datastore: DataStore;
    constructor() {
        const pmapiSrv: any = {
            getLabels: () => ({})
        };
        this.datastore = new DataStore(pmapiSrv, 25000);
    }
    async run(deferred: any) {
        for (let i = 0; i < 2000; i++) {
            await this.datastore.ingest({
                "timestamp": 5.2,
                "values": [{
                    "pmid": "1.0.1",
                    "name": "bpftrace.scripts.script1.data.scalar",
                    "instances": [{
                        "instance": null,
                        "value": 45200
                    }]
                }]
            });
        }
        deferred.resolve();
    }
}

class IngestWithoutRateConversation {
    datastore: DataStore;
    constructor() {
        const pmapiSrv: any = {
            getLabels: () => ({})
        };
        this.datastore = new DataStore(pmapiSrv, 25000);
    }
    async run(deferred: any) {
        for (let i = 0; i < 2000; i++) {
            await this.datastore.ingest({
                "timestamp": 5.2,
                "values": [{
                    "pmid": "1.0.1",
                    "name": "bpftrace.scripts.script1.data.scalar",
                    "instances": [{
                        "instance": null,
                        "value": 45200
                    }]
                }]
            });
        }
        deferred.resolve();
    }
}

class CounterValues {
    values: Datapoint<number>[];

    async setup() {
        const pmapiSrv: any = {
            getLabels: () => ({})
        };
        const datastore = new DataStore(pmapiSrv, 25000);
        // 3640 px per page (1px = 1 datapoint), 17 rows
        for (let i = 0; i < 3640 * 17; i++) {
            await datastore.ingest({
                "timestamp": 5.2,
                "values": [{
                    "pmid": "1.0.1",
                    "name": "bpftrace.scripts.script1.data.scalar",
                    "instances": [{
                        "instance": null,
                        "value": 45200
                    }]
                }]
            });
        }

        const result = datastore.queryMetric("bpftrace.scripts.script1.data.scalar", 0, Infinity);
        const instance = result[0] as MetricInstance<number>;
        this.values = instance.values;
        console.log("prepared values", this.values.length);
    }

    run(deferred: any) {
        Transformations.applyTransformations(TargetFormat.TimeSeries, "counter", "bytes", this.values);
        deferred.resolve();
    }

    finish() {
        // TODO: this test removes the last element from the list,
        // i.e. later executions are faster and the benchmark result is invalid
        console.log("finished values", this.values.length);
    }
}


class Benchmarks {

    static async runSuite(benchmarks: BenchmarkCase[]) {
        let suite = new Benchmark.Suite();
        for (const benchmark of benchmarks) {
            if (benchmark.setup) {
                await benchmark.setup();
            }

            suite = suite.add(benchmark.constructor.name, benchmark.run.bind(benchmark), { defer: true });
        }
        suite
            .on('cycle', (event) => {
                console.log(String(event.target), "per test", event.target.times.period * 1000, "ms");
            })
            .on('complete', () => {
                console.log('Fastest is ' + (suite.filter('fastest') as any).map('name'));
                for (const benchmark of benchmarks) {
                    if (benchmark.finish)
                        benchmark.finish();
                }
            })
            .run({ 'async': true });
    }

    static async runOnce(benchmarks: BenchmarkCase[]) {
        for (const benchmark of benchmarks) {
            if (benchmark.setup) {
                await benchmark.setup();
            }
        }
        for (const benchmark of benchmarks) {
            await new Promise((resolve, reject) => {
                benchmark.run({ resolve, reject });
            });
        }
        for (const benchmark of benchmarks) {
            if (benchmark.finish)
                await benchmark.finish();
        }
    }
}

(window as any).Benchmark = Benchmark;
(window as any).runBenchmarks = () => {
    console.log("starting benchmarks...");
    Benchmarks.runSuite([
        new IngestWithRateConversation(),
        new IngestWithoutRateConversation(),
        new CounterValues()
    ]);
};
