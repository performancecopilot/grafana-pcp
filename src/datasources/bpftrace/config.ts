export const Config = {
    apiTimeoutMs: 2000,

    /**
     * don't remove targets immediately if not requested in refreshInterval
     * also instruct pmproxy to not clear the context immediately if not used in refreshInterval
     */
    gracePeriodMs: 10000,

    defaults: {
        hostspec: '127.0.0.1',
        retentionTime: '30m',
    },
};
