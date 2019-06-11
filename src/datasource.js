import _ from "lodash";
import { Parser } from 'plugins/pcp-live/expr-eval.js'

const Poller = require('./poller')
const utils = require('./utils')
const extensions = require('./extensions')

export class PcpLiveDatasource {

  constructor(instanceSettings, $q, backendSrv, templateSrv) {
    this.type = instanceSettings.type;
    this.url = instanceSettings.url;
    this.name = instanceSettings.name;
    this.q = $q;
    this.backendSrv = backendSrv;
    this.templateSrv = templateSrv;
    this.withCredentials = instanceSettings.withCredentials;
    this.headers = {'Content-Type': 'application/json'};
    if (typeof instanceSettings.basicAuth === 'string' && instanceSettings.basicAuth.length > 0) {
      this.headers['Authorization'] = instanceSettings.basicAuth;
    }

    this.poller = Poller(backendSrv);
  }

  buildQueryTargets(options) {
    return options.targets
      .filter((target) => {
        // remove placeholder targets
        return target.target !== 'select metric';
      })
      .map((target) => {
        let data = _.isUndefined(target.data) ? null : target.data;

        if (typeof data === 'string' && data.trim() === '') {
          data = null;
        }

        if (data !== null) {
          const match = data.match(/("(\$.+?)")/g);
          if (match !== null) {
            data
              .match(/("(\$.+?)")/g)
              .map((match) => {
                const replacedMatch = this.templateSrv.replace(match, options.scopedVars, 'json');
                if (replacedMatch !== match) {
                  data = data.replace(match, replacedMatch.substring(1, replacedMatch.length - 1));
                }
              });
          }
          data = JSON.parse(data);
        }

        return {
          data,
          target: this.templateSrv.replace(target.target, options.scopedVars, 'regex'),
          displayName: this.templateSrv.replace(target.displayName, options.scopedVars, 'regex'),
          refId: target.refId,
          hide: target.hide,
          type: target.type,
        };
      });
  }

  getVariables() {
    const index = _.isUndefined(this.templateSrv.index) ? {} : this.templateSrv.index;
    const variables = {};
    Object.keys(index).forEach((key) => {
      const variable = index[key];

      let variableValue = variable.current.value;
      if (variableValue === '$__all' || _.isEqual(variableValue, ['$__all'])) {
        if (variable.allValue === null) {
          variableValue = variable.options.slice(1).map(textValuePair => textValuePair.value);
        } else {
          variableValue = variable.allValue;
        }
      }

      variables[key] = {
        text: variable.current.text,
        value: variableValue,
      };
    });

    return variables;
  }
// above here, standard simple json datasource
/////////////////////////
// below here, pcp specific stuff

    targetName(instances, instance, targets, target) {
        // special fixes for these histogram labels
        const HISTOGRAM_INSTANCE_NAME_FIX_TARGETS = ['bcc.runq.latency', 'bcc.disk.all.latency']
        if (HISTOGRAM_INSTANCE_NAME_FIX_TARGETS.includes(target)) {
            const iname = instances[instance]
            return (iname.split && iname.split('-')[1]) || iname
        }

        const targetDisplay = (targets.length <= 1)
            ? target
            : target.substring(utils.sharedPrefixLength(targets.map(t => t.target)))

        const firstInstanceValue = instances && Object.values(instances)[0]
        const allInstancesTheSame = instances && Object.values(instances).every(i => i === firstInstanceValue)

        if (instances[instance]) {
            if (targets.length > 1) {
                if (allInstancesTheSame) {
                    return targetDisplay
                } else {
                    return `${targetDisplay} (${instances[instance]})`
                }
            } else {
                return instances[instance]
            }
        } else {
            return targetDisplay
        }
    }

    async doRequest(options) {
        const request = {
            ...options,
            withCredentials: this.withCredentials,
            headers: this.headers,
        }

        return await this.backendSrv.datasourceRequest(request);
    }

    async testDatasource() {
        return {
            status: 'success',
            title: 'Success',
            message: 'Data source configured, use _host, _port, _proto, [and _container] variables to connect.',
        }
    }

    async annotationQuery(options) {
        return []
    }

    async metricFindQuery(query) {
        let variables = this.getVariables()
        let result = []

        // if the query is for containers.name, return the containers
        // otherwise, default to providing a list of all metrics
        if (query === 'containers.name') {
            // TODO move this to somewhere else
            const { _proto, _host, _port } = this.getVariables()
            const endpoint = `${_proto.value}://${_host.value}:${_port.value}`

            const contextResponse = await this.backendSrv.datasourceRequest({
                url: `${endpoint}/pmapi/context?exclusive=1&hostspec=127.0.0.1&polltimeout=10`
            })
            const context = contextResponse.data.context
            const metricsResponse = await this.backendSrv.datasourceRequest({
                url: `${endpoint}/pmapi/${context}/_fetch?names=containers.name`
            })
            const UUID_REGEX = /[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}/
            result = metricsResponse.data.values[0].instances
                .map(iv => iv.value)
                .filter(i => i.match(UUID_REGEX))
                .map(i => ({ text: i, value: i }))
        } else {
            const target = this.templateSrv.replace(query, null, 'regex')
            const allowAll = !target
            const filteredMetrics = this.poller.metricNames
                .filter(mn => allowAll || mn.includes(target))
            result = filteredMetrics
                .map(mn => ({ text: mn, value: mn }))
        }

        return result
    }

    async query(options) {
        // TODO all this is generic boilerplate, we can probably get rid of it
        // by cutting down to only what we need
        const query = options
        query.targets = this.buildQueryTargets(options);

        const parser = new Parser()

        if (this.templateSrv.getAdhocFilters) {
            query.adhocFilters = this.templateSrv.getAdhocFilters(this.name);
        } else {
            query.adhocFilters = [];
        }

        options.scopedVars = { ...this.getVariables(), ...options.scopedVars };

        const { targets } = options
        const { _host, _port, _proto, _container } = options.scopedVars

        if (! _host || ! _port || ! _proto ) {
            console.log('_host, _port, or _proto variable not set in options, skipping query')
            return
        }

        const endpoint = _container
            ? `${_proto.value}://${_host.value}:${_port.value}::${_container.value}`
            : `${_proto.value}://${_host.value}:${_port.value}`

        const expressions = targets.map(t => t.target).map(t => parser.parse(t))
        const metricsToPoll = utils.flatMap(e => e.variables({ withMembers: true }), expressions)
        this.poller.ensurePolling(endpoint, metricsToPoll)

        const rawCollected = this.poller.collectData(endpoint, metricsToPoll)
        const collected = extensions.transformAfterCollected(rawCollected, _container && _container.value)

        const collectApplied = []

        // oh the for loops

        if (collected[0]) {
            for(const t of targets) {
                // for now we just take the first timeslot as the reference for the series
                const applied = []
                const expr = parser.parse(t.target)
                for(const data of collected[0].datas) {
                    const ts = data[0]
                    const ivout = []
                    for(const ivToCollect of data[1]) {
                        // look up all available data for this ts/instance combo
                        const valuesAtTimestampForInstance = collected.map(c => {
                            const valuesAtTs = c.datas.find(data => data[0] === ts)
                            const v = valuesAtTs
                                    && valuesAtTs[1]
                                    && valuesAtTs[1].find(civ => civ.instance === ivToCollect.instance)
                            return {
                                metric: c.metric,
                                value: v && v.value,
                            }
                        })

                        // provide a default 0, load in all of the values
                        const variables = {}
                        metricsToPoll.forEach(
                            v => _.set(variables, v, 0))
                        valuesAtTimestampForInstance.forEach(
                            v => _.set(variables, v.metric, v.value))
                        const calculated = expr.evaluate(variables)
                        ivout.push({
                            instance: ivToCollect.instance,
                            instanceName: ivToCollect.instanceName,
                            value: calculated,
                        })
                    }
                    applied.push([ts, ivout])
                }

                collectApplied.push({
                    datas: applied,
                    endpoint,
                    metric: t.displayName || t.target,
                })
            }
        }

        // flatten the metric instance data out
        const plotted = []

        for(const data of collectApplied) {
            // TODO this looping is a bit O(n^2) but should be ok for proof of concept

            // get a list of all unique instances and carry forward the instance name
            const instances = {}
            data.datas.forEach(d => d[1].forEach(iv => instances[iv.instance] = iv.instanceName))

            for(const instance of Object.keys(instances)) {
                const target = this.targetName(instances, instance, targets, data.metric)

                const datapoints = [] // array of: [ value, unix_epoch_ms ]
                for (const tsiv of data.datas) {
                    const ts = tsiv[0]
                    const iv = tsiv[1]
                    const foundIv = iv.find(ivi => ivi.instance == instance)
                    if (foundIv) {
                        const value = foundIv.value
                        datapoints.push([ value, ts ])
                    }
                }

                plotted.push({
                    metric: data.metric,
                    instance,
                    target,
                    datapoints,
                })
            }
        }

        // most data is for a request of type 'timeserie'[sic]
        // if the user requests everything of type 'table'
        // then let's make them a table
        let output
        if (targets.every(t => t.type === 'table')) {
            // for a table, we are going to assume just take the LATEST of the dataset
            // output everything as a string:
            // each metric is a column, each instance is a row
            const type = 'table'
            const columns = targets.map(t => ({ text: t.target, type: 'string' }))
            const rows = []
            plotted.forEach(p => rows.push([]))
            for (let i = 0; i < rows.length; i++) {
                for (let j = 0; j < columns.length; j++) {
                    const instanceAsString = `${i}`
                    const colName = columns[j].text
                    const foundPoints = plotted.find(p => p.instance === instanceAsString && p.metric === colName)
                    if (foundPoints) {
                        const points = foundPoints.datapoints
                        rows[i][j] = points[points.length - 1][0]
                    }
                }
            }
            output = [{
                columns,
                rows,
                type,
            }]
        } else {
            output = plotted.map(p => ({ target: p.target, datapoints: p.datapoints }))
        }

        return {
            data: output
        }
    }
//////////
}
