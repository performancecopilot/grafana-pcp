import { getBackendSrv } from '@grafana/runtime';
import { PmSearchApiService } from '../../../common/services/pmsearch/PmSearchApiService';
import { PmSeriesApiService } from '../../../common/services/pmseries/PmSeriesApiService';
import { GenericError } from '../../../common/types/errors';
import redisPluginConfig from '../../../datasources/redis/plugin.json';
import Config from '../config/config';
import EntityService from './EntityDetailService';

export interface Services {
    searchService: PmSearchApiService;
    seriesService: PmSeriesApiService;
    entityService: EntityService;
}

async function getDatasourceSettings() {
    const datasources = await getBackendSrv().get('/api/datasources');
    const redisDatasource = datasources.find((ds: any) => ds.type === redisPluginConfig.id);
    if (!redisDatasource) {
        throw new GenericError(
            `Could not find any PCP Redis datasource. Please create a PCP Redis datasource before using the search feature.`
        );
    }
    return redisDatasource;
}

export const initServices = async (): Promise<Services> => {
    const settings = await getDatasourceSettings();
    const searchService = new PmSearchApiService(getBackendSrv(), {
        dsInstanceSettings: settings,
        baseUrl: settings.url!,
        timeoutMs: Config.REQUEST_TIMEOUT,
    });
    const seriesService = new PmSeriesApiService(getBackendSrv(), {
        dsInstanceSettings: settings,
        baseUrl: settings.url!,
        timeoutMs: Config.REQUEST_TIMEOUT,
    });
    const entityService = new EntityService(searchService, seriesService);
    return { searchService, seriesService, entityService };
};
