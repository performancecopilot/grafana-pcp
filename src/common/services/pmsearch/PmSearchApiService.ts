import { defaults, has } from 'lodash';
import { firstValueFrom } from 'rxjs';
import { BackendSrv, BackendSrvRequest, FetchResponse } from '@grafana/runtime';
import { SearchEntityUtil } from '../../../components/search/utils/SearchEntityUtil';
import { NetworkError } from '../../types/errors';
import { DefaultRequestOptions, getRequestOptions, timeout, TimeoutError } from '../../utils';
import {
    AutocompleteQueryParams,
    AutocompleteResponse,
    IndomQueryParams,
    PmSearchApiConfig,
    SearchNotAvailableError,
    TextQueryParams,
    TextResponse,
} from './types';

export class PmSearchApiService {
    defaultRequestOptions: DefaultRequestOptions;

    constructor(private backendSrv: BackendSrv, private apiConfig: PmSearchApiConfig) {
        this.defaultRequestOptions = getRequestOptions(apiConfig.dsInstanceSettings);
    }

    async request<T>(options: BackendSrvRequest): Promise<FetchResponse<T>> {
        options = defaults({}, options, this.defaultRequestOptions);
        try {
            return await timeout(firstValueFrom(this.backendSrv.fetch<T>(options)), this.apiConfig.timeoutMs);
        } catch (error) {
            if (error instanceof TimeoutError) {
                throw new TimeoutError(`Timeout while connecting to '${options.url}'`, error);
            }
            throw new NetworkError(error);
        }
    }

    static isNoRecordResponse(response: FetchResponse<any>) {
        return has(response, 'data.success') && response.data.success && Object.keys(response.data).length === 1;
    }

    /**
     * Wrap each whitespace-separated term of a query in double quotes so it is
     * treated as a literal FTS5 phrase.
     *
     * WORKAROUND: pmproxy's /search endpoints pass the query string verbatim into
     * a SQLite FTS5 `MATCH` expression (see `search_build_match` in PCP's
     * libpcp_web/src/search.c) without quoting or escaping it. Characters that are
     * significant to FTS5 query syntax -- notably `.` and `-`, which appear in
     * virtually every PCP metric name (e.g. `kernel.all.load`, `disk.dev.read`) --
     * therefore trigger an FTS5 syntax error that pmproxy reports as
     * HTTP 400 `{"success":false}`, indistinguishable from search being
     * unavailable. Quoting each term client-side avoids the syntax error while
     * preserving multi-term (AND) matching.
     *
     * `/search/text` additionally supports `"term"*` prefix queries, so a trailing
     * `*` is kept outside the quotes when `allowPrefix` is true. `/search/suggest`
     * performs prefix matching itself and rejects a trailing `*` on a quoted term,
     * so callers of that endpoint must leave `allowPrefix` false.
     *
     * This is a client-side workaround: if pmproxy is changed to quote/escape the
     * query server-side (or exposes an escaping mode), it can be removed. Note the
     * tradeoff that quoting disables raw FTS5 operators (boolean OR/AND/NOT) in the
     * user's query -- an accepted compromise for making metric-name searches work.
     */
    static escapeFtsQuery(query: string, allowPrefix = false): string {
        return query
            .trim()
            .split(/\s+/)
            .map(token => {
                const hasPrefix = allowPrefix && token.endsWith('*');
                // strip the prefix `*` (if kept) plus any other `*`, which is not
                // valid inside an FTS5 phrase
                const core = (hasPrefix ? token.slice(0, -1) : token).replace(/\*/g, '');
                if (core.length === 0) {
                    return '';
                }
                // FTS5 escapes an embedded double quote by doubling it
                const escaped = core.replace(/"/g, '""');
                return `"${escaped}"${hasPrefix ? '*' : ''}`;
            })
            .filter(token => token.length > 0)
            .join(' ');
    }

    async autocomplete(params: AutocompleteQueryParams): Promise<AutocompleteResponse> {
        const request = {
            url: `${this.apiConfig.baseUrl}/search/suggest`,
            params: {
                ...params,
                query: PmSearchApiService.escapeFtsQuery(params.query),
            },
        };

        try {
            const response = await this.request<AutocompleteResponse>(request);
            return response.data;
        } catch (error: any) {
            if (has(error, 'data.success') && !error.data.success && Object.keys(error.data).length === 1) {
                throw new SearchNotAvailableError();
            } else {
                throw error;
            }
        }
    }

    async indom(params: IndomQueryParams): Promise<TextResponse | null> {
        const request = {
            url: `${this.apiConfig.baseUrl}/search/indom`,
            params,
        };

        try {
            const response = await this.request<TextResponse>(request);
            if (PmSearchApiService.isNoRecordResponse(response)) {
                return {
                    elapsed: 0,
                    total: 0,
                    results: [],
                    limit: params.limit ?? 0,
                    offset: params.offset ?? 0,
                };
            } else {
                return {
                    ...response.data,
                    limit: params.limit ?? 0,
                    offset: params.offset ?? 0,
                };
            }
        } catch (error: any) {
            if (has(error, 'data.success') && !error.data.success && Object.keys(error.data).length === 1) {
                throw new SearchNotAvailableError();
            } else {
                throw error;
            }
        }
    }

    async text(params: TextQueryParams): Promise<TextResponse | null> {
        const request = {
            url: `${this.apiConfig.baseUrl}/search/text`,
            params: {
                ...params,
                query: PmSearchApiService.escapeFtsQuery(params.query, true),
                ...(params.highlight ? { highlight: params.highlight.join(',') } : {}),
                ...(params.field ? { field: params.field.join(',') } : {}),
                ...(params.return ? { return: params.return.join(',') } : {}),
                ...(params.type ? { type: SearchEntityUtil.toEntityTypes(params.type).join(',') } : {}),
            },
        };

        try {
            const response = await this.request<TextResponse>(request);
            if (PmSearchApiService.isNoRecordResponse(response)) {
                return {
                    elapsed: 0,
                    total: 0,
                    results: [],
                    limit: params.limit ?? 0,
                    offset: params.offset ?? 0,
                };
            } else {
                return {
                    ...response.data,
                    limit: params.limit ?? 0,
                    offset: params.offset ?? 0,
                };
            }
        } catch (error: any) {
            if (has(error, 'data.success') && !error.data.success && Object.keys(error.data).length === 1) {
                throw new SearchNotAvailableError();
            } else {
                throw error;
            }
        }
    }
}
