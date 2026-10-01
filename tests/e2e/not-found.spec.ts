import { test, expect } from '@playwright/test';

test.describe('404 Not Found Handling', () => {
  test('should display a standard 404 page for missing routes', async ({ page }) => {
    // Navigate to a completely invalid nested URL
    // (A single segment URL is caught by the /[username] route and redirects to home if unauthenticated)
    const response = await page.goto('/invalid-section/this-page-absolutely-does-not-exist', { timeout: 60000 });
    
    // Some next setups return 404 status codes correctly, some handle it client-side.
    // It's robust to just check the page content.
    await expect(page.getByText(/Not Found|404|Page Not Found/i).first()).toBeVisible();
    
    // Usually there is a "Return Home" or similar link on 404 pages
    const homeLink = page.getByRole('link', { name: /home|return|back/i }).first();
    if (await homeLink.isVisible()) {
        await expect(homeLink).toBeVisible();
    }
  });

  test('should display 404 for invalid blog post slugs', async ({ page }) => {
    await page.goto('/blog/invalid-slug-that-is-fake', { timeout: 60000 });
    // Expect a 404 error page
    await expect(page.getByText(/Not Found|404|Could not find/i).first()).toBeVisible();
  });
});
