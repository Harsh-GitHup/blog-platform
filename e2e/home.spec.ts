import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('has title and verify homepage content', async ({ page }) => {
    await page.goto('/');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Blogify/);

    // Expect to find a link or text that is known to exist on the home page
    const heading = page.getByRole('heading', { name: /Explore/i }).first();
    await expect(heading).toBeVisible();
  });

  test('should display the hero section', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('should have working navigation links', async ({ page }) => {
    await page.goto('/');
    const exploreLink = page.getByRole('link', { name: /Explore/i, exact: false }).first();
    await expect(exploreLink).toBeVisible();
    await exploreLink.click();
    await expect(page).toHaveURL(/.*\/blog/);
  });
});
