import { PCPBPFtraceDatasource } from "./datasource";

export default class PCPBPFtraceCompleter {

    identifierRegexps = [/[a-zA-Z0-9_:]/];
    probeCache: Record<string, string[]> = {};

    constructor(private datasource: PCPBPFtraceDatasource, private target: any) {
    }

    getCompletions(editor: any, session: any, pos: any, prefix: any, callback: any) {
        if (editor.completers.length === 4) {
            // the ace editor comes with [snippetCompleter, textCompleter, keywordCompleter]
            // our completor is the last of the array
            // let's remove the textCompleter (index 1)
            editor.completers.splice(1, 1);
        }

        this.findCompletions(editor, session, pos, prefix).then((value) => {
            callback(null, value);
        }, (reason: any) => {
            callback(reason, []);
        });
    }

    getCompletion(word: string, meta: string) {
        return {
            caption: word,
            value: word,
            meta: meta,
            score: Number.MAX_VALUE
        };
    }

    async findProbeCompletions(token: any) {
        // don't do this in constructor of PCPBPFtraceCompleter, as the user could
        // change the endpoint settings of the query, but the constructor is only called once
        const [url, container] = this.datasource.getConnectionParams(this.target, {});
        const endpoint = this.datasource.getOrCreateEndpoint(url, container);

        if (!this.probeCache[endpoint.id]) {
            const result = await endpoint.context.fetch(["bpftrace.info.tracepoints"], true);
            this.probeCache[endpoint.id] = result.values.find(
                (metric: any) => metric.name === "bpftrace.info.tracepoints"
            ).instances.map((instance: any) => instance.instanceName);
        }
        return this.probeCache[endpoint.id].map(probe => this.getCompletion(probe, "probe"));
    }

    async findCompletions(editor: any, session: any, pos: any, prefix: any) {
        const token = session.getTokenAt(pos.row, pos.column);
        if (token.type === "keyword.control.probe") {
            return this.findProbeCompletions(token);
        }
        else {
            return [];
        }
    }
}
