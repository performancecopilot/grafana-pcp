import { AppPlugin } from '@grafana/data';
import { Search } from './components/search/Search';
import { PCPAppConfigCtrl } from './components/appconfig/config';

export { PCPAppConfigCtrl as ConfigCtrl };

class CustomApp extends AppPlugin<{}> {}

export const plugin = new CustomApp().setRootPage(Search);
