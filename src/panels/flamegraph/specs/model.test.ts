import { LoadingState } from "@grafana/data";
import { generateFlameGraphModel } from "../model";

describe("Model", () => {

    it("should generate flame graph model", () => {
        const panelData: any = {
            state: LoadingState.Done,
            series: [
                { name: "", rows: [[1, 1]] },
                { name: "\n    write+24\n    0x3266377830202020\n", rows: [[2, 2]] },
                { name: "\n    write+24\n    0x3266377830202020\n    0x123", rows: [[3, 1]] },
                { name: "\n    writev+24\n    0x400007ffd\n", rows: [[4, 3]] },
                { name: "\n    zmalloc_get_rss+20\n", rows: [[5, 1]] }
            ]
        };

        const result = generateFlameGraphModel(panelData, { minSamples: 0, hideUnresolvedStackFrames: false, hideIdleStacks: false });
        const expected = {
            root: {
                name: "root",
                value: 0,
                children: [{
                    name: "write+24",
                    value: 0,
                    children: [{
                        name: "0x3266377830202020",
                        value: 2,
                        children: [{
                            name: "0x123",
                            value: 3,
                            children: []
                        }]
                    }]
                }, {
                    name: "writev+24",
                    value: 0,
                    children: [{
                        name: "0x400007ffd",
                        value: 4,
                        children: []
                    }]
                }, {
                    name: "zmalloc_get_rss+20",
                    value: 5,
                    children: []
                }]
            },
            minDate: 1,
            maxDate: 3
        };
        expect(result).toStrictEqual(expected);
    });

});
