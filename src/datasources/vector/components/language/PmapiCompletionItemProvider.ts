import { cloneDeep, keyBy } from 'lodash';
import { getLogger } from 'loglevel';
import { PmApiService } from '../../../../common/services/pmapi/PmApiService';
import { Metadata, NoIndomError } from '../../../../common/services/pmapi/types';
import { Dict } from '../../../../common/types/utils';
import { Monaco, MonacoType } from '../../../../components/monaco';
import { findToken, getTokenValues, TokenValue } from '../../../../datasources/lib/language';
import { PCPVectorDataSource } from '../../datasource';
import { VectorQuery } from '../../types';
import PmapiBuiltins from './PmapiBuiltins.json';

const log = getLogger('PmapiCompletionItemProvider');

export class PmapiCompletionItemProvider implements MonacoType.languages.CompletionItemProvider {
    private pmApiService: PmApiService;
    private functionCompletions: MonacoType.languages.CompletionItem[] = [];

    triggerCharacters = ['(', '.', '['];

    constructor(private monaco: Monaco, private datasource: PCPVectorDataSource, private getQuery: () => VectorQuery) {
        this.pmApiService = datasource.pmApiService;

        this.functionCompletions = PmapiBuiltins.functions.map(f => {
            const name = f.def.substring(0, f.def.indexOf('('));
            return {
                kind: this.monaco.languages.CompletionItemKind.Function,
                label: name,
                insertText: name,
                documentation: {
                    value: `${f.def}\n\n${f.doc}`,
                    isTrusted: true,
                },
                range: undefined as any,
            };
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

    async findMetricCompletions(token: TokenValue): Promise<MonacoType.languages.CompletionItem[]> {
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
                kind: this.monaco.languages.CompletionItemKind.Folder,
                label: `${prefixWithDot}${nonleaf}`,
                insertText: `${prefixWithDot}${nonleaf}`,
                range: undefined as any,
            })),
            ...suggestions.leaf.map(leaf => ({
                kind: this.monaco.languages.CompletionItemKind.Event,
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
                kind: this.monaco.languages.CompletionItemKind.EnumMember,
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

    async provideCompletionItems(model: MonacoType.editor.ITextModel, position: MonacoType.Position) {
        try {
            const suggestions = await this.findCompletions(getTokenValues(this.monaco, model, position));

            // the 'range' property gets modified by monaco, therefore return a clone instead of the real object
            return cloneDeep(suggestions);
        } catch (error: any) {
            log.error('Error while auto-completing', error, error?.data);
            return;
        }
    }
}
