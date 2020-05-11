import _ from "lodash";
import { PCPBPFtraceDatasource } from "./datasource";
import * as completions from './completions.json';
import { Completion } from "../lib/models/ace";

export default class PCPBPFtraceCompleter {

    static probeCache: Record<string, Completion[]> = {};

    identifierRegexps = [/[a-zA-Z0-9_\-:.]/];

    metadataCompletions: Completion[] = [];
    probeCompletions: Completion[] = []; // probes except kprobe, software, hardware, tracepoint (PMDA returns these probes)
    builtinVariableCompletions: Completion[] = [];
    builtinFunctionCompletions: Completion[] = [];

    constructor(private datasource: PCPBPFtraceDatasource, private target: any) {
        this.prepareBuiltinCompletions();
    }

    getCompletions(editor: any, session: any, pos: any, prefix: any, callback: any) {
        this.findCompletions(editor, session, pos, prefix).then(completions => {
            callback(null, completions);
        }, (reason: any) => {
            callback(reason, []);
        });
    }

    genDocHTML(title: string, doc: string) {
        title = _.escape(title);
        doc = _.escape(doc);
        doc = doc.replace(/```([^]+?)```/g, "<pre>$1</pre>");
        doc = doc.replace(/`(.+?)`/g, "<code>$1</code>");
        return `<b>${title}</b><hr />${doc}`;
    }

    private prepareBuiltinCompletions() {
        this.metadataCompletions = completions.metadata.map(m => ({
            caption: m.name,
            value: m.value,
            meta: "metadata",
            score: 0,
            docHTML: this.genDocHTML(m.name, m.doc)
        }));
        this.probeCompletions = completions.probes.map(p => ({
            caption: `${p.name}:`,
            value: `${p.name}:`,
            meta: "probe",
            score: Number.MAX_VALUE
        }));
        this.builtinVariableCompletions = completions.variables.map(v => ({
            caption: v.name,
            value: v.value || v.name,
            meta: "variable",
            score: 0,
            docHTML: this.genDocHTML(v.name, v.doc)
        }));
        this.builtinFunctionCompletions = completions.functions.map(f => {
            const name = f.def.substring(0, f.def.indexOf('('));
            return {
                caption: `${name}()`,
                value: name,
                meta: "function",
                score: 0,
                docHTML: this.genDocHTML(f.def, f.doc)
            };
        });
    }

    async findProbeCompletions() {
        // don't do this in constructor of PCPBPFtraceCompleter, as the user could
        // change the endpoint settings of the query, but the constructor is only called once
        const [url, container] = this.datasource.getConnectionParams(this.target, {});
        const endpoint = await this.datasource.getOrCreateEndpoint(url, container);

        if (!PCPBPFtraceCompleter.probeCache[endpoint.id]) {
            const result = await endpoint.pmapiSrv.getMetricValues(["bpftrace.info.tracepoints"]);
            const probes = (result.values[0].instances[0].value as string).split(',')
                .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
            for (let i = 0, numProbes = probes.length; i < numProbes; i++) {
                if (probes[i].startsWith("kprobe:"))
                    probes.push("kretprobe:" + probes[i].substring(probes[i].indexOf(':') + 1));
            }
            PCPBPFtraceCompleter.probeCache[endpoint.id] = probes.map(probe => ({
                caption: probe,
                value: probe,
                meta: "probe",
                score: Number.MAX_VALUE
            }));
        }

        return this.probeCompletions.concat(PCPBPFtraceCompleter.probeCache[endpoint.id]);
    }

    async findCompletions(editor: any, session: any, pos: any, prefix: any): Promise<Completion[]> {
        // ace will be defined *after* the editor is loaded, therefore we can't import it at the top of the file
        const { TokenIterator } = (window as any).ace.acequire('ace/token_iterator');
        const iterator = new TokenIterator(session, pos.row, pos.column);
        let depth = 0;
        let filter = 0;
        for (let token = iterator.getCurrentToken(); token; token = iterator.stepBackward()) {
            if (token.type === 'paren.lparen.brace')
                depth++;
            else if (token.type === 'paren.rparen.brace')
                depth--;
            else if (depth === 0 && token.type === 'keyword.operator' && token.value === '/')
                filter = (filter + 1) % 2;
        }

        const curToken = session.getTokenAt(pos.row, pos.column);
        if (curToken.type === "comment") // comment
            return this.metadataCompletions;
        else if (depth === 0 && filter === 0) // global scope
            return await this.findProbeCompletions();
        else if (depth === 0 && filter === 1) // global scope, inside filter
            return this.builtinVariableCompletions;
        else // action block
            return this.builtinVariableCompletions.concat(this.builtinFunctionCompletions);
    }
}
