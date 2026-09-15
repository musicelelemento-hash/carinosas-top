import { test, expect } from '@playwright/test';

test.describe('Cariñosas.top Smoke & Core Feature Tests', () => {
  test('Home page renders the feed, nav and panic button', async ({ page }) => {
    await page.goto('/');

    // Check main title
    await expect(page).toHaveTitle(/Cariñosas\.top/i);

    // Key sections present: feed collection + panic button
    const collection = page.locator('#collection');
    await expect(collection).toBeVisible();

    // Panic Button present and accessible
    const panicBtn = page.getByRole('button', { name: /salida rápida/i });
    await expect(panicBtn).toBeVisible();
  });

  test('Panic button redirects to safe page on click', async ({ page }) => {
    await page.goto('/');

    const panicBtn = page.getByRole('button', { name: /salida rápida/i });
    await expect(panicBtn).toBeVisible();

    // Clicking panic button initiates navigation to google
    const navigationPromise = page.waitForURL(/google\.com/);
    await panicBtn.click();
    await navigationPromise;
  });

  test('Turnstile verification API responds correctly', async ({ request }) => {
    // Calling verify endpoint with empty token returns 400
    const response = await request.post('/api/turnstile/verify', {
      data: { token: '' }
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.success).toBe(false);
  });
});
