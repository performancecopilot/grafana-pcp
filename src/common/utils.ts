import { DataSourceInstanceSettings } from '@grafana/data';
import { BackendSrvRequest } from '@grafana/runtime';
import { TimeoutError } from './types/errors/timeout';
import rootLogger from 'loglevel';
import logPrefixer from 'loglevel-plugin-prefix';
import { isString } from 'lodash';
import { RequiredField } from './types/utils';

export function getLogger(name: string) {
    rootLogger.setDefaultLevel('ERROR');
    logPrefixer.reg(rootLogger);
    logPrefixer.apply(rootLogger, { template: '[%t] %l %n:' });
    return rootLogger.getLogger(name);
}

export type DefaultRequestOptions = Omit<BackendSrvRequest, 'url'>;
export function getRequestOptions(instanceSettings: DataSourceInstanceSettings): DefaultRequestOptions {
    const defaultRequestOptions: RequiredField<DefaultRequestOptions, 'headers'> = {
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

export function timeout<T>(promise: Promise<T>, ms: number): Promise<T> {
    return new Promise<T>(async (resolve, reject) => {
        setTimeout(() => {
            reject(new TimeoutError());
        }, ms);
        try {
            const result = await promise;
            resolve(result);
        } catch (e) {
            reject(e);
        }
    });
}

export function isBlank(str?: string) {
    return !(str && isString(str) && str.trim().length > 0);
}

export function interval_to_ms(str: string) {
    if (str.length === 0) {
        return 0;
    }

    const suffix = str.substring(str.length - 1);
    if (suffix === 's') {
        return parseInt(str.substring(0, str.length - 1), 10) * 1000;
    } else if (suffix === 'm') {
        return parseInt(str.substring(0, str.length - 1), 10) * 1000 * 60;
    } else if (suffix === 'h') {
        return parseInt(str.substring(0, str.length - 1), 10) * 1000 * 60 * 60;
    } else {
        return parseInt(str, 10) * 1000;
    }
}
