import { test, expect } from '@playwright/test';

test('connexion admin fonctionne', async ({ page }) => {
  const email = process.env.ADMIN_EMAIL!;
  const password = process.env.ADMIN_PASSWORD!;

  console.log("ADMIN_EMAIL =", process.env.ADMIN_EMAIL);
  console.log("ADMIN_PASSWORD =", process.env.ADMIN_PASSWORD);

  await page.goto('http://localhost:3000/login');

  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);

  await Promise.all([
    page.waitForURL(/\/admin$/, {
      timeout: 5000,
      waitUntil: 'domcontentloaded',
    }),
    page.getByRole('button', { name: /connexion|se connecter/i }).click(),
  ]);

  await expect(
    page.getByRole('heading', { name: /admin/i })
  ).toBeVisible();
});