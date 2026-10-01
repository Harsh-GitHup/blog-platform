import { test, expect } from '@playwright/test';

test.describe('Authentication Flows', () => {
  test('should navigate to the login page', async ({ page }) => {
    await page.goto('/');
    
    // Find the login link and click it (handles responsive menu or direct link)
    const loginLink = page.getByRole('link', { name: /log in|login/i }).first();
    await expect(loginLink).toBeVisible();
    await loginLink.click();
    
    // Expect URL to be /login and see sign in heading
    await expect(page).toHaveURL(/.*\/login/);
    const heading = page.getByRole('heading', { name: /Sign in to your account|Welcome Back/i });
    await expect(heading).toBeVisible();
  });

  test('should navigate to the register page', async ({ page }) => {
    await page.goto('/');
    
    // Click register/signup link
    const registerLink = page.getByRole('link', { name: /register|sign up|get started/i }).first();
    if (await registerLink.isVisible()) {
        await registerLink.click();
        await expect(page).toHaveURL(/.*\/register/);
        const heading = page.getByRole('heading', { name: /Create an account|Create Account/i });
        await expect(heading).toBeVisible();
    }
  });


  test('should display login page form fields', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByPlaceholder('name@example.com')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.getByRole('button', { name: /Sign In/i })).toBeVisible();
  });

  test('should display register page form fields', async ({ page }) => {
    await page.goto('/register');
    await expect(page.getByPlaceholder('John Doe').first()).toBeVisible();
    await expect(page.getByPlaceholder('name@example.com')).toBeVisible();
    await expect(page.getByPlaceholder('johndoe123')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });
});
