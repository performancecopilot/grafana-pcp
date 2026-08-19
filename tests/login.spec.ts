import { test, expect } from '@grafana/plugin-e2e';

test.describe('Grafana', () => {
  test('login', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
  });
});
