import _ from 'lodash';
import { TDatapoint, Datapoint, TargetFormat } from '../models/datasource';
import { TransformationFn, Semantics, Units } from '../models/metrics';
//import './specs/benchmarks';

export class ValueTransformationSrv {

    static applyTransformations(format: TargetFormat, semantics: Semantics, units: Units, datapoints: TDatapoint[]) {
        const transformations: TransformationFn[] = [];
        if (semantics === "counter") {
            const round = format === TargetFormat.FlameGraph;
            transformations.push(ValueTransformationSrv.counter(round));

            if (units === "nanosec")
                transformations.push(ValueTransformationSrv.divideBy(1000 * 1000 * 1000));
        }

        const datapointsCopy = _.cloneDeep(datapoints);
        datapointsCopy.sort((a: TDatapoint, b: TDatapoint) => a[1] - b[1]);
        return transformations.reduce((datapoints, transformation) => transformation(datapoints), datapointsCopy);
    }

    /**
     * rate conversation
     * (v2 - v1) / (t2 - t1)
     *
     * note: the flamegraph counter also needs 2 values,
     * if sampling started already and counter is at value X,
     * we don't know if it jumped 0 -> X or it was X for a long time already
     */
    private static counter(round = false) {
        return (datapoints: Datapoint<number>[]) => {
            if (datapoints.length === 0)
                return datapoints;

            let prev = datapoints[0];
            for (let i = 1; i < datapoints.length; i++) {
                const cur = datapoints[i].slice() as Datapoint<number>; // copy datapoint
                const deltaSec = (cur[1] - prev[1]) / 1000;
                if (round)
                    datapoints[i][0] = Math.ceil((cur[0] - prev[0]) / deltaSec);
                else
                    datapoints[i][0] = (cur[0] - prev[0]) / deltaSec;
                prev = cur;
            }

            datapoints.shift();
            return datapoints;
        };
    }

    private static divideBy(divisor: number) {
        return (datapoints: Datapoint<number>[]) => {
            datapoints.forEach(datapoint => {
                datapoint[0] /= divisor;
            });
            return datapoints;
        };
    }

}
