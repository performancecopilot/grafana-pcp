import { Monaco, MonacoType } from '../../../../components/monaco';
import { PCPBPFtraceDataSource } from '../../datasource';
import { BPFtraceQuery } from '../../types';
import BPFtraceBuiltins from './BPFtraceBuiltins.json';
import { BPFtraceCompletionItemProvider } from './BPFtraceCompletionItemProvider';

const languageConfiguration: MonacoType.languages.LanguageConfiguration = {
    autoClosingPairs: [
        { open: '(', close: ')' },
        { open: '"', close: '"' },
    ],

    // autocompletions replace the current "word" (without this setting, we get kprobe:kprobe:something)
    // the default separators except `@$:`
    wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\#\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\'\"\,\.\<\>\/\?\s]+)/g,
};

const languageDefinition: MonacoType.languages.IMonarchLanguage = {
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
        ...BPFtraceBuiltins.variables.map(v => v.name),
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
    builtinFunctions: BPFtraceBuiltins.functions.map(f => f.def.substring(0, f.def.indexOf('('))),

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
};

export const registerLanguage = (
    monaco: Monaco,
    languageId: string,
    datasource: PCPBPFtraceDataSource,
    getQuery: () => BPFtraceQuery
) => {
    const languages = monaco.languages.getLanguages();
    if (languages.find(language => language.id === languageId)) {
        return;
    }

    monaco.languages.register({ id: languageId });
    monaco.languages.setLanguageConfiguration(languageId, languageConfiguration);
    monaco.languages.setMonarchTokensProvider(languageId, languageDefinition);
    monaco.languages.registerCompletionItemProvider(
        languageId,
        new BPFtraceCompletionItemProvider(monaco, datasource, getQuery)
    );
};
