import _ from 'lodash';
import Context from "./context";
import { objectProperty } from '@babel/types';
import { EndpointPoller } from './endpoint';

export interface BPFtraceScript {
    name: string;
    code: string;
    vars: string[];
    status: string;
    output: string;
}

export default class ScriptRegistry {

    readonly scripts: Record<string, BPFtraceScript> = {}; // {name: BPFtraceScript}

    constructor(private context: Context, private poller: EndpointPoller) {
        setInterval(this.syncState.bind(this), 10000);
    }

    findByCode(code: string) {
        return _.find(Object.values(this.scripts), (script: BPFtraceScript) => script.code === code);
    }

    async register(context: Context, code: string) {
        console.debug("registering script", code);
        let uuid = Math.floor(Math.random() * 1000);
        await context.store("bpftrace.control.register", `${uuid}#${code}`);

        const responses = await context.fetch(["bpftrace.control.register"]);
        const script: BPFtraceScript = JSON.parse(responses.values[0].instances[0].value)[uuid];
        script.code = code;
        this.scripts[script.name] = script;

        console.debug("bpftrace.control.register response", script);
        if (script.status === "stopped") {
            throw { message: `BPFtrace error:\n\n${script.output}` };
        }
        return script;
    }

    async syncState() {
        await this.context.fetchMetricMetadata();

        let metrics: string[] = [];
        for (const script of Object.values(this.scripts)) {
            const status_metric = `bpftrace.scripts.${script.name}.status`;
            const output_metric = `bpftrace.scripts.${script.name}.output`;

            if (this.context.findMetricMetadata(status_metric) && this.context.findMetricMetadata(output_metric)) {
                metrics.push(status_metric, output_metric);
            }
            else {
                console.info(`script ${script.name} is missing on the PMDA`);
                const script_metrics = script.vars.map(var_ => `bpftrace.scripts.${script.name}.data.${var_}`);
                delete this.scripts[script.name];
                this.poller.removeMetricsFromPolling(script_metrics);
            }
        }

        const response = await this.context.fetch(metrics);
        for (const metric of response.values) {
            const metric_split = metric.name.split('.');
            const script_name = metric_split[2];
            const metric_field = metric_split[3];

            const script = this.scripts[script_name];
            if (metric_field === "status") {
                script.status = metric.instances[0].value;
            }
            else if (metric_field === "output") {
                script.output = metric.instances[0].value;
            }
        }
    }
}
