import _ from 'lodash';

interface MetricMetadata {
  name: string,
  pmid: number
}

export default class PCPContext {

  static datasourceRequest: (options: any) => any;
  private context: string;
  private metricMetadataCache: MetricMetadata[] = [];
  private missingMetrics: string[] = [];
  private indomCache: Record<string, Record<number, string>> = {}; // indomCache[metric][instance_id] = instance_name

  constructor(readonly url: string, readonly container: string | null = null) {
  }

  async createContext() {
    //console.log('** making request for context')
    let contextUrl = `${this.url}/pmapi/context?hostspec=127.0.0.1&polltimeout=30`
    if (this.container)
      contextUrl += `&container=${this.container}`

    const contextResponse = await PCPContext.datasourceRequest({ url: contextUrl })
    //console.log('** contextResponse:', contextResponse)
    this.context = contextResponse.data.context

    if (this.container) {
      //console.log('selecting container..')
      const containerResponse = await PCPContext.datasourceRequest({
        url: `${this.url}/pmapi/${this.context}/_store?name=pmcd.client.container&value=${this.container}`
      })
      //console.log('selected', containerResponse)
    }

    if (_.isEmpty(this.metricMetadataCache)) {
      await this.fetchMetricMetadata();
    }
  }

  async ensureContext(fn: () => any) {
    if (!this.context) {
      await this.createContext();
    }

    try {
      return await fn();
    } catch(err) {
      await this.createContext();
      return await fn();
    }
  }

  async fetchMetricMetadata() {
    //console.log('** making request for metrics')
    await this.ensureContext(async () => {
      const metricsResponse = await PCPContext.datasourceRequest({
        url: `${this.url}/pmapi/${this.context}/_metric`
      });
      this.metricMetadataCache = metricsResponse.data.metrics;
    });
  }

  findPmidForMetric(metric: string) {
    const pmidentry = this.metricMetadataCache.find(p => p.name === metric)
    if (pmidentry) {
        return pmidentry.pmid
    } else { // no pmid found
        if (!this.missingMetrics.includes(metric)) {
            this.missingMetrics.push(metric)
            console.log(`Cannot find pmid for ${metric}. Is this PMDA enabled?`)
        }
        return null
    }
  }

  async refreshIndoms(metric: string) {
    const indoms = await this.ensureContext(async () => {
      const response = await PCPContext.datasourceRequest({
        url: `${this.url}/pmapi/${this.context}/_indom`,
        params: {name: metric}
      });
      return response.data.instances;
    });

    // convert [{instance: X, name: Y}] to {instance: name}
    this.indomCache[metric] = indoms.reduce((cache: any, indom: any) => {
      cache[indom.instance] = indom.name;
      return cache;
    }, {});
    return this.indomCache[metric];
  }

  async fetch(metrics: string[], instanceNames: boolean = false) {
    // extract pmid for metric name
    const queryPmids = metrics
      .map((metric: string) => this.findPmidForMetric(metric))
      .filter((metric: number|null) => metric) // filter out nulls from findPmidForMetric

    if (!queryPmids.length)
      return []

    // by now we have a context, the pmids to fetch, so lets do it
    
    const data = await this.ensureContext(async () => {
      const response = await PCPContext.datasourceRequest({
        url: `${this.url}/pmapi/${this.context}/_fetch`,
        params: {pmids: queryPmids.join(',')}
      });
      return response.data;
    });

    if (instanceNames) {
      // add instance names to instances
      for (const metric of data.values) {
        if (metric.instances.length == 0) {
          continue;
        } else if (metric.instances[0].instance === -1) { // this metric has no instances (single value)
          metric.instances[0].instanceName = null;
          continue;
        }

        let indomsForMetric = this.indomCache[metric.name];
        if (!indomsForMetric)
          indomsForMetric = await this.refreshIndoms(metric.name);
          
        let refreshed = false;
        for(const instance of metric.instances) {
          instance.instanceName = indomsForMetric[instance.instance];
          if (!instance.instanceName && !refreshed) {
            // refresh instances at max once per metric
            indomsForMetric = await this.refreshIndoms(metric.name);
            instance.instanceName = indomsForMetric[instance.instance];
            refreshed = true;
          }
        }
      }
    }

    return data;
  }

  async store(metric: string, value: string) {
    return await this.ensureContext(() => {
      return PCPContext.datasourceRequest({
        url: `${this.url}/pmapi/${this.context}/_store`,
        params: {name: metric, value: value}
      })
    });
  }
}
