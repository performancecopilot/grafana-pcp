import _ from 'lodash';
import { PCPRedisDatasource } from "./datasource";
import { PmSeries } from "./pmseries";

export default class PCPRedisCompleter {

    // first regex is required that the auto-completion box shows up
    // when entering a { or "
    identifierRegexps = [/[\{"]/, /[a-zA-Z0-9_.]/];
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

    findToken(tokens: any[], type: string) {
        for (let i = tokens.length - 1; i >= 0; i--) {
            if (tokens[i].type === type)
                return tokens[i];
        }
        return null;
    }

    async findMetricCompletions(token: any) {
        let searchPrefix = token.value.substring(0, 1);
        let completions = await this.pmSeries.metrics(`${searchPrefix}*`);
        completions.sort();
        return completions.map((metric: string) => this.getCompletion(metric, "", "metric"));
    }

    private async findQualifiersForToken(metric: string): Promise<Record<string, string[]>> {
        const seriesList = await this.pmSeries.query(metric);
        if (seriesList.length === 0)
            return {};

        const qualifiers = {};
        const descriptions = await this.pmSeries.descs(seriesList);
        const [seriesWithIndoms, seriesWithoutIndoms] = _.partition(seriesList, series => descriptions[series].indom !== "none");
        let instanceIds: string[] = [];
        if (seriesWithIndoms.length > 0) {
            const instances = await this.pmSeries.instances(seriesWithIndoms);
            qualifiers["instance.name"] = [];
            for (const series in instances) {
                instanceIds.push(...Object.keys(instances[series]));
                qualifiers["instance.name"].push(...Object.values(instances[series]));
            }
        }

        const labels = await this.pmSeries.labels([...seriesWithoutIndoms, ...instanceIds]);
        for (const label of Object.values(labels)) {
            for (const [key, value] of Object.entries(label)) {
                if (!(key in qualifiers))
                    qualifiers[key] = [];
                if (!qualifiers[key].includes(value))
                    qualifiers[key].push(value);
            }
        }
        return qualifiers;
    }

    async findQualifierKeyCompletions(tokens: any[], token: any) {
        const hiddenPrefix = token.value === "{" ? "{" : "";
        const metricToken = this.findToken(tokens, "entity.name.tag.metric");
        if (!metricToken)
            return [];

        const qualifiers = await this.findQualifiersForToken(metricToken.value);
        return Object.keys(qualifiers).map(qualifierKey =>
            this.getCompletion(qualifierKey, hiddenPrefix, qualifierKey === "instance.name" ? "qualifier" : "label")
        );
    }

    async findQualifierValueCompletions(tokens: any[], token: any) {
        const hiddenPrefix = token.value === '""' ? '"' : '';
        const metricToken = this.findToken(tokens, "entity.name.tag.metric");
        const qualifierKeyToken = this.findToken(tokens, "entity.name.tag.qualifier-key");
        if (!metricToken || !qualifierKeyToken)
            return [];

        const qualifiers = await this.findQualifiersForToken(metricToken.value);
        return (qualifiers[qualifierKeyToken.value] || []).map(qualifierValue =>
            this.getCompletion(qualifierValue, hiddenPrefix, qualifierValue === "instance.name" ? "qualifier" : "label")
        );
    }

    async findCompletions(editor: any, session: any, pos: any, prefix: any) {
        const token = session.getTokenAt(pos.row, pos.column);
        if (token.type === "entity.name.tag.metric") {
            return this.findMetricCompletions(token);
        }
        else if (token.type === "entity.name.tag.qualifier-key" || token.type === "paren.lparen.qualifiers-matcher") {
            return this.findQualifierKeyCompletions(session.getTokens(pos.row), token);
        }
        else if (token.type === "string.quoted.qualifier-value") {
            return this.findQualifierValueCompletions(session.getTokens(pos.row), token);
        }
        else {
            return [];
        }
    }
}
