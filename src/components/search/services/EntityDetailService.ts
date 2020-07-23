import PmSearchApiService from './PmSearchApiService';
import PmSeriesApiService from './PmSeriesApiService';
import _ from 'lodash';
import { SeriesLabelsItemResponse, SeriesDescResponse } from '../models/endpoints/series';
import { MetricEntity, MetricEntitySeries } from '../models/entities/metric';
import { SearchEntity, TextItemResponseField } from '../models/endpoints/search';

type LabelsAndMeta = SeriesLabelsItemResponse[] & SeriesDescResponse;

class EntityService {
    searchService: PmSearchApiService;
    seriesService: PmSeriesApiService;

    constructor(searchService: PmSearchApiService, seriesService: PmSeriesApiService) {
        this.searchService = searchService;
        this.seriesService = seriesService;
    }

    async metric(metric: string): Promise<MetricEntity> {
        const { seriesService, searchService } = this;
        if (metric === '') {
            throw Error('Metric identifier cannot be empty.');
        }
        let entitySeriesTransformed: MetricEntitySeries[] = [];
        const series: string[] = (await seriesService.query({ expr: `${metric}*` })) as string[];
        if (series.length !== 0) {
            const [metadata, labels] = await Promise.all([
                seriesService.descs({ series }),
                seriesService.labels({ series }),
            ]);
            const entitySeries: _.Dictionary<LabelsAndMeta> = _.groupBy(
                _.merge(metadata, labels) as LabelsAndMeta,
                'series'
            );
            entitySeriesTransformed = Object.keys(entitySeries).reduce<MetricEntitySeries[]>(
                (prev: MetricEntitySeries[], val: string) => {
                    return [
                        ...prev,
                        ...(entitySeries[val]
                            ? [
                                  {
                                      series: val,
                                      meta: _.omit(entitySeries[val][0], 'series', 'labels'),
                                      ...(entitySeries[val][0].labels ? { labels: entitySeries[val][0].labels } : {}),
                                  },
                              ]
                            : {}),
                    ];
                },
                []
            );
        }
        const searchRecord = await searchService.text({
            query: metric,
            limit: 1,
            offset: 0,
            type: SearchEntity.Metrics,
            field: [TextItemResponseField.Name],
        });
        if (searchRecord !== null && searchRecord.results.length > 0) {
            const record = searchRecord.results[0];
            if (record.name === metric) {
                return {
                    name: metric,
                    series: entitySeriesTransformed,
                    oneline: record.oneline,
                    help: record.helptext,
                };
            }
        }
        return {
            name: metric,
            series: entitySeriesTransformed,
        };
    }

    async indom(indom: string) {}
}

export default EntityService;
