import { BackendSrv } from '@grafana/runtime';
import { DataSourceInstanceSettings } from '@grafana/data';
import {
    SearchMaybeResponse,
    AutocompleteQueryParams,
    AutocompleteResponse,
    TextQueryParams,
    TextResponse,
    TextMaybeResponse,
    SearchNoRecordResponse,
    IndomQueryParams,
} from '../models/endpoints/search';
import { timeout } from '../utils/utils';
import Config from '../config/config';
import { SearchEntityUtil } from '../utils/SearchEntityUtil';

class PmSearchApiService {
    baseUrl: string;
    backendSrv: BackendSrv;
    headers = {
        'Content-Type': 'application/json',
    };

    constructor(instanceSettings: DataSourceInstanceSettings, backendSrv: BackendSrv) {
        if (!instanceSettings.url) {
            throw new Error();
        }
        this.baseUrl = instanceSettings.url;
        this.headers = {
            ...this.headers,
            ...(instanceSettings.basicAuth ? { Authorization: instanceSettings.basicAuth } : {}),
        };
        this.backendSrv = backendSrv;
    }

    static isNoRecordResponse(response: SearchMaybeResponse) {
        if (
            typeof response === 'object' &&
            (response as { [key: string]: any }).success !== undefined &&
            Object.keys(response).length === 1
        ) {
            return true;
        }
        return false;
    }

    async autocomplete(params: AutocompleteQueryParams): Promise<AutocompleteResponse> {
        const { headers, baseUrl, backendSrv } = this;
        const getParams = new URLSearchParams();
        getParams.append('query', params.query);
        if (params.limit !== undefined) {
            getParams.append('limit', params.limit.toString());
        }
        const options = {
            url: `${baseUrl}/search/suggest?${getParams.toString()}`,
            methods: 'GET',
            showSuccessAlert: false,
            headers,
        };
        try {
            const response: AutocompleteResponse = await timeout(backendSrv.request(options), Config.REQUEST_TIMEOUT);
            return response;
        } catch {
            return [];
        }
    }

    async indom(params: IndomQueryParams): Promise<TextResponse | null> {
        const { headers, baseUrl, backendSrv } = this;
        const getParams = new URLSearchParams();
        getParams.append('query', params.query);
        const options = {
            url: `${baseUrl}/search/indom?${getParams.toString()}`,
            methods: 'GET',
            showSuccessAlert: false,
            headers,
        };
        try {
            const response: TextMaybeResponse = await timeout(backendSrv.request(options), Config.REQUEST_TIMEOUT);
            if (PmSearchApiService.isNoRecordResponse(response)) {
                // monkey patch
                return {
                    elapsed: 0,
                    total: 0,
                    results: [],
                    limit: params.limit ?? 0,
                    offset: params.offset ?? 0,
                };
            }
            return {
                ...(response as Exclude<TextResponse, SearchNoRecordResponse>),
                limit: params.limit ?? 0,
                offset: params.offset ?? 0,
            };
        } catch {
            return null;
        }
    }

    async text(params: TextQueryParams): Promise<TextResponse | null> {
        const { headers, baseUrl, backendSrv } = this;
        const getParams = new URLSearchParams();
        getParams.append('query', params.query);
        if (params.highlight !== undefined) {
            getParams.append('highlight', params.highlight.join(','));
        }
        if (params.offset !== undefined) {
            getParams.append('offset', params.offset.toString());
        }
        if (params.limit !== undefined) {
            getParams.append('limit', params.limit.toString());
        }
        if (params.field !== undefined) {
            getParams.append('fields', params.field.join(','));
        }
        if (params.return !== undefined) {
            getParams.append('return', params.return.join(','));
        }
        if (params.type !== undefined) {
            let entityTypes = SearchEntityUtil.toEntityTypes(params.type);
            getParams.append('type', entityTypes.join(','));
        }
        const options = {
            url: `${baseUrl}/search/text?${getParams.toString()}`,
            methods: 'GET',
            showSuccessAlert: false,
            headers,
        };
        try {
            // TODO: replace monkey patched limit/offset
            const response: TextMaybeResponse = await timeout(backendSrv.request(options), Config.REQUEST_TIMEOUT);
            if (PmSearchApiService.isNoRecordResponse(response)) {
                // monkey patch
                return {
                    elapsed: 0,
                    total: 0,
                    results: [],
                    limit: params.limit ?? 0,
                    offset: params.offset ?? 0,
                };
            }
            return {
                ...(response as Exclude<TextResponse, SearchNoRecordResponse>),
                limit: params.limit ?? 0,
                offset: params.offset ?? 0,
            };
        } catch {
            // monkey patch since API just returns { success: "true" }
            return null;
        }
    }
}

export default PmSearchApiService;
