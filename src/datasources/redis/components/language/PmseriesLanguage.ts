import { Monaco, MonacoType } from '../../../../components/monaco';
import { PCPRedisDataSource } from '../../datasource';
import { PmseriesCompletionItemProvider } from './PmseriesCompletionItemProvider';

const languageConfiguration: MonacoType.languages.LanguageConfiguration = {
    autoClosingPairs: [
        { open: '(', close: ')' },
        { open: '{', close: '}' },
        { open: '"', close: '"' },
    ],
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

export const registerLanguage = (monaco: Monaco, languageId: string, datasource: PCPRedisDataSource) => {
    const languages = monaco.languages.getLanguages();
    if (languages.find(language => language.id === languageId)) {
        return;
    }

    monaco.languages.register({ id: languageId });
    monaco.languages.setLanguageConfiguration(languageId, languageConfiguration);
    monaco.languages.setMonarchTokensProvider(languageId, languageDefinition);
    monaco.languages.registerCompletionItemProvider(languageId, new PmseriesCompletionItemProvider(monaco, datasource));
};
