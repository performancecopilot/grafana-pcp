import { test, expect } from '@grafana/plugin-e2e';

test.describe('PCP Vector Checklist', () => {
  test('should open the checklist dashboard', async ({ page }) => {
    await page.goto('/d/pcp-vector-checklist');
    await page.waitForLoadState('networkidle');
    await expect(page.getByText('Memory Utilization')).toBeVisible();
  });
});
