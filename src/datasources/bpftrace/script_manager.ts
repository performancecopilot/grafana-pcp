import { PmApi, PermissionError } from '../lib/pmapi';
import { getLogger } from '../lib/utils';
const log = getLogger('script_manager');

export class ScriptManager {
    constructor(private pmApi: PmApi) {}
    async storeControlMetric(url: string, hostspec: string, metric: string, value: string): Promise<string> {
        // create temporary context, required so that the PMDA can identify
        // the client who sent the pmStore message
        const context = await this.pmApi.createContext(url, hostspec);
        try {
            await this.pmApi.storeMetricValue(url, context.context, metric, value);
        } catch (error) {
            if (error instanceof PermissionError) {
                throw new Error(
                    "You don't have permission to register bpftrace scripts. " +
                        'Please check the bpftrace PMDA configuration (bpftrace.conf) and the datasource authentication settings.'
                );
            } else {
                throw error;
            }
        }

        const response = await this.pmApi.getMetricValues(url, context.context, [metric]);
        return JSON.parse(response.values[0].instances[0].value as string);
    }

    async register(url: string, hostspec: string, code: string) {
        log.info('registering script', code);
        const response = await this.storeControlMetric(url, hostspec, 'bpftrace.control.register', code);
        log.info('registering script response', response);
        return response;
    }
}
