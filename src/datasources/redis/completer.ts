import { MetricMetadata } from "../lib/types";
import { PCPRedisDatasource } from "./datasource";
import { PmSeries } from "./pmseries";

export default class PCPRedisMetricCompleter {

    identifierRegexps = [/\{/, /[a-zA-Z0-9_.]/];
    pmSeries: PmSeries;

    constructor(datasource: PCPRedisDatasource) {
        this.pmSeries = datasource.pmSeries;
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

    getCompletion(word: string, hiddenPrefix: string, meta: string) {
        return {
            caption: word,
            value: hiddenPrefix + word,
            meta: meta,
            score: Number.MAX_VALUE
        };
    }

    async findMetricCompletions(token: any) {
        let searchPrefix: string = "";
        if (token.value.includes(".")) {
            searchPrefix = token.value.substring(0, token.value.lastIndexOf("."));
        }

        let completions = await this.pmSeries.metrics(`${searchPrefix}.*`);
        completions = completions.filter(c => c.match(`${searchPrefix}.*`)); // TODO: remove me once API performs filtering
        completions.sort();
        return completions.map((metric: string) => this.getCompletion(metric, "", "metric"));
    }

    async findQualifierCompletions(token: any) {
        const hiddenPrefix = token.value === "{" ? "{" : "";
        let labels = await this.pmSeries.labelNames(); // todo: only labels of series for expr

        let completions: any[] = [];
        completions.push(...["instance.name", "metric.name"].map(suggestion => this.getCompletion(suggestion, hiddenPrefix, "qualifier")));
        completions.push(...labels.map(label => this.getCompletion(label, hiddenPrefix, "label")));
        return completions;
    }

    async findCompletions(editor: any, session: any, pos: any, prefix: any) {
        const token = session.getTokenAt(pos.row, pos.column);
        if (token.type === "entity.name.tag.metric") {
            return this.findMetricCompletions(token);
        }
        else if (token.type === "entity.name.tag.qualifier-field" || token.type === "paren.lparen.qualifiers-matcher") {
            return this.findQualifierCompletions(token);
        }
        else {
            return [];
        }
    }
}
