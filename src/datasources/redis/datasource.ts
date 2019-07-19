///<reference path="../../../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />
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

    async query(options) {
        // query using an array of GETs, one panel refId per URL
        const queries: any = [];
        const query = options;
        query.targets = this.buildQueryTargets(options);
        var tzparam = "UTC";

        if (query.targets.length <= 0) {
            return this.q.when({ data: [] });
        }

        for (let i = 0; i < query.targets.length; i++) {
            queries.push(query.targets[i]);
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
        /*var urls = new Array(query.targets.length);
        for (let i = 0; i < query.targets.length; i++) {
            urls[i] = this.url + '/series/query' + '?refId=' + query.targets[i].refId +
                '&panelId=' + query.panelId + '&dashboardId=' + query.dashboardId +
                '&timezone=' + tzparam + '&maxdatapoints=' + query.maxDataPoints +
                '&start=' + Math.round(query.range.from / 1000) + '&finish=' + Math.round(query.range.to / 1000) +
                // '&intervalms=' + query.intervalMs +
                // '&interval=' + query.interval + '&expr=' + encodeURIComponent(query.targets[i].target);
                '&interval=' + query.interval + '&expr=' + query.targets[i].target;
        }*/

        let series: Promise<any>[] = [];
        for (const target of query.targets) {
            series.push(this.doRequest({
                url: `${this.url}/series/query?expr=${target.target}`
            }).then(result => result.data));
        }

        let seriesResults = await Promise.all(series);
        seriesResults = _.flatten(seriesResults);

        const start = Math.round(query.range.from / 1000);
        const finish = Math.round(query.range.to / 1000);
	const samples = Math.round((query.range.to - query.range.from) / query.intervalMs);
	const interval = query.interval;
	const refId = query.targets[0].refId; // TODO multiple targets
	const mdp = query.maxDataPoints;
	let url = `${this.url}/series/values?series=${seriesResults.join(',')}&refId=${refId}&start=${start}&samples=${samples}&interval=${interval}&maxdatapoints=${mdp}&zone=${tzparam}`;

	console.log("DEBUG URL " + JSON.stringify(url));

        let metricValues = await this.doRequest({
            url: url
        });
        metricValues = metricValues.data;

        // TODO: multiple targets and instances
        let target = {
	    // TODO subsitutions in target for query.targets[r].legend, template {{variable}} and {{label}}
            target: query.targets[0].target,
            datapoints: metricValues.map(metricValue => [parseFloat(metricValue.value), this.round(metricValue.timestamp,1)])
        }

	let ret = {
            data: [target]
        };

        console.log("DEBUG returning " + JSON.stringify(ret));
        return ret;

        /*
        console.log("DEBUG RESULTS len=" + results.length + " value=" + JSON.stringify(results));

        for (let r = 0; r < results.length; r++) {
            if (query.targets[r].legend)
                results[r].target = query.targets[r].legend; // TODO template subs
        }

        //
        for (let r = 0; r < results.length; r++) {
            if (query.targets[r].isCounter) {
                // Client side rate conversion for counters
                console.log("RATE CONVERTING query[" + r + "] target=" + query.targets[r].target);
                let pd = results[r].datapoints[0][0];
                let pt = results[r].datapoints[0][1];
                for (let i = 1; i < results[r].datapoints.length; i++) {
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
        */
    }

    round(value, precision) {
	var multiplier = Math.pow(10, precision || 0);
	return Math.round(value * multiplier) / multiplier;
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
            url: this.url + '/series/ping',
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
            url: this.url + '/grafana/search?target=' + query + '*',
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
                    legend: target.legend, // TODO replace each {{label}} with the label value
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
