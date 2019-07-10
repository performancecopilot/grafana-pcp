import _ from 'lodash';
import Context from "./context";

interface BPFTraceScript {
    name: string;
    vars: string[];
    status: string;
    output: string;
}

export default class ScriptRegistry {
    readonly scripts: Record<string, BPFTraceScript> = {}; // {bpftrace_code: BPFTraceScript}

    find(code: string) {
        return this.scripts[code];
    }

    async register(context: Context, code: string) {
        let uuid = Math.floor(Math.random() * 1000);
        await context.store("bpftrace.control.register", `${uuid}#${code}`);

        const responses = await context.fetch(["bpftrace.control.register"]);
        const script: BPFTraceScript = JSON.parse(responses.values[0].instances[0].value)[uuid];
        this.scripts[code] = script;

        console.debug("bpftrace.control.register response", script);
        if (script.status === "stopped") {
            throw { message: script.output };
        }
        else {
            // check script health (syntax errors, ...) after 1s
            setTimeout(this.checkScriptHealth.bind(this, context, code), 1000);
        }
    }

    async checkScriptHealth(context: Context, code: string) {
        const script = this.scripts[code];
        await context.fetchMetricMetadata();
        const response = await context.fetch([`bpftrace.scripts.${script.name}.status`, `bpftrace.scripts.${script.name}.output`]);

        for (const metric of response.values) {
            if (metric.name === `bpftrace.scripts.${script.name}.status`) {
                script.status = metric.instances[0].value;
            }
            else if (metric.name === `bpftrace.scripts.${script.name}.output`) {
                script.output = metric.instances[0].value;
            }
        }

        if (script.status === "starting") {
            console.info("script", code, "is still starting, rescheduling health check in 1s...");
            setTimeout(this.checkScriptHealth.bind(this, context, code), 1000);
        }
    }
}
