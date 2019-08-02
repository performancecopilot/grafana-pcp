import { TransformationFn, Datapoint, TDatapoint } from "./types";


export default class ValueTransformations {

    static applyTransformations(transformations: TransformationFn[], datapoints: TDatapoint[]) {
        datapoints.sort((a: TDatapoint, b: TDatapoint) => a[1] - b[1]);
        transformations.forEach(transformation => transformation(datapoints));
        return datapoints;
    }

    static counter(datapoints: Datapoint<number>[]) {
        // for counters we need at least 2 values to get the rate
        if (datapoints.length < 2)
            datapoints.length = 0;

        let prev = datapoints[0];
        for (let i = 1; i < datapoints.length; i++) {
            let cur = datapoints[i].slice() as Datapoint<number>; // copy datapoint
            const deltaSec = (cur[1] - prev[1]) / 1000;
            datapoints[i][0] = (cur[0] - prev[0]) / deltaSec;
            prev = cur;
        }
        datapoints.shift(); // remove first value of the counter (not possible to calculate rate)
    }

}