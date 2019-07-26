import { PcpLiveDatasource } from "./datasource";
import Context from "../lib/context";
import { Endpoint } from "../lib/endpoint_registry";
import { MetricMetadata } from "../lib/types";

export default class PCPMetricCompleter {

    identifierRegexps = [/\./, /[a-zA-Z0-9_]/];
    childrenCache: Record<string, Record<string, { leaf: string[], nonleaf: string[] }>> = {};

    constructor(private datasource: PcpLiveDatasource, private target: any) {
    }

    getCompletions(editor: any, session: any, pos: any, prefix: any, callback: any) {
        if (editor.completers.length > 1) {
            // the ace editor comes with a snippetCompleter, textCompleter, keywordCompleter
            // our completor is the last of the array - let's remove all other
            // completers except ours
            editor.completers = editor.completers.slice(-1);
        }

        this.findCompletions(editor, session, pos, prefix).then((value) => {
            callback(null, value);
        }, (reason: any) => {
            callback(reason, []);
        });
    }

    getHelpText(metric: string, metadata: MetricMetadata) {
        const type = metadata.type;
        const semantics = metadata.sem;
        const units = metadata.units;
        const help = metadata['text-help'] || metadata['text-oneline'];
        return `<b>${metric}</b><hr />` +
            `Type: ${type}<br />` +
            `Semantics: ${semantics}<br />` +
            `Units: ${units}<br /><br />` +
            `${help}`;
    }

    async getChildren(endpoint: Endpoint, prefix: string) {
        if (endpoint.id in this.childrenCache && prefix in this.childrenCache[endpoint.id])
            return this.childrenCache[endpoint.id][prefix];

        const suggestions = await endpoint.context.children(prefix);
        if (!(endpoint.id in this.childrenCache))
            this.childrenCache[endpoint.id] = {};
        this.childrenCache[endpoint.id][prefix] = { nonleaf: suggestions.nonleaf, leaf: suggestions.leaf };

        return this.childrenCache[endpoint.id][prefix];
    }

    async findCompletions(editor: any, session: any, pos: any, prefix: any) {
        // don't do this in constructor of PCPMetricCompleter, as the user could
        // change the endpoint settings of the query, but the constructor is only called once
        const endpoint = this.datasource.getOrCreateEndpoint(this.target);

        const editorValue: string = editor.getValue();
        let metricPrefix = "";

        if (editorValue.includes(".")) {
            metricPrefix = editorValue.substring(0, editorValue.lastIndexOf("."));
        }

        const suggestions = await this.getChildren(endpoint, metricPrefix);
        if (prefix !== ".")
            prefix = "";

        const completions: any[] = [];
        completions.push(...suggestions.nonleaf.map((nonleaf: string) => ({
            caption: nonleaf,
            value: prefix + nonleaf,
            meta: "namespace",
            score: Number.MAX_VALUE
        })));

        const metadatas = await endpoint.context.metricMetadatas(suggestions.leaf.map((leaf: string) => `${metricPrefix}.${leaf}`));
        completions.push(...suggestions.leaf.map((leaf: string) => ({
            caption: leaf,
            value: prefix + leaf,
            meta: "metric",
            score: Number.MAX_VALUE,
            docHTML: this.getHelpText(`${metricPrefix}.${leaf}`, metadatas[`${metricPrefix}.${leaf}`])
        })));

        return completions;
    }
}
