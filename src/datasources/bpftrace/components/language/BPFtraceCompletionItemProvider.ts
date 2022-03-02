import { cloneDeep } from 'lodash';
import { getLogger } from 'loglevel';
import { PmApiService } from '../../../../common/services/pmapi/PmApiService';
import { Dict } from '../../../../common/types/utils';
import { Monaco, MonacoType } from '../../../../components/monaco';
import { getTokenValues, TokenValue } from '../../../lib/language';
import { PCPBPFtraceDataSource } from '../../datasource';
import { BPFtraceQuery } from '../../types';
import * as BPFtraceBuiltins from './BPFtraceBuiltins.json';

const log = getLogger('BPFtraceCompletionItemProvider');

export class BPFtraceCompletionItemProvider implements MonacoType.languages.CompletionItemProvider {
    private pmApiService: PmApiService;
    private dynamicProbeCompletions: Dict<string, MonacoType.languages.CompletionItem[]> = {}; // kprobes based on current running kernel
    private staticProbeCompletions: MonacoType.languages.CompletionItem[] = []; // probes which are not in `bpftrace -l` (BEGIN, END, interval, ...)
    private variableCompletions: MonacoType.languages.CompletionItem[] = [];
    private functionCompletions: MonacoType.languages.CompletionItem[] = [];

    constructor(
        private monaco: Monaco,
        private datasource: PCPBPFtraceDataSource,
        private getQuery: () => BPFtraceQuery
    ) {
        this.pmApiService = datasource.pmApiService;

        this.staticProbeCompletions = BPFtraceBuiltins.probes.map(f => ({
            kind: this.monaco.languages.CompletionItemKind.Event,
            label: f.name,
            insertText: f.name,
            range: undefined as any,
        }));
        this.variableCompletions = BPFtraceBuiltins.variables.map(f => ({
            kind: this.monaco.languages.CompletionItemKind.Variable,
            label: f.name,
            insertText: f.insertText ?? f.name,
            documentation: {
                value: `${f.name}\n\n${f.doc}`,
                isTrusted: true,
            },
            range: undefined as any,
        }));
        this.functionCompletions = BPFtraceBuiltins.functions.map(f => {
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

    async findProbeCompletions(token: TokenValue): Promise<MonacoType.languages.CompletionList> {
        const { url, hostspec } = this.datasource.getUrlAndHostspec(this.getQuery());
        const endpointId = `${url}::${hostspec}`;

        if (!(endpointId in this.dynamicProbeCompletions)) {
            const fetchResponse = await this.pmApiService.fetch(url, {
                hostspec,
                names: ['bpftrace.info.tracepoints'],
            });

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
                kind: this.monaco.languages.CompletionItemKind.Event,
                label: probe,
                insertText: probe,
                range: undefined as any,
            }));
        }

        // Monaco performance degrades significantly with a big number of autocompletion items (~172343 probes)
        const completions = [...this.staticProbeCompletions, ...this.dynamicProbeCompletions[endpointId]!].filter(
            completion => (completion.label as string).includes(token.value)
        );

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
