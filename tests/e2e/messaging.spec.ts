import { test, expect } from '@playwright/test';

test.describe('Messaging', () => {
  test('should redirect to login when unauthenticated', async ({ page }) => {
    await page.goto('/messages');
    await expect(page).toHaveURL(/\/login/);
  });
});
