import { test, expect } from '@grafana/plugin-e2e';

test.describe('PCP Metric Search', () => {
  // The search page reuses the PCP Valkey data source URL as its API base, so a
  // PCP Valkey data source must exist before the search form will render.
  // createDataSourceConfigPage deletes the data source it creates at the end of
  // each test, so (unlike the one from setup.spec.ts) it does not persist into
  // this project -- each test must create its own.
  test.beforeEach(async ({ createDataSourceConfigPage, page }) => {
    const configPage = await createDataSourceConfigPage({ type: 'performancecopilot-valkey-datasource' });
    await page.getByPlaceholder('http://localhost:44322').fill('http://localhost:44322');
    await expect(configPage.saveAndTest()).toBeOK();
  });

  test('should render the search page', async ({ page }) => {
    // The app root page is the Full-Text Metric Search UI.
    await page.goto('/a/performancecopilot-pcp-app');
    await page.waitForLoadState('networkidle');

    // The search form should render.
    await expect(page.locator('[data-test="text-input"]')).toBeVisible();
    await expect(page.locator('[data-test="submit-button"]')).toBeVisible();

    // Entity filters for metrics, instances and instance domains.
    await expect(page.locator('[data-test="metrics-toggle"]')).toBeVisible();
    await expect(page.locator('[data-test="instances-toggle"]')).toBeVisible();
    await expect(page.locator('[data-test="indoms-toggle"]')).toBeVisible();
  });

  test('should run a search query', async ({ page }) => {
    await page.goto('/a/performancecopilot-pcp-app');
    await page.waitForLoadState('networkidle');

    await page.locator('[data-test="text-input"]').fill('disk');
    await page.locator('[data-test="submit-button"]').click();
    await page.waitForLoadState('networkidle');

    // Depending on whether pmproxy has the pmsearch index built, we either see
    // results or the "not available"/"no results" message. Either way the app
    // must not crash and should still show the search form.
    await expect(page.locator('[data-test="text-input"]')).toBeVisible();
  });
});
