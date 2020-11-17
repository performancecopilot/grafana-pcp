import { AppPlugin } from '@grafana/data';
import { PCPAppConfigCtrl } from './components/appconfig/config';
import { Search } from './components/search/Search';

export { PCPAppConfigCtrl as ConfigCtrl };

class CustomApp extends AppPlugin<{}> {}

export const plugin = new CustomApp().setRootPage(Search);
