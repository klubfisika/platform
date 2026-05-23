import { test, expect } from '@playwright/test';

test.describe('Notifications', () => {
  test('should redirect to login when unauthenticated', async ({ page }) => {
    await page.goto('/overview');
    await expect(page).toHaveURL(/\/login/);
  });
});
