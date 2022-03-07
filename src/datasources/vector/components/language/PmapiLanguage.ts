import { Monaco, MonacoType } from '../../../../components/monaco';
import { PCPVectorDataSource } from '../../datasource';
import { VectorQuery } from '../../types';
import * as PmapiBuiltins from './PmapiBuiltins.json';
import { PmapiCompletionItemProvider } from './PmapiCompletionItemProvider';

const languageConfiguration: MonacoType.languages.LanguageConfiguration = {
    autoClosingPairs: [
        { open: '(', close: ')' },
        { open: '[', close: ']' },
    ],

    // Monaco's autocompletion replace the current "word" when selecting a suggestion
    // i.e. when typing disk.dev.write_bytes, then removing _bytes and selecting disk.dev.write_rawactive,
    // it should replace the entire metric name; otherwise the editor contains 'disk.dev.disk.dev.write_rawactive'
    //
    // a word in our case is the entire metric name, i.e. including dots
    wordPattern: /[^\`\~\!\@\#\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\<\>\/\?\s]+/g, // the default separators except `.`
};

const languageDefinition: MonacoType.languages.IMonarchLanguage = {
    tokenPostfix: '.pmapi', // do not append languageId (which is random)

    functions: PmapiBuiltins.functions.map(f => f.def.substring(0, f.def.indexOf('('))),

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
};

export const registerLanguage = (
    monaco: Monaco,
    languageId: string,
    datasource: PCPVectorDataSource,
    getQuery: () => VectorQuery
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
        new PmapiCompletionItemProvider(monaco, datasource, getQuery)
    );
};
