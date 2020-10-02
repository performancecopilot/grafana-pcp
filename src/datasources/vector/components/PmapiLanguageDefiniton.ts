import * as Monaco from 'monaco-editor/esm/vs/editor/editor.api';
import PmapiLanguage from './PmapiLanguage.json';
import { findToken, getTokenValues, TokenValue } from 'datasources/lib/language';
import { cloneDeep, keyBy } from 'lodash';
import { PmApiService } from 'common/services/pmapi/PmApiService';
import { Metadata, NoIndomError } from 'common/services/pmapi/types';
import { Dict } from 'common/types/utils';
import { DataSource } from '../datasource';
import { VectorQuery } from '../types';
import { getLogger } from 'common/utils';

// this prevents monaco from being included in the redis datasource
// (it it already in its own chunk in vendors~monaco-editor.js)
declare const monaco: typeof Monaco;

const log = getLogger('PmapiLanguageDefinition');

export class PmapiLanguageDefinition {
    private pmApiService: PmApiService;
    private functionCompletions: Monaco.languages.CompletionItem[];

    constructor(private datasource: DataSource, private getQuery: () => VectorQuery) {
        this.pmApiService = datasource.pmApiService;
        this.functionCompletions = PmapiLanguage.functions.map(f => ({
            kind: monaco.languages.CompletionItemKind.Function,
            label: f.name,
            insertText: f.name,
            documentation: {
                value: f.doc,
                isTrusted: true,
            },
            range: undefined as any,
        }));
    }

    register() {
        monaco.languages.register({ id: 'pmapi' });
        monaco.languages.setLanguageConfiguration('pmapi', {
            autoClosingPairs: [
                { open: '(', close: ')' },
                { open: '[', close: ']' },
            ],

            // autocompletions replace the current "word"
            // the default separators except `.`
            wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\@\#\%\^\&\*\(\)\=\$\-\+\[\{\]\}\\\|\;\:\'\"\,\<\>\/\?\s]+)/g,
        });
        monaco.languages.setMonarchTokensProvider('pmapi', {
            functions: PmapiLanguage.functions.map(f => f.name),

            operators: ['<', '<=', '==', '>=', '>', '!=', '!', '&&', '||', '?', ':'],

            symbols: /[<=>!&|?:]+/,

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
                    [
                        /@symbols/,
                        {
                            cases: {
                                '@operators': 'operators',
                                '@default': '',
                            },
                        },
                    ],
                    [/\[/, 'delimiter.square.start-instance', '@instance'],
                ],

                instance: [
                    [/[^\]]+/, 'type.instance'],
                    [/\]/, 'delimiter.square', '@pop'],
                ],
            },
        } as Monaco.languages.IMonarchLanguage);
        monaco.languages.registerCompletionItemProvider('pmapi', {
            triggerCharacters: ['(', '.', '['],
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

    getHelpText(metadata?: Metadata) {
        if (!metadata) {
            return '';
        }

        // two spaces before the newline render it as a <br>, see https://daringfireball.net/projects/markdown/syntax#block
        return (
            `${metadata.name}\n\n` +
            `Type: *${metadata.type}*  \n` +
            `Semantics: *${metadata.sem}*  \n` +
            `Units: *${metadata.units}*\n\n` +
            `${metadata['text-help'] || metadata['text-oneline']}`
        );
    }

    async findMetricCompletions(token: TokenValue): Promise<Monaco.languages.CompletionItem[]> {
        const url = this.datasource.getUrlAndHostspec(this.getQuery()).url;
        let searchPrefix = '';
        if (token.value.includes('.')) {
            searchPrefix = token.value.substring(0, token.value.lastIndexOf('.'));
        }

        const suggestions = await this.pmApiService.children(url, null, searchPrefix);
        const prefixWithDot = searchPrefix === '' ? '' : `${searchPrefix}.`;
        let metadataByMetric: Dict<string, Metadata> = {};
        if (suggestions.leaf.length > 0) {
            const metadatas = await this.pmApiService.metric(
                url,
                null,
                suggestions.leaf.map(leaf => `${prefixWithDot}${leaf}`)
            );
            metadataByMetric = keyBy(metadatas.metrics, 'name');
        }

        suggestions.nonleaf.sort();
        suggestions.leaf.sort();
        return [
            ...suggestions.nonleaf.map(nonleaf => ({
                kind: monaco.languages.CompletionItemKind.Folder,
                label: nonleaf,
                insertText: nonleaf,
                range: undefined as any,
            })),
            ...suggestions.leaf.map(leaf => ({
                kind: monaco.languages.CompletionItemKind.Event,
                label: leaf,
                documentation: {
                    value: this.getHelpText(metadataByMetric[`${prefixWithDot}${leaf}`]),
                    isTrusted: true,
                },
                insertText: leaf,
                range: undefined as any,
            })),
        ];
    }

    async findInstanceCompletions(tokens: TokenValue[]) {
        const url = this.datasource.getUrlAndHostspec(this.getQuery()).url;
        const metric = findToken(tokens, 'identifier.pmapi');
        if (!metric) {
            return [];
        }

        try {
            const instancesResponse = await this.pmApiService.indom(url, null, metric.value);
            return instancesResponse.instances.map(instance => ({
                kind: monaco.languages.CompletionItemKind.EnumMember,
                label: instance.name,
                insertText: instance.name,
                range: undefined as any,
            }));
        } catch (error) {
            if (error instanceof NoIndomError) {
                return [];
            } else {
                throw error;
            }
        }
    }

    async findCompletions(tokens: TokenValue[]) {
        if (tokens.length === 0) {
            return;
        }

        const currentToken = tokens[tokens.length - 1];
        if (currentToken.type === 'identifier.pmapi') {
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
            currentToken.type === 'delimiter.square.start-instance.pmapi' ||
            currentToken.type === 'type.instance.pmapi'
        ) {
            return { suggestions: await this.findInstanceCompletions(tokens) };
        } else {
            return;
        }
    }
}
