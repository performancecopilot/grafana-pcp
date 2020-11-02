import { BackendSrv, BackendSrvRequest, FetchResponse } from '@grafana/runtime';
import { NetworkError } from 'common/types/errors/network';
import { DefaultRequestOptions, getRequestOptions, timeout } from 'common/utils';
import { SearchEntityUtil } from 'components/search/utils/SearchEntityUtil';
import { defaults, has } from 'lodash';
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
        options = defaults(options, this.defaultRequestOptions);
        try {
            return await timeout(this.backendSrv.fetch<T>(options).toPromise(), this.apiConfig.timeoutMs);
        } catch (error) {
            throw new NetworkError(error, options);
        }
    }

    static isNoRecordResponse(response: FetchResponse<any>) {
        return has(response, 'data.success') && response.data.success && Object.keys(response.data).length === 1;
    }

    async autocomplete(params: AutocompleteQueryParams): Promise<AutocompleteResponse> {
        const request = {
            url: `${this.apiConfig.baseUrl}/search/suggest`,
            params,
        };

        try {
            const response = await this.request<AutocompleteResponse>(request);
            return response.data;
        } catch (error) {
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
        } catch (error) {
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
        } catch (error) {
            if (has(error, 'data.success') && !error.data.success && Object.keys(error.data).length === 1) {
                throw new SearchNotAvailableError();
            } else {
                throw error;
            }
        }
    }
}
