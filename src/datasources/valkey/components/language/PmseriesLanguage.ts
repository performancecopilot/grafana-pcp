import { Monaco, MonacoType } from '../../../../components/monaco';
import { PCPValkeyDataSource } from '../../datasource';
import { PmseriesCompletionItemProvider } from './PmseriesCompletionItemProvider';

const languageConfiguration: MonacoType.languages.LanguageConfiguration = {
    autoClosingPairs: [
        { open: '(', close: ')' },
        { open: '{', close: '}' },
        { open: '"', close: '"' },
    ],

    // Monaco's autocompletion replace the current "word" when selecting a suggestion
    // i.e. when typing disk.dev.write_bytes, then removing _bytes and selecting disk.dev.write_rawactive,
    // it should replace the entire metric name; otherwise the editor contains 'disk.dev.disk.dev.write_rawactive'
    //
    // a word in our case is the entire metric name, i.e. including dots
    wordPattern: /[^\`\~\!\@\#\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\<\>\/\?\s]+/g, // the default separators except `.`
};

const languageDefinition: MonacoType.languages.IMonarchLanguage = {
    tokenPostfix: '.pmseries', // do not append languageId (which is random)

    functions: [], //PmseriesLanguage.functions.map(f => f.name),

    comparisonOperators: ['==', '!=', '~~', '=~', '!~', ':', '<', '>', '<=', '>='],
    logicalOperators: ['&&', '||', ','],
    symbols: /[=!~:<>&|,]+/,

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
};

export const registerLanguage = (monaco: Monaco, languageId: string, datasource: PCPValkeyDataSource) => {
    const languages = monaco.languages.getLanguages();
    if (languages.find(language => language.id === languageId)) {
        return;
    }

    monaco.languages.register({ id: languageId });
    monaco.languages.setLanguageConfiguration(languageId, languageConfiguration);
    monaco.languages.setMonarchTokensProvider(languageId, languageDefinition);
    monaco.languages.registerCompletionItemProvider(languageId, new PmseriesCompletionItemProvider(monaco, datasource));
};
