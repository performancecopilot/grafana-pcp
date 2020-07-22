export const defaults = {
    hostspec: '127.0.0.1',
    retentionTime: '10m',
};

/**
 * don't remove targets immediately if not requested in refreshInterval
 * also instruct pmproxy to not clear the context immediately if not used in refreshInterval
 */
export const gracePeriodMs = 10000;
