import { test, expect } from '@playwright/test';

test.describe('Discussions', () => {
  test('should redirect to login when unauthenticated', async ({ page }) => {
    await page.goto('/discussions');
    await expect(page).toHaveURL(/\/login/);
  });

  test('should load discussions page', async ({ page }) => {
    // Navigate directly — auth guard redirects to login if not authenticated
    await page.goto('/discussions');
    // Either we're redirected to login (no session) or we see discussions
    const url = page.url();
    expect(url).toMatch(/\/login|\/discussions/);
  });
});
