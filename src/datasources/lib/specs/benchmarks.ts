import Benchmark from "benchmark";
import DataStore from "../datastore";
import { MetricInstance, Datapoint } from "../types";
import { ValuesTransformations } from "../transformations";

interface BenchmarkCase {
    setup?: () => void;
    run: (deferred: any) => void;
    finish?: () => void;
}

class IngestWithRateConversation {
    datastore: DataStore;
    constructor() {
        const context: any = {
            metricMetadata: () => ({ sem: "counter" })
        };
        this.datastore = new DataStore(context, 25000);
    }
    async run(deferred: any) {
        for (let i = 0; i < 2000; i++) {
            await this.datastore.ingest({
                "timestamp": {
                    "s": 5,
                    "us": 2000
                },
                "values": [{
                    "pmid": 633356298,
                    "name": "bpftrace.scripts.script1.data.scalar",
                    "instances": [{
                        "instance": -1,
                        "value": 45200,
                        "instanceName": ""
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
        const context: any = {
            metricMetadata: () => ({})
        };
        this.datastore = new DataStore(context, 25000);
    }
    async run(deferred: any) {
        for (let i = 0; i < 2000; i++) {
            await this.datastore.ingest({
                "timestamp": {
                    "s": 5,
                    "us": 2000
                },
                "values": [{
                    "pmid": 633356298,
                    "name": "bpftrace.scripts.script1.data.scalar",
                    "instances": [{
                        "instance": -1,
                        "value": 45200,
                        "instanceName": ""
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
        const context: any = {
            metricMetadata: () => ({})
        };
        const datastore = new DataStore(context, 25000);
        // 3640 px per page (1px = 1 datapoint), 17 rows
        for (let i = 0; i < 3640 * 17; i++) {
            await datastore.ingest({
                "timestamp": {
                    "s": 5,
                    "us": 2000
                },
                "values": [{
                    "pmid": 633356298,
                    "name": "bpftrace.scripts.script1.data.scalar",
                    "instances": [{
                        "instance": -1,
                        "value": 45200,
                        "instanceName": ""
                    }]
                }]
            });
        }

        const result = datastore.queryMetric("bpftrace.scripts.script1.data.scalar", 0, Infinity);
        const instance = result[0] as MetricInstance<number>;
        this.values = instance.values;
        console.log(this.values.length);
    }

    run(deferred: any) {
        ValuesTransformations.applyTransformations("counter", "", this.values);
        deferred.resolve();
    }

    finish() {
        // TODO: this test removes the last element from the list,
        // i.e. later executions are faster and the benchmark result is invalid
        console.log("finished", this.values.length);
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
