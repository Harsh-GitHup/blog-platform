import { test, expect } from '@playwright/test';

test.describe('Dashboard Authentication & Access', () => {
  test('unauthenticated users should be redirected to login when accessing dashboard', async ({ page }) => {
    // Attempting to access any username's dashboard directly
    await page.goto('/randomuser');
    
    // Some implementations redirect to login, some show a 404/unauthorized
    // We expect either a redirect to login OR a Not Found/Unauthorized message
    const url = page.url();
    if (url.includes('/login')) {
      await expect(page.getByRole('heading', { name: /Sign in/i })).toBeVisible();
    } else {
      // If it doesn't redirect, it should show an error page (404/401)
      await expect(page.getByText(/Not Found|Unauthorized|Sign in required/i).first()).toBeVisible();
    }
  });

  test('unauthenticated users should not access settings', async ({ page }) => {
    await page.goto('/randomuser/settings');
    const url = page.url();
    if (url.includes('/login')) {
      await expect(page.getByRole('heading', { name: /Sign in/i })).toBeVisible();
    } else {
      await expect(page.getByText(/Not Found|Unauthorized|Sign in required/i).first()).toBeVisible();
    }
  });
});
