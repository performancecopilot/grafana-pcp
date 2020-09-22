import { DataSource } from '../datasource';
import * as Monaco from 'monaco-editor/esm/vs/editor/editor.api';
import PmseriesLang from './PmseriesLang.json';
import { MetricFindValue } from '@grafana/data';

// this prevents monaco from being included in the redis datasource
// (it it already in its own chunk in vendors~monaco-editor.js)
declare const monaco: typeof Monaco;

interface MonarchLanguageConfiguration extends Monaco.languages.IMonarchLanguage {
    functions: string[];
}

interface TokenValue {
    offset: number;
    offsetEnd: number;
    type: string;
    value: string;
}

export class PmseriesLangDef {
    private functionCompletions: Monaco.languages.CompletionItem[];

    constructor(private datasource: DataSource) {
        this.functionCompletions = PmseriesLang.functions.map(f => ({
            kind: monaco.languages.CompletionItemKind.Function,
            label: f.name,
            insertText: f.name,
            detail: f.doc,
            range: undefined as any,
        }));
    }

    register() {
        monaco.languages.register({ id: 'pmseries' });
        monaco.languages.setLanguageConfiguration('pmseries', {
            autoClosingPairs: [
                { open: '{', close: '}' },
                { open: '(', close: ')' },
                { open: '"', close: '"' },
            ],
        });
        monaco.languages.setMonarchTokensProvider('pmseries', {
            functions: PmseriesLang.functions.map(f => f.name),

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

                    [/{/, 'delimiter.curly.start-qualifiers', '@qualifiers'],
                ],

                qualifiers: [
                    [/[\w.]+/, 'type.qualifier-key'],
                    [/".*?"/, 'string.qualifier-value'],
                    [/-?(\d+\.)?\d+/, 'number.qualifier-value'],
                    [/==|!=|~~|=~|!~|:|<|>|<=|>=/, 'operators.comparison'],
                    [/&&|\|\||,/, 'operators.logical'],
                    [/}/, 'delimiter.curly', '@pop'],
                ],
            },
        } as MonarchLanguageConfiguration);
        monaco.languages.registerCompletionItemProvider('pmseries', {
            triggerCharacters: ['{', '"', '&', '|', ','],
            provideCompletionItems: async (model, position) => {
                const currentLine = model.getLineContent(position.lineNumber);
                const tokens = monaco.editor.tokenize(currentLine, model.getModeId());
                const tokenValues: TokenValue[] = [];
                for (let i = 0; i < tokens[0].length; i++) {
                    const offset = tokens[0][i].offset;
                    const offsetEnd = i + 1 < tokens[0].length ? tokens[0][i + 1].offset : currentLine.length; // excluding
                    if (offset >= position.column - 1) {
                        break;
                    }

                    tokenValues.push({
                        offset,
                        offsetEnd,
                        type: tokens[0][i].type,
                        value: currentLine.substring(offset, offsetEnd),
                    });
                }
                return await this.findCompletions(tokenValues);
            },
        });
    }

    findToken(tokens: TokenValue[], type: string) {
        for (let i = tokens.length - 1; i >= 0; i--) {
            if (tokens[i].type === type) {
                return tokens[i];
            }
        }
        return;
    }

    async findMetricCompletions(token: TokenValue) {
        const metrics = (await this.datasource.getResource('metricFindQuery', {
            query: `metrics(${token.value}*)`,
        })) as MetricFindValue[];
        return metrics.map(metric => ({
            kind: monaco.languages.CompletionItemKind.Event,
            label: metric.text,
            insertText: metric.text,
            range: undefined as any,
        }));
    }

    async findQualifierKeyCompletions() {
        const labelNames = (await this.datasource.getResource('metricFindQuery', {
            query: 'label_names()',
        })) as MetricFindValue[];
        return labelNames.map(labelName => ({
            kind: monaco.languages.CompletionItemKind.Enum,
            label: labelName.text,
            insertText: labelName.text,
            range: undefined as any,
        }));
    }

    async findQualifierValuesCompletions(tokens: TokenValue[]) {
        const qualifierKeyToken = this.findToken(tokens, 'type.qualifier-key.pmseries');
        if (!qualifierKeyToken) {
            return [];
        }

        const labelValues = (await this.datasource.getResource('metricFindQuery', {
            query: `label_values(${qualifierKeyToken.value})`,
        })) as MetricFindValue[];
        return labelValues.map(labelValue => ({
            kind: monaco.languages.CompletionItemKind.EnumMember,
            label: labelValue.text,
            insertText: labelValue.text,
            range: undefined as any,
        }));
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
            currentToken.type === 'operators.logical.pmseries' ||
            currentToken.type === 'type.qualifier-key.pmseries'
        ) {
            return { suggestions: await this.findQualifierKeyCompletions() };
        } else if (currentToken.type === 'string.qualifier-value.pmseries') {
            return { suggestions: await this.findQualifierValuesCompletions(tokens) };
        } else {
            return;
        }
    }
}
