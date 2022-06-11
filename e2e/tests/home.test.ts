import { test, expect } from '@playwright/test';

test('increments count', async ({ page }) => {
  await page.goto('');

  await expect(page.locator('text=Hello Vite + React!')).toHaveCount(1);
  await page.locator('role=button[name="count is: 0"]').click();
  await expect(page.locator('role=button[name="count is: 1"]')).toHaveCount(1);
});
