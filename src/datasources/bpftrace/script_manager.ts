import { PmApi, PermissionError } from '../lib/pmapi';
import { getLogger } from '../lib/utils';
import { Script, MetricType } from './script';
import { TargetFormat } from 'datasources/lib/models/pmapi';
const log = getLogger('script_manager');

export class ScriptManager {
    constructor(private pmApi: PmApi) {}

    getMetric(script: Script, varName: string) {
        const scriptIdOrName = script.metadata.name || script.script_id;
        // bpftrace variables start with @; remove first char, and if the resulting string is empty, substitute it with "root"
        varName = varName.substring(1) || 'root';
        return `bpftrace.scripts.${scriptIdOrName}.data.${varName}`;
    }

    getVariablesForTargetFormat(script: Script, format: TargetFormat) {
        if (format === TargetFormat.TimeSeries) {
            return Object.keys(script.variables);
        } else if (format === TargetFormat.Heatmap) {
            const foundVar = Object.entries(script.variables).find(
                ([, varDef]) => varDef.metrictype === MetricType.Histogram
            );
            if (!foundVar) {
                throw new Error('Cannot find any histogram in this BPFtrace script.');
            }
            return [foundVar[0]];
        } else if (format === TargetFormat.CsvTable) {
            const foundVar = Object.entries(script.variables).find(
                ([, varDef]) => varDef.metrictype === MetricType.Output
            );
            if (!foundVar) {
                throw new Error('Please printf() a table in CSV format in the BPFtrace script.');
            }
            return [foundVar[0]];
        } else if (format === TargetFormat.FlameGraph) {
            const foundVar = Object.entries(script.variables).find(
                ([, varDef]) => varDef.metrictype === MetricType.Stacks
            );
            if (!foundVar) {
                throw new Error(
                    'Cannot find any sampled stacks in this BPFtrace script. Try: profile:hz:99 { @[kstack] = count(); }'
                );
            }
            return [foundVar[0]];
        }
        throw new Error('Unsupported panel format.');
    }

    getMetrics(script: Script, format: TargetFormat) {
        return this.getVariablesForTargetFormat(script, format).map(varName => this.getMetric(script, varName));
    }

    async storeControlMetric(url: string, hostspec: string, metric: string, value: string): Promise<any> {
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

    async register(url: string, hostspec: string, code: string): Promise<Script> {
        log.info('registering script:\n', code);
        const response = await this.storeControlMetric(url, hostspec, 'bpftrace.control.register', code);
        log.debug('registering script response', response);
        return response;
    }

    async deregister(url: string, hostspec: string, script: Script) {
        log.info('deregistering script:\n', script);

        const response = await this.storeControlMetric(url, hostspec, 'bpftrace.control.deregister', script.script_id);
        log.debug('deregistering script response', response);
    }
}
