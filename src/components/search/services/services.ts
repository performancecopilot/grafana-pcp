import { getBackendSrv } from '@grafana/runtime';
import { PmSearchApiService } from '../../../common/services/pmsearch/PmSearchApiService';
import { PmSeriesApiService } from '../../../common/services/pmseries/PmSeriesApiService';
import { GenericError } from '../../../common/types/errors';
import valkeyPluginConfig from '../../../datasources/valkey/plugin.json';
import Config from '../config/config';
import EntityService from './EntityDetailService';

export interface Services {
    searchService: PmSearchApiService;
    seriesService: PmSeriesApiService;
    entityService: EntityService;
}

async function getDatasourceSettings() {
    const datasources = await getBackendSrv().get('/api/datasources');
    const valkeyDatasource = datasources.find((ds: any) => ds.type === valkeyPluginConfig.id);
    if (!valkeyDatasource) {
        throw new GenericError(
            `Could not find any PCP Valkey data source. Please create a PCP Valkey data source before using the search feature.`
        );
    }
    return valkeyDatasource;
}

export const initServices = async (): Promise<Services> => {
    const settings = await getDatasourceSettings();
    // Route search/series requests through Grafana's datasource proxy rather than
    // calling the datasource URL directly from the browser. This matches how the
    // other PCP datasources reach pmproxy (server-side, so pmproxy need not be
    // reachable from the browser and no CORS is involved) and keeps search
    // working wherever the PCP Valkey datasource itself works.
    const baseUrl = `/api/datasources/proxy/uid/${settings.uid}`;
    const searchService = new PmSearchApiService(getBackendSrv(), {
        dsInstanceSettings: settings,
        baseUrl,
        timeoutMs: Config.REQUEST_TIMEOUT,
    });
    const seriesService = new PmSeriesApiService(getBackendSrv(), {
        dsInstanceSettings: settings,
        baseUrl,
        timeoutMs: Config.REQUEST_TIMEOUT,
    });
    const entityService = new EntityService(searchService, seriesService);
    return { searchService, seriesService, entityService };
};
