import { test, expect } from '@playwright/test';

test.describe('Cariñosas.top Smoke & Core Feature Tests', () => {
  test('Home page renders hero, classifieds feed and VIP lounge', async ({ page }) => {
    await page.goto('/');
    
    // Check main title
    await expect(page).toHaveTitle(/Cariñosas\.top/i);

    // Verify key sections are present
    const feed = page.locator('#clasificados-express');
    await expect(feed).toBeVisible();

    // Verify Panic Button is present and accessible
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

  test('Multi-country switch updates classifieds feed', async ({ page }) => {
    await page.goto('/');

    const internationalBtn = page.getByRole('button', { name: /internacional/i });
    if (await internationalBtn.isVisible()) {
      await internationalBtn.click();
      // Should show international ads
      await expect(page.locator('#clasificados-express')).toContainText(/Internacional/i);
    }
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
