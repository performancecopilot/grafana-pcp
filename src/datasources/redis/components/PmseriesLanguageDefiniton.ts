import { DataSource } from '../datasource';
import * as Monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { MetricFindValue } from '@grafana/data';
import { findToken, getTokenValues, TokenValue } from '../../lib/language';
//import * as PmseriesLanguage from './PmseriesLanguage.json';
import { cloneDeep, uniqueId } from 'lodash';
import { getLogger } from 'common/utils';
import { MonacoLanguageDefinition } from 'components/monaco/MonacoEditorWrapper';
import { getTemplateSrv } from '@grafana/runtime';

// this prevents monaco from being included in the redis datasource
// (it it already in its own chunk in vendors~monaco-editor.js)
declare const monaco: typeof Monaco;

const log = getLogger('PmseriesLanguageDefiniton');

export class PmseriesLanguageDefiniton implements MonacoLanguageDefinition {
    languageId: string;
    private functionCompletions: Monaco.languages.CompletionItem[] = [];
    private disposeCompletionProvider?: Monaco.IDisposable;

    constructor(private datasource: DataSource) {
        this.languageId = uniqueId('pmseries');
    }

    register() {
        /*this.functionCompletions = PmseriesLanguage.functions.map(f => ({
            kind: monaco.languages.CompletionItemKind.Function,
            label: f.name,
            insertText: f.name,
            detail: f.doc,
            range: undefined as any,
        }));*/

        monaco.languages.register({ id: this.languageId });
        monaco.languages.setLanguageConfiguration(this.languageId, {
            autoClosingPairs: [
                { open: '(', close: ')' },
                { open: '{', close: '}' },
                { open: '"', close: '"' },
            ],

            // autocompletions replace the current "word"
            // the default separators except `.`
            wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\@\#\%\^\&\*\(\)\=\$\-\+\[\{\]\}\\\|\;\:\'\"\,\<\>\/\?\s]+)/g,
        });
        monaco.languages.setMonarchTokensProvider(this.languageId, {
            tokenPostfix: '.pmseries', // do not append languageId (which is random)

            functions: [], //PmseriesLanguage.functions.map(f => f.name),

            comparisonOperators: ['==', '!=', '~~', '=~', '!~', ':', '<', '>', '<=', '>='],
            logicalOperators: ['&&', '||', ','],
            symbols: /[=!~:<>=&|,]+/,

            tokenizer: {
                root: [
                    // functions (or metric name if not a function)
                    [
                        /[\w.]+/,
                        {
                            cases: {
                                '@functions': 'keyword.function',
                                '@default': 'identifier',
                            },
                        },
                    ],
                    [/[()]/, 'delimiter.parenthesis'],
                    [/{/, 'delimiter.curly.start-qualifiers', '@qualifiers'],
                ],

                qualifiers: [
                    [/[\w.]+/, 'type.qualifier-key'],
                    [/".*?"/, 'string.qualifier-value'],
                    [/-?(\d+\.)?\d+/, 'number.qualifier-value'],
                    [
                        /@symbols/,
                        {
                            cases: {
                                '@comparisonOperators': 'operators.comparison',
                                '@logicalOperators': 'operators.logical',
                                '@default': '',
                            },
                        },
                    ],
                    [/}/, 'delimiter.curly', '@pop'],
                ],
            },
        } as Monaco.languages.IMonarchLanguage);
        this.disposeCompletionProvider = monaco.languages.registerCompletionItemProvider(this.languageId, {
            triggerCharacters: ['(', '{', '"', '&', '|', ','],
            provideCompletionItems: async (model, position) => {
                try {
                    // the 'range' property gets modified by monaco, therefore return a clone instead of the real object
                    return cloneDeep(await this.findCompletions(getTokenValues(model, position)));
                } catch (error) {
                    log.error(error, error?.data);
                    return;
                }
            },
        });
    }

    deregister() {
        this.disposeCompletionProvider?.dispose();
    }

    async findMetricCompletions(token: TokenValue) {
        const metrics = (await this.datasource.getResource('metricFindQuery', {
            query: `metrics(${token.value}*)`,
        })) as MetricFindValue[];
        return metrics.map(metric => ({
            kind: monaco.languages.CompletionItemKind.Event,
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
                kind: monaco.languages.CompletionItemKind.Enum,
                label: 'instance.name',
                insertText: 'instance.name',
                detail: 'instance name',
                range: undefined as any,
            },
            ...labelNames.map(labelName => ({
                kind: monaco.languages.CompletionItemKind.Enum,
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
                kind: monaco.languages.CompletionItemKind.EnumMember,
                label: '$' + variableName,
                insertText: '$' + variableName,
                detail: 'dashboard variable',
                range: undefined as any,
            })),
            ...labelValues.map(labelValue => ({
                kind: monaco.languages.CompletionItemKind.EnumMember,
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
}
