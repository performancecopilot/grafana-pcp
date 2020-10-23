import { getBackendSrv } from '@grafana/runtime';
import PmSearchApiService from './PmSearchApiService';
import EntityService from './EntityDetailService';
import { PmSeriesApiService } from 'common/services/pmseries/PmSeriesApiService';
import Config from '../config/config';
import redisPluginConfig from '../../../datasources/redis/plugin.json';

export interface Services {
    searchService: PmSearchApiService;
    seriesService: PmSeriesApiService;
    entityService: EntityService;
}

async function getDatasourceSettings() {
    const datasources = await getBackendSrv().get('/api/datasources');
    const redisDatasource = datasources.find((ds: any) => ds.type === redisPluginConfig.id);
    if (!redisDatasource) {
        throw new Error(
            `Could not find any PCP Redis datasource. Please create a PCP Redis datasource before using the search feature.`
        );
    }
    return redisDatasource;
}

export const initServices = async (): Promise<Services> => {
    const settings = await getDatasourceSettings();
    const searchService = new PmSearchApiService(settings, getBackendSrv());
    const seriesService = new PmSeriesApiService(getBackendSrv(), {
        dsInstanceSettings: settings,
        isDatasourceRequest: false,
        baseUrl: settings.url!,
        timeoutMs: Config.REQUEST_TIMEOUT,
    });
    const entityService = new EntityService(searchService, seriesService);
    return { searchService, seriesService, entityService };
};
