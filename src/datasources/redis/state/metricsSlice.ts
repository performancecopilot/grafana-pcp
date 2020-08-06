import { createSlice, createEntityAdapter, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunkApiConfig } from './store';
import { difference, keyBy, groupBy, Dictionary, mapValues } from 'lodash';
import {
    SeriesLabelsItemResponse,
    SeriesMetricsItemResponse,
    SeriesInstancesItemResponse,
} from '../../../lib/models/api/series';
import {
    SeriesId,
    SeriesMetric,
    SERIES_NO_INDOM,
    SeriesInstanceId,
    SeriesInstance,
} from '../../../lib/models/pcp/pmseries';
import { Dict } from '../../../lib/models/utils';

const metricsAdapter = createEntityAdapter<SeriesMetric>({
    selectId: metric => metric.metadata.series,
});
const metricsSelector = metricsAdapter.getSelectors<RootState>(state => state.series.metrics);

export const metricsSlice = createSlice({
    name: 'metrics',
    initialState: metricsAdapter.getInitialState(),
    reducers: {
        metricsReceived(state, action: PayloadAction<SeriesMetric[]>) {
            metricsAdapter.setAll(state, action.payload);
        },
    },
});

export const fetchMetrics = createAsyncThunk<SeriesMetric[], SeriesId[], AppThunkApiConfig>(
    'metrics/fetchMetrics',
    async (series, thunkApi) => {
        const allCachedMetrics = metricsSelector.selectIds(thunkApi.getState()) as SeriesId[];
        const missingSeries = difference(series, allCachedMetrics);

        if (missingSeries.length > 0) {
            const [names, metadata] = await Promise.all([
                thunkApi.extra.pmSeriesApi.metrics({ series: missingSeries }) as Promise<SeriesMetricsItemResponse[]>,
                thunkApi.extra.pmSeriesApi.descs({ series: missingSeries }),
            ]);
            const metadataBySeries = keyBy(metadata, m => m.series);
            let metricLabelsBySeries: Dictionary<SeriesLabelsItemResponse> = {};
            let instancesBySeries: Dictionary<SeriesInstancesItemResponse[]> = {};
            let instanceLabelsByInstance: Dictionary<SeriesLabelsItemResponse> = {};

            const seriesWithIndom = metadata.filter(m => m.indom !== SERIES_NO_INDOM).map(m => m.series);
            const seriesWithoutIndom = metadata.filter(m => m.indom === SERIES_NO_INDOM).map(m => m.series);
            if (seriesWithoutIndom.length > 0) {
                // only metrics without indoms have labels attached
                const metricLabels = (await thunkApi.extra.pmSeriesApi.labels({
                    series: seriesWithoutIndom,
                })) as SeriesLabelsItemResponse[];
                metricLabelsBySeries = keyBy(metricLabels, l => l.series);
            }
            if (seriesWithIndom.length > 0) {
                // metrics with indoms have the labels at the instance level
                const instances = await thunkApi.extra.pmSeriesApi.instances({ series: seriesWithIndom });
                instancesBySeries = groupBy(instances, i => i.series);
                const instanceLabels = (await thunkApi.extra.pmSeriesApi.labels({
                    series: instances.map(i => i.instance),
                })) as SeriesLabelsItemResponse[];
                instanceLabelsByInstance = keyBy(instanceLabels, i => i.series);
            }

            thunkApi.dispatch(
                metricsSlice.actions.metricsReceived(
                    names.map(nameItem => {
                        const series = nameItem.series;
                        const desc = metadataBySeries[series];
                        const labels = series in metricLabelsBySeries ? metricLabelsBySeries[series].labels : {};
                        let instances: Dict<SeriesInstanceId, SeriesInstance> = {};
                        if (series in instancesBySeries) {
                            instances = mapValues(
                                keyBy(instancesBySeries[series], i => i.instance),
                                instance => ({
                                    ...instance,
                                    labels: instanceLabelsByInstance[instance.instance].labels,
                                })
                            );
                        }

                        return {
                            metadata: {
                                series,
                                name: nameItem.name,
                                indom: desc.indom === SERIES_NO_INDOM ? undefined : desc.indom,
                                type: desc.type,
                                sem: desc.semantics,
                                units: desc.units,
                                labels,
                            },
                            instanceDomain: {
                                instances,
                                labels: {},
                            },
                        };
                    })
                )
            );
        }

        return series.map(series => metricsSelector.selectById(thunkApi.getState(), series)!);
    }
);
