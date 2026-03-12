import { test, expect } from '@grafana/plugin-e2e';

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

  test('should auto-complete metric names', async ({ createDataSourceConfigPage, page }) => {
    const configPage = await createDataSourceConfigPage({ type: 'performancecopilot-vector-datasource' });
    await page.getByRole('textbox', { name: 'URL' }).fill('http://localhost:44322');
    await configPage.saveAndTest({ path: '/pmapi/context' });

    await page.goto(`/dashboard/new-with-ds/${configPage.datasource.uid}`);
    await page.getByRole('button', { name: 'Add visualization' }).click();
    await page.getByRole('button', { name: new RegExp(configPage.datasource.name) }).click();

    const editor = page.locator('.monaco-editor textarea');
    await editor.waitFor({ state: 'visible' });
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
