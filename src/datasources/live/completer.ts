import { PcpLiveDatasource } from "./datasource";
import Context from "../lib/context";
import { Endpoint } from "../lib/endpoint_registry";

export default class PCPMetricCompleter {

    identifierRegexps = [/\./, /[a-zA-Z0-9_]/];

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

    async findCompletions(editor: any, session: any, pos: any, prefix: any) {
        // don't do this in constructor of PCPMetricCompleter, as the user could
        // change the endpoint settings of the query, but the constructor is only called once
        const endpoint = await this.datasource.getOrCreateEndpoint(this.target);

        const editorValue: string = editor.getValue();
        let metricPrefix = "";

        if (editorValue.includes(".")) {
            metricPrefix = editorValue.substring(0, editorValue.lastIndexOf("."));
        }

        const suggestions = await endpoint.context.children(metricPrefix);
        if (prefix !== ".")
            prefix = "";

        const completions: any[] = [];
        completions.push(...suggestions.nonleaf.map((suggestion: string) => ({
            caption: suggestion,
            value: prefix + suggestion,
            meta: "metric prefix",
            score: Number.MAX_VALUE
        })));
        completions.push(...suggestions.leaf.map((suggestion: string) => ({
            caption: suggestion,
            value: prefix + suggestion,
            meta: "metric",
            score: Number.MAX_VALUE,
            docHTML: undefined
        })));
        return completions;
    }
}
