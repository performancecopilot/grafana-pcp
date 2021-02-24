const GRAFANA_URL = process.env['GRAFANA_URL'];
// jest.setTimeout(60000);
// await page.screenshot({ path: "example.png" });

describe('setup grafana-pcp', () => {
    beforeAll(async () => {
        await page.setViewport({ width: 1920, height: 1080 });
    });

    it('should install grafana-pcp', async () => {
        // plugin page, not enabled
        await page.goto(`${GRAFANA_URL}/plugins/performancecopilot-pcp-app/`);
        await page.waitForSelector('button');
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
            page.click('button'),
        ]);

        // plugin page, enabled
        await expect(page.title()).resolves.toMatch('Performance Co-Pilot: Performance Co-Pilot - Grafana');
        await expect(page).toMatchElement('button', { text: 'Disable' });
    });

    it('should setup PCP Redis datasource', async () => {
        // new datasource page
        await page.goto(`${GRAFANA_URL}/datasources/new`);
        await page.waitForSelector('div[aria-label*="PCP Redis"]');
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
            page.click('div[aria-label*="PCP Redis"]'),
        ]);

        // new datasource settings
        await page.type('input[placeholder="http://localhost:44322"]', 'http://localhost:44322');
        await Promise.all([
            page.waitForTimeout(1000), // page.waitForNavigation({ waitUntil: 'networkidle0' }),
            page.click('button[type=submit]'),
        ]);

        // new datasource saved
        const alerts = await page.$$('div[aria-label*="Alert"]'); // datasource saved (top right) & datasource health test (bottom) alerts
        const datasourceHealthAlert = alerts[alerts.length-1];
        await expect(datasourceHealthAlert).toMatch("http://localhost:44322/series/ping");
        await expect(datasourceHealthAlert).toMatch("connection refused");
    });
});
