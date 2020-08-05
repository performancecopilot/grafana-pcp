import { FieldType } from '@grafana/data';
import { Semantics, MetricMetadata } from '../../lib/models/pcp/pcp';

const pcpNumberTypes = ['32', 'u32', '64', 'u64', 'float', 'double'];
export function pcpTypeToGrafanaType(metadata: MetricMetadata): FieldType {
    if (pcpNumberTypes.includes(metadata.type)) {
        return FieldType.number;
    } else if (metadata.type === 'string') {
        return FieldType.string;
    } else {
        return FieldType.other;
    }
}

export function pcpUnitToGrafanaUnit(metadata: MetricMetadata): string | undefined {
    // pcp/src/libpcp/src/units.c
    // grafana-data/src/valueFormats/categories.ts
    switch (metadata.units) {
        case 'nanosec':
            return 'ns';
        case 'microsec':
            return 'µs';
        case 'millisec':
            return 'ms';
        case 'sec':
            return 's';
        case 'min':
            return 'm';
        case 'hour':
            return 'h';
    }

    if (metadata.sem === Semantics.Counter) {
        switch (metadata.units) {
            case 'byte':
                return 'Bps';
            case 'Kbyte':
                return 'KBs';
            case 'Mbyte':
                return 'MBs';
            case 'Gbyte':
                return 'GBs';
            case 'Tbyte':
                return 'TBs';
            case 'Pbyte':
                return 'PBs';
        }
    } else {
        switch (metadata.units) {
            case 'byte':
                return 'bytes';
            case 'Kbyte':
                return 'kbytes';
            case 'Mbyte':
                return 'mbytes';
            case 'Gbyte':
                return 'gbytes';
            case 'Tbyte':
                return 'tbytes';
            case 'Pbyte':
                return 'pbytes';
        }
    }
    return undefined;
}
