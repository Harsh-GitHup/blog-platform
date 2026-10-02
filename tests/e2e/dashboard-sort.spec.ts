import { test, expect } from '@playwright/test';

test.describe('Dashboard Sorting & Search Params (Unauthenticated)', () => {
    test('should prevent unauthenticated access to posts page with sort parameters', async ({ page }) => {
        // Attempting to access any username's dashboard posts directly with sort params
        await page.goto('/janedoe/posts?sort=title&dir=asc', { timeout: 60000 });
        
        // In this app, unauthenticated users are redirected to the homepage
        await expect(page).toHaveURL('http://localhost:3000/', { timeout: 30000 });
    });
});
