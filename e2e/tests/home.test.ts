import { test, expect } from '@playwright/test';

test('increments count', async ({ page }) => {
  await page.goto('');

  await expect(page.getByText('Hello World!')).toHaveCount(1);
  await page.getByRole('button', { name: 'count is: 0' }).click();
  await expect(page.getByRole('button', { name: 'count is: 1' })).toHaveCount(1);
});
