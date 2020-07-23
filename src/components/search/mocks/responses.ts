import { TextItemResponse, EntityType } from '../models/endpoints/search';
import { PmApiMetricEndpointResponse, PmApiIndomEndpointResponse } from '../models/endpoints/pmapi';

export const searchEntities: TextItemResponse[] = [
    {
        docid: '489dbe44c0fd4746fed850433b9eab1af5bee1b5',
        count: 1,
        score: 0,
        name: 'kernel.uname.distro',
        type: EntityType.Metric,
        indom: 'PM_INDOM_NULL',
        oneline: 'Linux <strong>distribution</strong> name',
        helptext: `The Linux distribution name, as <strong>determined</strong> by a number of heuristics.
For example:
+ on Fedora, the contents of /etc/fedora-release
+ on RedHat, the contents of /etc/redhat-release`,
    },
    {
        docid: '0dce1bdbfc415b485ef04c1dedf0c09a3663e25d',
        count: 1,
        score: 0,
        name: 'kernel.uname.sysname',
        type: EntityType.Metric,
        indom: 'PM_INDOM_NULL',
        oneline: 'name of the <strong>implementation<strong> of the operating system',
        helptext: `Name of the implementation of the <strong>running</strong> operating system as reported by the sysname[] value returned from uname(2) or uname -s. Usually "Linux".`,
    },
    {
        docid: '73e91dbd17f34634228b87c63bab8a4b90437512',
        count: 1,
        score: 0,
        name: 'kernel.all.uptime',
        type: EntityType.Metric,
        indom: 'PM_INDOM_NULL',
        oneline: 'time the <strong>current</strong> kernel has been running',
        helptext: 'time the current <strong>kernel</strong> has been running',
    },
    {
        docid: '77c80fa867cc066fca97a6a1e33d9579a3d48f65',
        count: 1,
        score: 0,
        name: 'network.interface.speed',
        type: EntityType.Metric,
        indom: '60.3',
        oneline: 'interface speed in <strong>megabytes</strong> per second',
        helptext: `The linespeed on the network interface, as <strong>reported</strong> by the kernel, scaled from Megabits/second to Megabytes/second. See also network.interface.baudrate for the bytes/second value.`,
    },
    {
        docid: '946086f939d2db36941aa4cf3d7788e1a7b2790a',
        count: 1,
        score: 0,
        name: 'mem.freemem',
        type: EntityType.Metric,
        indom: 'PM_INDOM_NULL',
        oneline: 'free system memory metric from <strong>/proc/meminfo</strong>',
        helptext: 'free system memory metric from <strong>/proc/meminfo</strong>',
    },
    {
        docid: 'd95f683f17c9f1ee05edf25e59fc8deba376ba27',
        count: 1,
        score: 0,
        name: '60.3',
        type: EntityType.InstanceDomain,
        indom: '60.3',
        oneline: 'set of <strong>network</strong> interfaces',
        helptext: 'set of <strong>network</strong> interfaces',
    },
];

export const detailEntities: PmApiMetricEndpointResponse[] = [
    {
        context: 1173037301,
        metrics: [
            {
                name: 'kernel.uname.distro',
                series: '65da24b5d07cf1b7e1730e4f5f7bedef47f42816',
                pmid: '60.12.7',
                type: 'string',
                sem: 'discrete',
                units: 'none',
                labels: {
                    agent: 'linux',
                    domainname: 'localdomain',
                    hostname: 'localhost.localdomain',
                    machineid: 'e89b1710db70431e96453dae52cd95c2',
                },
                'text-oneline': 'Linux distribution name',
                'text-help':
                    'The Linux distribution name, as determined by a number of heuristics.\u000AFor example:\u000A+ on Fedora, the contents of /etc/fedora-release\u000A+ on RedHat, the contents of /etc/redhat-release',
            },
        ],
    },
    {
        context: 1347218198,
        metrics: [
            {
                name: 'kernel.uname.sysname',
                series: 'b4e77d887954125de78403d9ff74a03518629525',
                pmid: '60.12.2',
                type: 'string',
                sem: 'discrete',
                units: 'none',
                labels: {
                    agent: 'linux',
                    domainname: 'localdomain',
                    hostname: 'localhost.localdomain',
                    machineid: 'e89b1710db70431e96453dae52cd95c2',
                },
                'text-oneline': 'name of the implementation of the operating system',
                'text-help':
                    'Name of the implementation of the running operating system as reported\u000Aby the sysname[] value returned from uname(2) or uname -s.  Usually\u000A\u0022Linux\u0022.\u000A\u000ASee also pmda.uname.',
            },
        ],
    },
    {
        context: 87754531,
        metrics: [
            {
                name: 'kernel.all.uptime',
                series: '6bd814c70da0e038672de243af39e4f05688d51b',
                pmid: '60.26.0',
                type: 'double',
                sem: 'instant',
                units: 'sec',
                labels: {
                    agent: 'linux',
                    domainname: 'localdomain',
                    hostname: 'localhost.localdomain',
                    machineid: 'e89b1710db70431e96453dae52cd95c2',
                },
                'text-oneline': 'time the current kernel has been running',
                'text-help': 'time the current kernel has been running',
            },
        ],
    },
    {
        context: 1990618704,
        metrics: [
            {
                name: 'network.interface.speed',
                series: '616706f07f79c9529c617cedf8d44546ed7e552d',
                pmid: '60.3.22',
                indom: '60.3',
                type: 'float',
                sem: 'discrete',
                units: 'Mbyte / sec',
                labels: {
                    agent: 'linux',
                    domainname: 'localdomain',
                    hostname: 'localhost.localdomain',
                    machineid: 'e89b1710db70431e96453dae52cd95c2',
                },
                'text-oneline': 'interface speed in megabytes per second',
                'text-help':
                    'The linespeed on the network interface, as reported by the kernel,\u000Ascaled from Megabits/second to Megabytes/second.\u000ASee also network.interface.baudrate for the bytes/second value.',
            },
        ],
    },
    {
        context: 580184507,
        metrics: [
            {
                name: 'mem.freemem',
                series: '75b7f2eceee41be0136d560d020789d697c1ea7d',
                pmid: '60.1.10',
                type: 'u64',
                sem: 'instant',
                units: 'Kbyte',
                labels: {
                    agent: 'linux',
                    domainname: 'localdomain',
                    hostname: 'localhost.localdomain',
                    machineid: 'e89b1710db70431e96453dae52cd95c2',
                },
                'text-oneline': 'free system memory metric from /proc/meminfo',
                'text-help': 'free system memory metric from /proc/meminfo',
            },
        ],
    },
];

export const indomEntities: PmApiIndomEndpointResponse[] = [
    {
        context: 927862141,
        indom: '60.3',
        labels: {
            device_type: 'interface',
            domainname: 'localdomain',
            hostname: 'localhost.localdomain',
            indom_name: 'per interface',
            machineid: 'e89b1710db70431e96453dae52cd95c2',
        },
        'text-oneline': 'set of network interfaces',
        'text-help': 'set of network interfaces',
        instances: [
            {
                instance: 5,
                name: 'docker0',
                labels: {
                    domainname: 'localdomain',
                    hostname: 'localhost.localdomain',
                    machineid: 'e89b1710db70431e96453dae52cd95c2',
                },
            },
            {
                instance: 2,
                name: 'wlp0s20f3',
                labels: {
                    domainname: 'localdomain',
                    hostname: 'localhost.localdomain',
                    machineid: 'e89b1710db70431e96453dae52cd95c2',
                },
            },
            {
                instance: 35,
                name: 'veth80732b1',
                labels: {
                    domainname: 'localdomain',
                    hostname: 'localhost.localdomain',
                    machineid: 'e89b1710db70431e96453dae52cd95c2',
                },
            },
            {
                instance: 0,
                name: 'lo',
                labels: {
                    domainname: 'localdomain',
                    hostname: 'localhost.localdomain',
                    machineid: 'e89b1710db70431e96453dae52cd95c2',
                },
            },
            {
                instance: 4,
                name: 'virbr0-nic',
                labels: {
                    domainname: 'localdomain',
                    hostname: 'localhost.localdomain',
                    machineid: 'e89b1710db70431e96453dae52cd95c2',
                },
            },
            {
                instance: 3,
                name: 'virbr0',
                labels: {
                    domainname: 'localdomain',
                    hostname: 'localhost.localdomain',
                    machineid: 'e89b1710db70431e96453dae52cd95c2',
                },
            },
            {
                instance: 1,
                name: 'ens20u2',
                labels: {
                    domainname: 'localdomain',
                    hostname: 'localhost.localdomain',
                    machineid: 'e89b1710db70431e96453dae52cd95c2',
                },
            },
        ],
    },
];
