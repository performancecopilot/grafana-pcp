import * as Monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { getTokenValues, TokenValue } from 'datasources/lib/language';
import { PmApiService } from 'common/services/pmapi/PmApiService';
import { DataSource } from '../datasource';
import { getLogger } from 'common/utils';
import { BPFtraceQuery } from '../types';
import * as BPFtraceLanguage from './BPFtraceLanguage.json';
import { Dict } from 'common/types/utils';
import { cloneDeep, uniqueId } from 'lodash';
import { MonacoLanguageDefinition } from 'components/monaco/MonacoEditorWrapper';

// this prevents monaco from being included in the redis datasource
// (it it already in its own chunk in vendors~monaco-editor.js)
declare const monaco: typeof Monaco;

const log = getLogger('BPFtraceLanguageDefinition');

export class BPFtraceLanguageDefinition implements MonacoLanguageDefinition {
    languageId: string;
    private pmApiService: PmApiService;
    private dynamicProbeCompletions: Dict<string, Monaco.languages.CompletionItem[]> = {}; // kprobes based on current running kernel
    private staticProbeCompletions: Monaco.languages.CompletionItem[] = []; // probes which are not in `bpftrace -l` (BEGIN, END, interval, ...)
    private variableCompletions: Monaco.languages.CompletionItem[] = [];
    private functionCompletions: Monaco.languages.CompletionItem[] = [];
    private disposeCompletionProvider?: Monaco.IDisposable;

    getHelpText(title: string, doc: string) {
        return `${title}\n\n${doc}`;
    }

    constructor(private datasource: DataSource, private getQuery: () => BPFtraceQuery) {
        this.languageId = uniqueId('bpftrace');
        this.pmApiService = datasource.pmApiService;
    }

    register() {
        this.staticProbeCompletions = BPFtraceLanguage.probes.map(f => ({
            kind: monaco.languages.CompletionItemKind.Event,
            label: f.name,
            insertText: f.name,
            range: undefined as any,
        }));
        this.variableCompletions = BPFtraceLanguage.variables.map(f => ({
            kind: monaco.languages.CompletionItemKind.Variable,
            label: f.name,
            insertText: f.insertText ?? f.name,
            documentation: {
                value: this.getHelpText(f.name, f.doc),
                isTrusted: true,
            },
            range: undefined as any,
        }));
        this.functionCompletions = BPFtraceLanguage.functions.map(f => {
            const name = f.def.substring(0, f.def.indexOf('('));
            return {
                kind: monaco.languages.CompletionItemKind.Function,
                label: name,
                insertText: name,
                documentation: {
                    value: this.getHelpText(f.def, f.doc),
                    isTrusted: true,
                },
                range: undefined as any,
            };
        });

        monaco.languages.register({ id: this.languageId });
        monaco.languages.setLanguageConfiguration(this.languageId, {
            autoClosingPairs: [
                { open: '(', close: ')' },
                { open: '"', close: '"' },
            ],

            // autocompletions replace the current "word" (without this setting, we get kprobe:kprobe:something)
            // the default separators except `@$:`
            wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\#\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\'\"\,\.\<\>\/\?\s]+)/g,
        });
        monaco.languages.setMonarchTokensProvider(this.languageId, {
            tokenPostfix: '.bpftrace', // do not append languageId (which is random)

            probes:
                'BEGIN|END|' +
                [
                    '(k|u)(ret)?probe',
                    'tracepoint',
                    'usdt',
                    'profile',
                    'interval',
                    'software',
                    'hardware',
                    'watchpoint',
                    'k(ret)?func',
                ]
                    .map(p => `${p}:[a-zA-Z0-9_\\-:./]*`)
                    .join('|'),

            keywords: ['if', 'else', 'unroll', 'return'],
            storageType: ['struct', 'union', 'enum'],
            builtinVariables: [
                ...BPFtraceLanguage.variables.map(v => v.name),
                'args',
                'arg0',
                'arg1',
                'arg2',
                'arg3',
                'arg4',
                'arg5',
                'arg6',
                'arg7',
                'arg8',
                'arg9',
            ],
            builtinConstants: ['true', 'false'],
            builtinFunctions: BPFtraceLanguage.functions.map(f => f.def.substring(0, f.def.indexOf('('))),

            operators: [
                '=',
                '||',
                '&&',
                '|',
                '^',
                '&',
                '==',
                '!=',
                '<=',
                '>=',
                '<<',
                '+',
                '-',
                '*',
                '/',
                '%',
                '!',
                '~',
                '++',
                '--',
                '+=',
                '-=',
                '*=',
                '/=',
                '%=',
                '&=',
                '|=',
                '^=',
                '<<=',
                '>>=',
                '>>',
                '=>',
            ],

            symbols: /[=><!~?:&|+\-*\/\^%]+/,

            tokenizer: {
                root: [
                    [/#\s*(include|import|pragma|line|define|undef)/, 'keyword'], // compiler directives
                    [/<.*>/, 'string'], // compiler directive value

                    ['@probes', 'type.probe'],

                    [
                        /[a-zA-Z_][a-zA-Z0-9_]*/,
                        {
                            cases: {
                                '@keywords': 'keyword',
                                '@storageType': 'keyword',
                                '@builtinVariables': 'identifier',
                                '@builtinConstants': 'identifier',
                                '@builtinFunctions': 'keyword',
                            },
                        },
                    ],
                    [/(@|\$)[a-zA-Z_][a-zA-Z0-9_]*/, 'identifier'],

                    [/[{}()\[\]]/, 'brackets'],

                    [/[ \t\v\f\r\n]+/, ''],
                    [/\/\*/, 'comment', '@comment'],
                    [/\/\/.*$/, 'comment'],

                    [
                        /@symbols/,
                        {
                            cases: {
                                '@operators': 'delimiter',
                                '@default': '',
                            },
                        },
                    ],

                    [/[0-9_]*\.[0-9_]+([eE][\-+]?\d+)?[fFdD]?/, 'number.float'],
                    [/0[xX][0-9a-fA-F_]+/, 'number.hex'],
                    [/0[bB][01_]+/, 'number.hex'],
                    [/[0-9_]+/, 'number'],

                    [/[;,.]/, 'delimiter'],
                    [/".*?"/, 'string'],
                ],

                comment: [
                    [/[^\/*]+/, 'comment'],
                    [/\*\//, 'comment', '@pop'],
                    [/[\/*]/, 'comment'],
                ],
            },
        } as Monaco.languages.IMonarchLanguage);
        this.disposeCompletionProvider = monaco.languages.registerCompletionItemProvider(this.languageId, {
            triggerCharacters: [':'],
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

    async findProbeCompletions(token: TokenValue): Promise<Monaco.languages.CompletionList> {
        const { url, hostspec } = this.datasource.getUrlAndHostspec(this.getQuery());
        const endpointId = `${url}::${hostspec}`;

        if (!(endpointId in this.dynamicProbeCompletions)) {
            const fetchResponse = await this.pmApiService.fetch(url, null, ['bpftrace.info.tracepoints']);

            const probes = (fetchResponse.values[0].instances[0].value as string)
                .split(',')
                .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
            for (let i = 0, numProbes = probes.length; i < numProbes; i++) {
                if (probes[i].startsWith('kprobe:')) {
                    probes.push('kretprobe:' + probes[i].substring(probes[i].indexOf(':') + 1));
                }
                if (probes[i].startsWith('kfunc:')) {
                    probes.push('kretfunc:' + probes[i].substring(probes[i].indexOf(':') + 1));
                }
            }
            this.dynamicProbeCompletions[endpointId] = probes.map(probe => ({
                kind: monaco.languages.CompletionItemKind.Event,
                label: probe,
                insertText: probe,
                range: undefined as any,
            }));
        }

        // Monaco performance degrades significantly with a big number of autocompletion items (~172343 probes)
        const completions = [
            ...this.staticProbeCompletions,
            ...this.dynamicProbeCompletions[endpointId]!,
        ].filter(completion => (completion.label as string).includes(token.value));

        if (completions.length < 100) {
            return { suggestions: completions, incomplete: false };
        } else {
            completions.splice(100);
            return { suggestions: completions, incomplete: true };
        }
    }

    async findCompletions(tokens: TokenValue[]) {
        if (tokens.length === 0) {
            return;
        }

        const currentToken = tokens[tokens.length - 1];
        let depth = 0; // depth of {} blocks, 0 = global scope
        let filter = 0; // check if inside filter (==1) or not (==0)
        for (let i = tokens.length - 1; i >= 0; i--) {
            const token = tokens[i];
            if (token.type === 'brackets.bpftrace' && token.value === '{') {
                depth++;
            } else if (token.type === 'brackets.bpftrace' && token.value === '}') {
                depth--;
            } else if (depth === 0 && token.type === 'delimiter.bpftrace' && token.value === '/') {
                filter = (filter + 1) % 2;
            }
        }

        // TODO: completionProvider doesn't get triggered inside comments

        if (depth === 0 && filter === 0) {
            // global scope
            return await this.findProbeCompletions(currentToken);
        } else if (depth === 0 && filter === 1) {
            // global scope, inside filter
            return { suggestions: this.variableCompletions };
        } else {
            // action block
            return { suggestions: this.variableCompletions.concat(this.functionCompletions) };
        }
    }
}
