import { test, expect } from '@grafana/plugin-e2e';

test.describe('Grafana', () => {
  test('login', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
  });
});
