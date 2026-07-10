import { test, expect, DashboardPage } from '@grafana/plugin-e2e';

test.describe('PCP Vector data source', () => {
  test('should import bundled dashboards', async ({ createDataSourceConfigPage, page }) => {
    await createDataSourceConfigPage({ type: 'performancecopilot-vector-datasource' });
    await page.getByRole('tab', { name: 'Dashboards' }).click();
    await page
      .getByRole('row', { name: /PCP Vector: Host Overview/ })
      .getByRole('button', { name: 'Import' })
      .click();
    await expect(page.getByText(/[Dd]ashboard [Ii]mported/)).toBeVisible();
  });

  test('should auto-complete metric names', async ({
    createDataSourceConfigPage,
    page,
    selectors,
    grafanaVersion,
    request,
  }, testInfo) => {
    const configPage = await createDataSourceConfigPage({ type: 'performancecopilot-vector-datasource' });
    await page.getByPlaceholder('http://localhost:44322').fill('http://localhost:44322');
    await expect(configPage.saveAndTest({ path: '/pmapi/context' })).toBeOK();

    const dashboardPage = new DashboardPage({ page, selectors, grafanaVersion, request, testInfo });
    await dashboardPage.goto();
    const panelEditPage = await dashboardPage.addPanel();
    await panelEditPage.datasource.set(configPage.datasource.name);

    const editor = page.locator('.monaco-editor textarea');
    await editor.waitFor({ state: 'visible' });

    // Wait for datasource to be fully loaded and editor to initialize
    await page.waitForTimeout(2000);

    await editor.click({ force: true });
    await editor.pressSequentially('disk.dev.write_b', { delay: 100 });

    const suggestion = page.locator('.monaco-list-row', { hasText: 'disk.dev.write_bytes' }).first();
    await expect(suggestion).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('Semantics: counter')).toBeVisible();
    await expect(page.getByText('Units: Kbyte')).toBeVisible();
    await expect(page.getByText('per-disk count of bytes written')).toBeVisible();

    await suggestion.press('Enter');
    await expect(editor).toHaveValue('disk.dev.write_bytes');

    // remove '_bytes' and type '_' to open autocomplete again
    for (let i = 0; i < 6; i++) {
      await editor.press('Backspace');
    }
    await editor.pressSequentially('_', { delay: 50 });

    await page.locator('.monaco-list-row', { hasText: 'disk.dev.write_rawactive' }).first().click();
    await expect(editor).toHaveValue('disk.dev.write_rawactive');
  });
});
