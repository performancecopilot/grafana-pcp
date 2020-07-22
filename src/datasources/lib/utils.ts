import { isString } from 'lodash';

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

export function getDashboardRefreshInterval() {
    const interval = new URLSearchParams(window.location.search).get('refresh');
    return interval ? interval_to_ms(interval) : undefined;
}
