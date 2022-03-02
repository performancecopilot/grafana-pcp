import { cloneDeep } from 'lodash';
import { getLogger } from 'loglevel';
import { MetricFindValue } from '@grafana/data';
import { getTemplateSrv } from '@grafana/runtime';
import { Monaco, MonacoType } from '../../../../components/monaco';
import { findToken, getTokenValues, TokenValue } from '../../../lib/language';
import { PCPRedisDataSource } from '../../datasource';
import * as PmseriesBuiltins from './PmseriesBuiltins.json';

const log = getLogger('PmseriesCompletionItemProvider');

export class PmseriesCompletionItemProvider implements MonacoType.languages.CompletionItemProvider {
    private functionCompletions: MonacoType.languages.CompletionItem[] = [];

    triggerCharacters = ['(', '{', '"', '&', '|', ','];

    constructor(private monaco: Monaco, private datasource: PCPRedisDataSource) {
        this.functionCompletions = PmseriesBuiltins.functions.map(f => {
            const name = f.def.substring(0, f.def.indexOf('('));
            return {
                kind: this.monaco.languages.CompletionItemKind.Function,
                label: name,
                insertText: name,
                documentation: {
                    value: `${f.def}\n\n${f.doc}`,
                    isTrusted: true,
                },
                range: undefined as any,
            };
        });
    }

    async findMetricCompletions(token: TokenValue) {
        const metrics = (await this.datasource.getResource('metricFindQuery', {
            query: `metrics(${token.value}*)`,
        })) as MetricFindValue[];
        return metrics.map(metric => ({
            kind: this.monaco.languages.CompletionItemKind.Event,
            label: metric.text,
            insertText: metric.text,
            detail: 'metric',
            range: undefined as any,
        }));
    }

    async findQualifierKeyCompletions() {
        const labelNames = (await this.datasource.getResource('metricFindQuery', {
            query: 'label_names()',
        })) as MetricFindValue[];

        return [
            {
                kind: this.monaco.languages.CompletionItemKind.Enum,
                label: 'instance.name',
                insertText: 'instance.name',
                detail: 'instance name',
                range: undefined as any,
            },
            ...labelNames.map(labelName => ({
                kind: this.monaco.languages.CompletionItemKind.Enum,
                label: labelName.text,
                insertText: labelName.text,
                detail: 'label name',
                range: undefined as any,
            })),
        ];
    }

    async findQualifierValuesCompletions(tokens: TokenValue[]) {
        const qualifierKeyToken = findToken(tokens, 'type.qualifier-key.pmseries');
        if (!qualifierKeyToken) {
            return [];
        }

        const variableNames = getTemplateSrv()
            .getVariables()
            .map(v => v.name);

        let labelValues: MetricFindValue[] = [];
        if (qualifierKeyToken.value !== 'instance.name') {
            labelValues = await this.datasource.getResource('metricFindQuery', {
                query: `label_values(${qualifierKeyToken.value})`,
            });
        }

        return [
            ...variableNames.map(variableName => ({
                kind: this.monaco.languages.CompletionItemKind.EnumMember,
                label: '$' + variableName,
                insertText: '$' + variableName,
                detail: 'dashboard variable',
                range: undefined as any,
            })),
            ...labelValues.map(labelValue => ({
                kind: this.monaco.languages.CompletionItemKind.EnumMember,
                label: labelValue.text,
                insertText: labelValue.text,
                detail: 'label value',
                range: undefined as any,
            })),
        ];
    }

    async findCompletions(tokens: TokenValue[]) {
        if (tokens.length === 0) {
            return;
        }

        const currentToken = tokens[tokens.length - 1];
        if (currentToken.type === 'identifier.pmseries') {
            // if the current token includes a dot, it can only be a metric name
            // otherwise it can be a function as well
            if (currentToken.value.includes('.')) {
                return { suggestions: await this.findMetricCompletions(currentToken) };
            } else {
                return {
                    suggestions: [...this.functionCompletions, ...(await this.findMetricCompletions(currentToken))],
                };
            }
        } else if (
            currentToken.type === 'delimiter.curly.start-qualifiers.pmseries' ||
            currentToken.type === 'type.qualifier-key.pmseries' ||
            currentToken.type === 'operators.logical.pmseries'
        ) {
            return { suggestions: await this.findQualifierKeyCompletions() };
        } else if (currentToken.type === 'string.qualifier-value.pmseries') {
            return { suggestions: await this.findQualifierValuesCompletions(tokens) };
        } else {
            return;
        }
    }

    async provideCompletionItems(model: MonacoType.editor.ITextModel, position: MonacoType.Position) {
        try {
            const suggestions = await this.findCompletions(getTokenValues(this.monaco, model, position));

            // the 'range' property gets modified by monaco, therefore return a clone instead of the real object
            return cloneDeep(suggestions);
        } catch (error: any) {
            log.error('Error while auto-completing', error, error?.data);
            return;
        }
    }
}
