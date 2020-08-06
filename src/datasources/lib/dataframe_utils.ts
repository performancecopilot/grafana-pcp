import { Field, Labels as GrafanaLabels } from '@grafana/data';
import { InstanceName, InstanceId, Metric, Labels } from '../../lib/models/pcp/pcp';
import { pcpTypeToGrafanaType, pcpUnitToGrafanaUnit } from './pcp';
import { PmapiContext } from './pmapi';

export function getLabels(metric: Metric, instanceId: InstanceId | null, context?: PmapiContext): Labels {
    let labels = {
        ...context?.labels,
        ...metric.metadata.labels,
        ...metric.instanceDomain.labels,
    };
    if (instanceId != null && instanceId in metric.instanceDomain.instances) {
        Object.assign(labels, metric.instanceDomain.instances[instanceId]!.labels);
    }
    return labels;
}

export function getFieldMetadata(
    metric: Metric,
    instanceId: InstanceId | null,
    instanceName?: InstanceName,
    context?: PmapiContext
): Partial<Field> {
    return {
        type: pcpTypeToGrafanaType(metric.metadata),
        config: {
            unit: pcpUnitToGrafanaUnit(metric.metadata),
            custom: {
                instanceId,
                instanceName,
            },
        },
        labels: getLabels(metric, instanceId, context) as GrafanaLabels,
    };
}
