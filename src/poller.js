const { groupBy, objectMap } = require('./utils')
const { applyTransforms } = require('./transforms')

// reload with:
// curl http://100.72.36.31:7402/pmapi/74083770/_metric | jq '.metrics'
const metricInfo = require('./data/metrics.js')
const metricNames = metricInfo.map(m => m.name)
metricNames.sort()

// poll metric sources every X ms
const POLL_INTERVAL_MS = 1000
// we will keep polling a metric for up to X ms after it was last requested
const KEEP_POLLING_MS = 20000
// age out time
const OLDEST_DATA_MS = 5*60*1000

const contexts = {} // endpoint -> { context, pmidMap, indomMap } // pmidMap is metrictext -> number, indomMap is metrictext -> { num : text }
let required = [] // list of { endpoint, metric text, lastRequested }
const collected = [] // list of { endpoint, metric text, datas[[ts,value],..] }

const parseEndpoint = (endpoint) => ({
    url: endpoint.split('::')[0],
    container: endpoint.split('::')[1] || null,
})

module.exports = (backendSrv) => {
    const doPollAll = () => {
        // clean up any not required metrics before we poll
        const pollExpiry = new Date().getTime() - KEEP_POLLING_MS
        required = required.filter(r => r.lastRequested > pollExpiry)

        // group each metric to be polled by endpoint 
        const pollsGrouped = groupBy(required, 'endpoint')
        const polls = objectMap(pollsGrouped, v => v.map(r => r.metric))

        const requests = []
        for (const endpoint of Object.keys(polls)) {
            requests.push(doPollOne(endpoint, polls[endpoint]))
        }

        const results = Promise.all(requests)

        const keepExpiry = new Date().getTime() - OLDEST_DATA_MS
        for (const c of collected) {
            const before = c.datas
            c.datas = c.datas.filter(tsv => tsv[0] > keepExpiry)
            const after = c.datas
        }
    }

    const ensureContext = async (endpoint, force) => {
        if (!force && endpoint in contexts) {
            return !!(contexts[endpoint].context && contexts[endpoint].pmids.length)
        } else {
            try {
                // first thing we do is set this up, so that future polls
                // do not try to connect, since endpoint will be set
                contexts[endpoint] = { context: null, pmids: [], indoms: {}, missingMetrics: [] }

                const { url, container } = parseEndpoint(endpoint)

                console.log('** making request for context')
                const contextUrl = container
                    ? `${url}/pmapi/context?hostspec=127.0.0.1&polltimeout=30&container=${container}`
                    : `${url}/pmapi/context?hostspec=127.0.0.1&polltimeout=30`
                const contextResponse = await backendSrv.datasourceRequest({
                    url: contextUrl,
                })
                console.log('** contextResponse:', contextResponse)

                const context = contextResponse.data.context
                contexts[endpoint] = { context, pmids: [], indoms: {}, missingMetrics: [] }

                if (container) {
                    console.log('selecting container..')
                    const containerResponse = await backendSrv.datasourceRequest({
                        url: `${url}/pmapi/${context}/_store?name=pmcd.client.container&value=${container}`
                    })
                    console.log('selected', containerResponse)
                }

                // fetch pmids
                console.log('** making request for metrics')
                const metricsResponse = await backendSrv.datasourceRequest({
                    url: `${url}/pmapi/${context}/_metric`
                })
                console.log('** metricsResponse:', metricsResponse)
                const pmids = metricsResponse.data.metrics.map(m => ({ name: m.name, pmid: m.pmid }))

                contexts[endpoint] = { context, pmids, indoms: {}, missingMetrics: [] }

                return true
            } catch (err) {
                console.log('could not connect to endpoint', endpoint)
                // TODO never connect? or wipe and try again?
                console.log(err)
                return false
            }
        }
    }

    const refreshIndoms = async (endpoint, metric) => {
        if (!await ensureContext(endpoint, false)) {
            // not ready for polling or failed, skip it
            return
        }

        const { url } = parseEndpoint(endpoint)
        const context = contexts[endpoint]

        let fetchResponse
        try {
            fetchResponse = await backendSrv.datasourceRequest({
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

    const renameIndoms = (endpoint, metric, data) => {
        let needsRefresh = false
        const context = contexts[endpoint]

        let output = []
        for(const iv of data) {
            if (iv.instance === -1) {
                output.push(iv)
            } else {
                const mapping = (context.indoms[metric] || []).find(indom => indom.instance === iv.instance)
                output.push({
                    ...iv,
                    instanceName: mapping ? mapping.name : iv.instance,
                })
                needsRefresh |= (!mapping)
            }
        }
        if (needsRefresh) {
            refreshIndoms(endpoint, metric)
        }
        return output
    }

    const doPollOne = async (endpoint, metrics) => {
        if (!await ensureContext(endpoint, false)) {
            // not ready for polling or failed, skip it
            return
        }

        const { url } = parseEndpoint(endpoint)
        const context = contexts[endpoint]

        // extract pmid for each metric name
        const pmids = metrics.map(m => {
            const pmidentry = context.pmids.find(p => p.name === m)
            if (pmidentry) {
                return pmidentry.pmid
            } else { // no pmid found
                if (!context.missingMetrics.includes(m)) {
                    context.missingMetrics.push(m)
                    console.log('is pmda enabled? missing pmid for:', m)
                }
                return
            }
        }).filter(m => !!m) // filter empty entries

        if (! pmids.length) return

        // by now we have a context, the pmids to fetch, so lets do it
        let fetchResponse
        try {
            fetchResponse = await backendSrv.datasourceRequest({
                url: `${url}/pmapi/${context.context}/_fetch?pmids=${pmids.join(',')}`
            })
        } catch (err) {
            // context will be dropped pretty quickly by pmwebd after we abandon polling
            // so we need to reconnect and wait for next poll iteration
            console.log('err fetching pmids', err)
            ensureContext(endpoint, true)
            return
        }

        const pollTimeEpochMs = fetchResponse.data.timestamp.s * 1000 + fetchResponse.data.timestamp.us / 1000

        for(const v of fetchResponse.data.values) {
            const data = [pollTimeEpochMs, renameIndoms(endpoint, v.name, v.instances)]

            const existing = collected.find(c => c.endpoint === endpoint && c.metric === v.name)
            if (existing) {
                existing.datas.push(data)
            } else {
                collected.push({ endpoint, metric: v.name, datas: [data] })
            }
        }
    }

    setInterval(doPollAll, POLL_INTERVAL_MS)

    return {
        metricNames,

        ensurePolling: (endpoint, metrics) => {
            const now = new Date().getTime()
            for (const metric of metrics) {
                // TODO replace with reduce
                const existing = required.find(r => r.endpoint === endpoint && r.metric === metric)
                if (!existing) {
                    required.push({ endpoint, metric, lastRequested: now })
                } else {
                    existing.lastRequested = now
                }
            }
        },
     
        collectData: (endpoint, metrics) => {
            return applyTransforms(
                collected.filter(c => c.endpoint === endpoint && metrics.includes(c.metric)))
        },
    }
}
