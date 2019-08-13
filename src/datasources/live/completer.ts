import { PCPLiveDatasource } from "./datasource";
import { MetricMetadata } from "../lib/models/pmapi";

export default class PCPLiveCompleter {

    identifierRegexps = [/[a-zA-Z0-9_.]/];

    constructor(private datasource: PCPLiveDatasource, private target: any) {
    }

    getCompletions(editor: any, session: any, pos: any, prefix: any, callback: any) {
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
        const help = metadata["text-help"] || metadata["text-oneline"];
        return `<b>${metric}</b><hr />` +
            `Type: ${type}<br />` +
            `Semantics: ${semantics}<br />` +
            `Units: ${units}<br /><br />` +
            `${help}`;
    }

    getCompletion(word: string, meta: string, doc?: string) {
        return {
            caption: word,
            value: word,
            meta: meta,
            score: Number.MAX_VALUE,
            docHTML: doc
        };
    }

    async findMetricCompletions(token: any) {
        // don't do this in constructor of PCPLiveCompleter, as the user could
        // change the endpoint settings of the query, but the constructor is only called once
        const [url, container] = this.datasource.getConnectionParams(this.target, {});
        const endpoint = this.datasource.getOrCreateEndpoint(url, container);

        let searchPrefix = "";
        if (token.value.includes(".")) {
            searchPrefix = token.value.substring(0, token.value.lastIndexOf("."));
        }
        const suggestions = await endpoint.pmapiSrv.getChildren(searchPrefix);
        const prefixWithDot = searchPrefix === "" ? "" : `${searchPrefix}.`;
        const metadatas = await endpoint.pmapiSrv.getMetricMetadatas(suggestions.leaf.map((leaf: string) => `${prefixWithDot}${leaf}`));

        suggestions.nonleaf.sort();
        suggestions.leaf.sort();
        const completions: any[] = [];
        completions.push(...suggestions.nonleaf.map(nonleaf =>
            this.getCompletion(`${prefixWithDot}${nonleaf}`, "namespace")
        ));
        completions.push(...suggestions.leaf.map(leaf => {
            const helpText = this.getHelpText(`${prefixWithDot}${leaf}`, metadatas[`${prefixWithDot}${leaf}`]);
            return this.getCompletion(`${prefixWithDot}${leaf}`, "metric", helpText);
        }));

        return completions;
    }

    async findCompletions(editor: any, session: any, pos: any, prefix: any) {
        const token = session.getTokenAt(pos.row, pos.column);
        if (token.type === "entity.name.tag.metric") {
            return this.findMetricCompletions(token);
        }
        else {
            return [];
        }
    }
}
