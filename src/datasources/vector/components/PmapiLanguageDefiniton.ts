import * as Monaco from 'monaco-editor/esm/vs/editor/editor.api';
import PmapiLanguage from './PmapiLanguage.json';
import { findToken, getTokenValues, TokenValue } from 'datasources/lib/language';
import { cloneDeep, keyBy, uniqueId } from 'lodash';
import { PmApiService } from 'common/services/pmapi/PmApiService';
import { Metadata, NoIndomError } from 'common/services/pmapi/types';
import { Dict } from 'common/types/utils';
import { DataSource } from '../datasource';
import { VectorQuery } from '../types';
import { getLogger } from 'common/utils';
import { MonacoLanguageDefinition } from 'components/monaco/MonacoEditorWrapper';

// this prevents monaco from being included in the redis datasource
// (it it already in its own chunk in vendors~monaco-editor.js)
declare const monaco: typeof Monaco;

const log = getLogger('PmapiLanguageDefinition');

export class PmapiLanguageDefinition implements MonacoLanguageDefinition {
    languageId: string;
    private pmApiService: PmApiService;
    private functionCompletions: Monaco.languages.CompletionItem[] = [];
    private disposeCompletionProvider?: Monaco.IDisposable;

    constructor(private datasource: DataSource, private getQuery: () => VectorQuery) {
        this.languageId = uniqueId('pmapi');
        this.pmApiService = datasource.pmApiService;
    }

    register() {
        this.functionCompletions = PmapiLanguage.functions.map(f => {
            const name = f.def.substring(0, f.def.indexOf('('));
            return {
                kind: monaco.languages.CompletionItemKind.Function,
                label: name,
                insertText: name,
                documentation: {
                    value: `${f.def}\n\n${f.doc}`,
                    isTrusted: true,
                },
                range: undefined as any,
            };
        });

        monaco.languages.register({ id: this.languageId });
        monaco.languages.setLanguageConfiguration(this.languageId, {
            autoClosingPairs: [
                { open: '(', close: ')' },
                { open: '[', close: ']' },
            ],

            // autocompletions replace the current "word"
            // the default separators except `.`
            wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\@\#\%\^\&\*\(\)\=\$\-\+\[\{\]\}\\\|\;\:\'\"\,\<\>\/\?\s]+)/g,
        });
        monaco.languages.setMonarchTokensProvider(this.languageId, {
            tokenPostfix: '.pmapi', // do not append languageId (which is random)

            functions: PmapiLanguage.functions.map(f => f.def.substring(0, f.def.indexOf('('))),

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
        this.disposeCompletionProvider = monaco.languages.registerCompletionItemProvider(this.languageId, {
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

    deregister() {
        this.disposeCompletionProvider?.dispose();
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
        const { url, hostspec } = this.datasource.getUrlAndHostspec(this.getQuery());
        let searchPrefix = '';
        if (token.value.includes('.')) {
            searchPrefix = token.value.substring(0, token.value.lastIndexOf('.'));
        }

        const suggestions = await this.pmApiService.children(url, { hostspec, prefix: searchPrefix });
        const prefixWithDot = searchPrefix === '' ? '' : `${searchPrefix}.`;
        let metadataByMetric: Dict<string, Metadata> = {};
        if (suggestions.leaf.length > 0) {
            const metadatas = await this.pmApiService.metric(url, {
                hostspec,
                names: suggestions.leaf.map(leaf => `${prefixWithDot}${leaf}`),
            });
            metadataByMetric = keyBy(metadatas.metrics, 'name');
        }

        suggestions.nonleaf.sort();
        suggestions.leaf.sort();
        return [
            ...suggestions.nonleaf.map(nonleaf => ({
                kind: monaco.languages.CompletionItemKind.Folder,
                label: `${prefixWithDot}${nonleaf}`,
                insertText: `${prefixWithDot}${nonleaf}`,
                range: undefined as any,
            })),
            ...suggestions.leaf.map(leaf => ({
                kind: monaco.languages.CompletionItemKind.Event,
                label: `${prefixWithDot}${leaf}`,
                documentation: {
                    value: this.getHelpText(metadataByMetric[`${prefixWithDot}${leaf}`]),
                    isTrusted: true,
                },
                insertText: `${prefixWithDot}${leaf}`,
                range: undefined as any,
            })),
        ];
    }

    async findInstanceCompletions(tokens: TokenValue[]) {
        const { url, hostspec } = this.datasource.getUrlAndHostspec(this.getQuery());
        const metric = findToken(tokens, 'identifier.pmapi');
        if (!metric) {
            return [];
        }

        try {
            const instancesResponse = await this.pmApiService.indom(url, { hostspec, name: metric.value });
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
