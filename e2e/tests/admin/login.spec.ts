import { test, expect } from '@playwright/test';

test.describe('Admin Login', () => {
  test.beforeEach(async ({ page }) => {
    // Ir para a página de login admin
    await page.goto('http://localhost:3001/admin');
  });

  test('deve mostrar formulário de login', async ({ page }) => {
    // Verificar se está na página de login
    await expect(page).toHaveURL(/.*login/);

    // Verificar elementos do formulário usando IDs específicos
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('login com Super Admin deve funcionar', async ({ page }) => {
    await page.locator('#email').fill('admin@asof.org.br');
    await page.locator('#password').fill('senha123');
    await page.locator('button[type="submit"]').click();

    // Esperar redirecionamento para dashboard admin
    await expect(page).toHaveURL(/.*admin/);
  });

  test('login com dados incorretos deve falhar', async ({ page }) => {
    await page.locator('#email').fill('teste@exemplo.com');
    await page.locator('#password').fill('senhaerrada');
    await page.locator('button[type="submit"]').click();

    // Verificar se ainda estamos na página de login
    await expect(page).toHaveURL(/.*login/);

    // Verificar mensagem de erro
    await expect(page.locator('text=Credenciais inválidas')).toBeVisible();
  });

  test('deve redirecionar para login quando não autenticado', async ({ page }) => {
    await page.goto('http://localhost:3001/admin/media');
    await expect(page).toHaveURL(/.*login/);
  });
});
