import { test, expect } from '@playwright/test';

/**
 * Teste de Exemplo - Quick Start
 * Execute com: npm run test:e2e -- example.spec.ts
 */

test.describe('Exemplo de Teste E2E', () => {
  test('deve acessar a homepage e verificar elementos básicos', async ({ page }) => {
    // 1. Navegar para a homepage
    await page.goto('/');

    // 2. Verificar que a página carregou
    await expect(page).toHaveTitle(/ASOF/i);

    // 3. Verificar que o header está visível
    const header = page.locator('header');
    await expect(header).toBeVisible();

    // 4. Verificar que existe um H1
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();

    // 5. Verificar que o footer está presente
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();

    console.log('✅ Teste de exemplo passou com sucesso!');
  });

  test('deve ter navegação funcional', async ({ page }) => {
    // Ir para home
    await page.goto('/');

    // Aguardar carregamento da página
    await page.waitForLoadState('networkidle');

    // Procurar link de Notícias na navegação
    const newsLink = page.getByRole('navigation').getByRole('link', { name: 'Notícias' });

    // Verificar que o link existe
    await expect(newsLink).toBeVisible();

    // Verificar que tem a URL correta
    await expect(newsLink).toHaveAttribute('href', '/noticias');

    // Clicar no link
    await newsLink.click();

    // Aguardar navegação
    await page.waitForURL(/\/noticias/);

    console.log('✅ Navegação para notícias funcionou!');
  });

  test('deve ser responsivo', async ({ page }) => {
    // Desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await expect(page.locator('header')).toBeVisible();

    // Mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await expect(page.locator('header')).toBeVisible();

    console.log('✅ Site é responsivo!');
  });
});
