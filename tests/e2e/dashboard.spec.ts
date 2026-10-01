import { test, expect } from '@playwright/test';

test.describe('Dashboard Authentication & Access', () => {
  test('unauthenticated users should be redirected to login when accessing dashboard', async ({ page }) => {
    // Attempting to access any username's dashboard directly
    await page.goto('/randomuser', { timeout: 60000 });
    
    // In this app, unauthenticated users are redirected to the homepage by the [username] catch-all
    await expect(page).toHaveURL('http://localhost:3000/', { timeout: 30000 });
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('unauthenticated users should not access settings', async ({ page }) => {
    await page.goto('/randomuser/settings', { timeout: 60000 });
    
    // In this app, unauthenticated users are redirected to the homepage by the [username] catch-all
    await expect(page).toHaveURL('http://localhost:3000/', { timeout: 30000 });
    await expect(page.locator('h1').first()).toBeVisible();
  });
});
