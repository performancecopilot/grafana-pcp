import { AppPlugin } from '@grafana/data';
import { AppConfig } from './components/appconfig/config';
import { AppSettings } from './components/appconfig/types';
import { App } from './components/app/App';

export const plugin = new AppPlugin<AppSettings>()
    .addConfigPage({ id: 'config', title: 'Config', icon: 'cog', body: AppConfig })
    .setRootPage(App);
