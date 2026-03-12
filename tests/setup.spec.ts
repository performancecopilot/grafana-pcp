import { test, expect } from '@grafana/plugin-e2e';

test.describe('grafana-pcp setup', () => {
  test('should install grafana-pcp', async ({ request }) => {
    const response = await request.post('/api/plugins/performancecopilot-pcp-app/settings', {
      data: { enabled: true, pinned: true },
    });
    await expect(response).toBeOK();
  });

  test('should setup PCP Valkey data source', async ({ createDataSourceConfigPage, page }) => {
    const configPage = await createDataSourceConfigPage({ type: 'performancecopilot-valkey-datasource' });
    await page.getByRole('textbox', { name: 'URL' }).fill('http://localhost:44322');
    await expect(configPage.saveAndTest()).toBeOK();
  });

  test('should setup PCP Vector data source', async ({ createDataSourceConfigPage, page }) => {
    const configPage = await createDataSourceConfigPage({ type: 'performancecopilot-vector-datasource' });
    await page.getByRole('textbox', { name: 'URL' }).fill('http://localhost:44322');
    await expect(configPage.saveAndTest({ path: '/pmapi/context' })).toBeOK();
  });

  test('should setup PCP bpftrace data source', async ({ createDataSourceConfigPage, page }) => {
    const configPage = await createDataSourceConfigPage({ type: 'performancecopilot-bpftrace-datasource' });
    await page.getByRole('textbox', { name: 'URL' }).fill('http://localhost:44322');
    await expect(configPage.saveAndTest({ path: '/pmapi/context' })).toBeOK();
  });
});
