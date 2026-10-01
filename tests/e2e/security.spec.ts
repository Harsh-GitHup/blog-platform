import { test, expect } from '@playwright/test';

test.describe('Security & Authorization Flows', () => {
  
  test.describe('Protected Routes (Unauthenticated)', () => {
    test('should redirect unauthenticated users away from /janedoe to /login', async ({ page }) => {
      await page.goto('/janedoe');
      // Next-Auth middleware should redirect to signin/login page
      await expect(page).toHaveURL(/.*\/login/);
    });

    test('should redirect unauthenticated users away from /janedoe/settings to /login', async ({ page }) => {
      await page.goto('/janedoe/settings');
      await expect(page).toHaveURL(/.*\/login/);
    });

    test('should redirect unauthenticated users away from new post creation to /login', async ({ page }) => {
      await page.goto('/janedoe/posts/new');
      await expect(page).toHaveURL(/.*\/login/);
    });
  });

  test.describe('Authentication Security', () => {
    test('should reject login with invalid credentials', async ({ page }) => {
      await page.goto('/login');
      
      const emailInput = page.getByPlaceholder('name@example.com');
      const passwordInput = page.locator('input[type="password"]');
      const submitButton = page.getByRole('button', { name: /Sign In/i });

      await emailInput.fill('invalid@example.com');
      await passwordInput.fill('wrongpassword');
      await submitButton.click();

      // Assuming there is an error message or toast for invalid login
      // Wait a moment for network response
      await page.waitForTimeout(1000); 
      // User should still be on login page
      await expect(page).toHaveURL(/.*\/login/);
    });

    test('should allow login with valid seeded credentials and access dashboard', async ({ page }) => {
      await page.goto('/login');
      
      const emailInput = page.getByPlaceholder('name@example.com');
      const passwordInput = page.locator('input[type="password"]');
      const submitButton = page.getByRole('button', { name: /Sign In/i });

      // Using the seeded user we just updated in generate-seed-data.js
      await emailInput.fill('admin@example.com');
      await passwordInput.fill('password123');
      await submitButton.click();

      // Should redirect to dashboard upon successful login
      await page.waitForURL('**/janedoe**');
      await expect(page).toHaveURL(/.*\/janedoe/);
      
      // Verify user can now see dashboard content
      const heading = page.getByRole('heading', { name: /Dashboard Overview/i }).first();
      await expect(heading).toBeVisible();
    });
  });

});
