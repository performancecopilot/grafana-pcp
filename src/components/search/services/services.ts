import { getBackendSrv, getDataSourceSrv } from '@grafana/runtime';
import PmSearchApiService from './PmSearchApiService';
import EntityService from './EntityDetailService';
import { PmSeriesApiService } from 'common/services/pmseries/PmSeriesApiService';
import Config from '../config/config';
import { isBlank } from 'common/utils';

export interface Services {
    searchService: PmSearchApiService;
    seriesService: PmSeriesApiService;
    entityService: EntityService;
}

const getDatasourceSettings = async (name: string) => {
    let datasource: any;
    try {
        datasource = await getDataSourceSrv().get(name);
    } catch (error) {
        throw new Error(
            `${error.message}. Please create a datasource named '${name}' before using the search feature.`
        );
    }

    const uid = datasource?.instanceSettings?.uid;
    const settings = getDataSourceSrv().getDataSourceSettingsByUid(uid);
    if (!settings || isBlank(settings.url)) {
        throw new Error(
            `Cannot get datasource settings of '${name}'. Please create this datasource before using the search feature.`
        );
    }
    return settings;
};

export const initServices = async (): Promise<Services> => {
    // PCP Redis is a backend datasource, and the instance settings can't be accessed client-side
    const settings = await getDatasourceSettings('PCP Vector');
    const backendSrv = getBackendSrv();

    const searchService = new PmSearchApiService(settings, backendSrv);
    const seriesService = new PmSeriesApiService(backendSrv, {
        dsInstanceSettings: settings,
        isDatasourceRequest: false,
        baseUrl: settings.url!,
        timeoutMs: Config.REQUEST_TIMEOUT,
    });
    const entityService = new EntityService(searchService, seriesService);
    return { searchService, seriesService, entityService };
};
