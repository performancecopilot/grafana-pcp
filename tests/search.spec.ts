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
    // The pmsearch FTS index is built shortly after pmproxy starts, so allow a
    // retry window below, with a per-test timeout comfortably above it.
    test.setTimeout(120000);

    await page.goto('/a/performancecopilot-pcp-app');
    await page.waitForLoadState('networkidle');

    // Submit "disk" and wait for a successful /search/text response, retrying
    // while the index is still being built. Validating the response (not just
    // the rendered element) makes an unreachable or erroring search backend fail
    // with a clear message instead of a vague "element not found" only after the
    // whole retry window elapses.
    await expect(async () => {
      await page.locator('[data-test="text-input"]').fill('disk');
      const responsePromise = page.waitForResponse((r) => r.url().includes('/search/text'), {
        timeout: 10000,
      });
      await page.locator('[data-test="submit-button"]').click();
      expect((await responsePromise).ok()).toBeTruthy();
    }).toPass({ timeout: 90000 });

    // "disk.*" metrics always exist, so a successful response must render
    // results. Short timeouts here so a UI regression fails fast rather than
    // relying on the retry window above.
    await expect(page.locator('[data-test="total"]')).toBeVisible();
    await expect(page.locator('[data-test="name"]').first()).toBeVisible();
  });
});
