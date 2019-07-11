import { Target, Datapoint } from "./datasource";

export default class Transformations {
    static toHeatmap(target: Target) {
        // target name is the upper bound
        target.target = target.target.split('-')[1];

        // round timestamps to one second - the heatmap panel calculates the x-axis size accordingly
        target.datapoints = target.datapoints.map(
           (dataPoint: Datapoint) => [dataPoint[0], Math.round(dataPoint[1] / 1000) * 1000, dataPoint[2]]
        );
        return target;
    }
}
