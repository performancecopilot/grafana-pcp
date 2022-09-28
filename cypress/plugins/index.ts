import * as axios from 'axios';
import { execSync } from 'child_process';

/**
 * @type {Cypress.PluginConfig}
 */
export default (on, config) => {
    on('task', {
        async 'grafana:reset'() {
            const resetGrafanaCmd = process.env['RESET_GRAFANA_CMD'];
            execSync(resetGrafanaCmd);

            // wait until Grafana is ready
            const baseUrl = process.env['CYPRESS_BASE_URL'];
            let elapsed = 0;
            while (elapsed < 20000) {
                try {
                    await axios.get(baseUrl, { timeout: 500 });
                    return true;
                } catch {
                    elapsed += 500;
                }
            }
            return false;
        },
    });
};
