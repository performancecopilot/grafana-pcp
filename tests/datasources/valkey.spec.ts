import { test, expect, DashboardPage } from '@grafana/plugin-e2e';

test.describe('PCP Valkey data source', () => {
  test('should import bundled dashboards', async ({ createDataSourceConfigPage, page }) => {
    await createDataSourceConfigPage({ type: 'performancecopilot-valkey-datasource' });
    await page.getByRole('tab', { name: 'Dashboards' }).click();
    await page
      .getByRole('row', { name: /PCP Valkey: Host Overview/ })
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
    // Cover datasource/editor setup plus both pickSuggestion retry windows
    // (2 x 30s) -- well above Playwright's default 30s per-test timeout, which
    // would otherwise kill the test mid-retry on slow CI.
    test.setTimeout(120000);

    const configPage = await createDataSourceConfigPage({ type: 'performancecopilot-valkey-datasource' });
    await page.getByPlaceholder('http://localhost:44322').fill('http://localhost:44322');
    await expect(configPage.saveAndTest()).toBeOK();

    const dashboardPage = new DashboardPage({ page, selectors, grafanaVersion, request, testInfo });
    await dashboardPage.goto();
    const panelEditPage = await dashboardPage.addPanel();
    await panelEditPage.datasource.set(configPage.datasource.name);

    const editor = page.locator('.monaco-editor textarea');
    await editor.waitFor({ state: 'visible' });

    // Type a query fragment and surface the suggestion for `metric`. The whole
    // interaction is retried because Monaco's suggest widget can transiently
    // fail to open (debounce/re-render timing, worse on slow CI) -- each attempt
    // clears the editor, retypes, and re-checks, which is far more robust than a
    // single long wait on one keystroke sequence.
    const pickSuggestion = async (fragment: string, metric: string) => {
      const suggestion = page.locator('.monaco-list-row', { hasText: metric }).first();
      await expect(async () => {
        await editor.click({ force: true });
        await editor.press('Control+a');
        await editor.press('Delete');
        await editor.pressSequentially(fragment, { delay: 100 });
        // Explicitly open the suggest widget: on some Grafana/Monaco versions
        // (observed on grafana:latest) the auto-trigger on typing does not fire,
        // leaving the suggestion list closed.
        await editor.press('Control+Space');
        await expect(suggestion).toBeVisible({ timeout: 5000 });
      }).toPass({ timeout: 30000 });
      return suggestion;
    };

    const bytes = await pickSuggestion('disk.dev.write_b', 'disk.dev.write_bytes');
    await bytes.press('Enter');
    await expect(editor).toHaveValue('disk.dev.write_bytes');

    const rawactive = await pickSuggestion('disk.dev.write_r', 'disk.dev.write_rawactive');
    await rawactive.click();
    await expect(editor).toHaveValue('disk.dev.write_rawactive');
  });
});
