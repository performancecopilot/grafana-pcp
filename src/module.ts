import { AppPlugin } from '@grafana/data';
import { Search } from './components/search/Search';
import { PCPAppConfigCtrl } from './components/appconfig/config';

export { PCPAppConfigCtrl as ConfigCtrl };

export const plugin = new AppPlugin().setRootPage(Search);
