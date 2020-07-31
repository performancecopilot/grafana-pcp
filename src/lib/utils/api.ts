import { DataSourceInstanceSettings } from '@grafana/data';
import { DefaultRequestOptions } from '../../datasources/lib/types';

export function getRequestOptions(instanceSettings: DataSourceInstanceSettings): DefaultRequestOptions {
    const defaultRequestOptions: DefaultRequestOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
        showSuccessAlert: false,
    };
    if (instanceSettings.basicAuth || instanceSettings.withCredentials) {
        defaultRequestOptions.withCredentials = true;
    }
    if (instanceSettings.basicAuth) {
        defaultRequestOptions.headers['Authorization'] = instanceSettings.basicAuth;
    }
    return defaultRequestOptions;
}
