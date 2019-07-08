import { groupBy, objectMap } from './utils'
import Transformations from './transforms'

// poll metric sources every X ms
const POLL_INTERVAL_MS = 1000
// we will keep polling a metric for up to X ms after it was last requested
const KEEP_POLLING_MS = 20000
// age out time
const OLDEST_DATA_MS = 5*60*1000

const parseEndpoint = (endpoint) => ({
    url: endpoint.split('::')[0],
    container: endpoint.split('::')[1] || null,
})

export default class Poller {

    backendSrv: any;
    transformations: any;
    metricInfo: any;
    metricNames: any;
    contexts: any;
    required: any;
    collected: any;

    constructor(backendSrv) {
        this.backendSrv = backendSrv;
        this.transformations = new Transformations();
        this.metricInfo = null;
        this.metricNames = [];
        this.contexts = {} // endpoint -> Promise { context, pmidMap, indomMap } // pmidMap is metrictext -> number, indomMap is metrictext -> { num : text }
        this.required = [] // list of { endpoint, metric text, lastRequested }
        this.collected = [] // list of { endpoint, metric text, datas[[ts,value],..] }

        setInterval(this.doPollAll.bind(this), POLL_INTERVAL_MS)
    }

    doPollAll() {
        // clean up any not required metrics before we poll
        const pollExpiry = new Date().getTime() - KEEP_POLLING_MS
        this.required = this.required.filter(r => r.lastRequested > pollExpiry)

        // group each metric to be polled by endpoint 
        const pollsGrouped = groupBy(this.required, 'endpoint')
        const polls = objectMap(pollsGrouped, v => v.map(r => r.metric))

        const requests = [] as any
        for (const endpoint of Object.keys(polls)) {
            requests.push(this.doPollOne(endpoint, polls[endpoint]))
        }

        Promise.all(requests).then(() => {
            const keepExpiry = new Date().getTime() - OLDEST_DATA_MS
            for (const c of this.collected) {
                c.datas = c.datas.filter(tsv => tsv[0] > keepExpiry)
            }
        })
    }

    async getContext(endpoint, refresh) {
        const { url, container } = parseEndpoint(endpoint)

        //console.log('** making request for context')
        let contextUrl = `${url}/pmapi/context?hostspec=127.0.0.1&polltimeout=30`
        if (container)
            contextUrl += `&container=${container}`

        const contextResponse = await this.backendSrv.datasourceRequest({ url: contextUrl })
        //console.log('** contextResponse:', contextResponse)
        const context = contextResponse.data.context

        if (container) {
            //console.log('selecting container..')
            const containerResponse = await this.backendSrv.datasourceRequest({
                url: `${url}/pmapi/${context}/_store?name=pmcd.client.container&value=${container}`
            })
            //console.log('selected', containerResponse)
        }

        // fetch pmids
        //console.log('** making request for metrics')
        const metricsResponse = await this.backendSrv.datasourceRequest({
            url: `${url}/pmapi/${context}/_metric`
        })
        //console.log('** metricsResponse:', metricsResponse)
        const pmids = metricsResponse.data.metrics.map(m => ({ name: m.name, pmid: m.pmid }))

        // fetch metric info (if not already done)
        if (!this.metricInfo) {
            // TODO: instead of loading metric name on context creation, load them on dropdown click
            const metricsResponse = await this.backendSrv.datasourceRequest({
                url: `${url}/pmapi/${context}/_metric`
            })
            this.metricInfo = metricsResponse.data.metrics;
            this.metricNames = this.metricInfo.map(m => m.name);
            this.metricNames.sort()
            this.transformations.init(this.metricInfo);
        }

        return { context, pmids, indoms: {}, missingMetrics: [] }
    }

    ensureContext(endpoint, refresh) {
        if (!refresh && endpoint in this.contexts) {
            return this.contexts[endpoint]
        }

        this.contexts[endpoint] = this.getContext(endpoint, refresh)
        return this.contexts[endpoint].catch(e => {
            console.log(`error acquiring context for ${endpoint}`, e);
            return false;
        })
    }

    async getMetrics(endpoint, metrics) {
        const { url } = parseEndpoint(endpoint)
        const context = await this.ensureContext(endpoint, false)
        if (!context) {
            // not ready for polling or failed, skip it
            return
        }

        // extract pmid for metric name
        const pmids = metrics.map(m => this.lookupPmidForMetric(context, m)).filter(m => !!m)
        if (!pmids.length) return

        // by now we have a context, the pmids to fetch, so lets do it
        try {
            return await this.backendSrv.datasourceRequest({
                url: `${url}/pmapi/${context.context}/_fetch?pmids=${pmids.join(',')}`
            })
        } catch (err) {
            // context will be dropped pretty quickly by pmwebd after we abandon polling
            // so we need to reconnect and wait for next poll iteration
            console.log('err fetching pmids', err)
            this.ensureContext(endpoint, true)
            // TODO: try again
            return
        }
    }

    async doPollOne(endpoint, metrics) {
        const fetchResponse = await this.getMetrics(endpoint, metrics);
        await this.appendFetchResultDataToCollection(endpoint, fetchResponse.data);
    }

    async appendFetchResultDataToCollection(endpoint, fetchResponseData) {
        const pollTimeEpochMs = fetchResponseData.timestamp.s * 1000 + fetchResponseData.timestamp.us / 1000

        // add the data to that already collected for the endpoint/metric
        for(const v of fetchResponseData.values) {
            const data = [pollTimeEpochMs, await this.renameIndoms(endpoint, v.name, v.instances)]

            const existing = this.collected.find(c => c.endpoint === endpoint && c.metric === v.name)
            if (existing) {
                existing.datas.push(data)
            } else {
                // unless this is the first result for the endpoint/metric, in this case: create one
                this.collected.push({ endpoint, metric: v.name, datas: [data] })
            }
        }
    }

    async renameIndoms(endpoint, metric, data) {
        let needsRefresh = false
        const context = await this.ensureContext(endpoint, false)

        let output = [] as any
        for(const iv of data) {
            if (iv.instance === -1) {
                output.push(iv)
            } else {
                const mapping = (context.indoms[metric] || []).find(indom => indom.instance === iv.instance)
                output.push({
                    ...iv,
                    instanceName: mapping ? mapping.name : iv.instance,
                })
                if (!mapping)
                    needsRefresh = true;
            }
        }
        if (needsRefresh) {
            this.refreshIndoms(endpoint, metric)
        }
        return output
    }

    async refreshIndoms(endpoint, metric) {
        const { url } = parseEndpoint(endpoint)
        const context = await this.ensureContext(endpoint, false)
        if (!context) {
            // not ready for polling or failed, skip it
            return
        }

        let fetchResponse
        try {
            fetchResponse = await this.backendSrv.datasourceRequest({
                url: `${url}/pmapi/${context.context}/_indom?name=${metric}`
            })
        } catch (err) {
            // unfortunately errors might be caused by no indom mapping
            // ignore it for now
            // TODO we should explicitly check for missing indom error code
            // then we can discard context or not as appropriate
            console.log('err fetching indoms', err)
            return
        }

        context.indoms[metric] = fetchResponse.data.instances
    }

    lookupPmidForMetric(context, m) {
        const pmidentry = context.pmids.find(p => p.name === m)
        if (pmidentry) {
            return pmidentry.pmid
        } else { // no pmid found
            if (!context.missingMetrics.includes(m)) {
                context.missingMetrics.push(m)
                console.log('is pmda enabled? missing pmid for:', m)
            }
            return null
        }
    }

    ensurePolling(endpoint, metrics) {
        const now = new Date().getTime()
        for (const metric of metrics) {
            // TODO replace with reduce?
            const existing = this.required.find(r => r.endpoint === endpoint && r.metric === metric)
            if (!existing) {
                this.required.push({ endpoint, metric, lastRequested: now })
            } else {
                existing.lastRequested = now
            }
        }
    }

    collectData(endpoint, metrics) {
        const targeted = this.collected.filter(c => c.endpoint === endpoint && metrics.includes(c.metric))
        const output = this.transformations.applyTransforms(targeted)
        return output
    }
}
