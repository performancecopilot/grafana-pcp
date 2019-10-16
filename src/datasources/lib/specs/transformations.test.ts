import { Transformations } from "../transformations";
import { TDatapoint, TargetFormat } from "../models/datasource";

describe("Transformations", () => {

    it("should perform rate-conversation", () => {
        const datapoints = [
            [400, 1000] as TDatapoint,
            [500, 2000] as TDatapoint,
            [700, 3000] as TDatapoint,
        ];

        const result = Transformations.applyTransformations(TargetFormat.TimeSeries, "counter", "bytes", datapoints);
        const expected = [
            [100, 2000],
            [200, 3000]
        ];
        expect(result).toStrictEqual(expected);
    });

});
