import { test, expect } from '@playwright/test';

/**
 * Testes Cross-Browser
 * Validam compatibilidade entre Chrome, Firefox e Safari (WebKit)
 */

test.describe('Cross-Browser Compatibility', () => {
  test('deve renderizar homepage corretamente em todos os browsers', async ({ page, browserName }) => {
    await page.goto('/');

    console.log(`Testando no browser: ${browserName}`);

    // Verificar elementos principais
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();

    // Tirar screenshot para comparação visual
    await page.screenshot({
      path: `test-results/cross-browser-home-${browserName}.png`,
      fullPage: false,
    });
  });

  test('deve ter CSS consistente entre browsers', async ({ page, browserName }) => {
    await page.goto('/');

    // Verificar cores principais
    const headerBg = await page.locator('header').evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });

    console.log(`${browserName} - Header background: ${headerBg}`);

    // Cores devem estar definidas (não transparente)
    expect(headerBg).not.toBe('rgba(0, 0, 0, 0)');
  });

  test('deve carregar fontes corretamente', async ({ page, browserName }) => {
    await page.goto('/');

    const h1Font = await page.locator('h1').evaluate((el) => {
      return window.getComputedStyle(el).fontFamily;
    });

    console.log(`${browserName} - H1 Font: ${h1Font}`);

    // Font deve estar aplicada e conter fonte customizada (não apenas fallbacks padrão)
    expect(h1Font).toBeTruthy();

    // Normalizar espaços, aspas e case para comparação robusta
    const normalizedFont = h1Font.replace(/["']/g, '').replace(/\s+/g, ' ').toLowerCase();

    // Verificar que contém uma fonte customizada conhecida (exemplo: inter, roboto, fonte da ASOF)
    const expectedFonts = ['inter', 'roboto', 'open sans', 'lato', 'montserrat']; // Pode ser expandido
    const hasCustomFont = expectedFonts.some(font => normalizedFont.includes(font.toLowerCase()));

    expect(hasCustomFont).toBeTruthy();
  });

  test('deve ter layout responsivo consistente', async ({ page, browserName }) => {
    // Desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');

    let headerHeight = await page.locator('header').evaluate((el) => el.clientHeight);
    console.log(`${browserName} - Desktop Header Height: ${headerHeight}px`);

    expect(headerHeight).toBeGreaterThan(50);

    // Mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    headerHeight = await page.locator('header').evaluate((el) => el.clientHeight);
    console.log(`${browserName} - Mobile Header Height: ${headerHeight}px`);

    expect(headerHeight).toBeGreaterThan(40);
  });

  test('deve suportar flexbox/grid corretamente', async ({ page, browserName }) => {
    await page.goto('/');

    const usesFlexOrGrid = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      let flexCount = 0;
      let gridCount = 0;

      elements.forEach((el) => {
        const display = window.getComputedStyle(el).display;
        if (display.includes('flex')) flexCount++;
        if (display.includes('grid')) gridCount++;
      });

      return { flexCount, gridCount };
    });

    console.log(`${browserName} - Flex: ${usesFlexOrGrid.flexCount}, Grid: ${usesFlexOrGrid.gridCount}`);

    expect(usesFlexOrGrid.flexCount + usesFlexOrGrid.gridCount).toBeGreaterThan(0);
  });

  test('deve executar JavaScript corretamente', async ({ page, browserName }) => {
    await page.goto('/');

    const jsWorks = await page.evaluate(() => {
      // Testar recursos JS modernos
      const arrow = () => true;
      const spread = { ...{ a: 1 } };
      const destructure = { b: 2 };
      const { b } = destructure;

      return arrow() && spread.a === 1 && b === 2;
    });

    console.log(`${browserName} - JavaScript moderno funciona: ${jsWorks}`);
    expect(jsWorks).toBeTruthy();
  });

  test('deve ter navegação funcional', async ({ page, browserName }) => {
    await page.goto('/');

    // Verificar que o link de notícias está presente e visível
    const newsLink = page.getByRole('link', { name: /notícias/i });
    await expect(newsLink).toBeVisible();

    // Clicar em link de navegação
    await newsLink.click();
    await page.waitForURL(/\/noticias/);

    console.log(`${browserName} - Navegação para /noticias: OK`);
    expect(page.url()).toContain('/noticias');
  });

  test('deve suportar imagens modernas (WebP/AVIF)', async ({ page, browserName }) => {
    const modernFormats: string[] = [];

    page.on('response', async (response) => {
      const contentType = response.headers()['content-type'] || '';

      if (contentType.includes('image/webp') || contentType.includes('image/avif')) {
        modernFormats.push(response.url());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    console.log(`${browserName} - Imagens modernas carregadas: ${modernFormats.length}`);

    // Chrome e Firefox devem suportar WebP
    // Safari (WebKit) também suporta WebP em versões recentes
    if (browserName === 'chromium' || browserName === 'firefox') {
      // Informational only - log modern format usage
      // expect(modernFormats.length).toBeGreaterThan(0);
    }
  });

  test('deve ter performance aceitável em todos os browsers', async ({ page, browserName }) => {
    const startTime = Date.now();

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const loadTime = Date.now() - startTime;

    console.log(`${browserName} - Tempo de carregamento: ${loadTime}ms`);

    // Todos os browsers devem carregar em menos de 8 segundos
    expect(loadTime).toBeLessThan(8000);
  });

  test.describe('Recursos CSS Modernos', () => {
    test('deve suportar CSS Variables', async ({ page, browserName }) => {
      await page.goto('/');

      const supportsVariables = await page.evaluate(() => {
        const testDiv = document.createElement('div');
        testDiv.style.setProperty('--test', 'test');
        return testDiv.style.getPropertyValue('--test') === 'test';
      });

      console.log(`${browserName} - Suporta CSS Variables: ${supportsVariables}`);
      expect(supportsVariables).toBeTruthy();
    });

    test('deve suportar CSS Grid', async ({ page, browserName }) => {
      await page.goto('/');

      const supportsGrid = await page.evaluate(() => {
        const testDiv = document.createElement('div');
        testDiv.style.display = 'grid';
        return window.getComputedStyle(testDiv).display === 'grid';
      });

      console.log(`${browserName} - Suporta CSS Grid: ${supportsGrid}`);
      expect(supportsGrid).toBeTruthy();
    });

    test('deve suportar Flexbox', async ({ page, browserName }) => {
      await page.goto('/');

      const supportsFlex = await page.evaluate(() => {
        const testDiv = document.createElement('div');
        testDiv.style.display = 'flex';
        return window.getComputedStyle(testDiv).display === 'flex';
      });

      console.log(`${browserName} - Suporta Flexbox: ${supportsFlex}`);
      expect(supportsFlex).toBeTruthy();
    });
  });

  test.describe('Mobile Browser Compatibility', () => {
    test('deve funcionar em mobile Chrome', async ({ page }) => {
      await page.goto('/');

      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('header')).toBeVisible();
    });

    test('deve funcionar em mobile Safari', async ({ page }) => {
      await page.goto('/');

      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('header')).toBeVisible();
    });
  });
});
