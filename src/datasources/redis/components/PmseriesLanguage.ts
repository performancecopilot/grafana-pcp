import * as Monaco from 'monaco-editor/esm/vs/editor/editor.api';
// this prevents monaco from being included in the redis datasource
// (it it already in its own chunk in vendors~monaco-editor.js)
declare const monaco: typeof Monaco;

export default class PmseriesLanguage {
    constructor() {}

    register() {
        monaco.languages.register({ id: 'pmseries' });
        monaco.languages.registerCompletionItemProvider('pmseries', {
            provideCompletionItems: (model, position, context) => {
                var suggestions = [
                    {
                        label: 'rate',
                        kind: monaco.languages.CompletionItemKind.Function,
                        insertText: 'rate',
                        range: undefined as any,
                    },
                ];
                return { suggestions: suggestions };
            },
        });
    }
}
