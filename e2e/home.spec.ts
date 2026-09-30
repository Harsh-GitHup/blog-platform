import { test, expect } from '@playwright/test';

test('has title and verify homepage content', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Blogify/);

  // Expect to find a link or text that is known to exist on the home page
  // The home page has "Explore Articles" based on typical layouts
  const heading = page.getByRole('heading', { name: /Explore/i }).first();
  await expect(heading).toBeVisible();
});
