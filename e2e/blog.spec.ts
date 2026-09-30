import { test, expect } from '@playwright/test';

test.describe('Blog Page Flows', () => {
  test('should load the main blog page', async ({ page }) => {
    await page.goto('/blog');
    
    // The blog page should have a heading for the articles
    const heading = page.getByRole('heading', { name: /All Articles/i });
    await expect(heading).toBeVisible();
    
    // We should see a search or filter input
    const searchInput = page.getByPlaceholder(/Search articles/i);
    await expect(searchInput).toBeVisible();
  });

  test('should navigate from home to blog page', async ({ page }) => {
    await page.goto('/');
    
    const blogLink = page.getByRole('link', { name: /blog|articles/i }).first();
    await blogLink.click();
    
    await expect(page).toHaveURL(/.*\/blog/);
  });
});
