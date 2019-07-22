import _ from "lodash";
import { Parser } from 'expr-eval'

import Poller from './poller'
import * as utils from './utils'
import * as extensions from './extensions'
import { TargetFormat, PanelData } from "../lib/types";
import EndpointRegistry, { Endpoint } from "../lib/endpoint_registry";
import Transformations from "../lib/transformations";
import Context from "../lib/context";

export class PcpLiveDatasource {

  instanceSettings: any;
  name: string;
  url: string;
  q: any;
  backendSrv: any;
  templateSrv: any;
  variableSrv: any;
  withCredentials: boolean;
  headers: any;
  poller: Poller;
  container_name_filter: any;

  pollIntervalMs: number; // poll metric sources every X ms
  keepPollingMs: number; // we will keep polling a metric for up to X ms after it was last requested
  olderstDataMs: number; // age out time

  endpointRegistry: EndpointRegistry<Endpoint>;
  transformations: Transformations;

  /** @ngInject **/
  constructor(instanceSettings, $q, backendSrv, templateSrv, variableSrv) {
    this.instanceSettings = instanceSettings;
    this.name = instanceSettings.name;
    this.url = instanceSettings.url;
    this.q = $q;
    this.backendSrv = backendSrv;
    this.templateSrv = templateSrv;
    this.variableSrv = variableSrv;
    this.withCredentials = instanceSettings.withCredentials;
    this.headers = {'Content-Type': 'application/json'};
    if (typeof instanceSettings.basicAuth === 'string' && instanceSettings.basicAuth.length > 0) {
      this.headers['Authorization'] = instanceSettings.basicAuth;
    }

    //this.poller = new Poller(backendSrv);

    const UUID_REGEX = /[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}/
    this.container_name_filter = name => true // name => name.match(UUID_REGEX)


    this.pollIntervalMs = instanceSettings.jsonData.pollIntervalMs || 1000;
    this.keepPollingMs = instanceSettings.jsonData.keepPollingMs || 20000;
    this.olderstDataMs = instanceSettings.jsonData.olderstDataMs || 5 * 60 * 1000;

    Context.datasourceRequest = this.doRequest.bind(this);
    this.endpointRegistry = new EndpointRegistry();
    this.transformations = new Transformations(this.templateSrv);

    if (this.pollIntervalMs > 0)
      setInterval(this.doPollAll.bind(this), this.pollIntervalMs);
  }

  doPollAll() {
    let promises: Promise<void>[] = [];
    for (const endpoint of this.endpointRegistry.list()) {
        endpoint.datastore.cleanExpiredMetrics();
        endpoint.poller.cleanupExpiredMetrics();
        promises.push(endpoint.poller.poll());
    }
    return Promise.all(promises);
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

  getVariables(): any {
    const variables = {};
    if (!this.variableSrv.variables) {
        // variables are not defined on the datasource settings page
        return {};
    }

    this.variableSrv.variables.forEach((variable) => {
      let variableValue = variable.current.value;
      if (variableValue === '$__all' || _.isEqual(variableValue, ['$__all'])) {
        if (variable.allValue === null) {
          variableValue = variable.options.slice(1).map(textValuePair => textValuePair.value);
        } else {
          variableValue = variable.allValue;
        }
      }

      variables[variable.name] = {
        text: variable.current.text,
        value: variableValue,
      };
    });

    return variables;
  }

  getConfiguredEndpoint() {
      const variables = this.getVariables();
      if ('_proto' in variables && '_host' in variables && '_port' in variables) {
          let endpoint = `${variables._proto.value}://${variables._host.value}:${variables._port.value}`;
          if ('_container' in variables) {
              endpoint += `::${variables._container.value}`;
          }
          return endpoint;
      }
      else {
          let endpoint = this.instanceSettings.url;
          if (this.instanceSettings.jsonData.container) {
            endpoint += `::${this.instanceSettings.jsonData.container}`;
        }
        return endpoint;
      }
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
        let context = new Context(this.url);
        try {
            await context.createContext();
            return {
              status: 'success',
              title: 'Success',
              message: 'Data source configured successfully. If you wish to override the PCP endpoint for specific dashboards, '+
                       'you can use the  _host, _port, _proto, (and optionally _container) variables.'
          }
        }
        catch (error) {
          return {
            status: 'error',
            title: 'Additional configuration required',
            message: 'Could not connect to the specified url. To use this data source, '+
                     'please configure the _host, _port, _proto, (and optionally _container) dashboard variables.',
           }
        }
    }

    async annotationQuery(options) {
        return []
    }

    /**
     * called by the query editor for auto completion of metric names
     * also used by the templating engine (dashboard variables with type = query)
     */
    async metricFindQuery(query) {
        let endpoint = await this.findOrCreateEndpoint();

        // if the query is for containers.name, return the containers
        // otherwise, default to providing a list of all metrics
        if (query === 'containers.name') {
          const metricsResponse = await endpoint.context.fetch(["containers.name"]);
            return metricsResponse.values[0].instances
                .map(iv => iv.value)
                .filter(this.container_name_filter)
                .map(i => ({ text: i, value: i }))
        } else {
            const filteredMetrics = endpoint.context.getAllMetricNames()
                .filter(mn => !query || mn.includes(query))
            return filteredMetrics
                .map(mn => ({ text: mn, value: mn }))
        }
    }

    async findOrCreateEndpoint() {
      const dashboardVariables = this.getVariables();

      // TODO: also allow overriding of url in query editor
      let url: string;
      if (dashboardVariables.url && dashboardVariables.url.value.length > 0)
          url = dashboardVariables.url.value;
      else
          url = this.url;

      let endpoint = this.endpointRegistry.find(url);
      if (!endpoint) {
          endpoint = this.endpointRegistry.create(url, null, this.keepPollingMs, this.olderstDataMs);
          await endpoint.context.fetchMetricMetadata(); // TODO: where?
      }
      return endpoint;
    }

    async query(options) {
        const query = options;
        if (query.targets.length == 0) {
            return { data: [] };
        }

        const panelData: PanelData[] = [];
        for (const target of query.targets) {
            if (target.hide || (!target.expr && !target.target))
                continue;

            // TODO: remove me: workaround for old dashboards
            if (!target.expr)
              target.expr = target.target;
            if (!target.format && (target.type === "timeseries" || target.type === "timeserie"))
              target.format = "time_series";

            // TODO: allow templating
            const expr:string = target.expr.trim();
            if (expr.length === 0)
                continue;

            let endpoint = await this.findOrCreateEndpoint();
            try {
                //const parser = new Parser();
                //const expressions = parser.parse(expr);
                //const metricsToPoll = expressions.variables({ withMembers: true });

                let metricsToPoll : string[] = [];
                if (target.format === TargetFormat.Table) {
                    if (!_.every(query.targets, ['format', TargetFormat.Table]))
                        throw {message: "To use the table format, every query of this panel has to be in table format"};
                    // note: this ignores that the endpoint could be different for each query
                    metricsToPoll = query.targets.map((target:any) => target.expr);
                }
                else {
                    metricsToPoll = [expr];
                }

                endpoint.poller.ensurePolling(metricsToPoll);
                let queryResult = endpoint.datastore.queryMetrics(metricsToPoll, options.range.from.valueOf(), options.range.to.valueOf());
                panelData.push(...this.transformations.transform(queryResult, target));

                if (target.format === TargetFormat.Table) {
                    break;
                }
            }
            catch (error) {
                // catch all exceptions and add the refId of the panel
                error.refId = target.refId;
                throw error;
            }
        }

        return { data: panelData };

/*

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
        const endpoint = this.getConfiguredEndpoint();
        const container = endpoint.split('::')[1] || null

        const expressions = targets.map(t => t.target).map(t => parser.parse(t))
        const metricsToPoll = utils.flatMap(e => e.variables({ withMembers: true }), expressions)
        this.poller.ensurePolling(endpoint, metricsToPoll)

        const rawCollected = this.poller.collectData(endpoint, metricsToPoll)
        const collected = extensions.transformAfterCollected(rawCollected, container)

        const collectApplied = [] as any

        // oh the for loops

        if (collected[0]) {
            for(const t of targets) {
                // for now we just take the first timeslot as the reference for the series
                const applied = [] as any
                const expr = parser.parse(t.target)
                for(const data of collected[0].datas) {
                    const ts = data[0]
                    const ivout = [] as any
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
        const plotted : any[] = [];

        for(const data of collectApplied) {
            // TODO this looping is a bit O(n^2) but should be ok for proof of concept

            // get a list of all unique instances and carry forward the instance name
            const instances = {}
            data.datas.forEach(d => d[1].forEach(iv => instances[iv.instance] = iv.instanceName))

            for(const instance of Object.keys(instances)) {
                const target = this.targetName(instances, instance, targets, data.metric)

                const datapoints = [] as any // array of: [ value, unix_epoch_ms ]
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
            const rows = [] as any
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
        }*/
    }
//////////
}
