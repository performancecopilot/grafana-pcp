import { test, expect } from '@grafana/plugin-e2e';

test.describe('grafana-pcp setup', () => {
  test('should install grafana-pcp', async ({ request, page }) => {
    const response = await request.post('/api/plugins/performancecopilot-pcp-app/settings', {
      data: { enabled: true, pinned: true },
    });
    await expect(response).toBeOK();

    // Navigate to home to trigger dialog, then close it (Grafana 13+)
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Close "What's new" dialog if present
    const closeButton = page.getByRole('button', { name: 'Close' });
    try {
      if (await closeButton.isVisible({ timeout: 3000 })) {
        await closeButton.click();
        await page.waitForTimeout(500); // Wait for dialog animation
      }
    } catch {
      // Dialog not present, continue
    }
  });

  test('should setup PCP Valkey data source', async ({ createDataSourceConfigPage, page }) => {
    const configPage = await createDataSourceConfigPage({ type: 'performancecopilot-valkey-datasource' });
    await page.getByPlaceholder('http://localhost:44322').fill('http://localhost:44322');
    await expect(configPage.saveAndTest()).toBeOK();
  });

  test('should setup PCP Vector data source', async ({ createDataSourceConfigPage, page }) => {
    const configPage = await createDataSourceConfigPage({ type: 'performancecopilot-vector-datasource' });
    await page.getByPlaceholder('http://localhost:44322').fill('http://localhost:44322');
    await expect(configPage.saveAndTest({ path: '/pmapi/context' })).toBeOK();
  });

  test('should setup PCP bpftrace data source', async ({ createDataSourceConfigPage, page }) => {
    const configPage = await createDataSourceConfigPage({ type: 'performancecopilot-bpftrace-datasource' });
    await page.getByPlaceholder('http://localhost:44322').fill('http://localhost:44322');
    await expect(configPage.saveAndTest({ path: '/pmapi/context' })).toBeOK();
  });
});
