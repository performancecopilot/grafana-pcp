import { AppPlugin } from '@grafana/data';
import { AppConfig } from './components/appconfig/config';
import { AppSettings } from './components/appconfig/types';
import { Search } from './components/search/Search';

export const plugin = new AppPlugin<AppSettings>()
    .addConfigPage({ id: 'config', title: 'Config', icon: 'cog', body: AppConfig })
    .setRootPage(Search);
