import { test, expect } from '@playwright/test';

test.describe('Editor and Post Creation (Unauthenticated)', () => {
    test('should redirect unauthenticated users away from the new post page', async ({ page }) => {
        // Try to access the new post page directly
        await page.goto('/janedoe/posts/new', { timeout: 60000 });
        
        // Ensure redirected to home
        await expect(page).toHaveURL('http://localhost:3000/', { timeout: 30000 });
        await expect(page.locator('h1').first()).toBeVisible();
    });

    test('should redirect unauthenticated users away from edit post page', async ({ page }) => {
        // Try to access an edit page directly
        await page.goto('/janedoe/posts/123/edit', { timeout: 60000 });
        
        // Ensure redirected to home
        await expect(page).toHaveURL('http://localhost:3000/', { timeout: 30000 });
    });
});
