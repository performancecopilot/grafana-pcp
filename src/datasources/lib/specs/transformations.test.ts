import { Transformations } from "../transformations";
import { TDatapoint, TargetFormat } from "../models/datasource";
import * as fixtures from './lib/fixtures';

describe("Transformations", () => {

    it("should perform rate-conversation", () => {
        const datapoints = [
            [400, 1000] as TDatapoint,
            [500, 2000] as TDatapoint,
            [700, 3000] as TDatapoint,
        ];

        const metadata = {
            ...fixtures.metricMetadataSingle,
            sem: "counter"
        };

        const result = Transformations.applyTransformations(TargetFormat.TimeSeries, metadata, datapoints);
        const expected = [
            [100, 2000],
            [200, 3000]
        ];
        expect(result).toStrictEqual(expected);
    });

});
