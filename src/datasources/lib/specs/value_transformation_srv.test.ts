import { TargetFormat } from "../models/datasource";
import { ValueTransformationSrv } from "../services/value_transformation_srv";

describe("ValueTransformationSrv", () => {

    it("should perform rate-conversation", () => {
        expect(ValueTransformationSrv.applyTransformations(TargetFormat.TimeSeries, "counter", "bytes", [
            [400, 1000],
            [500, 2000],
            [700, 3000]
        ])).toStrictEqual([
            [100, 2000],
            [200, 3000]
        ]);
    });

    it("should handle counter value wraps", () => {
        expect(ValueTransformationSrv.applyTransformations(TargetFormat.TimeSeries, "counter", "bytes", [
            [400, 1000],
            [500, 2000],
            [300, 3000],
            [900, 4000]
        ])).toStrictEqual([
            [100, 2000],
            [600, 4000]
        ]);
    });

    it("should perform rate-conversation for flame graphs (with rounding)", () => {
        expect(ValueTransformationSrv.applyTransformations(TargetFormat.FlameGraph, "counter", "bytes", [
            [1, 1000], // sampled once
            [2, 2100], // once more
            [2, 3200] // stack wasn't sampled here
        ])).toStrictEqual([
            [1, 2100],
            [0, 3200]
        ]);
    });

});
