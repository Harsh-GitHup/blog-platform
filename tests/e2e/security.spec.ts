import { test, expect } from '@playwright/test';

test.describe('Security & Authorization Flows', () => {
  
  test.describe('Protected Routes (Unauthenticated)', () => {
    test('should redirect unauthenticated users away from /janedoe to home', async ({ page }) => {
      await page.goto('/janedoe');
      // Next-Auth middleware/layout should redirect to home page
      await expect(page).toHaveURL('http://localhost:3000/');
    });

    test('should redirect unauthenticated users away from /janedoe/settings to home', async ({ page }) => {
      await page.goto('/janedoe/settings');
      await expect(page).toHaveURL('http://localhost:3000/');
    });

    test('should redirect unauthenticated users away from new post creation to home', async ({ page }) => {
      await page.goto('/janedoe/posts/new');
      await expect(page).toHaveURL('http://localhost:3000/');
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

    test('should allow login with valid seeded credentials and redirect to home', async ({ page }) => {
      await page.goto('/login');
      
      const emailInput = page.getByPlaceholder('name@example.com');
      const passwordInput = page.locator('input[type="password"]');
      const submitButton = page.getByRole('button', { name: /Sign In/i });

      // Using the seeded user we just updated in generate-seed-data.js
      await emailInput.fill('admin@example.com');
      await passwordInput.fill('password123');
      await submitButton.click();

      // Should redirect to home upon successful login
      await page.waitForURL('http://localhost:3000/');
      await expect(page).toHaveURL('http://localhost:3000/');
    });
  });

});
