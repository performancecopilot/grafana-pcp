import { ValuesTransformations } from "../transformations";
import { TDatapoint } from "../types";

describe("Transformations", () => {

    it("should perform rate-conversation", () => {
        const datapoints = [
            [45200, 1000] as TDatapoint,
            [55200, 2000] as TDatapoint,
            [75200, 3000] as TDatapoint,
        ];

        const result = ValuesTransformations.applyTransformations("counter", "", datapoints);
        const expected = [
            [10000, 2000],
            [20000, 3000]
        ];
        expect(result).toStrictEqual(expected);
    });

});
