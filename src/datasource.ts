///<reference path="../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />
import _ from 'lodash';
import map from 'lodash/map';
import isObject from 'lodash/isObject';
import isUndefined from 'lodash/isUndefined';

export class PCPDatasource {

  name: string;
  url: string;
  q: any;
  backendSrv: any;
  templateSrv: any;
  withCredentials: boolean;
  headers: any;

  /** @ngInject **/
  constructor(instanceSettings, private $q, backendSrv, templateSrv) {
    this.name = instanceSettings.name;
    this.url = instanceSettings.url;
    this.q = $q;
    this.backendSrv = backendSrv;
    this.templateSrv = templateSrv;
    this.withCredentials = instanceSettings.withCredentials;
    this.headers = { 'Content-Type': 'application/json' };
    if (typeof instanceSettings.basicAuth === 'string' && instanceSettings.basicAuth.length > 0) {
      this.headers['Authorization'] = instanceSettings.basicAuth;
    }
  }

  queryPost(options) {
    // query using a POST - has query for all panel refIDs in the one POST request
    const query = options;
    query.targets = this.buildQueryTargets(options);

    if (query.targets.length <= 0) {
      return this.q.when({ data: [] });
    }

    if (this.templateSrv.getAdhocFilters) {
      query.adhocFilters = this.templateSrv.getAdhocFilters(this.name);
    } else {
      query.adhocFilters = [];
    }

    // options.scopedVars = { ...this.getVariables(), ...options.scopedVars };

    return this.doRequest({
      url: this.url + '/grafana/query',
      data: query,
      method: 'POST',
    });
  }

  async query(options) {
    // query using an array of GETs, one panel refId per URL
    const queries: any = [];
    const query = options;
    query.targets = this.buildQueryTargets(options);
    var tzparam = "UTC";

    if (query.targets.length <= 0) {
      return this.q.when({ data: [] });
    }
    for (let i=0; i < query.targets.length; i++) {
      queries.push(query.targets[i]);
      console.log("DEBUG query.targets["+i+"]="+JSON.stringify(query.targets[i]));
    }

    if (this.templateSrv.getAdhocFilters) {
      query.adhocFilters = this.templateSrv.getAdhocFilters(this.name);
    } else {
      query.adhocFilters = [];
    }

    if (query.timezone == "browser")
    	tzparam = Intl.DateTimeFormat().resolvedOptions().timeZone;

    //
    // refIds (panel queries)
    //
    var urls = new Array(query.targets.length);
    for (let i=0; i < query.targets.length; i++) {
      urls[i] = this.url + '/grafana/query' + '?refId=' + query.targets[i].refId +
	'&panelId=' + query.panelId + '&dashboardId=' + query.dashboardId +
	'&timezone=' + tzparam + '&maxdatapoints=' + query.maxDataPoints +
	'&start=' + Math.round(query.range.from/1000) + '&finish=' + Math.round(query.range.to/1000) +
	// '&intervalms=' + query.intervalMs +
	// '&interval=' + query.interval + '&expr=' + encodeURIComponent(query.targets[i].target);
	'&interval=' + query.interval + '&expr=' + query.targets[i].target;
    }

    // Promise.all returns when all async URL fetches have completed, at which
    // time the results array is available to pass back to grafana.
    let results: any = []
    let requests = urls.map(url => this.fetchURL(url));
    let sts = await Promise.all(requests)
    .then(responses => {
	for (let response of responses) {
	  results.push(response[0]);
	}
      })

    // console.log("DEBUG RESULTS len="+results.length+" value=" + JSON.stringify(results));

    //
    for (let r=0; r < results.length; r++) {
      if (query.targets[r].isCounter) {
	// Client side rate conversion for counters
	console.log("RATE CONVERTING query["+r+"] target="+query.targets[r].target);
	let pd = results[r].datapoints[0][0];
	let pt = results[r].datapoints[0][1];
	for (let i=1; i < results[r].datapoints.length; i++) {
	  let d = results[r].datapoints[i][0];
	  let t = results[r].datapoints[i][1];
	  // timestamps are in ms, we dont know the data units though.
	  // For now, we assume count/second
	  // TODO, use correct scaling from the metric metadata
	  let delta = (t - pt) / 1000.0; // time delta in seconds
	  if (delta > 0.0)
	      results[r].datapoints[i][0] = (d - pd) / delta;
	    else
	      results[r].datapoints[i][0] = null; // undefined
	  pd = d;
	  pt = t;
	  // console.log("RESULTS " +results[r].target +"[" +r +"][" +i +"][" +d +"," +t +"] = " + results[r].datapoints[i][0]);
	}
	results[r].datapoints[0][0] = null; // no previous sample
      }
    }

    return { data: results }
  }

  fetchURL(url: string) {
    var sts;
    console.log("fetchURL=" + url);
    sts = this.doRequest({
      url: url,
      method: 'GET',
    }).then((result) => {
      return result.data;
    });
    return sts;
  }

  testDatasource() {
    return this.doRequest({
      url: this.url + '/grafana',
      method: 'GET',
    }).then((response) => {
      if (response.status === 200) {
        return { status: 'success', message: 'PCP Data source is working', title: 'Success' };
      }

      return {
        status: 'error',
        message: 'PCP Data source is not working: ' + response.message, title: 'Error',
      };
    });
  }

  annotationQuery(options) {
    const query = this.templateSrv.replace(options.annotation.query, {}, 'glob');

    const annotationQuery = {
      annotation: {
        query,
        name: options.annotation.name,
        datasource: options.annotation.datasource,
        enable: options.annotation.enable,
        iconColor: options.annotation.iconColor,
      },
      range: options.range,
      rangeRaw: options.rangeRaw,
      variables: this.getVariables(),
    };

    return this.doRequest({
      url: this.url + '/grafana/annotations',
      method: 'POST',
      data: annotationQuery,
    }).then((result) => {
      return result.data;
    });
  }

  metricFindQuery(query) {
    const interpolated = {
      target: this.templateSrv.replace(query, null, 'regex'),
    };

    return this.doRequest({
      url: this.url + '/grafana/search?target='+query+'*',
      method: 'GET',
    }).then((result) => {
      return result.data;
    });
  }

  mapToTextValue(result) {
    return map(result.data, (d, i) => {
      if (d && d.text && d.value) {
        return { text: d.text, value: d.value };
      }

      if (isObject(d)) {
        return { text: d, value: i };
      }
      return { text: d, value: d };
    });
  }

  doRequest(options) {
    options.withCredentials = this.withCredentials;
    options.headers = this.headers;

    return this.backendSrv.datasourceRequest(options);
  }

  buildQueryTargets(options) {
    return options.targets
      .filter((target) => {
        // remove placeholder targets
        return target.target !== 'select metric';
      })
      .map((target) => {
        let data = target.data;

        if (typeof data === 'string' && data.trim() === '') {
          data = null;
        }

        if (data) {
          data = JSON.parse(data);
        }

        return {
          data,
          target: this.templateSrv.replace(target.target, options.scopedVars, 'regex'),
          refId: target.refId,
          hide: target.hide,
          type: target.type,
	  isCounter: target.isCounter,
        };
      });
  }

  getVariables() {
    const index = isUndefined(this.templateSrv.index) ? {} : this.templateSrv.index;
    const variables = {};
    Object.keys(index).forEach((key) => {
      const variable = index[key];
      variables[variable.name] = {
        text: variable.current.text,
        value: variable.current.value,
      };
    });

    return variables;
  }

  getTagKeys(options) {
    return new Promise((resolve, reject) => {
      this.doRequest({
        url: this.url + '/grafana/tag-keys',
        method: 'POST',
        data: options,
      }).then((result) => {
        return resolve(result.data);
      });
    });
  }

  getTagValues(options) {
    return new Promise((resolve, reject) => {
      this.doRequest({
        url: this.url + '/grafana/tag-values',
        method: 'POST',
        data: options,
      }).then((result) => {
        return resolve(result.data);
      });
    });
  }

}
