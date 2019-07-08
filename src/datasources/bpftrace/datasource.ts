///<reference path="../../../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />
import _ from 'lodash';
import PCPContext from './PCPContext';
import Poller from './poller';
import DataStore from './datastore';

export class PCPBPFtraceDatasource {

  name: string;
  url: string;
  q: any;
  backendSrv: any;
  templateSrv: any;
  variableSrv: any;
  withCredentials: boolean;
  headers: any;
  datastore: DataStore;
  poller: Poller;

  /** @ngInject **/
  constructor(instanceSettings, $q, backendSrv, templateSrv, variableSrv) {
    this.name = instanceSettings.name;
    this.url = instanceSettings.url;
    this.q = $q;
    this.backendSrv = backendSrv;
    this.templateSrv = templateSrv;
    this.variableSrv = variableSrv;
    this.withCredentials = instanceSettings.withCredentials;
    this.headers = { 'Content-Type': 'application/json' };
    if (typeof instanceSettings.basicAuth === 'string' && instanceSettings.basicAuth.length > 0) {
      this.headers['Authorization'] = instanceSettings.basicAuth;
    }

    this.datastore = new DataStore();
    PCPContext.datasourceRequest = this.doRequest.bind(this);
    this.poller = new Poller(this.datastore);
  }

  async query(options: any) {
    const query = options;
    if (query.targets.length == 0) {
      return { data: [] };
    }

    if (this.templateSrv.getAdhocFilters) {
      query.adhocFilters = this.templateSrv.getAdhocFilters(this.name);
    } else {
      query.adhocFilters = [];
    }

    const vars = this.getVariables();
    // TODO: url of target => url variable of dashboard => url setting of datasource
    let targetedMetrics : string[] = [];
    for(let target of query.targets) {
      if (!target.hide) {
        targetedMetrics.push(await this.poller.ensurePolling(this.url, target.script));
      }
    }
 
    return { data: this.datastore.query(this.url, targetedMetrics) };
  }

  async testDatasource() {
    let pcpContext = new PCPContext(this.url, null);
    try {  
      await pcpContext.createContext();
      return { status: 'success', message: "Data source is working", title: "Success" };
    }
    catch(error) {
      return {
        status: 'error',
        message: `Cannot connect to ${pcpContext.url}`,
        title: 'Error',
      };
    }
  }

  async metricFindQuery(query) {
    return [];
  }

  async doRequest(options: any) {
    options.withCredentials = this.withCredentials;
    options.headers = this.headers;

    return await this.backendSrv.datasourceRequest(options);
  }

  getVariables(): any {
    const variables = {};
    if (!this.variableSrv.variables) {
        // variables are not defined on the datasource settings page
        return {};
    }

    for (let variable of this.variableSrv.variables) {
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
    }

    return variables;
  }
}
