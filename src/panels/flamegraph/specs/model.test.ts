import { LoadingState, PanelData, MutableDataFrame, FieldType } from '@grafana/data';
import { generateFlameGraphModel } from '../model';

describe('Model', () => {
    it('should generate flame graph model', () => {
        const panelData: PanelData = {
            state: LoadingState.Done,
            timeRange: null!,
            series: [
                new MutableDataFrame({
                    name: '',
                    fields: [
                        { name: 'time', type: FieldType.time, values: [1] },
                        { name: 'data', values: [1] },
                    ],
                }),
                new MutableDataFrame({
                    name: '\n    write+24\n    0x3266377830202020\n',
                    fields: [
                        { name: 'time', type: FieldType.time, values: [2] },
                        { name: 'data', values: [2] },
                    ],
                }),
                new MutableDataFrame({
                    name: '\n    write+24\n    0x3266377830202020\n    0x123',
                    fields: [
                        { name: 'time', type: FieldType.time, values: [1] },
                        { name: 'data', values: [3] },
                    ],
                }),
                new MutableDataFrame({
                    name: '\n    writev+24\n    0x400007ffd\n',
                    fields: [
                        { name: 'time', type: FieldType.time, values: [3] },
                        { name: 'data', values: [4] },
                    ],
                }),
                new MutableDataFrame({
                    name: '\n    zmalloc_get_rss+20\n',
                    fields: [
                        { name: 'time', type: FieldType.time, values: [1] },
                        { name: 'data', values: [5] },
                    ],
                }),
            ],
        };

        const result = generateFlameGraphModel(panelData, {
            minSamples: 0,
            hideUnresolvedStackFrames: false,
            hideIdleStacks: false,
        });
        const expected = {
            root: {
                name: 'root',
                value: 0,
                children: [
                    {
                        name: 'write+24',
                        value: 0,
                        children: [
                            {
                                name: '0x3266377830202020',
                                value: 2,
                                children: [
                                    {
                                        name: '0x123',
                                        value: 3,
                                        children: [],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        name: 'writev+24',
                        value: 0,
                        children: [
                            {
                                name: '0x400007ffd',
                                value: 4,
                                children: [],
                            },
                        ],
                    },
                    {
                        name: 'zmalloc_get_rss+20',
                        value: 5,
                        children: [],
                    },
                ],
            },
            minDate: 1,
            maxDate: 3,
        };
        expect(result).toStrictEqual(expected);
    });

    it('should generate flame graph model with process names', () => {
        const panelData: PanelData = {
            state: LoadingState.Done,
            timeRange: null!,
            series: [
                new MutableDataFrame({
                    name: '',
                    fields: [
                        { name: 'time', type: FieldType.time, values: [1] },
                        { name: 'data', values: [1] },
                    ],
                }),
                new MutableDataFrame({
                    name: 'swapper/2,\n    write+24\n    0x3266377830202020\n',
                    fields: [
                        { name: 'time', type: FieldType.time, values: [2] },
                        { name: 'data', values: [2] },
                    ],
                }),
                new MutableDataFrame({
                    name: 'Xorg,\n    read+24\n    0x123\n    0x456',
                    fields: [
                        { name: 'time', type: FieldType.time, values: [1] },
                        { name: 'data', values: [3] },
                    ],
                }),
            ],
        };

        const result = generateFlameGraphModel(panelData, {
            minSamples: 0,
            hideUnresolvedStackFrames: false,
            hideIdleStacks: false,
        });
        const expected = {
            root: {
                name: 'root',
                children: [
                    {
                        name: 'swapper/2',
                        children: [
                            {
                                name: 'write+24',
                                children: [
                                    {
                                        name: '0x3266377830202020',
                                        children: [],
                                        value: 2,
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        name: 'Xorg',
                        children: [
                            {
                                name: 'read+24',
                                children: [
                                    {
                                        name: '0x123',
                                        children: [
                                            {
                                                name: '0x456',
                                                children: [],
                                                value: 3,
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        };
        expect(result).toMatchObject(expected);
    });
});
