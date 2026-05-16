import { expect, test } from '@playwright/test';

test('public routes render', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('ConstanciasFree').first()).toBeVisible();
  await page.goto('/verificar');
  await expect(page.getByText('Verificador publico')).toBeVisible();
});

