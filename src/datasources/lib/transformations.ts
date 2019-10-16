import _ from 'lodash';
import { TDatapoint, Datapoint, TargetFormat } from './models/datasource';
import { TransformationFn, Semantics, Units } from './models/metrics';
//import './specs/benchmarks';

export class Transformations {

    static applyTransformations(format: TargetFormat, semantics: Semantics, units: Units, datapoints: TDatapoint[]) {
        const transformations: TransformationFn[] = [];
        if (semantics === "counter" && format !== TargetFormat.FlameGraph) {
            transformations.push(Transformations.counter);
            if (units === "nanosec")
                transformations.push(Transformations.divideBy(1000 * 1000 * 1000));
        }

        const datapointsCopy = _.cloneDeep(datapoints);
        datapointsCopy.sort((a: TDatapoint, b: TDatapoint) => a[1] - b[1]);
        return transformations.reduce((datapoints, transformation) => transformation(datapoints), datapointsCopy);
    }

    static counter(datapoints: Datapoint<number>[]) {
        // for counters we need at least 2 values to get the rate
        if (datapoints.length < 2)
            datapoints.length = 0;

        let prev = datapoints[0];
        for (let i = 1; i < datapoints.length; i++) {
            const cur = datapoints[i].slice() as Datapoint<number>; // copy datapoint
            const deltaSec = (cur[1] - prev[1]) / 1000;
            datapoints[i][0] = (cur[0] - prev[0]) / deltaSec;
            prev = cur;
        }
        datapoints.shift(); // remove first value of the counter (not possible to calculate rate)
        return datapoints;
    }

    static divideBy(divisor: number) {
        return (datapoints: Datapoint<number>[]) => {
            datapoints.forEach(datapoint => {
                datapoint[0] /= divisor;
            });
            return datapoints;
        };
    }

}
