import { test, expect } from '@playwright/test';

test.describe('Information & Legal Pages', () => {
  test('should load the about page', async ({ page }) => {
    await page.goto('/about');
    await expect(page).toHaveURL(/.*\/about/);
    await expect(page.getByRole('heading', { name: /About/i }).first()).toBeVisible();
  });

  test('should load the contact page', async ({ page }) => {
    await page.goto('/contact');
    await expect(page).toHaveURL(/.*\/contact/);
    await expect(page.getByRole('heading', { name: /Contact/i }).first()).toBeVisible();
  });

  test('should load the privacy policy', async ({ page }) => {
    await page.goto('/privacy');
    await expect(page).toHaveURL(/.*\/privacy/);
    await expect(page.getByRole('heading', { name: /Privacy/i }).first()).toBeVisible();
  });

  test('should load the terms of service', async ({ page }) => {
    await page.goto('/terms');
    await expect(page).toHaveURL(/.*\/terms/);
    await expect(page.getByRole('heading', { name: /Terms/i }).first()).toBeVisible();
  });
});
