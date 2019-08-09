import { PCPAppConfigCtrl } from './components/config/config';
import { loadPluginCss } from 'grafana/app/plugins/sdk';

loadPluginCss({
    dark: 'plugins/performancecopilot-pcp-app/css/dark.css',
    light: 'plugins/performancecopilot-pcp-app/css/light.css'
});

export {
    PCPAppConfigCtrl as ConfigCtrl,
};
