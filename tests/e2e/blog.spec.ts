import { test, expect } from '@playwright/test';

test.describe('Blog Page Flows', () => {
  test('should load the main blog page', async ({ page }) => {
    await page.goto('/blog');
    
    // The blog page should have a heading for the articles
    const heading = page.getByRole('heading', { name: /Explore All Articles/i });
    await expect(heading).toBeVisible();
  });

  test('should navigate from home to blog page', async ({ page }) => {
    await page.goto('/');
    
    // In Navbar it's "Explore Articles" or "Explore"
    const blogLink = page.getByRole('link', { name: /explore articles|explore/i }).first();
    await blogLink.click();
    
    await expect(page).toHaveURL(/.*\/blog/);
  });

  test('should display the blog page and articles section grid', async ({ page }) => {
    await page.goto('/blog');
    await expect(page.locator('h1')).toContainText('Explore All Articles');
    
    // Check if grid exists (articles present) OR empty state exists
    const gridExists = await page.locator('.grid').count();
    if (gridExists > 0) {
      await expect(page.locator('.grid').first()).toBeVisible();
    } else {
      await expect(page.getByText(/No published articles found/i).first()).toBeVisible();
    }
  });
});
